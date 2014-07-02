var angular = require('angular');
var _ = require('lodash');
var $ = require('jquery');
var blobStream = require('blob-stream');
var exporters = require('epson-receipts/export');
var morph = require('morph');

angular.module('epsonreceipts.reports.report-export').controller('ReportExportController', function(
  $scope,
  $sce,
  $q,
  deferred,
  itemStorage,
  imageStorage,
  currentUser
) {
  $scope.settings = {};

  _.defaults($scope.settings, {
    exportType: 'download',
    exportDetails: 'table',
    fileExtension: 'pdf',
    groupByCategory: false
  });

  $scope.isActive = function(extension) {
    return $scope.settings.exportDetails === extension;
  };

  $scope.$on('$destroy', function() {
    if ($scope.reportUrl) {
      URL.revokeObjectURL($scope.reportUrl);
      $scope.reportUrl = undefined;
    }
  });

  $scope.generate = function() {
    $scope.processing = true;
    $scope.message = null;

    if ($scope.reportUrl) {
      URL.revokeObjectURL($scope.reportUrl);
      $scope.reportUrl = undefined;
    }

    var services = {
      getImage: function(id, callback) {
        imageStorage.fetch({ id: id })
        .then(function(image) {
          var reader = new FileReader();
          reader.onload = function() {
            var array = new Uint8Array(this.result);
            callback(null, new Buffer(array), image);
          };
          reader.onerror = function(err) {
            callback(err);
          };
          reader.readAsArrayBuffer(image);
        }, callback);
      },
      getUser: function(){
        return currentUser.get();
      }
    };

    var promises = _.map($scope.report.items, function(item) {
      return itemStorage.fetch(item);
    });

    var options = {
      table: /table/.test($scope.settings.exportDetails),
      images: /images/.test($scope.settings.exportDetails),
      items: /itemizations/.test($scope.settings.exportDetails),
      groupByCategory: $scope.settings.groupByCategory
    };

    $q.all(promises).then(function(items) {
      var exprt = exporters[$scope.settings.fileExtension];
      exprt.exporter($scope.report, items, options, services, function(err, stream) {
        if (err) { return console.error(err); }
        var output = blobStream();
        stream.pipe(output);

        output.on('finish', function() {
          $scope.processing = false;
          $scope.form.$setPristine(true);
          $scope.message = stream.message;

          var name = morph.toDashed($scope.report.name) + '.' + exprt.fileExtension;

          if (navigator.msSaveOrOpenBlob) {
            navigator.msSaveOrOpenBlob(output.toBlob(exprt.mimeType), name);
          } else if (/Safari/.test(navigator.userAgent)) {
            var reader = new FileReader();
            reader.onload = function() {
              $scope.roundtrip = true;
              $scope.reportType = exprt.fileExtension;
              $scope.reportName = name;
              $scope.reportUrl = $sce.trustAsResourceUrl(output.toBlobURL(exprt.mimeType));
              $scope.reportData = reader.result;
            };
            reader.readAsDataURL(output.toBlob(exprt.mimeType));
          } else {
            $scope.reportType = exprt.fileExtension;
            $scope.reportName = name;
            $scope.reportUrl = $sce.trustAsResourceUrl(output.toBlobURL(exprt.mimeType));
          }
        });

        output.on('error', function() {
          $scope.processing = false;
          $scope.message = 'Export failed!';
        });
      });
    });
  };

  $scope.print = function() {
    $('#report-iframe')[0].contentWindow.print();
  };

  $scope.canPrint = function() {
    try {
      // Check if we can print the report...
      // in firefox this throws an exception due to a cross domain iframe reference
      return _.isFunction($('#report-iframe')[0].contentWindow.print);
    } catch (e) {
      return false;
    }
  };

  $scope.cancel = function() {
    deferred.reject();
  };
});

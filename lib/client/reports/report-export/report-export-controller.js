var angular = require('angular');
var _ = require('lodash');
var blobStream = require('blob-stream');
var exporters = require('epson-receipts/export');

angular.module('epsonreceipts.reports.report-export').controller('ReportExportController', function(
  $scope,
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
    exportOptions: [
      { 'text': '.PDF', value: 'pdf' },
      { 'text': '.CSV', value: 'csv' },
      { 'text': '.QIF (Quicken)', value: 'qif' },
      { 'text': '.TXF (Turbo Tax)', value: 'txf' }
    ],
    fileExtension: 'pdf'
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
            callback(null, new Buffer(array));
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
      items: /itemizations/.test($scope.settings.exportDetails)
    };

    $q.all(promises).then(function(items) {
      var exprt = exporters[$scope.settings.fileExtension];
      exprt.exporter($scope.report, items, options, services, function(err, stream) {
        if (err) { return console.error(err); }
        stream = stream.pipe(blobStream());

        stream.on('finish', function() {

          $scope.processing = false;

          if (navigator.msSaveOrOpenBlob) {
            navigator.msSaveOrOpenBlob(stream.toBlob(), 'report.' + exprt.fileExtension);
          } else {
            $scope.reportName = 'report.' + exprt.fileExtension;
            $scope.reportUrl = stream.toBlobURL(exprt.mimeType);
          }
        });

        stream.on('error', function() {
          $scope.processing = false;
          alert('Export failed');
        });
      });
    });
  };

  $scope.ieSave = function () {
    console.log('Open', $scope.reportBlob);
    navigator.msSaveOrOpenBlob($scope.reportBlob, 'report.pdf');
  };

  $scope.cancel = function() {
    deferred.reject();
  };
});

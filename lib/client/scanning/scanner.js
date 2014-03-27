var _ = require('lodash');
var angular = require('angular');
var Dynamsoft = require('dynamsoft');

function debug(DWObject) {
  console.log('Debug', _.pick(DWObject, ['CurrentSourceName', 'DataSourceStatus', 'IfDeviceOnline', 'IfFeederEnabled', 'IfPaperDetectable', 'IfFeederLoaded', 'IfAutoFeed', 'ImageCaptureDriverType']));
}

angular.module('epsonreceipts.scanning').factory('scanner', function($q) {
  function log(name) {
    return function() {
      console.log(name, arguments);
    };
  }
  var dwtParams = {
    isTrial: true,
    containerID: 'webtwain',
    onTransferError: log('OnTransferError'),
    onTransferCancelled: log('OnTransferCancelled'),
    onPreAllTransfers: log('OnPreAllTransfers'),
    onPreTransfer: log('OnPreTransfer'),
    onPostLoad: log('OnPostLoad'),
    onPostTransfer: log('OnPostTransfer'),
    onPostAllTransfers: log('OnPostAllTransfers'),
    onOperateStatus: log('OnOperateStatus'),
    onBeforeOperate: log('OnBeforeOperate'),
    onAfterOperate: log('OnAfterOperate'),
    onMouseClick: log('OnMouseClick')
  };

  var deferred = $q.defer();

  angular.element(document).ready(function() {
    var container = angular.element('<div id="webtwain"></div>');
    angular.element(document.body).append(container);

    var dwt = new Dynamsoft.WebTwain(dwtParams);
    var DWObject = dwt.getInstance();


    setTimeout(function() {
      DWObject.IfThrowException = true;
      DWObject.BrokerProcessType = 1; // use a separate process for document scanning
      DWObject.ImageCaptureDriverType = 0; // use TWAIN drivers

      DWObject.CloseSourceManager();
      DWObject.OpenSourceManager();

      DWObject.SelectSource();

      debug(DWObject);

      DWObject.CloseSource();
      DWObject.OpenSource();

      debug(DWObject);

      deferred.resolve(DWObject);
    }, 3000);

  });

  var promise = deferred.promise;

  return {
    scan: function() {
      promise.then(function(DWObject) {
        console.log('Starting Scan');

        debug(DWObject);

        if (!DWObject.IfFeederLoaded) {
          alert("Please load a document");
          return;
        }

        DWObject.IfAutomaticBorderDetection = true;
        DWObject.XferCount = -1;
        DWObject.IfShowUI = false;
        DWObject.IfModalUI = false;
        DWObject.IfShowIndicator = false;

        DWObject.AcquireImage();
        console.log(DWObject.ErrorCode, DWObject.ErrorString);
      });

    }
  };
});

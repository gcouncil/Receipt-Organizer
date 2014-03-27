var _ = require('lodash');
var angular = require('angular');
var Dynamsoft = require('dynamsoft');

function debug(DWObject) {
  console.log('Debug', _.pick(DWObject, ['CurrentSourceName', 'DataSourceStatus', 'IfDeviceOnline', 'IfFeederEnabled', 'IfPaperDetectable', 'IfFeederLoaded', 'IfAutoFeed', 'IfAutoDiscardBlankpages', 'IfAutoScan', 'IfAutoBright', 'ImageCaptureDriverType', 'IfAutomaticDeskew', 'IfAutomaticBorderDetection']));
}

function setBooleanCapability(DWObject, capability, name, value) {
      DWObject.Capability = capability;
      DWObject.CapType = 5; // TWON_ONEVALUE
      DWObject.CapValue = value ? 1 : 0;

      if (!DWObject.CapIfSupported(2)) {
        alert('CapSet not supported ' + capability + ' ' + name);
      }

      DWObject.CapSet();
      DWObject.CapGet();

      console.log(DWObject.Capability, DWObject.CapValue);
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

      var sources = [];
      for ( var i = 0; i < DWObject.SourceCount; i++ ) {
        var name = DWObject.GetSourceNameItems(i);

        if( /EPSON/.test(name) ) {
          sources.push({ id: i, name: name });
        }
      }

      if (sources.length > 0) {
        DWObject.SelectSourceByIndex(sources[0].id);
      } else {
        return deferred.reject('No scanner');
      }

      debug(DWObject);
      window.DWObject = DWObject;

      DWObject.CloseSource();
      DWObject.OpenSource();

      deferred.resolve(DWObject);
    }, 500);

  });

  var promise = deferred.promise;

  return {
    scan: function() {
      promise.then(function(DWObject) {
        console.log('Starting Scan');

        DWObject.CloseSource();
        DWObject.OpenSource();

        DWObject.ResetImageLayout();
        // console.log(DWObject.GetImageLayout());

        DWObject.IfAutoScan = true;
        DWObject.IfAutoBright = false;
        DWObject.IfAutomaticDeskew = true;
        DWObject.IfAutomaticBorderDetection = true;
        DWObject.XferCount = -1;
        DWObject.IfShowUI = false;
        DWObject.IfModalUI = false;
        DWObject.IfShowIndicator = false;

        setBooleanCapability(DWObject, 0x1156, 'autosize', true);
        setBooleanCapability(DWObject, 0x1150, 'detect border', true);

        DWObject.PixelType = 1; // Grayscale

        debug(DWObject);

        DWObject.AcquireImage();
      });
    }
  };
});

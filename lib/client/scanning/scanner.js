var _ = require('lodash');
var angular = require('angular');
var Dynamsoft = require('dynamsoft');

angular.module('epsonreceipts.scanning').factory('scanner', function($interval, $q, imageStorage, receiptStorage) {
  var DWObject, promise;

  angular.element(document).ready(function initialize() {
    var deferred = $q.defer();

    // Create the UI Container
    var id = _.uniqueId('webtwain');
    var container = angular.element('<div style="height: 0; overflow: hidden; visibility: none;"></div>').attr('id', id);
    angular.element(document.body).append(container);

    // Setup Dynamsoft Web Twain

    // Can't use imageCaptureDriverType config options because 0 is falsy and
    // the vendor supplied dynamsoft.webtwain.initiate is buggy
    Dynamsoft.DWTProduct._iImageCaptureDriverType = 0; // (Mac) use TWAIN driver
    Dynamsoft.DWTProduct._iBrokerProcessType = 1; // (Window) use separate process for scanning
    var dwt = new Dynamsoft.WebTwain({
      isTrial: true,
      containerID: id,
      onPostTransfer: onNewImage
    });


    DWObject = dwt.getInstance();
    window.DWObject = DWObject; // Expose for debugging

    var interval;
    function wait() {
      if (DWObject.ErrorCode === 0) {
        $interval.cancel(interval);
        setup(deferred);
      }
    }
    interval = $interval(wait, 100);

    promise = deferred.promise;
  });

  function setup(deferred) {
    // Configure source manager Twain
    DWObject.IfThrowException = true;

    // Need to set these here in case the control detection in
    // dynamsoft.webtwain.initiate hasn't run yet
    DWObject.ImageCaptureDriverType = 0; // (Mac) use TWAIN driver
    DWObject.BrokerProcessType = 1; // (Window) use separate process for scanning

    // Re-open source manager
    DWObject.CloseSourceManager();
    DWObject.OpenSourceManager();

    deferred.resolve(DWObject);
  }

  function setCapability(capability, type, value, name) {
    DWObject.Capability = capability;
    DWObject.CapType = type;
    DWObject.CapValue = value;

    if (!DWObject.CapIfSupported(2)) {
      console.warn('CapSet not supported ' + name);
    }

    DWObject.CapSet();
  }

  function onNewImage() {
    if (DWObject.HowManyImagesInBuffer < 1) {
      return console.warn('No image found');
    }

    DWObject.SetSelectedImageIndex(0, 0);
    DWObject.GetSelectedImagesSize(1); // Prepare image as JPEG
    var base64 = DWObject.SaveSelectedImagesToBase64Binary();
    imageStorage.create({ data: base64 }).then(function(image) {
      receiptStorage.create({
        image: image.id
      });
    });

    DWObject.RemoveImage(0);
  }

  return {
    listScanners: function() {
      return promise.then(function(DWObject) {
        var sources = [];

        var count = DWObject.SourceCount;
        for ( var i = 0; i < count; i++ ) {
          var name = DWObject.GetSourceNameItems(i);

          if( /EPSON/.test(name) ) {
            sources.push({ id: i, name: name });
          }
        }

        return sources;
      });
    },

    scan: function(scanner) {
      return promise.then(function(DWObject) {
        DWObject.SelectSourceByIndex(scanner.id);

        // Re-open scanner driver
        DWObject.CloseSource();
        DWObject.OpenSource();

        // Scan all available pages
        DWObject.XferCount = -1;

        // Don't show a native UI
        DWObject.IfShowUI = false;

        // Prevent modal UI
        DWObject.IfModalUI = false;

        // ?
        DWObject.IfShowIndicator = false;

        // Setup auto size detection
        DWObject.IfAutomaticBorderDetection = true;
        setCapability(0x1156, 5, 1, 'ICAP_AUTOSIZE');

        // Configure image format
        DWObject.PixelType = 1; // Grayscale
        DWObject.Resolution = 200; // DPI

        // Scan It!
        DWObject.AcquireImage();
      });
    },

    cancel: function() {
      promise.then(function(DWObject) {
        DWObject.CancelAllPendingTransfers();
      });
    }
  };
});

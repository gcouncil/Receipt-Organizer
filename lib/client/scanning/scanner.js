var _ = require('lodash');
var angular = require('angular');
var Dynamsoft = require('dynamsoft');

angular.module('epsonreceipts.scanning').factory('scanner', function($timeout, $q, imageStorage, receiptStorage) {
  var DWObject, promise;

  angular.element(document).ready(function initialize() {
    var deferred = $q.defer();

    // Create the UI Container
    var id = _.uniqueId('webtwain');
    var container = angular.element('<div style="height: 0; overflow: hidden; visibility: none;"></div>').attr('id', id);
    angular.element(document.body).append(container);

    // Setup Dynamsoft Web Twain
    var dwt = new Dynamsoft.WebTwain({
      isTrial: true,
      containerID: id,
      onPostTransfer: onNewImage
    });

    DWObject = dwt.getInstance();
    window.DWObject = DWObject; // Expose for debugging

    function wait() {
      if (DWObject.ErrorCode === 0) {
        setup(deferred);
      } else {
        $timeout(wait, 100);
      }
    }
    $timeout(wait, 1e3);

    promise = deferred.promise;
  });

  function setup(deferred) {
    // Configure source manager Twain
    DWObject.IfThrowException = true;
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
      console.log('Image created', image);
      receiptStorage.create({
        image: image.uuid
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

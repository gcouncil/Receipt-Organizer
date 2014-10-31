var _ = require('lodash');
var angular = require('angular');
var Dynamsoft = require('dynamsoft');

angular.module('epsonreceipts.twain').factory('twain', function(
  $interval,
  $q,
  $window,
  imageStorage,
  itemStorage
) {
  var DWObject, scannerBusy;
  var deferred = $q.defer();
  var promise = deferred.promise;

  angular.element(document).ready(function initialize() {

    // Create the UI Container
    var id = _.uniqueId('webtwain');
    var container = angular.element('<div></div>').attr('id', id).css({ position: 'absolute', top: -200, left: -200 });
    angular.element(document.body).append(container);

    // Setup Dynamsoft Web Twain

    // Can't use imageCaptureDriverType config options because 0 is falsy and
    // the vendor supplied dynamsoft.webtwain.initiate is buggy
    Dynamsoft.DWTProduct._iImageCaptureDriverType = 0; // (Mac) use TWAIN driver
    Dynamsoft.DWTProduct._iBrokerProcessType = 1; // (Window) use separate process for scanning
    var dwt = new Dynamsoft.WebTwain({
      productKey: 'DCD320C0E0F0AE94F0C44598304F3077E0646886E8B65E18A7FCD8345659722E5C50D77326DD7492DA4EB4006502D32856B40FD743D93952FDD2D47835743BBC30000000',
      isTrial: 'false',
      containerID: id,
      resourcesPath: '/assets/dynamsoft',
      width: 100,
      height: 100
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

    DWObject.RegisterEvent('onPostTransfer', onNewImage);
    DWObject.RegisterEvent('onPreAllTransfers', function() { scannerBusy = true; });
    DWObject.RegisterEvent('onPostAllTransfers', function() { scannerBusy = false; twain.imageHandler = _.noop; });

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
    // begin base64
    if (DWObject.HowManyImagesInBuffer < 1) {
      return console.warn('No image found');
    }

    DWObject.SetSelectedImageIndex(0, 0);
    DWObject.GetSelectedImagesSize(1); // Prepare image as JPEG

    var base64 = DWObject.SaveSelectedImagesToBase64Binary();
    var bytes = require('base64-js').toByteArray(base64);
    var blob = new Blob([bytes], { type: 'image/jpeg' });

    DWObject.RemoveImage(0);

    // Since imageStorage.create is asynchronous we need to save the
    // imageHandler from the time when onNewImage is called (since it will be
    // cleared by onPostAllTransfers)
    var handler = twain.imageHandler;
    imageStorage.create(blob).then(function(image) {
      handler(image);
    });
  }

  function defaultImageHandler(image) {
      itemStorage.create({
        images: [image.id]
      });
  }

  promise.then(function(DWObject) {
    $interval(function() {
      var sources = [];

      var count = DWObject.SourceCount;
      for ( var i = 0; i < count; i++ ) {
        var name = DWObject.GetSourceNameItems(i);

        if( /EPSON/.test(name) ) {
          sources.push(name);
        }
      }

      twain.drivers = sources;
    }, 1000);
  });

  function selectDriver(driver) {
    return promise.then(function(DWObject) {
      var count = DWObject.SourceCount;
      for ( var i = 0; i < count; i++ ) {
        var name = DWObject.GetSourceNameItems(i);
        if ( name === driver ) {
          DWObject.SelectSourceByIndex(i);
          break;
        }
      }
    });
  }

  var driver = window.localStorage.getItem('driver');
  var twain = {
    isBusy: function() { return scannerBusy; },

    drivers: [],
    set driver(value) {
      driver = value;
      window.localStorage.setItem('driver', value);
    },
    get driver() {
      return driver;
    },

    imageHandler: _.noop,

    scan: function(handler) {
      return $q.all([
        promise,
        selectDriver(twain.driver)
      ]).then(function(values) {
        var DWObject = values[0];
        if (twain.imageHandler !== _.noop) {
          $window.alert('Error, scan already in progress');
          return;
        }

        twain.imageHandler = handler || defaultImageHandler;

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
        // DWObject.IfShowIndicator = false;

        // Automatically Disable Source
        DWObject.IfDisableSourceAfterAcquire = true;

        // Setup auto size detection
        setCapability(0x112d, 5, 1, 'ICAP_UNDEFINEDIMAGESIZE');
        setCapability(0x1150, 5, 1, 'ICAP_AUTOMATICBORDERDETECTION');
        setCapability(0x1156, 5, 1, 'ICAP_AUTOSIZE');
        setCapability(0x8011, 5, 1, 'CAP_EP_AUTOLAYOUT');
        setCapability(0x8050, 5, 1, 'ICAP_EP_AUTOSIZE');

        // Setup text enhancement
        setCapability(0x8043, 5, 1, 'ICAP_EP_TEXTENHANCEMENT');

        // Configure image format
        DWObject.PixelType = 2; // RGB
        DWObject.Resolution = 300; // DPI

        // Scan It!
        DWObject.AcquireImage();
      });
    }
  };

  return twain;
});

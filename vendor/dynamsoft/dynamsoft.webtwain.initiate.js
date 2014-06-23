/*!
* Dynamsoft JavaScript Library for Basic Initiation of Dynamic Web TWAIN
* More info on DWT: http://www.dynamsoft.com/Products/WebTWAIN_Overview.aspx
*
* Copyright 2013, Dynamsoft Corporation
* Author: Dynamsoft Support Team
* Date: Dec. 18 2013
* Version: 9.2
*/

// DWT Properties

var Dynamsoft = (function () {
	// Get Browser Agent Value
	var ua = (navigator.userAgent.toLowerCase()),
		_path = 'Resources/',
		_ret = {
		DWTProduct : {
			//--------------------------------------------------------------------------------------
			//****** <Required> You must specify it before using DWT
			//--------------------------------------------------------------------------------------
			_strProductKey: '',

			//------------------------------------------
			//++++++ <optional>
			//------------------------------------------
			_bIsTrial: true,     					// Whether it is using the trial version.
			_strProductName: 'Dynamic Web TWAIN',	// The Product Name of DWT.
			_strVersionCode: '9,2', 				// The version of DWT. ActiveX will use this to determine if it is necessary to upgrade the client. Use ',' to separate the numbers.

			 _iImageCaptureDriverType: 3,
		     _iBrokerProcessType: 1,

			_strLPKPath: _path + 'DynamicWebTwain.lpk',     					// The relative path of the LPK file.
			_strPKGPath: _path + 'DynamicWebTWAINMacEdition.pkg',     	//The relative path of the PKG file.
			_strMSIPath: _path + 'DynamicWebTWAINPlugIn.msi',         		//The relative path of the MSI file.
			_strCABX86Path: _path + 'DynamicWebTWAIN.cab',         			//The relative path of the x86 cab file.
			_strCABX64Path: _path + 'DynamicWebTWAINx64.cab',      			//The relative path of the x64 cab file.

			_strMIMETYPE: 'Application/DynamicWebTwain-Plugin',
			_strPROCLASSID: '5220cb21-c88d-11cf-b347-00aa00a28331',
			_strFULLCLASSID: 'E7DA7F8D-27AB-4EE9-8FC0-3FEC9ECFE758',
			_strTRAILCLASSID: 'FFC6F181-A5CF-4ec4-A441-093D7134FBF2'


		},
		Env: {

			// Set the Explorer Type
		_bInIE: (ua.indexOf('msie') != -1 || ua.indexOf('trident') != -1),

			// Set the Operating System Type
			// NOTE: only support Mac & Windows
			_bInWindows : (ua.indexOf('macintosh') == -1),

			// Set the x86 and x64 type
			_bInWindowsX64: (ua.indexOf('win64') != -1 || ua.indexOf('x64') != -1),

			_iPluginLength: (this._bInIE) ? 0: navigator.plugins.length,

			_varSeed : '',               // The seed used to detect the control.
			_bFirstSWebTwain : true,
			_aryAllSWebTwain : []
        },
	    mix:function (d, s) {
			for (var i in s) {
				d[i] = s[i];
			}
		}
	};
	return _ret;
})();

// DWT Functions
(function(D) {
    function SWebTwain() {
        var swt = this;
        //--------------------------------------------------------------------------------------
        //****** <Required> You must specify it before using DWT
        //--------------------------------------------------------------------------------------
        swt._strDWTControlContainerID = 'dwtcontrolContainer';

        //--------------------------------------------------------------------------------------
        //++++++ <optional> Default value provided. You can change it accordingly
        //--------------------------------------------------------------------------------------
        swt._strObjectName = swt._strDWTControlContainerID + '_Obj';
        swt._iWidth = 580;        // The width of the main control.
        swt._iHeight = 600;       // The height of the main control.

        //--------------------------------------------------------------------------------------
        //++++++ <optional> Events
        //--------------------------------------------------------------------------------------
        swt._onPostTransfer = '';
        swt._onPostAllTransfers = '';
        swt._onMouseClick = '';
        swt._onPostLoad = '';
        swt._onImageAreaSelected = '';
        swt._onMouseDoubleClick = '';
        swt._onMouseRightClick = '';
        swt._onTopImageInTheViewChanged = '';
        swt._onImageAreaDeSelected = '';
        swt._onGetFilePath = '';

        //--------------------------------------------------------------------------------------
        //					 Default value provided. YOU CANNOT change it accordingly
        //--------------------------------------------------------------------------------------
        swt._objectWebTwain = null;           // The DWT Object
        swt._strDWTInnerContainerID = swt._strDWTControlContainerID + '_CID'; // The ID of the container (Usually a DIV) which is used to contain DWT object. User must specify it.
        swt._strDWTNonInstallInnerContainerID = swt._strDWTControlContainerID + '_NonInstallCID'; // The ID of the container (Usually a DIV) which is used to show a message if DWT is not installed. User must specify it.

        swt._vNotAllowedForChrome = false;
    };

    SWebTwain.prototype.getInstance = function() {
        return this._objectWebTwain;
    };

    SWebTwain.prototype._init = function(configs) {
        if (!configs)
            return;

        var swt = this;
        if (configs.width)
            swt._iWidth = configs.width;
        if (configs.height)
            swt._iHeight = configs.height;

        if (configs.containerID) {
            swt._strDWTControlContainerID = configs.containerID;
            swt._strDWTInnerContainerID = swt._strDWTControlContainerID + '_CID';
            swt._strObjectName = swt._strDWTControlContainerID + '_Obj';
            swt._strDWTNonInstallInnerContainerID = swt._strDWTControlContainerID + '_NonInstallCID';
        }

        if (configs.onPostTransfer) {
            swt._onPostTransfer = configs.onPostTransfer;
        }

        if (configs.onPostAllTransfers) {
            swt._onPostAllTransfers = configs.onPostAllTransfers;
        }

        if (configs.onMouseClick) {
            swt._onMouseClick = configs.onMouseClick;
        }

        if (configs.onPostLoad) {
            swt._onPostLoad = configs.onPostLoad;
        }

        if (configs.onImageAreaSelected) {
            swt._onImageAreaSelected = configs.onImageAreaSelected;
        }

        if (configs.onMouseDoubleClick) {
            swt._onMouseDoubleClick = configs.onMouseDoubleClick;
        }

        if (configs.onMouseRightClick) {
            swt._onMouseRightClick = configs.onMouseRightClick;
        }

        if (configs.onTopImageInTheViewChanged) {
            swt._onTopImageInTheViewChanged = configs.onTopImageInTheViewChanged;
        }

        if (configs.onImageAreaDeSelected) {
            swt._onImageAreaDeSelected = configs.onImageAreaDeSelected;
        }

        if (configs.onGetFilePath) {
            swt._onGetFilePath = configs.onGetFilePath;
        }
    };

    SWebTwain.prototype._attachEvents = function() {
        var wt = this;
        if (wt._onPostTransfer != '')
            wt._objectWebTwain.RegisterEvent('onPostTransfer', wt._onPostTransfer);
        if (wt._onPostAllTransfers != '')
            wt._objectWebTwain.RegisterEvent('onPostAllTransfers', wt._onPostAllTransfers);
        if (wt._onMouseClick != '')
            wt._objectWebTwain.RegisterEvent('onMouseClick', wt._onMouseClick);
        if (wt._onPostLoad != '')
            wt._objectWebTwain.RegisterEvent('onPostLoad', wt._onPostLoad);
        if (wt._onImageAreaSelected != '')
            wt._objectWebTwain.RegisterEvent('onImageAreaSelected', wt._onImageAreaSelected);
        if (wt._onMouseDoubleClick != '')
            wt._objectWebTwain.RegisterEvent('onMouseDoubleClick', wt._onMouseDoubleClick);
        if (wt._onMouseRightClick != '')
            wt._objectWebTwain.RegisterEvent('onMouseRightClick', wt._onMouseRightClick);
        if (wt._onTopImageInTheViewChanged != '')
            wt._objectWebTwain.RegisterEvent('onTopImageInTheViewChanged', wt._onTopImageInTheViewChanged);
        if (wt._onImageAreaDeSelected != '')
            wt._objectWebTwain.RegisterEvent('onImageAreaDeSelected', wt._onImageAreaDeSelected);
        if (wt._onGetFilePath != '')
            wt._objectWebTwain.RegisterEvent('onGetFilePath', wt._onGetFilePath);
    };


    SWebTwain.prototype._createControl = function() {

        var varDWTContainer;

        var objString = "<div id ='" + this._strDWTInnerContainerID + "' style='position: relative;width:" + this._iWidth + "px; height:" + this._iHeight + "px;'>";

        // For IE, render the ActiveX Object
        if (Dynamsoft.Env._bInIE) {

            ///////////////////////////////////////
            objString += "<object classid='clsid:" + D.DWTProduct._strPROCLASSID + "' style='display:none;'><param name='LPKPath' value='" + D.DWTProduct._strLPKPath + "'/></object>";
            ///////////////////////////////////////

            objString += "<object id='" + this._strObjectName + "' style='width:" + this._iWidth + "px;height:" + this._iHeight + "px'";

            if (Dynamsoft.Env._bInWindowsX64)
                objString += "codebase='" + D.DWTProduct._strCABX64Path + "#version=" + D.DWTProduct._strVersionCode + "' ";
            else
                objString += "codebase='" + D.DWTProduct._strCABX86Path + "#version=" + D.DWTProduct._strVersionCode + "' ";


            var temp = D.DWTProduct._bIsTrial ? D.DWTProduct._strTRAILCLASSID : D.DWTProduct._strFULLCLASSID;
            objString += " classid='clsid:" + temp + "' viewastext>";
            objString += " <param name='Manufacturer' value='DynamSoft Corporation' />";
            objString += " <param name='ProductFamily' value='" + D.DWTProduct._strProductName + "' />";
            objString += " <param name='ProductName' value='" + D.DWTProduct._strProductName + "' />";
            //objString += " <param name='wmode' value='transparent'/>  ";
            objString += " </object>";
        }
        // For non-IE, render the embed object
        else {
            objString += "<embed id='" + this._strObjectName + "' style='display: inline; width:" + this._iWidth + "px;height:" + this._iHeight + "px' type='" + D.DWTProduct._strMIMETYPE + "'";

            if (Dynamsoft.Env._bInWindows)
                objString += " pluginspage='" + D.DWTProduct._strMSIPath + "'></embed>";
            else
                objString += " pluginspage='" + D.DWTProduct._strPKGPath + "'></embed>";
        }
        objString += "</div><div id='" + this._strDWTNonInstallInnerContainerID + "' style='width: " + this._iWidth + "px;'></div>";

        varDWTContainer = document.getElementById(this._strDWTControlContainerID);

        varDWTContainer.innerHTML = objString;
        this._objectWebTwain = document.getElementById(this._strObjectName);
    };

    // Check if the control is fully loaded.
    SWebTwain.prototype._controlDetect = function() {
        var cWebTwain = Dynamsoft.Env._aryAllSWebTwain[0];

        var aryDWTs = Dynamsoft.Env._aryAllSWebTwain;
        // If the ErrorCode is 0, it means everything is fine for the control. It is fully loaded.
        if (cWebTwain._objectWebTwain.ErrorCode == 0) {
            clearInterval(Dynamsoft.Env._varSeed);

            // Please put product key (since v9.0)
            for (var i = 0; i < aryDWTs.length; i++) {
                var o = aryDWTs[i];
                o._objectWebTwain.ProductKey = D.DWTProduct._strProductKey;
                o._attachEvents();

                if (!Dynamsoft.Env._bInWindows) {
                    o._objectWebTwain.ImageCaptureDriverType = D.DWTProduct._iImageCaptureDriverType;
                }
                o._objectWebTwain.BrokerProcessType = D.DWTProduct._iBrokerProcessType;
            }

        }
        else {
            if (!Dynamsoft.Env._bInIE) {
                navigator.plugins.refresh(false);
                if (Dynamsoft.Env._iPluginLength != navigator.plugins.length) {
                    for (var i = 0; i < navigator.mimeTypes.length; i++) {
                        if (navigator.mimeTypes[i].type.toLowerCase().indexOf(D.DWTProduct._strMIMETYPE.toLowerCase()) > -1) {
                            location.reload();
                        }
                    }
                }

                for (var i = 0; i < navigator.mimeTypes.length; i++) {
                    if (navigator.mimeTypes[i].type.toLowerCase().indexOf(D.DWTProduct._strMIMETYPE.toLowerCase()) > -1) {
                        for (var j = 0; j < aryDWTs.length; j++) {
                            var o = aryDWTs[j];
                            if (o._vNotAllowedForChrome == false) {
                                o._notAllowedForChrome();
                                o._vNotAllowedForChrome = true;
                            }
                        }

                    }
                }
            }

            for (var i = 0; i < aryDWTs.length; i++) {
                var o = aryDWTs[i];
                if (o._vNotAllowedForChrome == false) {
                    o._noControl();
                }
            }
        }
    };

    SWebTwain.prototype._noControl = function() {
        // Display the message and hide the main control
        if (!Dynamsoft.Env._bInIE) {
            this._createNonInstallDivPlugin();
            document.getElementById(this._strDWTNonInstallInnerContainerID).style.display = 'inline';
            document.getElementById(this._strDWTInnerContainerID).style.display = 'none';
        }
    };

    SWebTwain.prototype._notAllowedForChrome = function() {
        // Display the message and hide the main control
        if (!Dynamsoft.Env._bInIE) {
            ua = (navigator.userAgent.toLowerCase());
            if (ua.match(/chrome\/([\d.]+)/)) {
                this._createNonAllowedDivPlugin();
                document.getElementById(this._strDWTNonInstallInnerContainerID).style.display = 'inline';
                document.getElementById(this._strDWTInnerContainerID).style.display = 'none';
            }
        }
    };

    SWebTwain.prototype._createNonAllowedDivPlugin = function() {
        var o = document.getElementById(this._strDWTNonInstallInnerContainerID);
        if (o.innerHTML != '')
            return;

        var strObjString = ["<div style='display: block; border:solid black 1px; text-align:center; width:",
			this._iWidth,
			"px;height:",
			this._iHeight,
			"px'>",
			"<ul style='padding-top:100px;'>",
			"<li>The Component is not allowed to run on this site.</li>",
			"<li>Please click \"Always run on this site\" for the prompt \"" + D.DWTProduct._strProductName + " Plugin needs your permission to run\", refresh/restart the browser and try again.</li>",
			"</ul></div>"].join('');


        o.innerHTML = strObjString;
    };

    SWebTwain.prototype._createNonInstallDivPlugin = function() {
        var o = document.getElementById(this._strDWTNonInstallInnerContainerID);
        if (o.innerHTML != '')
            return;

        var strHref = '';
        if (Dynamsoft.Env._bInIE) {
            var strObjString = ["<div style='display: block; border:solid black 1px; text-align:center; width:",
				this._iWidth,
				'px;height:',
				this._iHeight,
				"px'>",
				"<ul style='padding-top:100px;'>",
				"<li>The Component is not installed</li>",
				"<li>You need to download and install the ActiveX to use this sample.</li>",
				"<li>Please follow the instructions in the information bar.</li>",
				"</ul></div>"].join('');
        }
        else {

            var _http = ('https:' == location.protocol ? 'https://' : 'http://');

            if (Dynamsoft.Env._bInWindows) {
                if (location.hostname != '')
                    strHref = _http + location.host + location.pathname.substring(0, location.pathname.lastIndexOf('/')) + '/' + D.DWTProduct._strMSIPath;
                else
                    strHref = D.DWTProduct._strMSIPath;
            }
            else {
                if (location.hostname != '')
                    strHref = _http + location.host + location.pathname.substring(0, location.pathname.lastIndexOf('/')) + '/' + D.DWTProduct._strPKGPath;
                else
                    strHref = D.DWTProduct._strPKGPath;
            }

            var strObjString = ["<div style='display: block; border:solid black 1px; text-align:center; width:",
				this._iWidth,
				"px;height:",
				this._iHeight,
				"px'>",
				"<ul style='padding-top:100px;'>",
				"<li>The Component is not installed</li>",
				"<li>You need to download and install the plug-in to use this sample.</li>",
				"<li>Please click the below link to download it.</li>",
				"<li>After the installation, please RESTART your browser.</li>",
				"<li><a href='",
				strHref,
				"'>Download</a></li>",
				"</ul></div>"].join('');
        }

        o.innerHTML = strObjString;
    };

    function _initProduct(configs) {

        if (configs.productKey)
            Dynamsoft.DWTProduct._strProductKey = configs.productKey;
        if (configs.isTrial)
            Dynamsoft.DWTProduct._bIsTrial = configs.isTrial == 'true' ? true : false;
        if (configs.version)
            Dynamsoft.DWTProduct._strVersionCode = configs.version;
        if (configs.imageCaptureDriverType)
            Dynamsoft.DWTProduct._iImageCaptureDriverType = configs.imageCaptureDriverType;
        if (configs.brokerProcessType)
            Dynamsoft.DWTProduct._iBrokerProcessType = configs.brokerProcessType;


        if (configs.resourcesPath) {
            var _path = configs.resourcesPath;
            if (_path.length > 0) {
                if (_path[_path.length - 1] == "/")
                    _path = _path.substring(0, _path.length - 1);
            }
            Dynamsoft.DWTProduct._strLPKPath = _path + '/DynamicWebTwain.lpk';     // The relative path of the LPK file. User can change it.
            Dynamsoft.DWTProduct._strPKGPath = _path + '/DynamicWebTWAINMacEdition.pkg';     //The relative path of the PKG file. User need to change it.
            Dynamsoft.DWTProduct._strMSIPath = _path + '/DynamicWebTWAINPlugIn.msi';         //The relative path of the MSI file. User need to change it.
            Dynamsoft.DWTProduct._strCABX86Path = _path + '/DynamicWebTWAIN.cab';         //The relative path of the x86 cab file. User need to change it.
            Dynamsoft.DWTProduct._strCABX64Path = _path + '/DynamicWebTWAINx64.cab';      //The relative path of the x64 cab file. User need to change
        }


    };

    D.WebTwain = function(objectConfigs) {

        var isFirstControl = Dynamsoft.Env._bFirstSWebTwain;

        if (isFirstControl) {
            Dynamsoft.Env._bFirstSWebTwain = false;
            _initProduct(objectConfigs);
        }

        var o = new SWebTwain();
        o._init(objectConfigs);
        o._createControl(); //Create an instance of the component in the DIV assigned by this._strDWTContainerID


        Dynamsoft.Env._aryAllSWebTwain.push(o);

        // detect the first instance
        if (isFirstControl) {
            //Set interval to check if the control is fully loaded.
            Dynamsoft.Env._varSeed = setInterval(Dynamsoft.Env._aryAllSWebTwain[0]._controlDetect, 500);
        }

        return o;
    };

})(Dynamsoft);

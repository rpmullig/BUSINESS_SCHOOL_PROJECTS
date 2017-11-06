/**
 * Sybase Hybrid App version 2.2
 * 
 * API.js
 * This file will not be regenerated, so it is possible to modify it, but it
 * is not recommended.
 *
 * The template used to create this file was compiled on Thu Jun 07 14:57:11 EDT 2012
 * 
 * Copyright (c) 2012 Sybase Inc. All rights reserved.
 */

/** @namespace Holds all the Hybrib Web Container javascript */
hwc = (typeof hwc === "undefined" || !hwc) ? {} : hwc;      // SUP 'namespace'

/**
 * Global Legacy Mapping
 * Needed because called by generated HTML or hardcoded in workflow.js or XBWUtil.java or in container callbacks.
 */

/**
 * @deprecated Deprecated since version 2.2 - use hwc.guid()
 */
function guid()               { return hwc.guid(); }

/**
 * @deprecated Deprecated since version 2.2 - use hwc.getXMLHTTPRequest()
 */
function getXMLHTTPRequest()  { return hwc.getXMLHTTPRequest(); }

/**
 * @deprecated Deprecated since version 2.2 - use hwc.log(sMsg, eLevel, notifyUser)
 */
function logToWorkflow(sMsg, eLevel, notifyUser) { return hwc.log(sMsg, eLevel, notifyUser); }

/**
 * @deprecated Deprecated since version 2.2 - use hwc.close()
 */
function closeWorkflow()            { return hwc.close(); }

/**
 * @deprecated Deprecated since version 2.2 - use hwc.clearCacheItem( cachekey )
 */
function clearCacheItem( cachekey ) { return hwc.clearCacheItem( cachekey ); }

/**
 * @deprecated Deprecated since version 2.2 - use hwc.clearCache()
 */
function clearCache()               { return hwc.clearCache(); }

/**
 * @deprecated Deprecated since version 2.2 - use hwc.close()
 */
function expireCredentials()        { return hwc.expireCredentials(); }

/**
 * @deprecated Deprecated since version 2.2 - use hwc.showCertificatePicker()
 */
function showCertificatePicker()    { return hwc.showCertificatePicker(); }

/**
 * @deprecated Deprecated since version 2.2 - use hwc.saveLoginCertificate(certificate)
 */
function saveLoginCertificate(certificate)         { return hwc.saveLoginCertificate(certificate); }

/**
 * @deprecated Deprecated since version 2.2 - use hwc.saveLoginCredentials(userName, password)
 */
function saveLoginCredentials(userName, password)  { return hwc.saveLoginCredentials(userName, password); }

/**
 * @deprecated Deprecated since version 2.2 - use hwc.activationRequired()
 */
function activationRequired()       { return hwc.activationRequired(); }

/**
 * @deprecated Deprecated since version 2.2 - use hwc.showUrlInBrowser(url)
 */
function showUrlInBrowser(url)      { return hwc.showUrlInBrowser(url); }

/**
 * @deprecated Deprecated since version 2.2 - use hwc.markAsProcessed()
 */
function markAsProcessed()      { return hwc.markAsProcessed(); }

/**
 * @deprecated Deprecated since version 2.2 - use hwc.markAsActivated()
 */
function markAsActivated()      { return hwc.markAsActivated(); }

/**
 * Delegate for data message processing details.
 * In the custom case, the user is expected to provide their own implemenation.
 * In the default SUP HybridApp case, this updates values then sets the next screen to navigate to.
 * @param {string} incomingDataMessageValue The XML formatted string for the incoming message
 * @param {boolean} [noUI] true if this has no UI
 * @param [loading]
 * @param [fromActivationFlow]
 * @param [dataType]
 */
function processDataMessage(incomingDataMessageValue, noUI, loading, fromActivationFlow, dataType) {
    if( typeof(hwc.processDataMessage) === 'function' ) {
        return hwc.processDataMessage(incomingDataMessageValue, noUI, loading, fromActivationFlow, dataType);
    }
    else {
        // get the users attention
        hwc.log("Implementation required for hwc.processDataMessage", "ERROR", true);
        throw new Error("Implementation required for either global processDataMessage or hwc.processDataMessage");
    }
}

/**
 * @deprecated Deprecated since version 2.2 - use hwc.processDataMessage(incomingDataMessageValue, noUI, loading, fromActivationFlow, dataType)
 */
function processWorkflowMessage(incomingDataMessageValue, noUI, loading, fromActivationFlow, dataType) {
    return processDataMessage(incomingDataMessageValue, noUI, loading, fromActivationFlow, dataType);
}

/**
 * This function is invoked by the container when there is a native error to report.
 * Use {@link hwc.setReportErrorFromNative} to set the callback funtion this function will call.
 * This function is not intended to be called except by the container.
 * @private
 */
function reportErrorFromNative(errString) {
   var reportErrorCallback = hwc.getReportErrorFromNativeCallback();
   if( typeof reportErrorCallback === "function" )
   {
      reportErrorCallback( errString );
   }
}

/**
 * Container API
 */
(function(hwc, window, undefined) {
    
    /**
     * A number representing the logging level.  The logging level must be an integer from the range [1..4]
     * with the higher numbers being more verbose.
     *
     * @type {number}
     */
    var requestedLoggingLevel,
    /**
     * A callback function used when {@link hwc.log} is invoked with true for the notifyUser parameter.
     * This callback should notify the user of the log message in an appropriate manner.
     *
     * @type {anonymous.alertDialogCallbackFunction}
     */
    requestedAlertDialogCallback,
    /**
     * A callback function used when there is a native error to report
     *
     * @type {anonymous.errorCallbackFunction}
     */
    reportErrorFromNativeCallback;
    
    /**
     * This function sets the callback used by hwc.log when it is required to notify the user of a log item.
     *
     * @param {anonymous.alertDialogCallbackFunction} newAlertDialogCallback The alert dialog to use.
     *
     * @example
     * customLogAlert = function( message )
     * {
     *    alert( "New log message: " + message );
     * }
     * hwc.setLoggingAlertDialog( customLogAlert );
     * @memberOf hwc
     * @public
     */
    hwc.setLoggingAlertDialog = function( newAlertDialogCallback )
    {
        requestedAlertDialogCallback = newAlertDialogCallback;
    };
    
    /**
     * This function gets the callback used by hwc.log when it is required to notify the user of a log item.
     *
     * @return {anonymous.alertDialogCallbackFunction} The alert dialog callback function.
     * @memberOf hwc
     * @public
     */
    hwc.getLoggingAlertDialog = function()
    {   
        return requestedAlertDialogCallback;
    };
    
    /**
     * This function sets the logging level. The logging level set with this function only persists as long as this javascript context does.
     * When the hybrid app is closed, the value set with this function is lost.
     *
     * @param {number} newLoggingLevel The number representing the new logging level.
     * Must be an integer in the range [1..4].  The higher numbers represent more verbose logging levels
     * from 1 for ERROR level logging up to 4 for DEBUG level logging.
     * @memberOf hwc
     * @public
     * @example
     * // Set the logging level to debug.
     * hwc.setLoggingCurrentLevel( 4 );
     */
    hwc.setLoggingCurrentLevel = function( newLoggingLevel )
    {
        requestedLoggingLevel = newLoggingLevel;
    };

    /**
     * This function gets the logging level.
     *
     * @return {number} A number representing the logging level.  Will be an integer in the range [1..4].
     * The higher numbers represent more verbose logging levels from 1 for ERROR level logging up to 4 for DEBUG level logging.
     * @memberOf hwc
     * @public
     * @example
     * // Get the logging level
     * var loggingLevel = hwc.getLoggingCurrentLevel();
     */
    hwc.getLoggingCurrentLevel = function() {
        var logLevel;
        if (requestedLoggingLevel === undefined) {
            logLevel = hwc.getQueryVariable("loglevel");
            requestedLoggingLevel = logLevel ? parseInt(logLevel, 10) : 1;
        }
        return requestedLoggingLevel; 
    };
    
    /**
     * This function sets the callback function called when there is a native error reported.
     * Calling this function will replace any callback that had been set previously.
     * @memberOf hwc
     * @public
     * @example
     * var errorCallback = function( errorString )
     * {
     *    alert( "There was a native error: " + errorString );
     * }
     * hwc.setReportErrorFromNativeCallback( errorCallback );
     */
    hwc.setReportErrorFromNativeCallback = function( callbackToSet )
    {
        reportErrorFromNativeCallback = callbackToSet;
    };
    
    /**
     * This function returns the callback function that will be called by {@link reportErrorFromNative}.
     * This function is not intended to be called by any function but {@link reportErrorFromNative}.
     * @private
     */
    hwc.getReportErrorFromNativeCallback = function()
    {
        return reportErrorFromNativeCallback;
    };

    /**
     * This function looks in the query string on the URL for the value corresponding to the given name.
     *
     * @param {string} variable The name of the variable in the URL to retrieve the value for.
     * @memberOf hwc
     * @public
     * @example
     * // Get the pageToShow variable from the URL query string
     * var pageToShow = hwc.getQueryVariable( "pageToShow" );
     */
    hwc.getQueryVariable = function(variable) {
        var query, vars, i, pair;
        query = window.location.search.substring(1);
        vars = query.split("&");
        for (i = 0; i < vars.length; i++) {
            pair = vars[i].split("=");
            if (pair[0] === variable) {
                return unescape(pair[1]);
            }
        }
    };
    

/**
 * This object contains constants representing the different types of public native error codes.
 * Error codes larger than 500 are reserved for server communication errors which may occur as the result of online requests and/or attachment downloads
 *
 * @namespace
 */
hwc.NativeErrorCodes = {};
/**
 * A constant indicating there was an unknown error.
 *
 * @constant
 *
 * @type {number}
 * @memberOf hwc.NativeErrorCodes
 * @public
 */
hwc.NativeErrorCodes.UNKNOWN_ERROR = 1;
/**
 * A constant indicating the attachment has not been downloaded.
 *
 * @type {number}
 * @memberOf hwc.NativeErrorCodes
 * @public
 */
hwc.NativeErrorCodes.ATTACHMENT_NOT_DOWNLOADED = 100;
/**
 * A constant indicating there was an unkown MIME type.
 *
 * @type number
 * @memberOf hwc.NativeErrorCodes
 * @public
 */
hwc.NativeErrorCodes.UNKNOWN_MIME_TYPE = 101;
/**
 * A constant indicating there was a filename without an extension.
 *
 * @type {number}
 * @memberOf hwc.NativeErrorCodes
 * @public
 */
hwc.NativeErrorCodes.FILENAME_NO_EXTENSION = 102;
/**
 * A constant indicating a required parameter was not available.
 *
 * @type {number}
 * @memberOf hwc.NativeErrorCodes
 * @public
 */
hwc.NativeErrorCodes.REQUIRED_PARAMETER_NOT_AVAILABLE = 103;
/**
 * A constant indicating there was no certificate selected by the user.
 *
 * @type {number}
 * @memberOf hwc.NativeErrorCodes
 * @public
 */
hwc.NativeErrorCodes.CERTIFICATE_NOT_SELECTED = 104;
/**
 * A constant indicating the attachment type is not supported.
 *
 * @type {number}
 * @memberOf hwc.NativeErrorCodes
 * @public
 */
hwc.NativeErrorCodes.UNSUPPORTED_ATTACHMENT_TYPE = 105;
/**
 * A constant indicating there was an SSO certificate manager exception.
 *
 * @type {number}
 * @memberOf hwc.NativeErrorCodes
 * @public
 */
hwc.NativeErrorCodes.SSOCERT_EXCEPTION = 106;
/**
 * A constant indicating a failure to save a credential.
 *
 * @type {number}
 * @memberOf hwc.NativeErrorCodes
 * @public
 */
hwc.NativeErrorCodes.FAIL_TO_SAVE_CREDENTIAL = 107;
/**
 * A constant indicating a failure to save a certificate.
 *
 * @type {number}
 * @memberOf hwc.NativeErrorCodes
 * @public
 */
hwc.NativeErrorCodes.FAIL_TO_SAVE_CERTIFICATE = 108;
/**
 * A constant indicating the device is not connected.
 *
 * @type {number}
 * @memberOf hwc.NativeErrorCodes
 * @public
 */
hwc.NativeErrorCodes.DEVICE_NOT_CONNECTED = 109;
/**
 * A constant indicating the response it too large for a javascript variable.
 *
 * @type {number}
 * @memberOf hwc.NativeErrorCodes
 * @public
 */
hwc.NativeErrorCodes.RESPONSE_TOO_LARGE = 110;
/**
 * A constant indicating that opening the URL failed.
 *
 * @type {number}
 * @memberOf hwc.NativeErrorCodes
 * @public
 */
hwc.NativeErrorCodes.NAVIGATION_ERROR = 111;
/**
 * A constant indicating an invalid common name was passed while requesting a certificate from Afaria.
 *
 * @type {number}
 * @memberOf hwc.NativeErrorCodes
 * @public
 */
hwc.NativeErrorCodes.INVALID_COMMON_NAME = 112;



/**
 * A utility function for use in generating a GUID
 *
 * @private
 */
function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}

/**
 * This function generates a GUID (globally unique identifier).
 *
 * @return {string} The generated GUID.
 * @memberOf hwc
 * @public
 * @example
 * var globallyUniqueName = hwc.guid();
 */
hwc.guid = function() {
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
};

/**
 * Reliably returns an XMLHttpRequest object regardless of what platform this code is being executed on.
 *
 * @return {object} An XMLHTTPRequest object.
 * @memberOf hwc
 * @public
 * @example
 * var request = hwc.getXMLHTTPRequest();
 */
hwc.getXMLHTTPRequest = function getXMLHTTPRequest() {
    var xmlHttpReq;
    if (window.XMLHttpRequest) {
        xmlHttpReq = new XMLHttpRequest();
    }
    else {// code for IE6, IE5
        xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
    }
    return xmlHttpReq;
};


/****************** Hybrid App NATIVE FUNCTIONS ************************/

/**
 * Sets the title of the screen.
 *
 * @param {string} screenTitle The screen title to use.
 * @memberOf hwc
 * @public
 * @example
 * hwc.setScreenTitle_CONT( "Custom Screen Title" );
 */
hwc.setScreenTitle_CONT = function(screenTitle) {
    if (hwc.isWindows()) {
        document.title = screenTitle; 
    }      
    else {
         if (hwc.isIOS() || hwc.isAndroid()) {
             hwc.getDataFromContainer("setscreentitle", "&title=" + encodeURIComponent(screenTitle));
          }
          else {
             hwc.postDataToContainer("setscreentitle", "&title=" + encodeURIComponent(screenTitle));
          }
    }
};

/**
 * This class represents a collection of menu items.
 * @memberOf hwc
 * @public
 * @class
 *
 * @example
 * // This is the function we'll use as a callback for the first menu item.
 * var callback = function()
 * {
 *    alert( "You clicked the first menu item!" );
 * }
 * 
 * // This is the function we'll use as a callback for the second menu item.
 * var callback2 = function()
 * {
 *    alert( "You clicked the second menu item!" );
 * }
 *
 * // This function creates and adds a menu item collection.
 * var addMenuItems = function()
 * {
 *    var menuItemCollection = new hwc.MenuItemCollection();
 *    menuItemCollection.addMenuItem("menu item 1", "callback()");
 *    menuItemCollection.addMenuItem("menu item 2", "callback2()");
 *    hwc.addMenuItemCollection( menuItemCollection );
 * }
 */
hwc.MenuItemCollection = function() {
    this.menuItems = [];
    this.subMenuName = null;
    this.okAction = null;
};

/**
 * This function adds a menu item to the collection.
 *
 * @param {string} title The display text for the menu item.
 * @param {anonymous.genericCallbackFunction} callback The function to call when the menu item is clicked.
 * @param {boolean} [isDefault] Determines if the menu item is selected by default on BlackBerry.
 * If more than one menu item is added to the same collection with true for this parameter, the
 * last menu item added with true for this parameter will be selected by default on Blackberry.
 * @memberOf hwc.MenuItemCollection
 * @public
 * @example
 * var callbackFunctionName = function()
 * {
 *    alert( "Menu item clicked!" );
 * }
 * var menuItemCollection = new hwc.MenuItemCollection();
 * menuItemCollection.addMenuItem("menu item name", "callbackFunctionName()", true);
 * 
 */
hwc.MenuItemCollection.prototype.addMenuItem = function(title, callback, isDefault) {
    this.menuItems.push( { "name" : title, "action" : callback, "default" : isDefault ? "true" : "false" } );
};
     
/**
 * This function sets the sub menu name to use on Windows Mobile.
 *
 * @param {string} name The sub menu name to use.
 * @memberOf hwc.MenuItemCollection
 * @public
 * @example
 * var callbackFunctionName = function()
 * {
 *    alert( "Menu item clicked!" );
 * }
 * var menuItemCollection = new hwc.MenuItemCollection();
 * menuItemCollection.setSubMenuName( "Custom Menu" );
 * menuItemCollection.addMenuItem("menu item name", "callbackFunctionName()");
 */
hwc.MenuItemCollection.prototype.setSubMenuName = function(name) {
    this.subMenuName = name;
};
    
/**
 * This function sets the OK action to use on WM.
 * @memberOf hwc.MenuItemCollection
 * @public
 * @param {anonymous.genericCallbackFunction} callback The function to call when the OK button is pressed.
 *
 * @example
 * var callbackFunctionName = function()
 * {
 *    alert( "Menu item clicked!" );
 * }
 * var okActionFunction = function()
 * {
 *    alert( "A OKAY!" );
 * }
 * var menuItemCollection = new hwc.MenuItemCollection();
 * menuItemCollection.setOKAction( "okActionFunction()" );
 * menuItemCollection.addMenuItem("menu item name", "callbackFunctionName()");
 */
hwc.MenuItemCollection.prototype.setOKAction = function(callback) {
    this.okAction = callback;
};

/**
 * This function converts the menu item collection to a JSON string.  This function
 * is used as a helper for {@link hwc.addMenuItemCollection}.
 *
 * @return {string} The JSON string representing this menu item collection.
 * @memberOf hwc.MenuItemCollection
 * @public
 * @example
 * var callbackFunctionName = function()
 * {
 *    alert( "Menu item clicked!" );
 * }
 * var menuItemCollection = new hwc.MenuItemCollection();
 * var jsonMenuItemCollection = menuItemCollection.stringify();
 */
hwc.MenuItemCollection.prototype.stringify = function()
{
    return JSON.stringify({
        "menuitems" : this.menuItems,
        "submenuname" : this.subMenuName,
        "OK" : this.okAction
    }); 
};

/**
 * This function adds a menu item collection to the menu items for the screen.
 *
 * @param {@link hwc.MenuItemCollection} collection The collection of menu items to add to the screen.
 * @memberOf hwc
 * @public
 * @example
 * var callbackFunctionName = function()
 * {
 *    alert( "Menu item clicked!" );
 * }
 * var menuItemCollection = new hwc.MenuItemCollection();
 * menuItemCollection.addMenuItem("menu item name", "callbackFunctionName()");
 * hwc.addMenuItemCollection( menuItemCollection );
 */
hwc.addMenuItemCollection = function(collection) {
    if (isBlackBerry() || isWindowsMobile() || isAndroid()) {
        var request = "menuitems=" + encodeURIComponent(collection.stringify());
          hwc.postDataToContainer("addallmenuitems", request);
    }
};

/**
 * Allows the user to add a menuitem with the specified name and with the specified
 * callback, which will be invoked when the menuitem is clicked.  This function should
 * only be used in hybrid apps generated with the Unwired Workspace designer.
 *
 * @private
 *
 * @param {string} menuItemName The specified menuitem name.
 * @param {string} functionName The string representing the call to the {@link anonymous.genericCallbackFunction} callback function.
 * @param {string} subMenuName The specific sub-menu name for Windows Mobile.
 * @param {string} screenToShow The screen about to be shown.
 * @param {string} [menuItemKey] The menuItem's key.
 * @memberOf hwc
 * @example
 * var callbackFunction = function()
 * {
 *    alert( "Menu Item Clicked!" );
 * }
 * hwc.addMenuItem_CONT( "Custom Menu Item", "callbackFunction()", "Custom Sub Menu", "Start" );
 */
hwc.addMenuItem_CONT = function(menuItemName, functionName, subMenuName, screenToShow, menuItemKey) {
    var div, menuStr, idxOfMenuItemName, comma, request;
    if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("entering addMenuItem()", "DEBUG", false); }
    //first add the item to sup_menuitems
    div = document.getElementById(screenToShow + "ScreenDiv");
    menuStr = div.getAttribute("sup_menuitems");
    idxOfMenuItemName = menuStr.indexOf(menuItemName);
    if (idxOfMenuItemName !== -1) {
        return;
    }
    comma = (menuStr.length > 0) ? "," : "";
    menuStr = menuStr + comma + menuItemName + "," + menuItemKey;
    try {
        div.setAttribute("sup_menuitems", menuStr);  //has no affect on Windows Mobile
    }
    catch (e) {
    }

    request = "menuitemname=" + encodeURIComponent(menuItemName);
    request += ("&onmenuclick=" + encodeURIComponent(functionName) + "()");
    if (hwc.isWindowsMobile()) {
        request += "&submenuname=";
        if (subMenuName) {
            request += encodeURIComponent(subMenuName);
        }
        else {
            if (resources) {
                request += encodeURIComponent(resources.getString("MENU"));
            }
            else {
                request += "Menu";
            }
        }
          hwc.postDataToContainer("addMenuItem", request);
    }
    else if (hwc.isAndroid() || hwc.isBlackBerry()) {
          hwc.postDataToContainer("addMenuItem", request);
    }    
        
    if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("exiting addMenuItem()", "DEBUG", false); }
};


/**
 * This function removes all menu items that were added by the hybrid app.
 * @memberOf hwc
 * @public
 * @example
 * hwc.removeAllMenuItems();
 */
hwc.removeAllMenuItems = function() {
    if (hwc.isAndroid() || hwc.isWindowsMobile() || hwc.isBlackBerry() ) {
        hwc.getDataFromContainer("removeallmenuitems");
    } 
};

/**
 * This function sets the activation required state of this hybrid app to true.  After calling this
 * function, the current hybrid app will need to be activated.
 * @memberOf hwc
 * @public
 * @example
 * hwc.activationRequired();
 */
hwc.activationRequired = function() {
    if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("entering activationRequired()", "DEBUG", false); }

    hwc.getDataFromContainer("requiresactivation");      

    if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("exiting activationRequired()", "DEBUG", false); }
};

/**
 * This function sets the activation required state for the current hybrid app to false.  After calling this
 * function, the current hybrid app will not need to be activated.
 * @memberOf hwc
 * @public
 * @example
 * hwc.markAsActivated();
 */
hwc.markAsActivated = function() {
    if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("entering markAsActivated()", "DEBUG", false); }

    hwc.getDataFromContainer("markasactivated");     

    if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("exiting markAsActivated()", "DEBUG", false); }
};

/**
 * Allows the user to set the processed state to true for the current message.
 * @memberOf hwc
 * @public
 * @example
 * hwc.markAsProcessed()
 */
hwc.markAsProcessed = function() {
    if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("entering markAsProcessed()", "DEBUG", false); }

    hwc.getDataFromContainer("markasprocessed");

    if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("exiting markAsProcessed()", "DEBUG", false); }
};

/**
 * Allows the user to set the credentials to the expired state for the current hybrid app.
 * @memberOf hwc
 * @public
 * @example
 * hwc.expireCredentials();
 */
hwc.expireCredentials = function() {
    if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("entering expireCredentials()", "DEBUG", false); }

    hwc.getDataFromContainer("expirecredentials");   

     if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("exiting expireCredentials()", "DEBUG", false); }
};

/**
 * This function clears the contents of the on-device request result cache for the current hybrid app.
 * @memberOf hwc
 * @public
 * @example
 * hwc.clearCache();
 */
hwc.clearCache = function() {
    if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("entering clearCache()", "DEBUG", false); }
     
     hwc.getDataFromContainer("clearrequestcache");

    if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("exiting clearCache()", "DEBUG", false); }
};

/**
 * This function clears an item from the contents of the on-device request result cache for the current hybrid app.
 *
 * @param {string} cachekey The key for the cache item to be removed.  This is the same key that was passed to hwc.doOnlineRequest.
 * @memberOf hwc
 * @public 
 * @example
 * // The cache key is set when calling hwc.doOnlineRequest_CONT
 * hwc.doOnlineRequest( ., ., ., ., ., ., ., cacheKey, ., .);
 * // At some later point if we want to clear the cache for the above request, we use the following code:
 * hwc.clearCacheItem( cacheKey );
 */
hwc.clearCacheItem = function( cachekey ) {
    var request;
    if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("entering clearCacheItem()", "DEBUG", false); }
    request = "cachekey=" + encodeURIComponent(cachekey);
   
    hwc.postDataToContainer("clearrequestcacheitem", request);
    if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("exiting clearCacheItem()", "DEBUG", false); }
};


/**
 * Allows the user to log a message to the device trace log which can be remotely retrieved from the server. 
 * Whether the message actually gets logged will depend on how the log level that the administrator has selected
 * for this device user compares with the log level of this message.
 * The logging level and alert dialog callback can be set with {@link hwc.setLoggingCurrentLevel} and {@link setLoggingAlertDialog}.
 *  
 * @param {string} sMsg The message to be logged.
 * @param {string} eLevel The error level for this message.  This parameter must be one of: "ERROR", "WARN", "INFO" or "DEBUG".
 * @param {boolean} notifyUser Whether the logging alert callback will be invoked.  This parameter is independent of the
 * logging level (the logging alert callback will always be invoked if this is true, and never if this is false).
 * @memberOf hwc
 * @public
 * @example
 * var logAlert = function( message )
 * {
 *    alert( "New log message: " + message );
 * }
 * hwc.setLoggingAlertDialog( logAlert );
 * hwc.setLoggingCurrentLevel( 3 );
 * // The following will be logged, and the logging alert dialog will be invoked.
 * hwc.log( "info message notify", "INFO", true );
 * // The following will be logged, but the logging alert dialog will not be invoked.
 * hwc.log( "info message", "INFO", false );
 * // The following will not be logged, but the logging alert dialog will be invoked.
 * hwc.log( "debug message notify", "DEBUG", true );
 * // The following will not be logged, and the logging alert dialog will not be invoked.
 * hwc.log( "debug message", "DEBUG", false );
 * 
 */
hwc.log = function log(sMsg, eLevel, notifyUser) {
    var msgLogLevel;
    if( !sMsg ) {
        return; 
    } 
    if (notifyUser && hwc.getLoggingAlertDialog()) {
        (hwc.getLoggingAlertDialog())(sMsg);
    }
    
    switch (eLevel) {
        case "ERROR":
            msgLogLevel = 1;
            break;
        case "WARN":
            msgLogLevel = 2;
            break;
        case "INFO":
            msgLogLevel = 3;
            break;
        case "DEBUG":
            msgLogLevel = 4;
            break;
        default:
            msgLogLevel = 1;
    }
    if((sMsg === "") || (msgLogLevel > hwc.getLoggingCurrentLevel()) || (hwc.isWindows())) {
        return;
    }

    if (hwc.isAndroid()) {
        _HWC.log(sMsg, msgLogLevel);
    } else {
        hwc.postDataToContainer("logtoworkflow", "loglevel=" + msgLogLevel + "&logmessage=" + encodeURIComponent(sMsg));
    }

};

/**
 * This function opens a form on the device that allows the user to specify the credentials for the use of
 * certificate-based authentication. If the user picks a certificate, then that certificate is saved in the
 * credentials cache.
 * @memberOf hwc
 * @public
 * @example
 * hwc.showCertificatePicker();
 */
hwc.showCertificatePicker = function() {
    if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("entering showCertificatePicker()", "DEBUG", false); }
     
     hwc.getDataFromContainer("showcertpicker");

    if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("exiting showCertificatePicker()", "DEBUG", false); }
};


/**
 * This function saves login credentials from a certificate to the credential cache.
 * The common name is used for the username and the signed certificate is used for the password.
 *
 * @param {hwc.Certificate} certificate The values certificate.subjectCN and certificate.signedCertificate must be defined.
 * @memberOf hwc
 * @public
 * @example
 * var certInfo = {};
 * certInfo.subjectCN = "sampleCommonName";
 * certInfo.signedCertificate = "samplePassword";
 * hwc.saveLoginCertificate( certInfo );
 */
hwc.saveLoginCertificate = function(certificate) {
    if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("entering saveLoginCertificate()", "DEBUG", false); }

    hwc.saveLoginCredentials(certificate.subjectCN, certificate.signedCertificate, true);

    if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("exiting saveLoginCertificate()", "DEBUG", false); }
};

/**
 * This function saves login credentials to the credential cache.
 *
 * @param {string} userName The user name to save
 * @param {string} password The password to save
 * @memberOf hwc
 * @public
 * @example
 * hwc.saveLoginCredentials( "sampleUserName", "samplePassword" );
 */
hwc.saveLoginCredentials = function(userName, password) {
    var requestData;
    if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("entering saveLoginCredentials()", "DEBUG", false); }

    requestData = "supusername=" + encodeURIComponent(userName) + "&suppassword=" + encodeURIComponent(password);

    if (hwc.isAndroid()) {
        _HWC.saveCredentials( userName, password );
    }  else {
         hwc.postDataToContainer("savecredential", requestData);
    }

    if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("exiting saveLoginCredentials()", "DEBUG", false); }
};

/**
 * This function opens the supplied URL in a browser.  The browser opens on top of the hybrid app - the
 * context of the hybrid app is undisturbed.
 *
 * @param {string} url The URL to be shown in a browser.
 * @memberOf hwc
 * @public
 * @example
 * hwc.showUrlInBrowser( "http://www.google.com" );
 */
hwc.showUrlInBrowser = function showUrlInBrowser(url)
{
    var idxOfColon;
    if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("entering showInBrowser()", "DEBUG", false); }
    url = hwc.trimSpaces(url, true);
    idxOfColon = url.indexOf(":");
    if (idxOfColon === -1 || (idxOfColon > 7)) {
        url = "http://" + url;
    }
    
    if (hwc.isWindowsMobile() || hwc.isAndroid() || hwc.isIOS() || hwc.isBlackBerry()) {
        hwc.getDataFromContainer("showInBrowser", "&url=" + encodeURIComponent(url));
    } else {
        window.open(url);
    }

    if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("exiting showInBrowser()", "DEBUG", false); }
};

/**
 * Shows the given file contents in a content-appropriate way. The type of the content is
 * supplied by either the MIME type or the filename, at least one of which must be supplied.
 * The content itself should be presented as a base64-encoded string. Not all file types may
 * be supported on all platforms.
 *
 * @param {string} contents The base-64 encoded version of the binary content of the attachment to be displayed.
 * @param {string} mimeType The MIME type of the file.
 * @param {string} fileName The name of the file.
 * @param {anonymous.genericCallbackFunction} waitDialogCallbackString The callback function used to close a wait dialog once the attachment
 * is done opening.
 * @memberOf hwc
 * @public
 * @example
 * var openAttachmentBase64StringPng = function()
 * {
 *    // How you want get the base 64 encoding of the file is up to you. This string represents a small png image.
 *    var data = "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAA0SURBVFhH7dAxEQAACAMx3CAT6eVQwZKh8/dSmc7n6jN+bQcIECBAgAABAgQIECBAgACBBb3SkJeQ67u1AAAAAElFTkSuQmCC";
 *    hwc.showProgressDialog();
 *    // Don't have to pass the filename because we are passing the MIME type.
 *    hwc.showAttachmentContents_CONT( data, "image/png", null, "hwc.hideProgressDialog()" );
 * }
 * 
 * @example
 * var openAttachmentBase64StringTxt = function()
 * {
 *    // How you want get the base 64 encoding of the file is up to you. This string represents a short text file.
 *    var data = "VGhpcyBpcyBwYXJ0IG9mIGEgaHlicmlkIGFwcC4=";
 *    // Don't have to pass the MIME type because we are passing the filename.
 *    hwc.showAttachmentContents_CONT( data, null, "attach.txt" );
 * }
 */
hwc.showAttachmentContents_CONT = function(contents, mimeType, fileName, waitDialogCallbackString) {
    var request;
    if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("entering showAttachment_CONT()", "DEBUG", false); }
    request = "callback=" + waitDialogCallbackString;

    if (hwc.isWindowsMobile()) {
        contents = contents.replace(/=/g, "~");
        request += "&Attachmentdata=" + contents;
    } else {
        request += "&Attachmentdata=" + encodeURIComponent(contents);
    }
    if (mimeType) {
        request += "&mimetype=" + encodeURIComponent(mimeType);
    }
    if (fileName) {
       request += "&filename=" + encodeURIComponent(fileName);
    }
     
     hwc.postDataToContainer("showattachment", request);
    if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("exiting showAttachment_CONT()", "DEBUG", false); }
};

/**
 * Shows the given file contents in a content-appropriate way. The type of the content is
 * supplied by either the MIME type or the filename, at least one of which must be supplied.
 * The content itself will be a unique key supplied earlier to a call to doAttachmentDownload.
 * @param uniqueKey The unique key for the attachment.
 * @param mimeType The MIME type of the file.
 * @param fileName The name of the file.
 * @param waitDialogCallbackString string with the value for the 'callback=' parameter.
 * @memberOf hwc
 * @public 
 */
hwc.showAttachmentFromCache_CONT = function(uniqueKey, mimeType, fileName, waitDialogCallbackString) {
    var request;
    if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("entering showAttachment()", "DEBUG", false); }
    request = "callback=" + waitDialogCallbackString;

    request += "&uniquekey=" + encodeURIComponent(uniqueKey);
    if (mimeType) {
        request += "&mimetype=" + encodeURIComponent(mimeType);
    }
    if (fileName) {
       request += "&filename=" + encodeURIComponent(fileName);
    }
     
     hwc.postDataToContainer("showattachment", request);
    if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("exiting showAttachment()", "DEBUG", false); }
};

/**
 * Shows a local attachment.
 *
 * @param {string} key The key of the attachment.  This is the path to the file, with the root being the
 * folder that manifest.xml is located.
 * @memberOf hwc
 * @public
 * @example
 * hwc.showLocalAttachment( "html/images/samplePic.gif" );
 */
hwc.showLocalAttachment = function showLocalAttachment(key) {
    if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("entering showLocalAttachment()", "DEBUG", false); }
    
    if (hwc.isWindowsMobile() || hwc.isAndroid() || hwc.isIOS()) { 
        hwc.getDataFromContainer("showlocalattachment", "&key=" + encodeURIComponent(key));
    } else if (hwc.isBlackBerry()) {
        if (key.indexOf("file://") > -1){
            window.location = key;
        } else {
            window.location = "http://localhost/" + key;
        }
    } else {
        window.open(key);
    }

    if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("exiting showLocalAttachment()", "DEBUG", false); }
};

/**
 * Internal function to allow the user to cause an operation/object query to be invoked.  This function should probably
 * only be used by designer generated javascript.
 *
 * @private
 *
 * @param {string} credInfo Credential info in the format "supusername=usernameValue&suppassword=passwordValue"
 * @param {string} serializeDataMessageToSend The data message, already serialized.  This parameter should be obtained by calling serializeToString
 * on the result from hwc.getMessageValueCollectionForOnlineRequest.
 * @param {boolean} hasFileMessageValue Whether the data message to send has a file message value.  This parameter should be obtained by calling
 * getHasFileMessageValue on the result from hwc.getMessageValueCollectionForOnlineRequest.
 * @param {number} timeout Specifies the time, in seconds, to wait before giving up waiting for a response.
 * @param {string} cacheTimeout Specifies the time, in seconds, since the last invocation with the same input parameter values to use the same
 * response as previously retrieved without making a new call to the server.  If this parameter is NEVER, the cache content will never expire.
 * @param {string} errorMessage Specifies the string to display if an online request fails.
 * @param {anonymous.errorCallbackFunction} errorCallback Name of the function to be called if an online request fails. If  this parameter is null,
 * 'reportRMIError' will be used.
 * @param {string} cacheKey String used as the key for this request in the on-device request result cache.
 * @param {string} cachePolicy Specifies cache lookup policy used by container. If this parameter is 'serverfirst' (ignoring case) then the cache policy
 * used for this online request will be to check the server before the cache.  If this parameter is any other value then a cache first policy will be used.
 * If this parameter is absent and cache is enabled, the container uses default cache lookup policy to get data from cache if it is not expired.
 * @param {boolean} asynchronous Specifies whether container will make the request in synchronous or asynchronous mode.
 * If this parameter is absent, the container makes the request to the server in synchronous mode.
 * @memberOf hwc
 */
hwc.doOnlineRequest_CONT = function( credInfo, 
        serializeDataMessageToSend,
        hasFileMessageValue,
        timeout, cacheTimeout, 
        errorMessage, errorCallback, 
        cacheKey, cachePolicy, 
        asynchronous) {
        
    var request, xmlhttp, response, encodedMessage, url, funcCall, responseDataType;
    request = "xmlWorkflowMessage=" + encodeURIComponent(serializeDataMessageToSend);
    
    if (credInfo) {
        request += ("&" + credInfo);
    }
    request += ("&cachekey=" + encodeURIComponent(cacheKey));
    if (timeout) {
        request += ("&rmitimeout=" + timeout);
    }
    if (cacheTimeout) {
        request += ("&RequestExpiry=" + cacheTimeout);
    }
    if (hasFileMessageValue) {
        request += ("&parse=true");
    }
    if (errorMessage) {
        if( hwc.isBlackBerry() ) {
            encodedMessage = encodeURIComponent(escape(errorMessage));
        } else {
            // This is a temporary fix for a bug in the container that calls
            // encodeURIComponent on the whole query string for Android.  See
            // IR 676161-2.
            encodedMessage = encodeURIComponent(errorMessage);
        }
        request += ("&onErrorMsg=" + encodedMessage);
    }
    if (!errorCallback) {
        errorCallback = "hwc.reportRMIError";
    }
    if (cachePolicy) {
        request += ("&cachePolicy=" + cachePolicy);
    }
    if (asynchronous) {
        request += ("&asynchronous=" + asynchronous);
    }
    request += ("&onErrorCallback=" + errorCallback);

    if (hwc.isWindowsMobile() || hwc.isWindows()) {
        //make xmlhttp request to load the rmi response from server
        xmlhttp = hwc.getXMLHTTPRequest();

        if (hwc.isWindowsMobile()) {
            xmlhttp.open("POST", "/sup.amp?querytype=rmi&" + hwc.versionURLParam, true );  
    
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState === 4) {
                    if (xmlhttp.status === 200 || xmlhttp.status === 0) {
                        response = xmlhttp.responseText;
                        var responseDataType = xmlhttp.getResponseHeader("OnlineRequest-Response-Data-Type");
                        processDataMessage(response, null, null, null, responseDataType);
                     }
                }
            };

            try {
                xmlhttp.send(request);
            }
            catch (excep1) {
                hwc.log("Error:  Unable to retrieve the message from the server", "ERROR", true);
            }
        }
        else { // hwc.isWindows() 
            xmlhttp.open("POST", "rmi.xml", false );
            xmlhttp.send(request);
    
            //Win32 returns 200 for OK, WM returns 0 for OK
            if (xmlhttp.status === 200 || xmlhttp.status === 0) {
                response = xmlhttp.responseText;
                processDataMessage(response);
            }
            else {
                hwc.log("Error:  Unable to retrieve the message from the server", "ERROR", true);
            }
        }
    }
    
    else if (hwc.isAndroid()) {
        url = 'http://localhost/sup.amp?querytype=rmi&' + hwc.versionURLParam;
        funcCall = "_HWC.postData('" + url + "', '" +  request + "')";
        // method processDataMessage invoked by native container.
        // funcCall = "processDataMessage(" + funcCall + ")";
        setTimeout(funcCall, 5);
    }  
    else { //BB and iPhone
        xmlhttp = hwc.getXMLHTTPRequest();   
        xmlhttp.open("POST", "http://localhost/sup.amp?querytype=rmi&" + hwc.versionURLParam, true);            
        
         if (hwc.isBlackBerry()) {
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState === 4) {
                    if (xmlhttp.status === 200) {
                        response = xmlhttp.responseText;
                        responseDataType = xmlhttp.getResponseHeader("OnlineRequest-Response-Data-Type");
                        processDataMessage(response, null, null, null, responseDataType);
                    }
                }
            };
        }
        try {
            xmlhttp.send(request);
        }
        catch (excep2) {
            hwc.log("Error:  Unable to retrieve the message from the server", "ERROR", true);
        }
    }                           
};

/**
 * Allows the user to cause an operation/object query to be invoked.  This function should probably only be used by
 * designer generated javascript.
 *
 * @private
 *
 * @param {string} credInfo Credential info in the format "supusername=usernameValue&suppassword=passwordValue"
 * @param {string} serializeDataMessageToSend The data message, already serialized.  This parameter should be obtained by calling serializeToString
 * on the result from hwc.getMessageValueCollectionForOnlineRequest.
 * @param {string} attachmentKey The specified key of the result will not be returned in the data message but will instead be stored on the
 * device for later access via {@link hwc.showAttachmentFromCache_CONT}.
 * @param {string} requestGUID Represents a unique key that can be used to store/access the cached key value from the request results.
 * @param {callback function} downloadCompleteCallback A function that will be invoked when the attachment has been downloaded to the device
 * and is ready to be accessed.
 * @memberOf hwc
 */
hwc.doAttachmentDownload_CONT = function(credInfo, serializeDataMessageToSend, attachmentKey, requestGUID, downloadCompleteCallback) {
    var request, xmlhttp;
    request = "xmlWorkflowMessage=" + encodeURIComponent(serializeDataMessageToSend);
    
    if (credInfo) {
        request += ("&" + credInfo);
    }
    request += ("&attachmentkey=" + attachmentKey);
    request += ("&uniquekey="     + requestGUID);
    request += ("&ondownloadcomplete=" + downloadCompleteCallback);
    if (hwc.isWindowsMobile() || hwc.isWindows()) {
        xmlhttp = hwc.getXMLHTTPRequest();
        xmlhttp.open("POST", "/sup.amp?querytype=downloadattachment&" + hwc.versionURLParam, true );
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4) {
                if (xmlhttp.status === 200) {
                    window[downloadCompleteCallback].call(this, decodeURIComponent(requestGUID), xmlhttp.responseText);
                }
            }
        };
        try {
            xmlhttp.send(request);          
        }
        catch (e3) {}                                
    }
    else if (hwc.isAndroid()) {
        hwc.postDataToContainer("downloadattachment", request);
    }   
    else {
        xmlhttp = hwc.getXMLHTTPRequest();
        xmlhttp.open("POST", "http://localhost/sup.amp?querytype=downloadattachment&" + hwc.versionURLParam, true);
        if (hwc.isBlackBerry()) {
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState === 4) {
                    if (xmlhttp.status === 200) {
                        window[downloadCompleteCallback].call(this, decodeURIComponent(requestGUID), xmlhttp.responseText);
                    }
                }
            };
        }
        try {
            xmlhttp.send(request);
        }
        catch (e1) {}
    }
};

/**
 * Allows the user to cause an operation/object query to be invoked. Will close the hybrid app application when finished.  This function should probably only be used by
 * designer generated javascript.
 *
 * @private
 *
 * @param {string} credInfo Credential info in the format "supusername=usernameValue&suppassword=passwordValue"
 * @param {string} serializeDataMessageToSend The data message, already serialized.  This parameter should be obtained by calling serializeToString
 * on the result from hwc.getMessageValueCollectionForOnlineRequest.
 * @param {boolean} hasFileMessageValue Whether the data message to send has a file message value.  This parameter should be obtained by calling
 * getHasFileMessageValue on the result from hwc.getMessageValueCollectionForOnlineRequest.
 * @memberOf hwc
 */
hwc.doSubmitWorkflow_CONT = function(credInfo, serializeDataMessageToSend, hasFileMessageValue) {
    var request = "xmlWorkflowMessage=" + encodeURIComponent(serializeDataMessageToSend);
    
    if (credInfo) {
        request += ("&" + credInfo);
    }
    if (hasFileMessageValue) {
        request += ("&parse=true");
    } 
     
     hwc.postDataToContainer("submit", request);
};

/**
 * Internal function to allow the user to cause an operation/object query to be invoked.  This function should probably only be used by
 * designer generated javascript.
 *
 * @private
 *
 * @param {string} credInfo Credential info in the format "supusername=usernameValue&suppassword=passwordValue"
 * @param {string} serializeDataMessageToSend The data message, already serialized.  This parameter should be obtained by calling serializeToString
 * on the result from hwc.getMessageValueCollectionForOnlineRequest.
 * @memberOf hwc
 */
hwc.doActivateWorkflow_CONT = function(credInfo, serializeDataMessageToSend ) {
    var request, xmlhttp;
    request = "xmlWorkflowMessage=" + encodeURIComponent(serializeDataMessageToSend);

    if (credInfo) {
        request += ("&" + credInfo);
    }
     
     hwc.postDataToContainer("activate", request);
};

/**
 * This function should probably only be used by designer generated javascript.
 *
 * @private
 
 * @param {string} credInfo Credential info in the format "supusername=usernameValue&suppassword=passwordValue"
 * @param serializeDataMessageToSend The data message, already serialized.  This parameter should be obtained by calling serializeToString
 * on the result from hwc.getMessageValueCollectionForOnlineRequest.
 * @memberOf hwc
 */
hwc.doCredentialsSubmit_CONT = function(credInfo, serializeDataMessageToSend ) {
    var request = "xmlWorkflowMessage=" + encodeURIComponent(serializeDataMessageToSend);

    if (credInfo) {
        request += ("&" + credInfo);
    }

    hwc.postDataToContainer("credentials", request);
};

/**
 * This function shows a progress dialog with spinner.  The dialog created by this function will block all
 * user input until {@link hwc.hideProgressDialog} is called.  It is important to be sure that
 * {@link hwc.hideProgressDialog} will be called after a call to this function.
 *
 * @param {string} [message] The message to show on the progress dialog. This message is displayed on Android
 * platforms only - other platforms show only a spinner.
 * @memberOf hwc
 * @public
 * @example
 * var showProgress = function()
 * {
 *    hwc.showProgressDialog( "a message" );
 *    setTimeout( hideProgress, 10000 );
 * }
 * 
 * var hideProgress = function()
 * {
 *    hwc.hideProgressDialog();
 * }
 */
hwc.showProgressDialog = function(message) {
    if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("entering showProgressDialog()", "DEBUG", false); }
    hwc.getDataFromContainer("showprogressdialog",  "&message=" + message);
    if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("exiting showProgressDialog()", "DEBUG", false); }
};

/**
 * This function hides the progress dialog displaying the  spinner.  This function should be used to hide
 * the progress dialog after a call to {@link hwc.showProgressDialog}.  If this function is called while there
 * is no progress dialog, then nothing will happen.
 * @memberOf hwc
 * @public
 * @example
 * var showProgress = function()
 * {
 *    hwc.showProgressDialog( "a message" );
 *    setTimeout( hideProgress, 10000 );
 * }
 * 
 * var hideProgress = function()
 * {
 *    hwc.hideProgressDialog();
 * }
 */
hwc.hideProgressDialog = function() {
    if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("entering hideProgressDialog()", "DEBUG", false); }
    hwc.getDataFromContainer("hideprogressdialog");
    if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("exiting hideProgressDialog()", "DEBUG", false); }
};


/**
 * Displays an alert dialog to the user.  This function blocks until it receives a response from the user.
 *
 * @param {string} message The message to display
 * @param {string} [title] The title doesn't actually get displayed.
 * @memberOf hwc
 * @public
 * @example
 * hwc.showAlertDialog( "This is a fancy alert dialog", "With a Title" );
 */
hwc.showAlertDialog = function(message, title) {
    alert(message);
};

/**
 * Shows a confirm dialog to the user.  This function blocks until it receives a response from the user.
 *
 * @param {string} message The message to display in the dialog.
 * @param {string} [title] The title doesn't actualy get displayed.
 *
 * @return {boolean} The user's choice from the confirm dialog.
 * @memberOf hwc
 * @public
 * @example
 * var userConfirm = hwc.showConfirmDialog( "Are you sure you want to see an alert message?", "Confirm Alert" );
 * if( userConfirm )
 * {
 *    alert( "This is what you wanted." );
 * }
 */
hwc.showConfirmDialog = function(message, title) {
    return confirm(message);
};

/**
 * This function closes the hybrid app.
 * @memberOf hwc
 * @public
 * @example
 * hwc.close();
 */
hwc.close = function() {
    workflowMessage = "";
    hwc.supUserName = "";
    if (hwc.isWindowsMobile()) {
        if(typeof(hwc.setWindowBlankScreen) === 'function')
        {
             hwc.setWindowBlankScreen();
        }
          
          hwc.getDataFromContainer("close");
    }
    else if (hwc.isIOS()) {
          hwc.getDataFromContainer("close");
    }
    else if (hwc.isAndroid()) {
        hwc.log("Closing Hybrid App" , "INFO");
        _HWC.close();
    }         
    else {
        window.close();
    }
};


})(hwc, window);
 
/**
 * A callback function invoked when {@link hwc.log} is invoked with true for the notifyUser parameter.
 * This callback should notify the user of the log message in an appropriate manner.
 *
 * @name anonymous.alertDialogCallbackFunction
 *
 * @param {string} message The message that the user should be notified of.
 *
 * @function
 */
 
/**
 * A callback function invoked if there is an error.
 *
 * @name anonymous.errorCallbackFunction
 *
 * @param {string} errorMessage The message describing the error.
 *
 * @function
 */
 
/**
 * A generic callback function that takes no parameters.  Used to execute code when a certain event occurs.
 *
 * @name anonymous.genericCallbackFunction
 *
 * @function
 */
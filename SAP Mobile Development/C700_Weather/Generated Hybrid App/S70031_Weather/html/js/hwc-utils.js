/**
 * Sybase Hybrid App version 2.2
 *
 * Utils_CONT.js    - container maintained aspect
 *
 * This file will not be regenerated, so it is possible to modify it, but it
 * is not recommended.
 *
 * The template used to create this file was compiled on Thu Jun 07 14:57:11 EDT 2012
 *
 * Copyright (c) 2012 Sybase Inc. All rights reserved.
 */
/** @namespace */
hwc = (typeof hwc === "undefined" || !hwc) ? {} : hwc;      // SUP 'namespace'

/**
 * Container Utilities
 */
(function(hwc, window, undefined) {

/****************** PUBLIC CONSTANTS ************************/
/** @private */
hwc.versionURLParam = "version=2.2";


/****************** PUBLIC API ************************/

/**
 * The version number sent with the HTTP messages to the native code.
 * @private
 * Used for internal versioning only
 * @return {String} the version string
 */
hwc.getVersionURLParam = function() {
    return hwc.versionURLParam;
};


/**
 * @private
 * Internal worker for initial HybridApp loading.
 * Returns the response message or empty.
 */
hwc.onHybridAppLoad_CONT = function() {
   var response = hwc.getTransformData();
   processDataMessage(response, false, true);
};

/**
 * Returns the transform data for the hybridapp.  Only a server-initiated app will have this data.
 * @example
 * TODO: Add an example
 * @return the transform data.
 * @public
 * @memberOf hwc
 */
hwc.getTransformData = function() {
   var xmlhttp;
   if (hwc.isWindows()) {
      xmlhttp = hwc.getXMLHTTPRequest();
      xmlhttp.open("GET", "transform.xml", false);
      xmlhttp.send("");
      if (xmlhttp.status === 200 || xmlhttp.status === 0) {//Win32 returns 200 for OK, WM returns 0 for OK
         return xmlhttp.responseText;
      }
    }
    else
    {
        return hwc.getDataFromContainer("loadtransformdata");
    }
};

/**
 * @private
 * Internal worker for adding a single menu item.
 */
hwc.addNativeMenuItem_CONT = function (menuStr ) {
        hwc.postDataToContainer("addallmenuitems", "menuitems=" + encodeURIComponent(menuStr));
};

 /**
 * @private
  * Internal worker setting credential information.
  */
hwc.handleCredentialChange_CONT = function(credInfo) {
        var requestData = credInfo ? credInfo : "";
        if (requestData) {
            if (!hwc.isWindows())  {
                  hwc.postDataToContainer("formredirect", requestData);
            }
        }
};

/**
 * @private
 * Removes spaces from the specified string.
 * @param str The specified string
 * @param leftAndRightOnly When true removes leading and trailing spaces
 * @return The trimmed string
 * @memberOf hwc
 */
hwc.trimSpaces = function(str, leftAndRightOnly) {
    if (leftAndRightOnly) {
        return str.replace(/^\s+|\s+$/g,"");
    }
    return str.replace(/\s+/g, '');
};

/** @private 
 * @memberOf hwc
 */
hwc.parseBoolean = function(value) {
   if (value) {
      return hwc.trimSpaces(value, true).toLowerCase() === "true";
   }
   else {
      return false;
   }
};

/**
 * Extract the error message from a URL string. The parameter name of the error message should be "onErrorMsg".
 *
 * @param {String} errString The error string URL
 * @return {String} error message
 * @memberOf hwc
 * @public
 */
hwc.getOnErrorMessageFromNativeError = function getOnErrorMessageFromNativeError(errString) {
        if( hwc.isBlackBerry() ) {
            return unescape(hwc.getURLParamFromNativeError("onErrorMsg", errString));
        } else {
            // This is a temporary fix for a bug in the container that calls
            // encodeURIComponent on the whole query string for Android.  See
            // IR 676161-2.
            return hwc.getURLParamFromNativeError("onErrorMsg", errString);
        }
};

/**
 * Extract the error call back method name from a URL string. The parameter name of the error call back method should be "onErrorCallback".
 * @param {String} errString The error string URL
 * @return {String} the error callback method name
 * @memberOf hwc
 * @public
 */
hwc.getCallbackFromNativeError = function getCallbackFromNativeError(errString) {
    return hwc.getURLParamFromNativeError("onErrorCallback", errString);
};

/**
 * Extract an error code from a URL string. The parameter name of the error code should be "errCode".
 * @example
 * TODO: CONFIRM THE RETURN DATATYPE
 * @param {String} errString The error string URL
 * @return {String} error code
 * @memberOf hwc
 * @public
 */
hwc.getCodeFromNativeError = function getCodeFromNativeError( errString ) {
    return hwc.getURLParamFromNativeError("errCode", errString);
};

/**
 * Extract a native message from a URL string. The parameter name of the native message should be "nativeErrMsg".
 * @param {String} errString The error string URL
 * @return {String} the native message
 * @memberOf hwc
 * @public
 */
hwc.getNativeMessageFromNativeError = function getNativeMessageFromNativeError( errString ) {
    return hwc.getURLParamFromNativeError("nativeErrMsg", errString);
};

/**
 * Extract a parameter value from a URL string with a given parameter name.
 * @param {String} paramName The parameter name
 * @param {String} url The containing URL of the parameter
 * @return {String} The parameter value
 * @memberOf hwc
 * @public
 */
hwc.getURLParamFromNativeError = function getURLParamFromNativeError(paramName, url) {
        var indxofS, idxofE, pName, pValue, paramSection, ret, paramSectionsAmp, ampSections, idxofA;
        
        if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("entering getURLParamFromNativeError()", "DEBUG", false); }

        if( hwc.isBlackBerry() ) {
            paramSection = url;
        } else {
            // This is a temporary fix for a bug in the container that calls
            // encodeURIComponent on the whole query string for Android.  See
            // IR 676161-2.
            paramSection = decodeURIComponent(url);
        }
        idxofA = paramSection.indexOf("&");
        if (idxofA > 0) {//there is one or more parameters in the & section
            paramSectionsAmp = paramSection.substring(idxofA + 1);
            ampSections = paramSection.split("&");
            if (ampSections.length === 1) {
                idxofE = paramSectionsAmp.indexOf("=");
                pName = paramSectionsAmp.substring(0, idxofE);
                if (pName.toLowerCase() === paramName.toLowerCase()) {
                    pValue = paramSectionsAmp.substring(idxofE + 1);
                    ret = decodeURIComponent( pValue);
                    if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("exiting getURLParamFromNativeError()", "DEBUG", false); }
                    return ret;
                }
            } else {  //multiple parameters in the & section
                for (indxofS in ampSections) {
                    idxofE = ampSections[indxofS].indexOf("=");
                    pName = ampSections[indxofS].substring(0, idxofE);
                    if (pName.toLowerCase() === paramName.toLowerCase()) {
                        pValue = ampSections[indxofS].substring(idxofE + 1);
                        ret = decodeURIComponent( pValue) ;
                        if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("exiting getURLParamFromNativeError()", "DEBUG", false); }
                        return ret;
                    }
                }
            }
            //ok did not find paramName in & section look for it at the start
            idxofE = paramSection.indexOf("=");
            pName = paramSection.substring(0, idxofE);
            if (pName.toLowerCase() === paramName.toLowerCase()) {
                pValue = paramSection.substring(idxofE + 1, idxofA);
                ret = decodeURIComponent( pValue );
                if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("exiting getURLParamFromNativeError()", "DEBUG", false); }
                return ret;
            }
        } else { //only one param
            idxofE = paramSection.indexOf("=");
            pName = paramSection.substring(0, idxofE);
            if (pName.toLowerCase() === paramName.toLowerCase()) {
                pValue = paramSection.substring(idxofE + 1);
                ret = decodeURIComponent( pValue );
                if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("exiting getURLParamFromNativeError()", "DEBUG", false); }
                return ret;
            }
        }
        if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("exiting getURLParamFromNativeError()", "DEBUG", false); }
        return pValue;
};

})(hwc, window);

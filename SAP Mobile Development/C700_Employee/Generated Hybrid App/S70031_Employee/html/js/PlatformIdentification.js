/*
 * Sybase Hybrid App version 2.2
 *
 * PlatformIdentification.js
 * This file will not be regenerated, so it is possible to modify it, but it
 * is not recommended.
 *
 * Original file date: 2012-Oct-22
 * Copyright (c) 2012 Sybase Inc. All rights reserved.
 */

/**
 * @namespace The namespace for the Hybrid Web Container javascript
 */
hwc = (typeof hwc === "undefined" || !hwc) ? {} : hwc;		// SUP 'namespace'

(function(hwc, window, undefined) {
	// private variables
	// platform identifiers are all calculated once and cached
	var _isIOS = false,  _isIPad = false, _isIOS5 = false, _isIOS6 = false,
	    _isBB  = false,  _isBB5  = false, _isBB5Touch = false, _isBB6NonTouch = false, _isBB7 = false,
	    _isAndroid = false, _isAndroid3  = false,
	    _isWindows = false, _isWinMobile = false;

	// public API
	/**
	* Returns true if the hybrid app application is being run on an iOS (e.g. iPhone, iPad) platform.
	* @feature Platform
	* @return {Boolean} True if the hybrid app application is being run on an iOS (e.g. iPhone, iPad) platform.
    * @memberOf hwc
    * @public
	*/
	hwc.isIOS  = function() { return _isIOS;  };
	/**
	* Returns true if the hybrid app application is being run on an iPad.
	* @feature Platform
	* @return {Boolean} True if the hybrid app application is being run on an iPad.
    * @memberOf hwc
    * @public
	*/
	hwc.isIPad = function() { return _isIPad; };
	/**
	* Returns true if the hybrid app application is being run on iOS5
	* @feature Platform
	* @return {Boolean} True if the hybrid app application is being run on iOS5
    * @memberOf hwc
    * @public
	*/
	hwc.isIOS5 = function() { return _isIOS5; };
	/**
	* Returns true if the hybrid app application is being run on iOS6
	* @public
	* @return {Boolean} True if the hybrid app application is being run on iOS6
    * @memberOf hwc
    * @public
	*/ 
	hwc.isIOS6 = function() { return _isIOS6; };

	/**
	* Returns true if the hybrid app application is being run on a BlackBerry platform.
	* @feature Platform
	* @return {Boolean} True if the hybrid app application is being run on a BlackBerry platform.
    * @memberOf hwc
    * @public
	*/
	hwc.isBlackBerry                 = function() { return _isBB;   };
	/**
	* Returns true if the hybrid app application is being run on a BlackBerry 5.0 OS
	* @feature Platform
	* @return {Boolean} True if the hybrid app application is being run on a BlackBerry 5.0 OS
    * @memberOf hwc
    * @public
	*/
	hwc.isBlackBerry5                = function() { return _isBB5;  };
	/**
	* Returns true if the hybrid app application is being run on a BlackBerry 7.x OS
	* @feature Platform
	* @return {Boolean} True if the hybrid app application is being run on a BlackBerry 7.x OS
    * @memberOf hwc
    * @public
	*/
	hwc.isBlackBerry7                = function() { return _isBB7;  };
	/**
	* Returns true if the hybrid app application is being run on a BlackBerry 5.0 OS with a touch screen
	* @feature Platform
	* @return {Boolean} True if the hybrid app application is being run on a BlackBerry 5.0 OS with a touch screen
    * @memberOf hwc
    * @public
	*/
	hwc.isBlackBerry5WithTouchScreen = function() { return _isBB5Touch;     };
	/**
	* Returns true if the hybrid app application is being run on a BlackBerry 6.0 OS without a touch screen
	* @feature Platform
	* @return {Boolean} True if the hybrid app application is being run on a BlackBerry 6.0 OS without a touch screen
    * @memberOf hwc
    * @public
	*/
	hwc.isBlackBerry6NonTouchScreen  = function() { return _isBB6NonTouch;  };

	/**
	* Returns true if the hybrid app application is being run on a Windows Mobile platform.
	* @feature Platform
	* @return {Boolean} True if the hybrid app application is being run on a Windows Mobile platform.
    * @memberOf hwc
    * @public
	*/
	hwc.isWindowsMobile = function() { return _isWinMobile; };
	/**
	* Returns true if the hybrid app application is being run on a Windows platform.
	* @feature Platform
	* @return {Boolean} True if the hybrid app application is being run on a Windows platform.
    * @memberOf hwc
    * @public
	*/
	hwc.isWindows       = function() { return _isWindows;   };

	/**
	* Returns true if the hybrid app application is being run on an Android 3.0 OS
	* @feature Platform
	* @return {Boolean} True if the hybrid app application is being run on an Android 3.0 OS
    * @memberOf hwc
    * @public
	*/
	hwc.isAndroid3 = function() { return _isAndroid3; };
	/**
	* Returns true if the hybrid app application is being run on an Android platform.
	* @feature Platform
	* @return {Boolean} True if the hybrid app application is being run on an Android platform.
    * @memberOf hwc
    * @public
	*/
	hwc.isAndroid  = function() { return _isAndroid;  };


	/**
	 * @private
	 * @return {Boolean} True if this code is running on a Blackberry 5 OS
	 */
	function _isBlackBerry5() {
        var ua = navigator.userAgent;
        if (ua.indexOf("BlackBerry 9800") >= 0) {
            return false;
        }
        if (ua.match(/5\.[0-9]\.[0-9]/i) !== null) {
            return true;
        }
	    return false;
	}

    /**
	 * @private
	 * @return {Boolean} True if this code is running on a Blackberry 5 OS with a touch screen
	 */
    function _isBlackBerry5WithTouchScreen() {
        if (isBlackBerry5()) {
            var ua = navigator.userAgent;
            if (ua.length > 12 && ua.substring(0, 12) === "BlackBerry95") {
                return true;
            }
        }
        return false;
    }

	/**
	 * @private
	 * @return {Boolean} True if this code is running on a Blackberry 6 OS with no touch screen
	 */
	function  _isBlackBerry6NonTouchScreen() {
	    if (navigator.userAgent.match(/Version\/6./i)) {
	        var ua = navigator.userAgent;
            if ((ua.indexOf('9780') > 0) || (ua.indexOf('9700') > 0) || (ua.indexOf('9650') > 0) || (ua.indexOf('9300') > 0) || (ua.indexOf('9330') > 0)) {
	            return true;
	        }
	    }
	    return false;
	}

	/**
	 * @private
	 * @return {Boolean} True if this code is running on a Blackberry & OS
	 */
	function _isBlackBerry7() {
		if (navigator.userAgent.match(/Version\/7\.[0-9]\.[0-9]/i) !== null){
			return true;
        }
		else {
			return false;
        }
	}


	/**
	 * Execute once to identify and cache
	 */
	{
		// apple products
		_isIOS  = ((navigator.platform.indexOf("i") === 0));
		if( _isIOS ) {
			_isIOS5 = (navigator.userAgent.match(/OS 5_[0-9_]+ like Mac OS X/i) !== null);
			_isIOS6 = (navigator.userAgent.match(/OS 6_[0-9_]+ like Mac OS X/i) !== null);
			_isIPad = (navigator.userAgent.match(/iPad/i) !== null);
		}

		// BlackBerry
		_isBB  = (navigator.platform === "BlackBerry");
		if( _isBB ) {
			_isBB5 = _isBlackBerry5();
			_isBB7 = _isBlackBerry7();
			_isBB5Touch    = _isBlackBerry5WithTouchScreen();
			_isBB6NonTouch = _isBlackBerry6NonTouchScreen();
		}

        // Android
		_isAndroid  = (navigator.userAgent.indexOf("Android") > -1);
		if( _isAndroid ) {
			_isAndroid3 = (navigator.userAgent.indexOf("3.0") > -1);
		}

		// Windows
		_isWinMobile = (navigator.platform === "WinCE");
		_isWindows   = ( (navigator.platform === "Win32") || (navigator.platform === "Win64") || (navigator.platform === "MacIntel") ||
                               ( !_isAndroid && (navigator.platform.indexOf("Linux") === 0) ) );

		//alert("Platform Identified: Win=" + _isWindows + ", BB=" + _isBB);
	}
})(hwc, window);



/**
 * Returns true if the hybrid app application is being run on an iOS (e.g. iPhone, iPad) platform.
 * @private
 * @return {Boolean} True if the hybrid app application is being run on an iOS (e.g. iPhone, iPad) platform.
 */
function isIOS() { return hwc.isIOS(); }

 /**
 * Returns true if the hybrid app application is being run on iOS5
 * @private
 * @return {Boolean} True if the hybrid app application is being run on iOS5
 */
function isIOS5() { return hwc.isIOS5(); }

/**
 * Returns true if the hybrid app application is being run on an iPad.
 * @private
 * @return {Boolean} True if the hybrid app application is being run on an iPad.
 */
function isIPad() { return hwc.isIPad(); }

/**
 * Returns true if the hybrid app application is being run on a BlackBerry platform.
 * @private
 * @return {Boolean} True if the hybrid app application is being run on a BlackBerry platform.
 */
function isBlackBerry() { return hwc.isBlackBerry(); }

/**
 * Returns true if the hybrid app application is being run on a BlackBerry 5.0 OS
 * @private
 * @return {Boolean} True if the hybrid app application is being run on a BlackBerry 5.0 OS
 */
function isBlackBerry5() { return hwc.isBlackBerry5(); }

/**
 * Returns true if the hybrid app application is being run on a BlackBerry 5.0 OS with a touch screen
 * @private
 * @return {Boolean} True if the hybrid app application is being run on a BlackBerry 5.0 OS with a touch screen
 */
function isBlackBerry5WithTouchScreen() { return hwc.isBlackBerry5WithTouchScreen(); }

/**
 * Returns true if the hybrid app application is being run on a BlackBerry 6.0 OS without a touch screen
 * @private
 * @return {Boolean} True if the hybrid app application is being run on a BlackBerry 6.0 OS without a touch screen
 */
function  isBlackBerry6NonTouchScreen() { return hwc.isBlackBerry6NonTouchScreen(); }

/**
 * Returns true if the hybrid app application is being run on a BlackBerry 7.x OS
 * @private
 * @return {Boolean} True if the hybrid app application is being run on a BlackBerry 7.x OS
 */
function isBlackBerry7() { return hwc.isBlackBerry7(); }

/**
 * Returns true if the hybrid app application is being run on a Windows Mobile platform.
 * @private
 * @return {Boolean} True if the hybrid app application is being run on a Windows Mobile platform.
 */
function isWindowsMobile() { return hwc.isWindowsMobile(); }

/**
 * Returns true if the hybrid app application is being run on a Windows platform.
 * @private
 * @return {Boolean} True if the hybrid app application is being run on a Windows platform.
 */
function isWindows() { return hwc.isWindows(); }

/**
 * Returns true if the hybrid app application is being run on an Android platform.
 * @private
 * @return {Boolean} True if the hybrid app application is being run on an Android platform.
 */
function isAndroid() { return hwc.isAndroid(); }

/**
 * Returns true if the hybrid app application is being run on an Android 3.0 OS
 * @private
 * @return {Boolean} True if the hybrid app application is being run on an Android 3.0 OS
 */
function isAndroid3() { return hwc.isAndroid3(); }

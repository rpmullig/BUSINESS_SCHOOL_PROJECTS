/*
 * Sybase Hybrid App version 2.5
 * 
 * Callbacks.js
 * This file will not be regenerated, so it is possible to modify it, but it
 * is not recommended.
 * 
 * Copyright (c) 2012 Sybase Inc. All rights reserved.
 */
 
/**
 * @namespace The namespace for the Hybrid Web Container javascript
 */
hwc = (typeof hwc === "undefined" || !hwc) ? {} : hwc;		// SUP 'namespace'


(function(hwc, window, undefined) {
	
	/**
	* Constructs CallbackSet object.  This object is not meant for general use.
	* @private
	* @constructor
    * @memberOf hwc
	*/	
	hwc.CallbackSet = function() {
		hwc.CallbackSet.setCount++;
		this.setId = hwc.CallbackSet.setCount;
	};
	
	/**
	* @private
	* @static
    * @memberOf hwc.CallbackSet
	*/
	hwc.CallbackSet.setCount = 0;
	
	/**
	* @private
	* @static
    * @memberOf hwc.CallbackSet
	*/	
	hwc.CallbackSet.callbacks = {};

	/**
	 * Registers a callback to be handled from container
	 * @memberOf hwc.CallbackSet
	 * @private
	 * @param methodName The name of the callback.
	 * @param callback The function pointer to the callback
	 * @return callbackId that can be used by the container
	 */
	hwc.CallbackSet.prototype.registerCallback = function (methodName, callback) {
		if (!hwc.CallbackSet.callbacks[this.setId]) {
			hwc.CallbackSet.callbacks[this.setId] = {};
		}
	
		hwc.CallbackSet.callbacks[this.setId][methodName] = callback;
		return this.setId + ':' + methodName;
	};

	/**
	 * Invoked asynchronously to handle callback from container
	 * @memberOf hwc.CallbackSet
	 * @static
	 * @private
	 * @param callbackId The id of the callback.  Format is "setid:methodname"
	 * @param removeSet True if the callback set should be removed
	 * @param args The arguments to be passed to the registered callback
	 */
	hwc.CallbackSet.callbackHandler = function(callbackId, removeSet, args) {
		var callbackSet, c, callback;
        c = callbackId.split(':', 2);
		
		if ( c && c.length === 2 ) {
			callbackSet = hwc.CallbackSet.callbacks[c[0]];
			
			if (callbackSet) {
				callback = callbackSet[c[1]];
				
				if (removeSet) {
					delete hwc.CallbackSet.callbacks[c[0]];
				}
				
				if (callback) {	
					callback.apply(callback, args);
				}
			}
		}
	};
	
	window.CallbackSet = [];
	window.CallbackSet.callbackHandler = hwc.CallbackSet.callbackHandler;
	
})(hwc, window);



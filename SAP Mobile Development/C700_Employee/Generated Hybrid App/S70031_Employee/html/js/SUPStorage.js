/*
* Sybase Hybrid App version 2.2
*
* SUPStorage.js
* This file will not be regenerated, so it is possible to modify it, but it
* is not recommended.
*
* Copyright (c) 2012 Sybase Inc. All rights reserved.
*/


/** @namespace */
hwc = (typeof hwc === "undefined" || !hwc) ? {} : hwc;		// SUP 'namespace'


/**
 * Access the storage functions, which allow you to specify a cache that stores results from online requests.
 * 
 * These functions give you the ability to:
 * Name the cached result sets
 * Enumerate the cached result sets
 * Read, delete, and modify cached contents individually for each cached result set
 *  Cached result sets must be stored as strings (before deserialization to an xmlWorkflowMessage structure).
 */
(function(hwc, window, undefined) {

/**
 * Creates a SUPStorage with the specified storeName. Provides encrypted storage of name value pairs. Results from online requests are one example. 
 * Strings stored in SUPStorage are encrypted and persisted to survive multiple invocations of the mobile workflow application.
 * @constructor
 * @param {String} store the store name
 *
 * @feature Storage
 * @memberOf hwc
 * @example
 * var store1 = new hwc.SUPStorage("one");
 */
hwc.SUPStorage = function(store) {
    this.bForSharedStorage = false;
    this.store = store ? store : "";
};

/**
* Gets the number of available keys in this object. The keys themselves may be
* retrieved using key().
* @feature Storage
* @example
* // Create the SUP Storage
* var store = new hwc.SUPStorage ("one");
* store.setItem ("foo", "bar"); // add an item.
* store.setItem ("foo1", "bar"); // add an item.
* store.setItem ("foo2", "bar"); // add an item.
* var result = store.length; // result = 3
* @public
* @memberOf hwc.SUPStorage
*/
hwc.SUPStorage.prototype.length = function() {
    var response;
    if (hwc.isWindowsMobile() || hwc.isIOS()) {
	    response = hwc.getDataFromContainer("workflowstorage", "&command=length&shared=" + this.bForSharedStorage +
                "&store=" + encodeURIComponent(this.store));
        return parseInt(response, 10);
    }
    else {
        if (this.bForSharedStorage) {
            return _SharedStorage.length(hwc.versionURLParam);
        }
        else {
            return SUPStorage.length(this.store);
        }

    }
};

/**
* Returns the key at the supplied index. Keys are guaranteed to remain
* at the same index until a modification is made.
*
*
* @param {Integer} index 0-based index to the key. Must be less than the value retrieved
*     by .length.
* @return {String} The key, or null if the index is invalid.
* @feature Storage
* @public
* @memberOf hwc.SUPStorage
* @example
* // Create the SUP Storage
* var store = new hwc.SUPStorage ("one");
* store.setItem ("foo", "bar"); // add an item.
* var result = store.key (0); // will returns "foo".
*/
hwc.SUPStorage.prototype.key = function(index) {
    var key, isExist;
    if (null === index) {
        return null;
    }

    if (hwc.isWindowsMobile() || hwc.isIOS()) {
        key = hwc.getDataFromContainer("workflowstorage", "&command=key&shared=" + this.bForSharedStorage +
                "&store=" + encodeURIComponent(this.store) + "&index=" + encodeURIComponent(index));

		  if (key === null || typeof key === 'undefined' || key === "") {
             isExist = hwc.getDataFromContainer("workflowstorage", "&command=exist&shared=" + this.bForSharedStorage +
                "&store=" + encodeURIComponent(this.store) + "&index=" + encodeURIComponent(index));

			//WM returns empty string if an item does not exist or if the value is empty string
			//call exist to distinguish this
			if (isExist == "true") {
				 key = "";
            }
			else {
				 key = null;
            }
		  }
    }
    else {
        if (this.bForSharedStorage) {
            key = _SharedStorage.key(index, hwc.versionURLParam);
        }
        else {
            key = SUPStorage.key(this.store, index);
        }
    }

    if (key === null || typeof key === 'undefined') {
        return null;
    } else {
        return key + "";
    } 
};

/**
* @private
* Helper method for parameter validation
* *PRIVATE*
* @param input: input value .
* @return if input is null, return empty string
*/
function checkNull(input) {
    if (null === input) {
        input = "";
    }
    return input;
}

/**
* Retrieves the value associated with a specified key.
*
* @param {String} key String key corresponding to the requested value.
* @return {String} A String value corresponding to the key, or null if either the key
*     is not known, or if the key exists but its value was set to null.
* @feature Storage
* @memberOf hwc.SUPStorage
* @example
* // Create the SUP Storage
* var store = new hwc.SUPStorage ("one");
* store.setItem ("foo", "bar"); // add an item.
* result = store.getItem ("foo"); // will returns "bar".
* result = store.getItem ("foo1"); // foo1 does not exists; will return null.
*/
hwc.SUPStorage.prototype.getItem = function(key) {
    var value, isExist;
    key = key ? key : "";

    if (hwc.isWindowsMobile() || hwc.isIOS()) {
	     value = hwc.getDataFromContainer("workflowstorage", "&command=getItem&shared=" + this.bForSharedStorage +
                "&store=" + encodeURIComponent(this.store) + "&key=" + encodeURIComponent(key));

		  if (value === null || typeof value === 'undefined' || value === "") {
            isExist = hwc.getDataFromContainer("workflowstorage", "&command=exist&shared=" + this.bForSharedStorage +
                "&store=" + encodeURIComponent(this.store) + "&key=" + encodeURIComponent(key));

            //WM returns empty string if an item does not exist or if the value is empty string
            //call exist to distinguish this
            if (isExist == "true") {
                value = "";
            }
            else {
                value = null;
            }
        }
    }
    else {
        if (this.bForSharedStorage) {
            value = _SharedStorage.getItem(key, hwc.versionURLParam);
        }
        else {
            value = SUPStorage.getItem(this.store, key);
        }
    }

    if (value === null || typeof value === 'undefined') {
        return null;
    } else {
        return value + "";
    }
};

/**
* Sets the value associated with a specified key. This replaces the key's
* previous value, if any.
*
*
* @param {String} key String key corresponding to the value.
* @param {String} value String value to store.
* @feature Storage
* @memberOf hwc.SUPStorage
* @example
* // Create the SUP Storage
* var store = new hwc.SUPStorage ("one");
* store.setItem ("foo", "bar"); // add an item.
*/
hwc.SUPStorage.prototype.setItem = function(key, value) {
    var result;
    key = key ? key : "";
    value = value ? value : "";
    if (hwc.isWindowsMobile() || hwc.isIOS()) {
	     hwc.postDataToContainer("workflowstorage", "command=setItem&store=" + encodeURIComponent(this.store) + "&shared=" + this.bForSharedStorage + "&key=" +
                    encodeURIComponent(key) + "&value=" + encodeURIComponent(value));
    }
    else {
        if (this.bForSharedStorage) {
            result = _SharedStorage.setItem(key, value, hwc.versionURLParam);
        }
        else {
            result = SUPStorage.setItem(this.store, key, value);
        }
        if (result !== 0) {
            throw new hwc.SUPStorageException(result, "SUP storage maximum size reached");
        }
    }
};

/**
* Removes the key and its associated value from this object. If the
* key does not exist, has no effect.
*
*
* @param {String} key String key to remove.
* @feature Storage
* @memberOf hwc.SUPStorage
* @example
* // Create the SUP Storage
* var store = new hwc.SUPStorage ("one");
* store.setItem ("foo", "bar"); // add an item.
* store.removeItem ("foo");
* result = store.getItem ("food"); // will be null.
*/
hwc.SUPStorage.prototype.removeItem = function(key) {
    key = key ? key : "";
    if (hwc.isWindowsMobile() || hwc.isIOS()) {
	     hwc.getDataFromContainer("workflowstorage", "&command=removeItem&shared=" + this.bForSharedStorage +
                "&store=" + encodeURIComponent(this.store) + "&key=" + encodeURIComponent(key));
    }
    else {
        if (this.bForSharedStorage) {
            _SharedStorage.removeItem(key, hwc.versionURLParam);
        }
        else {
            SUPStorage.removeItem(this.store, key);
        }
    }
};

/**
 * Removes all key/value pairs from this object.
 * @memberOf hwc.SUPStorage
 * @feature Storage
 */
hwc.SUPStorage.prototype.clear = function() {
    if (hwc.isWindowsMobile() || hwc.isIOS()) {
	     hwc.getDataFromContainer("workflowstorage", "&command=clear&shared=" + this.bForSharedStorage +
                "&store=" + encodeURIComponent(this.store));
    }
    else {
        if (this.bForSharedStorage) {
            _SharedStorage.clear(hwc.versionURLParam);
        }
        else {
            SUPStorage.clear(this.store);
        }
    }
};

/**
* Exception thrown when Storage space is exceeded.
* @feature Storage
* @constructor
* @memberOf hwc
* @param {Integer} code the error code
* @param {String} message the error message.
*/
hwc.SUPStorageException = function(code, message) {
    this.code = code;
    this.message = message;
};

hwc.SUPStorageException.UNKNOWN_ERROR = 1;
hwc.SUPStorageException.MAX_SIZE_REACHED = 2;
hwc.SUPStorageException.SHARED_STORAGE_DISABLED = 3;

// shared storage key.
hwc.sharedStorageKey = undefined;

/**
* Method to return the shared storage key defined for the hybrid app by designer. An empty string is returned if the shared storage function is disabled.
* @feature Storage
* @memberOf hwc
* @return {String} the shared storage key.
*/
hwc.getSharedStorageKey = function() {
        if (hwc.sharedStorageKey === undefined ) {
            var key = hwc.getQueryVariable("sharedStorageKey");
            hwc.sharedStorageKey = (key === undefined) ? "":key;
        }
    return hwc.sharedStorageKey;
};

/**
* Indicates whether the shared storage is enabled for the hybrid app.
* @feature Storage
* @memberOf hwc
* @return {Boolean} true if the shared storage is enabled; false otherwise.
*/
hwc.isSharedStorageEnabled = function() {
    var key = hwc.getSharedStorageKey();
    if (key === undefined || key === "") {
        return false;
    }
    else {
        return true;
    }
};

/**
* Constructs a new SUP shared storage. You can use the returned value to access the shared storage data with the exising SUPStorage interface, 
* however, the operation only affects the items belonging to the specified shared storage key.
* @class
* @memberOf hwc
* @feature Storage
*/
hwc.SharedStorage = function() {
        if (hwc.isSharedStorageEnabled() === false ) {
        throw new hwc.SUPStorageException(hwc.SUPStorageException.SHARED_STORAGE_DISABLED, "Shared storage is disabled"); 
    }
    this.bForSharedStorage = true;
    this.store = "";
};

hwc.SharedStorage.prototype = new hwc.SUPStorage();
hwc.SharedStorage.constructor = hwc.SharedStorage;
})(hwc, window);




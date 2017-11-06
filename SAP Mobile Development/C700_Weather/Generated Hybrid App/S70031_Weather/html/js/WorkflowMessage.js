/*
 * Sybase Hybrid App version 2.2.2
 * 
 * WorkflowMessage.js
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
 
/** 
 * MessageValueType array
 * @class
*/
MessageValueType = [];

/** 
 * MessageValueType constants
*/

/**
 * Constant representing a MessageValue type of file
 * @constant 
 * @type {string} */
MessageValueType.FILE = "FILE";
/** Constant representing a MessageValue type of text
 * @type string */
MessageValueType.TEXT = "TEXT";
/** Constant representing a MessageValue type of number
 * @type string */
MessageValueType.NUMBER = "NUMBER";
/** Constant representing a MessageValue type of datetime
 * @type string */
MessageValueType.DATETIME = "DATETIME";
/** Constant representing a MessageValue type of boolean
 * @type string */
MessageValueType.BOOLEAN = "BOOLEAN";
/** Constant representing a MessageValue type of list
 * @type string */
MessageValueType.LIST = "LIST";

/**
 * @class MessageValue
 * Represents a MessageValue object 
*/
function MessageValue() { 
    this.key;
    this.value;
    this.modifiedValue = [];
    this.type;
    this.isNull = false;	
}

/**
 * Returns the value of the Null Attribute for the MessageValue
 * @returns The value of the Null Attribute for this item.  */
MessageValue.prototype.getNullAttribute = function() { return this.isNull; };
/** 
 * Sets the Null Attribute for the MessageValue
 * @param {string} value This is the value that will be placed in the Null Attribute */
MessageValue.prototype.setNullAttribute = function(value) { this.isNull = value;};
/**
 * Returns the key of the given MessageValue object 
 * @returns The key of the given MessageValue object */
MessageValue.prototype.getKey = function() { return this.key; };
/** 
 * Sets the key of the given MessageValue object 
 * @param {string} key This is the value that will be used as the key */
MessageValue.prototype.setKey = function(key) { this.key = key; };
/** 
 * Returns the value of the given MessageValue object 
 * @returns The value of the given MessageValue object */
MessageValue.prototype.getValue = function() { 
    if (this.modifiedValue != undefined && (this.modifiedValue != "")) {
        return this.getModifiedValue();
    }
    else {
        return this.value; 
    }
};
/** 
 * Sets the value of the given MessageValue object 
 * @param {string} value This is the value that will be set for this MessageValue*/
MessageValue.prototype.setValue = function(value) { this.value = value; };
/** @ignore */
MessageValue.prototype.getModifiedValue = function() { return this.modifiedValue[this.modifiedValue.length - 1][1]; };
/** @ignore */
MessageValue.prototype.getScreenKeyModOccurredOn = function() { return this.modifiedValue[this.modifiedValue.length - 1][0]; };
/** @ignore */
MessageValue.prototype.addModifiedValue = function(modifiedValue, screenKey) { this.modifiedValue.push(new Array(screenKey, modifiedValue)); };
/** @ignore */
MessageValue.prototype.removeAModifiedValue = function(screenKey) {
    if (this.modifiedValue != undefined && (this.modifiedValue.length > 0)) {
        if (this.getScreenKeyModOccurredOn() === screenKey) {
            this.modifiedValue.pop();
        }
    } 
};
/** @ignore */
MessageValue.prototype.clearModifiedValues = function() { this.modifiedValue = []; };

/** 
 * Returns the type of the given MessageValue object 
 * @returns {MessageValueType} The MessageValueType of the MessageValue. Returns one of: {@link MessageValueType.FILE}, 
 * {@link MessageValueType.TEXT}, {@link MessageValueType.NUMBER}, {@link MessageValueType.DATETIME}, {@link MessageValueType.BOOLEAN},
 * {@link MessageValueType.LIST}
 * @see MessageValueType */
MessageValue.prototype.getType = function() { return this.type; };
/** 
 * Sets the type of the given MessageValue object 
 * @param {MessageValueType} type The constant type for the MessageValue. Must be one of: {@link MessageValueType.FILE}, 
 * {@link MessageValueType.TEXT}, {@link MessageValueType.NUMBER}, {@link MessageValueType.DATETIME}, {@link MessageValueType.BOOLEAN},
 * {@link MessageValueType.LIST} or an exception is thrown.
 * @see MessageValueType */
MessageValue.prototype.setType = function(type) {
	// Validate the given type.
	if (type === MessageValueType.TEXT ||
	    type === MessageValueType.NUMBER ||
	    type === MessageValueType.DATETIME ||
	    type === MessageValueType.BOOLEAN ||
	    type === MessageValueType.LIST ||
	    type === MessageValueType.FILE) {
   			this.type = type; 
 	}
 	else {
 		throw "Invalid MessageValue type: " + type;
 	}
};

/** 
 * Represents a MessageValueCollection object
 * @class MessageValueCollection
 */
function MessageValueCollection() {
    this.key;
    this.state;
    this.parent;
    this.parentValue;
    this.values;
    this.storage = {};
}

/** 
 * Returns the key of the given MessageValueCollection object
 * @returns {string} The requested key, if found. Otherwise null.
 */
MessageValueCollection.prototype.getKey = function() { return this.key; };
/** Sets the key of the given MessageValueCollection object 
 * @param {string} key The string representation of the key
*/
MessageValueCollection.prototype.setKey = function(key) { this.key = key; };
/** Returns the key and parent of the given MessageValueCollection object 
 * @returns {string} The key with parent */
MessageValueCollection.prototype.getFullKey = function() { return this.parent + "&<>" + this.key; };

// The valid values for the 'state' property are: "add", "delete", "new", "update", ""
/** Returns the state of the given MessageValueCollection object */
MessageValueCollection.prototype.getState = function() { return this.state; };
/** Sets the state of the given MessageValueCollection object */
MessageValueCollection.prototype.setState = function(state) { this.state = state; };

/** Returns the parent key of the given MessageValueCollection object */
MessageValueCollection.prototype.getParent = function() { return this.parent; };
/** Sets the parent key of the given MessageValueCollection object */
MessageValueCollection.prototype.setParent = function(parent) { this.parent = parent; };

/** Returns the parent object of the given MessageValueCollection object */
MessageValueCollection.prototype.getParentValue = function() { return this.parentValue; };
/** Sets the parent object of the given MessageValueCollection object. Does not change the actual parenting. */
MessageValueCollection.prototype.setParentValue = function(parentValue) { this.parentValue = parentValue; };

/** Adds a new value to the given MessageValueCollection */
MessageValueCollection.prototype.add = function(key, value) { this.storage[key] = value; };
/** Removes all value from the given MessageValueCollection */
MessageValueCollection.prototype.clear = function() { this.storage = {}; };
/** Returns the value corresponding to the specified key for the given MessageValueCollection */
MessageValueCollection.prototype.getData = function(key) { return this.storage[key]; };
/** Removes the value corresponding to the specified key for the given MessageValueCollection */
MessageValueCollection.prototype.remove = function(key) { delete this.storage[key]; };
/** Returns the number of values in the given MessageValueCollection */
MessageValueCollection.prototype.getCount = function() {
    var numValues = 0;
    var property;
    for (property in this.storage) {
        if (this.storage.hasOwnProperty(property)) {
            numValues += 1;
        } 
    }
    return numValues;    
};
/** Returns an array of the keys in the given MessageValueCollection */
MessageValueCollection.prototype.getKeys = function() {
    var keysArray = [];
    var property;
    for (property in this.storage) {
        if (this.storage.hasOwnProperty(property)) {
            keysArray[keysArray.length] = property;
        }
    }
    return keysArray;       
};
/** Returns an array of the values in the given MessageValueCollection */
MessageValueCollection.prototype.getValues = function() {
    var valuesArray = [];
    var property;
    for (property in this.storage) {
        if (this.storage.hasOwnProperty(property)) {
            valuesArray[valuesArray.length] = this.storage[property];
        }
    }
    return valuesArray;
};

/** Represents a WorkflowMessage object
 *  @class WorkflowMessage
 */
function WorkflowMessage(messageAsString) {
    this.header;
    this.requestAction;
    this.values;
    this.workflowScreen;
    this.hasFileMessageValue = false;
    this.isCompact = true;
    this.createFromString(messageAsString);
}

/** Returns the header of the given WorkflowMessage */
WorkflowMessage.prototype.getHeader = function() { return this.header ? this.header : ""; };
/** Sets the header of the given WorkflowMessage */
WorkflowMessage.prototype.setHeader = function(header) { this.header = header; };
/** Returns the request action of the given WorkflowMessage */
WorkflowMessage.prototype.getRequestAction = function() { return this.requestAction ? this.requestAction : ""; };
/** Sets the request action of the given WorkflowMessage */
WorkflowMessage.prototype.setRequestAction = function(requestAction) { this.requestAction = requestAction; };
/** Gets the values in the given WorkflowMessage */
WorkflowMessage.prototype.getValues = function() { return this.values; };
/** Returns the workflow screen of the given WorkflowMessage */
WorkflowMessage.prototype.getWorkflowScreen = function() { return this.workflowScreen ? this.workflowScreen : ""; };
/** Sets the workflow screen of the given WorkflowMessage */
WorkflowMessage.prototype.setWorkflowScreen = function(workflowScreen) { this.workflowScreen = workflowScreen; };
/**  */
WorkflowMessage.prototype.setHasFileMessageValue = function (hasFileMessageValue) { this.hasFileMessageValue = hasFileMessageValue;};
/**  */
WorkflowMessage.prototype.getHasFileMessageValue = function() { return this.hasFileMessageValue;};

/** Updates the contents of the given WorkflowMessage object from the given string */
WorkflowMessage.prototype.createFromString = function(messageAsString) {
    var parser;
    var document;
    if (messageAsString === "")
    {
        messageAsString = (this.isCompact ? "<M></M>" : "<XmlWidgetMessage></XmlWidgetMessage>");
    }
    if (window.DOMParser) {
        parser = new DOMParser();
        if (hwc.isBlackBerry()) {
            document = parser.parseFromString(messageAsString, "application/xhtml+xml");
        }
        else {
            document = parser.parseFromString(messageAsString, "text/xml");
        }
    }
    else if (window.ActiveXObject) {
        document = new ActiveXObject("Microsoft.XMLDOM");
        document.async="false";
        document.loadXML(messageAsString);
    }
    else {
        logToWorkflow("Error:  DOM parser not available", "ERROR");
        return;
    }
    var workflowMessage = document.firstChild;
    if (workflowMessage.nodeName === "XmlWidgetMessage"
            || workflowMessage.nodeName === "XmlWorkflowMessage")
    {
        this.isCompact = false;
    }
    else if (workflowMessage.nodeName === "M")
    {
        this.isCompact = true;
    }
    else
    {
        logToWorkflow("Error:  Unrecognizable hybrid app message", "ERROR");
        return;
    }
    var headers = workflowMessage.getElementsByTagName(this.isCompact ? "H" : "Header");
    var workflowScreens = workflowMessage.getElementsByTagName(this.isCompact ? "S" : "WidgetScreen");
    var requestActions = workflowMessage.getElementsByTagName(this.isCompact ? "A" : "RequestAction");
    var valuess = workflowMessage.getElementsByTagName(this.isCompact ? "VS" : "Values");
    if (headers && headers.length > 0 && headers.item(0).firstChild) {
        var header = headers.item(0);
        this.setHeader(header.firstChild.nodeValue.toString());
    }
    else {
        this.setHeader("");
    }
    
    if (workflowScreens && workflowScreens.length > 0 && workflowScreens.item(0).firstChild) {
        var workflowScreen = workflowScreens.item(0);
        this.setWorkflowScreen(workflowScreen.firstChild.nodeValue.toString());
    }
    else {
        this.setWorkflowScreen("");
    }

    if (requestActions && requestActions.length > 0 && requestActions.item(0).firstChild) {
        var requestAction = requestActions.item(0);
        this.setRequestAction(requestAction.firstChild.nodeValue.toString());
    }
    else {
        this.setRequestAction("");
    }
    
    if (valuess && valuess.length > 0 && valuess.item(0).firstChild) {
        var valuesChild = valuess.item(0);
        this.values = new MessageValueCollection();
        this.parseMessageValueCollection(valuesChild, this.values);
    }
    else {
        this.values = new MessageValueCollection();
    }
};

WorkflowMessage.prototype.parseMessageValueCollection = function(valuesNode, messageValueCollection) {
    var valueIdx;
    var isNullAttributeString;
    var numValues = valuesNode.childNodes.length;
    for (valueIdx = 0; valueIdx < numValues; valueIdx++) {
        var childItem = valuesNode.childNodes.item(valueIdx);
        if ((!this.isCompact && childItem.nodeName === "Value")
         || (this.isCompact && childItem.nodeName === "V")) {
            var value = new MessageValue();
            value.setKey(childItem.getAttribute((this.isCompact ? "k" : "key")).toString());
            if (this.isCompact) {
            	var type = childItem.getAttribute("t").toString();
            	if (type === "T") {
            		value.setType(MessageValueType.TEXT);
            	}
            	else if (type === "N") {
            		value.setType(MessageValueType.NUMBER);
            	}
            	else if (type === "D") {
            		value.setType(MessageValueType.DATETIME);
            	}
            	else if (type === "B") {
            		value.setType(MessageValueType.BOOLEAN);
            	}
            	else if (type === "L") {
            		value.setType(MessageValueType.LIST);
            	}
            	else if (type === "F") {
            		value.setType(MessageValueType.FILE);
            	}
            	isNullAttributeString = "n";
			}
			else {
            	value.setType(childItem.getAttribute("type").toString());
            	isNullAttributeString = "null";
            }

			var isNull = childItem.getAttribute(isNullAttributeString);
			if (isNull === null || isNull === undefined) {
				value.setNullAttribute(false);
			}
			else {
				value.setNullAttribute(true);
			}
            
            if (value.getType() === MessageValueType.LIST) {
                var numCollections = childItem.childNodes.length;
                var collections = new Array(numCollections);
                var collIdx;
                for (collIdx = 0; collIdx < numCollections; collIdx++) {
                    var collection = new MessageValueCollection();
                    var grandchildItem = childItem.childNodes.item(collIdx);
                    collection.setKey(grandchildItem.getAttribute((this.isCompact ? "k" : "key")));
                    collection.setState(grandchildItem.getAttribute((this.isCompact ? "s" : "state")));
                    collection.setParent(value.getKey());
                    collection.setParentValue(value);
                    this.parseMessageValueCollection(grandchildItem, collection);
                    collections[collIdx] = collection;
                }
                // value.value = serializeList(collections);
                value.value = collections;
            }
            else {
                var vNode;
                try {
                    var l = childItem.childNodes.length;
                    if (l) {
                        vNode = childItem.childNodes.item(0);
                        value.value = vNode.nodeValue.toString();
                    }
                    else {
                        value.value = "";
                    }
                }
                catch (e) {
                    showAlertDialog('Troubles parsing ' + vNode.nodeValue + " : " + e.message);
                }
            }
            messageValueCollection.add(value.getKey(), value);
        }
        else if ((!this.isCompact && childItem.nodeName === "Values")
              || (this.isCompact && childItem.nodeName === "VS")) {
            var valuesChild = new MessageValueCollection();
            valuesChild.setKey(childItem.getAttribute((this.isCompact ? "k" : "key")));
            valuesChild.setState(childItem.getAttribute((this.isCompact ? "s" : "state")));
            this.parseMessageValueCollection(childItem, valuesChild); 
            messageValueCollection.add(valuesChild.getKey(), valuesChild);
        }
    }    
};

/** Returns a string representation of the given WorkflowMessage */
WorkflowMessage.prototype.serializeToString = function() {
    var message = "";
    message += (this.isCompact ? "<M>" : "<XmlWidgetMessage>");
    message += (this.isCompact ? "<H>" : "<Header>") + this.getHeader();
    message += (this.isCompact ? "</H>" : "</Header>");
    message += (this.isCompact ? "<S>" : "<WidgetScreen>") + this.getWorkflowScreen();
    message += (this.isCompact ? "</S>" : "</WidgetScreen>");
    message += (this.isCompact ? "<A>" : "<RequestAction>") + this.getRequestAction();
    message += (this.isCompact ? "</A>" : "</RequestAction>");
    message += (this.isCompact ? "<VS>" : "<Values>") + this.serializeValues(this.getValues(), "");
    message += (this.isCompact ? "</VS></M>" : "</Values></XmlWidgetMessage>");
    return message;
};

/** Returns a string representation of the values contained in the WorkflowMessage */
WorkflowMessage.prototype.serializeValues = function(values, prefix) {
    var mess = "";
    var idx;
    var count = values.getCount();
    var keys = values.getKeys();
    for (idx = 0; idx < count; idx++) {
        var data = values.getData(keys[idx]);
        if (!isArray(data.getValue())) {
        	var dataType = data.getType();
        	if( ( typeof data.getNullAttribute ==='function' && data.getNullAttribute() === false )  && data.getType() === MessageValueType.DATETIME && data.getValue().indexOf('T') == -1) {
        		dataType = "TEXT";
        	}
        	mess += (this.isCompact ? '<V k' : '<Value key');
        	mess += '="' + keys[idx] + '" ';
        	mess += (this.isCompact ? 't' : 'type');
        	mess += '="';
        	mess += (this.isCompact ? dataType.substr(0, 1) : dataType);
			if (data.getNullAttribute() == true) {			// allow null values
				mess += '" ';
				mess += (this.isCompact ? 'n="T">' : 'null="T">');
			}
			else {				
				var value = data.getValue();
                if (hwc.isWindowsMobile()) {
                    if (dataType === "TEXT") {
                    	value = value + "";
                        // Mimic zero-width negative lookbehind, i.e. /(?<!\r)\n/
                    	value = value.replace(/(\r)?\n/g, function($0, $1){
                        	return $1 ? $0 : '\r\n';
                        });
                    }
                }
				mess += '">' + hwc.escapeValue(value);
			}

        	mess += (this.isCompact ? '</V>' : '</Value>');
        }
        else {
            mess += (this.isCompact ? '<V k' : '<Value key');
            mess += '="' + keys[idx] + '" ';
        	mess += (this.isCompact ? 't="L">' : 'type="LIST">');
            var idx2;
            for (idx2 = 0; idx2 < data.getValue().length; idx2++) {
                mess += (this.isCompact ? '<VS k' : '<Values key');
                mess += '="' + data.getValue()[idx2].getKey() + '" ';
                mess += (this.isCompact ? 's' : 'state');
                mess += '="'+ data.getValue()[idx2].getState() + '">' +  this.serializeValues(data.getValue()[idx2], prefix + "." + data.getKey() + "[" + idx2 + "]");
                mess += (this.isCompact ? '</VS>' : '</Values>');            
            }
        	mess += (this.isCompact ? '</V>' : '</Value>');
        }
    }
    return mess;
};

/**	Updates the values of the given WorkflowMessage */
WorkflowMessage.prototype.updateValues = function(sourceValues, currentMessageValueCollection) {
	var values = this.values;
	if (currentMessageValueCollection) {
		var i;
		for (i = currentMessageValueCollection.length - 1; i >= 0; i--) {
			if (currentMessageValueCollection[i]) {
				values = currentMessageValueCollection[i];
                break;
			}
		}
	}

    var count = sourceValues.getCount();
    var keys = sourceValues.getKeys();
    var idx;
    for (idx = 0; idx < count; idx++) {
        var oldData = values.getData(keys[idx]);
        if (oldData) {
            values.remove(oldData.getKey());
        }
        var newData = sourceValues.getData(keys[idx]);
        values.add(newData.getKey(), newData);
    }
};


/** 
 * Determines whether the given object is an array
 * @param testObject The object to test
 * @returns {boolean} True if it is an array
 */
function isArray(testObject) {
    return testObject && !(testObject.propertyIsEnumerable('length')) && typeof testObject === 'object' && typeof testObject.length === 'number';
}


/**
 * Compare the prefix to the key set of the given key value pairs
 * @param values The set of key value pairs
 * @param prefix The key name requested
 * @returns {string} The value associated with the prefix
 */
function narrowTo(values, prefix) {
    //see if there is a value with a key == to prefix and return it
    var data = values.getData(prefix);
    if (data) {
        return data;
    }
    
    //if not, loop through any lists and recurse.
    var count = values.getCount();
    var keys = values.getKeys();
    var more = [];
    var valueIdx;
    for (valueIdx = 0; valueIdx < count; valueIdx++) {
        data = values.getData(keys[valueIdx]);
        if (isArray(data.value)) { //we have a list
            //does this list have a Values key that matches the prefix?
            var valuesIdx;
            var value;
            for (valuesIdx = 0; valuesIdx < data.value.length; valuesIdx++) { //for each values in a list
                value = data.value[valuesIdx];
                if (value.getFullKey() == prefix) {
                    return value;
                }
                // more indepth search may need to be done, but first let's finish search on the same level
                if (isArray(value)) {
                    more.push(value);
                }
            }
        }
    }
    var ret = undefined;
    var idx;
    for (idx = 0; idx < more.length; idx++) {
        ret = narrowTo(more[idx], prefix);
        if (ret) {
            return ret;
        }
    }
    return ret;
}

(function(hwc, window, undefined) {

	/**
	 * Replaces invalid URI character sequences with valid ones.<br/><br/>
	 * 
	 * Replaces all instances in the specified string:<ul><li>
	 * Of the & character with '&amp;'.</li><li>
	 * Of the < character with '&lt;'.</li><li>
	 * Of the > character with '&gt;'.</li><li>
	 * Of the " (quotation mark) character with '&quot;'.</li><li>
	 * Of the ' (apostrophe) character with '&apos;'.</li></ul>
	 * @param val The specified string.
	 * @returns {string} The modified string.
	 */
	hwc.escapeValue = function(val) {
	   try {
	        val = val.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
	    }
	    catch (e) {}
	    return val;
	}

	/**
	 * Reverse the URI-specific character strings within a string. <br/><br/>
	 * Replaces all instances in the specified string:<ul><li>
	 * Of the '&amp;' substring with '&'.</li><li>
	 * Of the '&lt;' substring with '<'.</li><li>
	 * Of the '&gt;' substring with '>'.</li><li>
	 * Of the '&quot;' substring with '"'.</li><li>
	 * Of the '&apos;' substring with '''.</li></ul>
	 * @param val The specified string.
	 * @returns {string} The modified string. 
	 */
	hwc.unescapeValue = function(val) {
	    try {
	        val = val.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&apos;/g,'\'').replace(/&quot;/g,'\"');
	    }
	    catch (e) {}
	    return val;
	};
})(hwc, window);


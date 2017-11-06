/*
 * Sybase Hybrid App version 2.2.2
 * 
 * Utils.js
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

// ** remaining globals 
listViewValuesKey = [];
currentMessageValueCollection = [];
UIFrameResizeHandlers=[];
workflowMessage = "";
resources = null;
logLevel = 1;

UIUpdateHandlers = [];
UIScreenListeners = [];
isCustomLookAndFeel = false;


// ** Legacy mapping
/**
 * @deprecated since version 2.2 - should now use hwc.onHybridAppLoad()
 */
function onWorkflowLoad() { return hwc.onHybridAppLoad(); }
/**
 * @deprecated since version 2.2 - should now use hwc.windowOpen()
 */
function windowOpen(sUrl) { return hwc.windowOpen(sUrl); }
/**
 * @deprecated since version 2.2 - should now use hwc.setDefaultValues(...)
 */
function setDefaultValues(screenKey) { return hwc.setDefaultValues(screenKey); }
/**
 * @deprecated since version 2.2 - should now use hwc.afterShowScreen(...)
 */
function afterShowScreen(screenToShow) { return hwc.afterShowScreen(screenToShow); }

/**
 * Utility functions
 */
(function(hwc, window, undefined) {
/**
 * onHybridAppLoad
 * 
 * @public
 * @memberOf hwc
 */
hwc.onHybridAppLoad = function onHybridAppLoad() {
    if (!(typeof jQuery === "undefined") &&  !(typeof jQuery.mobile === "undefined")) {
    	hwc.hasjQueryMobile = true;
    	hwc.isJQueryMobileLookAndFeel = true;
    }
    hwc.bindInputChanged(); 
    deviceSpecificUpdates();
    try {
        if (!hwc.customBeforeHybridAppLoad()) {
            return;
        }
        // All important logging level
        logLevel = hwc.getURLParam("loglevel");
        hwc.setLoggingCurrentLevel( logLevel );				// store the log level
        hwc.setLoggingAlertDialog( hwc.showAlertDialog );		// the preferred user alert dialog
        hwc.setReportErrorFromNativeCallback( reportErrorFromNative );	// the preferred native error callback function
        if (logLevel >= 4) { hwc.log("entering onHybridAppLoad()", "DEBUG", false); }
        
        if (! hwc.hasjQueryMobile ){
            hwc.hideAllDivs();
        }
        
        hwc.clientpackage = hwc.getURLParam("clientpackage");
        hwc.sharedStorageKey = hwc.getURLParam("sharedstoragekey");
        hwc.log("Shared Storage Key: " + hwc.sharedStorageKey, "DEBUG", false);
        
        var screenNameToShow = hwc.getURLParam("screenToShow");
        hwc.defaultScreen = hwc.getURLParam("defaultScreen");
        if (!hwc.defaultScreen) {
            hwc.defaultScreen = screenNameToShow;
        }
        hwc.activationScreen = hwc.getURLParam("activationScreen");
        hwc.credentialsScreen = hwc.getURLParam("credentialsScreen");
        hwc.credentialRefresh = hwc.parseBoolean(hwc.getURLParam("credentialRefresh"));
        hwc.supUserName = hwc.getURLParam("supusername");
      
        hwc.lang = hwc.getURLParam("lang");
        if (!(hwc.lang === undefined)) {
            resources = new Resources(hwc.lang);
            if (!resources.hasLocale(hwc.lang)) {
                resources = null;
            }
        }
      
        hwc.disableControls   = hwc.parseBoolean(hwc.getURLParam("isalreadyprocessed"));
        hwc.loadTransformData = hwc.parseBoolean(hwc.getURLParam("loadTransformData"));
        //var ignoreTransformScreen = hwc.parseBoolean(hwc.getURLParam("ignoretransformscreen")); 
        hwc.log("URL " + window.location.href, "DEBUG", false);
        var i;
        for (i = 0; i < document.forms.length; i++) {
            var formName = document.forms[i].id;
            if (typeof(formName) === "object") {  //works around a webkit and Windows Mobile issue where if the form contains an form element with an id="id", the form's id becomes the child element.  CR 669521
                formName =  document.forms[i].name;
            }              
            hwc.setDefaultValues(formName.substring(0, formName.length - 4), 250);
        }
        var response;
        if (hwc.loadTransformData && !hwc.credentialRefresh) { //request the data message
        	hwc.setCurrentScreen( hwc.SERVERINITIATEDFLAG ); // normally blank or bogus - make constant for conditional navigation lookups 
            hwc.onHybridAppLoad_CONT();
        }
        else { //create an empty data payload message
            workflowMessage = new WorkflowMessage("");           // This modifies the global "workflowMessage" variable.
            if (screenNameToShow === undefined) {
                hwc.showAlertDialog("Please specify a valid screen key via ?screentoshow=ScreenKeyName or ?loadTransformData=true");
                return;
            }
            hwc.navigateForward(screenNameToShow, undefined, true);
        }
        
        //check if there is a user name credential
        if (hwc.supUserName) {
            var form = document.getElementById(screenNameToShow + "Form");
            if (form) {
                if (form.elements.length > 0) {
                    var i;
                    for (i = 0; i < form.elements.length; i++) {
                        var formEl = form.elements[i];
                        var credStr = getAttribute(formEl, "credential");
                        if (credStr) { // we are dealing with a username or password credential
                            if (credStr === "username") {
                                hwc.setHTMLValue(formEl, hwc.supUserName);
                            }
                        }
                    }
                }
            }
        }
        hwc.customAfterHybridAppLoad();
    }
    catch (excep) {
        hwc.log("Error: " + excep.message, "ERROR", true);
    }
    if (logLevel >= 4) { hwc.log("exiting onHybridAppLoad()", "DEBUG", false); }
};

	// **** PUBLIC PROPERTIES ****
	hwc.curScreenKey = "";
	hwc.defaultScreen = null;
	hwc.activationScreen = null;
	hwc.credentialsScreen = null;
	hwc.credentialRefresh = false;  //This is true when the credentials are invalid for an async operation
	
	hwc.origIncomingDataMessage = null;
	hwc.origNoUI = null;
	hwc.origLoading = null;
	hwc.origScreenKey = null;
	hwc.loadTransformData = null;
	hwc.supUserName = "";
	hwc.previousScreenKeyStack = [];
	hwc.lang = "";
	hwc.disableControls = false;  //used for mark as processed option

	hwc.hasjQueryMobile = false;
	hwc.isJQueryMobileLookAndFeel = false;
	hwc.sharedStorageKey = "";
	hwc.SERVERINITIATEDFLAG  = "$$Server-Initiated$$";       // magic value - shared with code generator
	hwc.clientpackage = 0;

/**
 * Private function:
 * Perform any device specific updates
 * @private
 * @memberOf hwc
 */
function deviceSpecificUpdates() {
	
    if ( hwc.hasjQueryMobile ) {
        if ( hwc.isBlackBerry() ){
             $.mobile.selectmenu.prototype.options.nativeMenu = true;
             $.mobile.defaultPageTransition = 'none';
	    }else{
		     $.mobile.selectmenu.prototype.options.nativeMenu = false;
	    }
	    
	    if ( hwc.isIOS5() ){
	         $.mobile.defaultPageTransition = "none";
	    }
	}
	
    if (hwc.isIOS() && !hwc.hasjQueryMobile) {
        var styleSheet = document.styleSheets[0];
        var ssRules = styleSheet.cssRules;
        var i;
        for (i = 0; i < ssRules.length; i++) {
            var selText = ssRules[i].selectorText;
            if (selText != null) {
                selText = selText.toLowerCase();
                if ((selText === "table.listview tr.evenrow:hover") || (selText === "table.listview tr.oddrow:hover")) {
                    var hoverRule = ssRules[i];
                    hoverRule.style.backgroundColor="";
                    hoverRule.style.color="";
                }
            }            
        }
    }
   
    if (hwc.isBlackBerry5WithTouchScreen()) {
         var i;
         for (i = 0; i < document.forms.length; i++) {
             var j;
             //var formEl = document.forms[i];
             for (j = 0; j < document.forms[i].elements.length; j++) {
                 var formEl = document.forms[i].elements[j];
                 if ((formEl.type === "date") || (formEl.type === "datetime") || (formEl.type === "datetime-local") || (formEl.type === "time")) {
                     if (formEl.readOnly === true) {
                         formEl.type = "text";  //cr 661977
                     }
                 }
             }
         }
    }
    if (hwc.isAndroid()) {
        if(hwc.hasjQueryMobile) {
            //CR 690725-1 changed defaultTransition from fade to none;
            $.mobile.defaultPageTransition = 'none';  //CR 666256 and 670006 transitions on Android particularly on the simulator are clunky, 
             
            
            hwc.addDiv("sw-frame"); //CR 670117-1 workaround for datePicker control problem loading images out of CSS in embedded browser control
            hwc.addDiv("sw-slots");
            hwc.addDiv("sw-header");
            hwc.addDiv("sw-cancel");
            hwc.addDiv("sw-done");
            setTimeout("hwc.removeDiv('sw-frame')", 150);
            setTimeout("hwc.removeDiv('sw-slots')", 150);
            setTimeout("hwc.removeDiv('sw-header')", 150);
            setTimeout("hwc.removeDiv('sw-cancel')", 150);
            setTimeout("hwc.removeDiv('sw-done')", 150);

            var div = hwc.addDiv('checkboxDiv'); //CR 672971 unable to load images from css after the page loads
            div.innerHTML = '<span class="ui-icon ui-icon-ui-icon-checkbox-off ui-icon-checkbox-on ui-icon-checkbox-off"></span>';
            setTimeout("hwc.removeDiv('checkboxDiv')", 150);

			// Jira NA12-1278 Fix a crash due to some miss-handling of a CSS width rule that gets too close to 100%
			// Refined by NA12-2239 to not apply it when labels are left or right.
        	if ((navigator.userAgent.indexOf(" 2.2") > -1 ) ||
        	     (navigator.userAgent.indexOf(" 2.3") > -1 ) )  {
				$('input[type="text"]').each(function(index) {
					if ($(this).attr("class") === "" || $(this).attr("class") === "top") {
						$(this).css({"width" : "90%"});
					}
				});
			 } 
			
        }
        else {
            var i;
            for (i = 0; i < document.forms.length; i++) {
                var j;
                //var formEl = document.forms[i];
                for (j = 0; j < document.forms[i].elements.length; j++) {
                    var formEl = document.forms[i].elements[j];
                    if (formEl.type === "range") {
                        formEl.type = "number";  //CR 664665-1
                    }
                }
            }
        }
        //CR 670127-1 readonly fields can be navigated to via the next/prev buttons
        var i;
        for (i = 0; i < document.forms.length; i++) {
            var j;
            //var formEl = document.forms[i];
            for (j = 0; j < document.forms[i].elements.length; j++) {
                var formEl = document.forms[i].elements[j];
                if (formEl.readOnly === true) {
                    if (hwc.hasjQueryMobile) {  //pickers are made readonly in hybridapp_jQM.html in document.ready 
                        if (!((formEl.type === "date") || (formEl.type === "datetime") || (formEl.type === "datetime-local") || (formEl.type === "time"))) {
                            formEl.setAttribute("disabled", "disabled");
                        }
                    }
                    else {
                        formEl.setAttribute("disabled", "disabled");
                    }
                }
            }
        }
    }
    if (hwc.isWindowsMobile()) {  //work around windows mobile bug where select elements do not respect the disabled attribute
        var i;
        for (i = 0; i < document.forms.length; i++) {
            var j;
            //var formEl = document.forms[i];
            for (j = 0; j < document.forms[i].elements.length; j++) {
                var formEl = document.forms[i].elements[j];
                if (formEl.tagName === "SELECT") {
                    var attr = getAttribute(formEl, "sup_disabled");
                    if (attr === "disabled") {
                        formEl.disabled = true;
                    }
                }
            }
        }
        for (i = 0; i < document.forms.length; i++) { //CR 690645
            var form = document.forms[i];
            var links = getElementsByTagName(form, "a");
            var linkIdx;
            for (linkIdx = 0; linkIdx < links.length; linkIdx++) {
                var prefix = getAttribute(links[linkIdx], "sup_link_prefix");
                var suffix = getAttribute(links[linkIdx], "sup_link_suffix");
                var href = links[linkIdx].href; 
                if (prefix === "tel:" || (prefix === "mailto:")) {
                    if (prefix) {
                        href = href.substring(prefix.length);
                    }
                    if (suffix) {
                        href = href.substring(0, href.length - suffix.length);
                    }
                    links[linkIdx].href = "javascript:hwc.showUrlInBrowser('" + prefix + href + suffix + "')";
                }
            }
        }
        // override ActiveXObject for OData SDK
        if (window.datajs)
        {
            window.oldActiveXObject = window.ActiveXObject;
            window.ActiveXObject = function(id) {
                try {
                    return new window.oldActiveXObject(id);
                }
                catch (exception) {
                    try {
                        if (id == "Msxml2.XMLHTTP.6.0" || id == "Msxml2.XMLHTTP.3.0") {
                            return new window.oldActiveXObject("Microsoft.XMLHTTP");
                        }
                        if (id == "Msxml2.DOMDocument.6.0" || id == "Msxml2.DOMDocument.3.0") {
                            return new window.oldActiveXObject("Microsoft.XMLDOM");
                        }
                    }
                    catch(e) {
                        throw e;
                    }
                    throw exception;
                }
            };
        }
    }    
    
    
    if (hwc.isBlackBerry5() && hwc.hasjQueryMobile) {
        var i;
        for (i = 0; i < document.styleSheets.length; i++) {
            var styleSheet = document.styleSheets[i];
            var rules;
            if (styleSheet.cssRules) {
                rules = styleSheet.cssRules;
            } else {
                rules = styleSheet.rules;
            }
            hwc.changeCheckboxImage(rules, 0);
        }
    }       
};

/**
 * @public
 * @memberOf hwc
 */
hwc.changeCheckboxImage = function changeCheckboxImage(rules, level) {
	var j, rule;
    for (j = 0; j < rules.length; j++) {
        rule = rules[j];
        if (!rule) {
            continue;
        }
        if (rule.type == 4 && level == 0) {
            if (rule.cssRules) {
                hwc.changeCheckboxImage(rule.cssRules, ++level);
            } else {
                hwc.changeCheckboxImage(rule.rules, ++level);
            }
            continue;
        }
        if (!rule.cssText || !rule.style || !rule.style.cssText) {
            continue;
        }
        if (rule.cssText.indexOf("ui-icon-checkbox") != -1) {
            var backgroundImage = rule.style.getPropertyValue("background-image");
            if (backgroundImage && backgroundImage.indexOf("icons-36") != -1) {
                rule.style.setProperty("background-image", backgroundImage.replace(/icons-36/g, 'icons-18'), "");
            }
        }
    }
};

/**
 * @public
 * @memberOf hwc
 */
hwc.removeAndroidSpinner = function removeAndroidSpinner() {
    if (hwc.isAndroid() && hwc.hasjQueryMobile) {
        var ps = document.getElementById("pickerScreen"); //fix for 670609-2
        if (ps) {
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("click", true, true );
            ps.dispatchEvent(evt);
        }
    }
};

/**
 * @public
 * @memberOf hwc
 */
hwc.removeBBDatePicker = function removeBBDatePicker() {
    if (hwc.isBlackBerry() && hwc.hasjQueryMobile) {
        var ps = document.getElementById("pickerScreen"); //fix for 685005-1
        if (ps) {
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("click", true, true );
            ps.dispatchEvent(evt);
        }
    }
};

/**
 * @public
 * @memberOf hwc
 */
hwc.addDiv = function addDiv(divID) {
    var div2 = document.createElement('div');
    div2.id = divID;
    div2.innerHTML = ' ';
    document.body.appendChild(div2);
    return div2; 
};

/**
 * @public
 * @memberOf hwc
 */
hwc.removeDiv = function removeDiv(divID) {
    var div2 = document.getElementById(divID);
    document.body.removeChild(div2);
};

/**
 * @public
 * @memberOf hwc
 */
hwc.hideAllDivs = function hideAllDivs() {
    if (logLevel >= 4) { hwc.log("entering hideAllDivs()", "DEBUG", false); }
    var divs = document.getElementsByTagName('div');
    var i;
    for (i = 0; i < divs.length; i++) {
        var id =  getAttribute( divs[i], 'id');
        if (id !== null && id.lastIndexOf('ScreenDiv') > 0) { 
            divs[i].style.display = "none";
        }
    } 
    if (logLevel >= 4) { hwc.log("exiting hideAllDivs()", "DEBUG", false); }
};


/**
 * Core controller for processing an incoming data message (from the server).
 * This updates values then sets the next screen to navigate to.
 * This modifies the global "workflowMessage" variable.
 * @param incomingDataMessageValue
 * @param noUI
 * @param loading
 * @param fromActivationFlow
 * @param dataType
 * @public
 * @memberOf hwc
 */
hwc.processDataMessage = function processDataMessage(incomingDataMessageValue, noUI, loading, fromActivationFlow, dataType) {
    if (logLevel >= 4) { hwc.log("entering processDataMessage()", "DEBUG", false); }
    var incomingDataMessage;
    if (!(typeof incomingDataMessageValue === "string")) {
        incomingDataMessage = incomingDataMessageValue.toString() + "";
    }
    else {
        incomingDataMessage = incomingDataMessageValue;
    }    
    if(typeof(hwc.customBeforeProcessDataMessage) === 'function') {
        if (!hwc.customBeforeProcessDataMessage(incomingDataMessage, loading, fromActivationFlow, dataType)) {
        	return;
        }
    }
    try {
		var dataSize = incomingDataMessage.length;
		if (hwc.isWindowsMobile() && (incomingDataMessage.length > 500000)) {
		    var answer = confirm("Hybrid App messages larger than 500,000 bytes are unlikely to be successfully parsed on this device.  The message size is " + dataSize + ".  Do you wish to continue?");
		    if (!answer) {
		        return;
		    }   
		}
		if ((incomingDataMessage.indexOf("<XmlWidgetMessage>") === 0)
		            || (incomingDataMessage.indexOf("<XmlWorkflowMessage>") === 0)
		            || (incomingDataMessage.indexOf("<M>") === 0)) {
		    if (workflowMessage) {
		        var newDataMessage = new WorkflowMessage(incomingDataMessage);
		        workflowMessage.setWorkflowScreen(newDataMessage.getWorkflowScreen());
		        workflowMessage.setRequestAction(newDataMessage.getRequestAction());
		        workflowMessage.setHeader(newDataMessage.getHeader());
		        workflowMessage.updateValues(newDataMessage.getValues(), currentMessageValueCollection);
		    }
		    else {
		        workflowMessage = new WorkflowMessage(incomingDataMessage);
		         
		        var currentScreenKey = getCurrentScreen();
		        if (hwc.activationScreen || hwc.credentialsScreen) { 
		            //save these so we can call processDataMessage after showing the activation screen
		            hwc.origIncomingDataMessage = incomingDataMessage;
		            hwc.origNoUI = noUI;
		            hwc.origLoading = false;
		        }
		        if (hwc.activationScreen) {
		            //go to the activation screen if required
		            var screenToNavTo = hwc.activationScreen;
		            hwc.setCurrentScreen('');
		            hwc.navigateForward(screenToNavTo, undefined, loading, true, dataType);
		            return;
		        }
		        if (hwc.credentialsScreen) { //go to the credential screen if required
		            var screenToNavTo = hwc.credentialsScreen;
		            hwc.setCurrentScreen('');
		            hwc.navigateForward(screenToNavTo, undefined, loading, dataType);
		            return;
		        }
		    }
		    if(typeof(hwc.customAfterDataReceived)==='function') {
		        hwc.customAfterDataReceived(workflowMessage);
		    }
		    
		    if (!noUI)
		    {
		        var requestedScreenToOpen = workflowMessage.getWorkflowScreen();
		
		        // handle any conditional navigation
		        if(typeof(customConditionalNavigation)==='function') {
		            var currentScreenKey = hwc.getCurrentScreen();
		            var requestAction = workflowMessage.getRequestAction();
		            var customNavigations = getCustomNavigations(currentScreenKey, requestAction);
		            var customNavsLength = customNavigations.length;
		            var idx = 0;
		            
		            if( customNavsLength > 0 ) {
		                try {
		                    for( idx=0; idx<customNavsLength; idx++) {
		                        if( customConditionalNavigation( currentScreenKey, requestAction,
		                              requestedScreenToOpen,
		                              customNavigations[idx].condition,
		                              workflowMessage)) {
		                            requestedScreenToOpen = customNavigations[idx].screen;
		                            if (logLevel >= 4) { hwc.log("Conditional Navigation changed next screen", "DEBUG", false); }
		                            break;
		                        }
		                    }
		                } catch( error ) {
		                    // log and tell the user
		                    // then bail out to execute the 'default' screen.
		                    hwc.log("Error: " + error.message, "ERROR", true);
		                    hwc.log("Error - customConditionalNavigation: idx=" + idx, "ERROR", false);
		                }
		            }
		        }
		        if (hwc.getCurrentScreen() === hwc.SERVERINITIATEDFLAG) { // wasn't a real screen, so clean up after ourselves  //after a migration Custom.js is not updated CR 679459
		            hwc.setCurrentScreen('');
		            //if we previously came from an activation or credential screen we need to set the screen back to that so that we can properly navigateForward (hide the old screen)
		            if (hwc.origScreenKey) {
		                hwc.setCurrentScreen(hwc.origScreenKey);
		            }
		        }
		
		        // navigate to the next screen
				if (requestedScreenToOpen && requestedScreenToOpen !== hwc.getCurrentScreen()) {
		            hwc.navigateForward(requestedScreenToOpen, undefined, loading, fromActivationFlow, dataType);
		        }
		        else {
		            hwc.updateUIFromMessageValueCollection(hwc.getCurrentScreen(), hwc.getCurrentMessageValueCollection());
		        }
		    }
		}
		else {  //it is an error message to be displayed
		    showErrorFromNative(incomingDataMessage); 
		}
	}
	finally {  
		if(typeof(hwc.customAfterProcessDataMessage) === 'function') {
	        hwc.customAfterProcessDataMessage(incomingDataMessage, loading, fromActivationFlow, dataType);
	    }        
    	if (logLevel >= 4) { hwc.log("exiting processDataMessage()", "DEBUG", false); }
    }
};

/**
 * @public
 * @memberOf hwc
 */
hwc.addNativeMenuItemsForScreen = function addNativeMenuItemsForScreen(screenToShow, subMenuName, okaction) {
    if (logLevel >= 4) { hwc.log("entering addNativeMenuItemsForScreen()", "DEBUG", false); }
    var divToShow = screenToShow + "ScreenDiv";
    var toShowEl = document.getElementById(divToShow);
    if (toShowEl) {
        if (hwc.isBlackBerry() || hwc.isWindowsMobile() || hwc.isAndroid()) {
            var menuToHideEl = document.getElementById(divToShow + "Menu");
            if (menuToHideEl) {
                menuToHideEl.style.display = "none";
            }
            var menuItemNamesStr = getAttribute(toShowEl, "sup_menuitems");
            var hasMenuItems = false;
            if (menuItemNamesStr) {
                var menuItemNames = menuItemNamesStr.split(',');
                var menuStr = "{\"menuitems\":[";
                var i;                                
                for (i = 0; i < menuItemNames.length; i++) {
                    var menuItemName = menuItemNames[i++];
                    var menuItemKey = menuItemNames[i];
                    var methodName = hwc.convertToValidJavaScriptName('menuItemCallback' + screenToShow + menuItemKey);
                    if (i === 1) {  //first value will be the default value
                        menuStr = menuStr + "{\"name\":\"" + menuItemName + "\",\"action\":\"" + methodName + "()\",\"default\":\"true\"},";
                    }
                    else {
                        menuStr = menuStr + "{\"name\":\"" + menuItemName + "\",\"action\":\"" + methodName + "()\"},";
                    }
                }
                if (menuStr.length > 15) {
                    hasMenuItems = true;
                    menuStr = menuStr.substring(0, menuStr.length - 1);
                    menuStr = menuStr + "],\"lang\":\"" + hwc.lang + "\",\"submenuname\":\"";
                    if (subMenuName) {
                        menuStr = menuStr + subMenuName;
                    }
                    else {
                        if (resources) {
                            menuStr = menuStr + resources.getString("MENU");
                        }
                        else {
                            menuStr = menuStr + "Menu";
                        }
                    }
                    if (hwc.isWindowsMobile()) {
                        if (!okaction) {
                            okaction = getAttribute(toShowEl, "sup_okaction");
                        }
                        if (!okaction) {
                            okaction = "doSaveAction()";
                        }
                        menuStr = menuStr + "\",\"OK\":\"" + okaction;
                    }
                    menuStr = menuStr + "\"}";
                    
                    hwc.addNativeMenuItem_CONT(menuStr);
                }
            }
            if (!hasMenuItems) {
                hwc.removeAllMenuItems();
            }
        }
    }
    if (logLevel >= 4) { hwc.log("exiting addNativeMenuItemsForScreen()", "DEBUG", false); }
};

/**
 * @public
 * @memberOf hwc
 */
hwc.loadMAChartView = function loadMAChartView(screenToShow) {
	if (!hwc.isWindowsMobile()) 
    {
        // init MAChartView if existed
        var form = document.getElementById(screenToShow + "Form");
        if(form)
        {
    	    var divElems = form.getElementsByTagName("div");
            var divElemIdx;
            var divElem;
            var typeAttrib;
        
            var screenChartIDs = new Array();
            for (divElemIdx = 0; divElemIdx < divElems.length; divElemIdx++) 
            {
                divElem = divElems[divElemIdx];
                typeAttrib = divElem.getAttribute("sup_html_type");

                if (typeAttrib != null && typeAttrib == "machartview") 
                {
                    //we have an MAChartView, get child node
                    var chartIDs = new Array();
                    var bSplit = /^true$/i.test(divElem.getAttribute("split_view"));
                    var bDrillDown = /^true$/i.test(divElem.getAttribute("drill_down"));
                    var bDAVar = /^true$/i.test(divElem.getAttribute("da_variables"));
                    var row = parseInt(divElem.getAttribute("row"));
				    var column = parseInt(divElem.getAttribute("column"));
                    var divCharts = divElem.getElementsByTagName("div");
                
                    var chartElem;
                    var chartElemIdx;
                    var currentChartElemIndex = 0;
                    for(chartElemIdx = 0; chartElemIdx < divCharts.length; chartElemIdx++)
                    {
                	    chartElem = divCharts[chartElemIdx];
                    	if (chartElem.parentNode == divElem)
                    	{
                	    	chartIDs[currentChartElemIndex++] = chartElem.id;
                	    }
                    }
                
                    //initialize chart
                    initMAChartView(screenToShow, chartIDs, row, column, bSplit, bDrillDown, bDAVar);
                
                    screenChartIDs = screenChartIDs.concat(chartIDs);
                }
            }
        
            if(typeof(initMAChartIDs) === 'function') 
            {
                initMAChartIDs(screenChartIDs);
            }
        }
    }
};
	
/**
 * @public
 * @memberOf hwc
 */
hwc.afterShowScreen = function afterShowScreen(screenToShow) {
	hwc.loadMAChartView(screenToShow);
};

/**
 * @public
 * @memberOf hwc
 */
hwc.showScreen = function showScreen(screenToShow, screenToHide, isNavigateBack ) {
    if (logLevel >= 4) { hwc.log("entering showScreen() screen: " + screenToShow, "DEBUG", false); }
    if (!hwc.customBeforeShowScreen(screenToShow, screenToHide)) {
        if (logLevel >= 4) { hwc.log("exiting showScreen()", "DEBUG", false); }
        return;
    }
    hwc.removeAndroidSpinner();
    //  Make sure the DatePicker goes away on screen transitions
    hwc.removeBBDatePicker();

    var divToShow = screenToShow + "ScreenDiv";
    var divToHide;
    if (screenToHide) {
        divToHide = screenToHide + "ScreenDiv";
    }
    var toShowEl = document.getElementById(divToShow);
    if (toShowEl) {
        var helpElem = document.getElementById(divToShow.substring(0, divToShow.length - 9) + "Form_help");
        if (helpElem) {
            hwc.setValidationText(helpElem, ""); //to remove any messages added by onCustomNavigate
        }
        
        if (! hwc.hasjQueryMobile ){
            toShowEl.style.display = "block";
            if ( toShowEl.offsetHeight < screen.height ) {
                toShowEl.style.height = screen.height +'px';
            }
        }
    }
    else {
        hwc.showAlertDialog("Please specify a valid screen to show via ?screenToShow=ScreenKeyName");
    }
    
    if (divToHide && ( ! hwc.hasjQueryMobile )) {
        var toHideEl = document.getElementById(divToHide);
        if (toHideEl) {
            toHideEl.style.display = "none";
        }
    }
    document.title = divToShow.substring(0, divToShow.length - 9);
    var i;
    for (i = 0; i < UIScreenListeners.length; i++ ) {
        var listener = UIScreenListeners[ i];
        var obj  = {
            screenToShow : screenToShow,
            screenToHide : screenToHide,
            isNavigateBack: isNavigateBack
        };
        listener.call( this, obj );
    }
    
    if (!hwc.isIOS() && !hwc.isWindows()) { //give focus to an element  //has no affect on an IOS device
        var form = document.getElementById(screenToShow + "Form");
        if (form) {
            var i;
            for (i = 0; i < form.elements.length; i++) {
                var formEl = form.elements[i];
                if (formEl.focus) {
                    formEl.focus();
                    break;
                }
            }
        }
    }
   
     if ( !hwc.isJQueryMobileLookAndFeel) {
     	hwc.setCurrentScreen( screenToShow );
		hwc.afterShowScreen( screenToShow );
        hwc.customAfterShowScreen(screenToShow, screenToHide);
    }else {
    	//please binding to JQM pageshow event in jQuery $(document).ready function.  
    }

    if (logLevel >= 4) { hwc.log("exiting showScreen()", "DEBUG", false); }
};

/**
 * @public
 * @memberOf hwc
 */
hwc.setDefaultValues = function setDefaultValues(screenKey) {
    if (logLevel >= 4) { hwc.log("entering setDefaultValues()", "DEBUG", false); }
    //loop through the form elements of type date or datetime-local
    var form = document.getElementById(screenKey + "Form");
    if (form && (form.elements.length > 0)) {
        var valueToShow;
        var i;
        for (i = 0; i < form.elements.length; i++) {
            var formEl = form.elements[i];
            var defaultValue = getAttribute(formEl, "sup_default_value");
            var type = getAttribute(formEl, "sup_html_type");
            valueToShow = "";
            if (defaultValue) {
                if (type === "date") {
                    var someDate = hwc.getDateFromExpression(defaultValue);
                    valueToShow = hwc.getISODateString(someDate);
                }
                else if (type === "datetime-local") {
                    var idxOfToday = defaultValue.indexOf("today");
                    var idxOfNow = defaultValue.indexOf("now");
                    if (idxOfToday === 0) {
                        valueToShow = hwc.getDateTimeToday(formEl, defaultValue);
                    }
                    else if (idxOfNow === 0) {
                        valueToShow = hwc.getDateTimeNow(formEl);
                    }
                    else {
                        var aDate = new Date(hwc.parseDateTime(formEl, defaultValue));
                        valueToShow = hwc.getISODateTimeString(aDate, getAttribute(formEl, "sup_precision"));
                    }
                }
				else if(type == "time") {
					var timeStr = hwc.getTimeStringToDisplayFromStr(defaultValue, getAttribute(formEl, "sup_precision"));
					var aTime = new Date(hwc.parseTime(timeStr));
					valueToShow = hwc.getISOTimeString(aTime, getAttribute(formEl, "sup_precision"));
				}
                if (valueToShow) {
                    hwc.setHTMLValue(formEl, valueToShow, screenKey, false);
                }
                else {
                    if (formEl.value != defaultValue) {
                        hwc.setHTMLValue(formEl, defaultValue, screenKey, false);
                    }
                }
            }
            else { //if we do not have a defaultValue and the type is date, datetime, time, number, or slider set a default value
                if (type === "date") {
                    var dateNow = new Date();
                    valueToShow = hwc.getISODateString(dateNow);
                }
                else if (type === "datetime-local") {
                    var dateNow = new Date();
                    valueToShow = hwc.getISODateTimeString(dateNow, getAttribute(formEl, "sup_precision"));
                }
                else if (type === "time") {
                    var dateNow = new Date();
                    valueToShow = hwc.getISOTimeString(dateNow, getAttribute(formEl, "sup_precision"));
                }
                else if (type === "number") {
                    var minValue = getAttribute(formEl, "sup_min_value");
                    var maxValue = getAttribute(formEl, "sup_max_value");
                    if (minValue && maxValue) {
                        if (0 >= minValue && (0 <= maxValue)) {
                            valueToShow = 0;
                        }
                        else {
                            valueToShow = minValue;
                        }
                    }
                    else if (minValue) {
                        if (0 >= minValue) {
                            valueToShow = 0;
                        }
                        else {
                            valueToShow = minValue;
                        }
                    }
                    else if (maxValue) {
                        if (0 <= maxValue) {
                            valueToShow = 0;
                        }
                        else {
                            valueToShow = maxValue;
                        }
                    }
                    else {
                        valueToShow = 0;
                    }
                }
                else if (type === "range") {
                    var minValue = getAttribute(formEl, "min");
                    if (minValue) {
                       valueToShow = minValue;
                    }
                    else {
                        valueToShow = 0;
                    }
                }
                else if (type === "text") {
                    valueToShow = "";
                }
                if (!(valueToShow === null) && !(valueToShow === undefined)) {
                    hwc.setHTMLValue(formEl, valueToShow, screenKey, false);
                }
            }
        } //elements in a form
    }
    if (logLevel >= 4) { hwc.log("exiting setDefaultValues()", "DEBUG", false); }
};

/**
 * @public
 * @memberOf hwc
 */
hwc.getTimeZoneOffset = function getTimeZoneOffset(aDate) {
    var offset = aDate.getTimezoneOffset();
    if (offset === 0) {
        if (hwc.isBlackBerry()) {
            offset = -1 * hwc.getOffsetFromUTC(aDate); //(-1  674539-1 negative rather than positive
        }
    }
    return offset; 
};

/**
 * @public
 * @memberOf hwc
 */
hwc.getDateTimeToday = function getDateTimeToday(formEl, defaultValue) {
    var dateNow = new Date();
    dateNow.setHours(12);
    dateNow.setMinutes(0);
    dateNow.setSeconds(0);
    dateNow.setMilliseconds(0);
    if (defaultValue.length > 5) {
        var offset = defaultValue.substring(5);
        offset = offset.replace("+", "");
        var dateNowMS = dateNow.getTime();
        dateNowMS = dateNowMS + offset * 1000;
        dateNow.setTime(dateNowMS);
    }
    var prec = "";
    if (formEl) {
        prec = getAttribute(formEl, "sup_precision");
    }
    defaultValue = hwc.getISODateTimeString(dateNow, prec);
    return defaultValue;
};

/**
 * @public
 * @memberOf hwc
 */
hwc.getDateTimeNow = function getDateTimeNow(formEl) {
    var dateNow = new Date();
    return hwc.getISODateTimeString(dateNow, getAttribute(formEl, "sup_precision"));
};

/**
 * @public
 * @memberOf hwc
 */
hwc.addZero = function addZero(value) {
    value = value + "";
    var ret = (value.length === 1) ? "0" + value : value;
    return ret;
};

/**
 * @public
 * @memberOf hwc
 */
hwc.addListViewHeader = function addListViewHeader(linesStr) {
    var lines = linesStr.split("&?")[4].split("&;");
    var hdrHTML = "<thead>";
    var linesIdx;
    for (linesIdx = 0; linesIdx < lines.length; linesIdx++) {
        hdrHTML = hdrHTML + "<tr>";
        var lineDetails = lines[linesIdx];
        var fields = lineDetails.split("&,");
        var fieldIdx;
        for (fieldIdx = 0; fieldIdx < fields.length; fieldIdx = fieldIdx + 7) {
            var fieldHeaderTitle = fields[fieldIdx + 2];
            if (fieldHeaderTitle.length === 0) {
                continue;
            }
            var fieldHeaderWidth = fields[fieldIdx + 1];
            if (fieldHeaderWidth != "0") {
                hdrHTML = hdrHTML + '<th align="left" width="'+ fieldHeaderWidth + '%">' + fieldHeaderTitle + '</th>';
            }
        }
    }
    hdrHTML = hdrHTML + "</tr></thead>";
    return hdrHTML;
};

/**
 * @public
 * @memberOf hwc
 */
hwc.addListViewItem = function addListViewItem(linesTxt, onClk, altRowColor, even, firstRow) {
    if (logLevel >= 4) { hwc.log("entering addListViewItem()", "DEBUG", false); }
    var trHTML = "";
    var i;
    for (i = 0; i < linesTxt.length; i++) {
        var fields = linesTxt[i];
        var className = "";
        var firstLine = (i === 0);
        var lastLine = (i === linesTxt.length - 1);
        if (firstRow) {
            if (firstLine && lastLine) {
                className = " class=\"firstAndLastLine\"";
            }
            else if (firstLine) {
                className = " class=\"firstLine\"";
            }
            else if (lastLine) {
                className = " class=\"lastLine\"";
            }
        }
        else if (lastLine) {
            className = " class=\"lastLine\"";
        }
        var altRow = " class=\"oddrow\"";
        var trStyle = "";
        if (even) {
            altRow = " class=\"evenrow\"";
            if (!document.styleSheets  || !document.styleSheets[0].addRule) { //Windows Mobile and BB 5 do not appear to support dynamically modifing the stylesheet
                if ((altRowColor !== "null") && (altRowColor.length > 0)) {
                    trStyle = " style=\"background: " + altRowColor + "\" ";
                }
            }
        }
        if (onClk && !hwc.isWindowsMobile()) {
            trHTML = trHTML + "<tr onclick=\"" + onClk + "\"" + altRow + trStyle + ">";
        }
        else {
            trHTML = trHTML + "<tr" + altRow + trStyle + ">";
        }
        var j;
        for (j = 0; j < fields.length; j++) {
            var field = fields[j];
            var font = field.font;
            var fontStart = "";
            var fontEnd = "";
//            if (hwc.isIOS()) {   // iphone automatically changes address, email, phone number to a link.  Adding no width space will prevent this but on some devices it appears as a square
//                field.value = '\u2060' + field.value;
//            }
            var value = field.value;
            if (font === "Bold") { 
                fontStart = "<b>";
                fontEnd = "</b>";
            }
            else if (font === "Italic") {
                fontStart = "<i>";
                fontEnd = "</i>";
            }
            else if (font === "normal") {
                fontStart = "<plain>";
                fontEnd = "</plain>";
            }
            if (field.dataType === "DATE") {
                var strIdx = field.value.indexOf("T");
                if (strIdx !== -1) {
                    field.value = field.value.substr(0, strIdx);
					value = field.value;	// NA12-2698
                }
            }
            else if (field.dataType === "TIME") {
                var strIdx = field.value.indexOf("T");
                if (strIdx !== -1) {
                    field.value = field.value.substr(strIdx+1);
					value = field.value;	// NA12-2698
                }
            } else if (field.dataType === "DATETIME") {
				if (field.value != "") {	// NA12-2698
					var aDateTime = new Date(hwc.parseDateTime(null, field.value));
					aDateTime = hwc.convertUtcToLocalTime(aDateTime);
					field.value = hwc.getISODateTimeString(aDateTime);
					value = field.value;
				}
            } else if ( field.dataType === "IMAGE" ) {
                if (hwc.isWindowsMobile() && field.isStaticImage === 'false' )
                    value = '';
                if (field.isStaticImage === 'true' )
                    value ='<img src="' + value +'" height="' + field.imageHeight + '"/>';
                else if (field.isStaticImage === 'false' && hwc.isWindowsMobile() === 'false' )
                    value ='<img src="data:image/jpeg;base64,' + value +'" height="' + field.imageHeight + '"/>';
            }

            if (field.width != "0") {
                if (hwc.isWindowsMobile()) {   //Windows mobile does not appear to support an onclick handler on the row ... so use an anchor
                    if (onClk) {
                        trHTML = trHTML + "<td" + className + " width='" + field.width + "%'><a href=\"javascript:" + onClk + "\">" + fontStart + value + fontEnd + "</a></td>";
                    }
                    else {
                        trHTML = trHTML + "<td" + className + " width='" + field.width + "%'>" + value + "</td>";
                    } 
                }
                else {
                    trHTML = trHTML + "<td" + className + " width='" + field.width + "%'>" + fontStart + value + fontEnd + "</td>";
                }
            }
        }
        trHTML = trHTML + "</tr>";
    }
    if (logLevel >= 4) { hwc.log("exiting addListViewItem()", "DEBUG", false); }
    return trHTML;
};

/**
 * @public
 * @memberOf hwc
 */
hwc.delayedSetValue = function delayedSetValue(screenKey, elemId, val) {
    if (logLevel >= 4) { hwc.log("entering delayedSetValue()", "DEBUG", false); }
    var form = document.getElementById(screenKey + "Form");
    var elem = hwc.getFormElementById(form, elemId);
    elem.value = val;
    if (logLevel >= 4) { hwc.log("exiting delayedSetValue()", "DEBUG", false); }
};

/**
 * @public
 * @memberOf hwc
 */
hwc.delayedSliderSetValue = function delayedSliderSetValue(screenKey, elemId, val) {
     if (logLevel >= 4) { hwc.log("entering delayedSliderSetValue", "DEBUG", false); }
     try {
         var form = document.getElementById(screenKey + "Form");
         var slider = hwc.getFormElementById(form, elemId);
         slider.value = val;
         $(slider).slider("refresh");
     }
     catch (e) {}
};

/**
 * @public
 * @memberOf hwc
 */
hwc.delayedCheckboxSetValue = function delayedCheckboxSetValue(screenKey, elemId, val) {
    if (logLevel >= 4) { hwc.log("entering delayedCheckboxSetValue", "DEBUG", false); }
    try {
        var form = document.getElementById(screenKey + "Form");
        var check = hwc.getFormElementById(form, elemId);
        check.checked = hwc.parseBoolean(val);
        $(check).checkboxradio("refresh");
    }
    catch (e) {}
};

/**
 * @public
 * @memberOf hwc
 */
hwc.getCredInfo = function getCredInfo(screenToCheck) {
    if (logLevel >= 4) { hwc.log("entering getCredInfo()", "DEBUG", false); }
    if (!(screenToCheck)) {
        screenToCheck = hwc.getCurrentScreen();
    }
    var credInfo = "";
    if (screenToCheck) {
        var form = document.forms[screenToCheck + "Form"];
        if (form) {
            if (form.elements.length > 0) {
                var i;
                for (i = 0; i < form.elements.length; i++) {
                    var formEl = form.elements[i];
                    var credStr = getAttribute(formEl, "credential");
                    if (credStr) { // we are dealing with a username or password credential
                        if (credStr === "username") {
                            credInfo = "supusername=" + encodeURIComponent(formEl.value) + "&";
                            hwc.supUserName = formEl.value;
                        }
                        else if (credStr === "password") {
                            credInfo += "suppassword=" + encodeURIComponent(formEl.value) + "&";
                        }
                    }
                }
            }
        }
    }
    if (credInfo) {
        credInfo = credInfo + hwc.getVersionURLParam();
    }
    if (logLevel >= 4) { hwc.log("exiting getCredInfo()", "DEBUG", false); }
    return credInfo;
};

/**
 * @public
 * @memberOf hwc
 */
hwc.clearCredentialPassword = function clearCredentialPassword() {
    if (hwc.curScreenKey) {
        var form = document.forms[hwc.curScreenKey + "Form"];
        if (form) {
            if (form.elements.length > 0) {
                var i;
                for (i = 0; i < form.elements.length; i++) {
                    var formEl = form.elements[i];
                    var credStr = getAttribute(formEl, "credential");
                    if (credStr) { // we are dealing with a username or password credential
                        if (credStr === "password") {
                            formEl.value = "";
                        }
                    }
                }
            }
        }
    }
};

/**
 * @public
 * @memberOf hwc
 */
hwc.handleCredentialChange = function handleCredentialChange(screenToCheck) {
    if (logLevel >= 4) { hwc.log("entering handleCredentialChange()", "DEBUG", false); }
    //need to post credentials with each navigation if any
    if (!(screenToCheck)) {
        screenToCheck = hwc.getCurrentScreen();
    }
   
    var credInfo = hwc.getCredInfo(screenToCheck);
    if (credInfo) {   
        if (hwc.activationScreen) { 
            hwc.credentialsScreen = null; //no need to show the credentials screen if we provide the credentials on the activation screen
        }
    }
    hwc.handleCredentialChange_CONT(credInfo);
    if (logLevel >= 4) { hwc.log("exiting handleCredentialChange()", "DEBUG", false); }
};

/**
 * @public
 * @memberOf hwc
 */
hwc.windowOpen = function windowOpen(sUrl) {
    if (logLevel >= 4) { hwc.log("entering windowOpen()", "DEBUG", false); }
    window.open(sUrl);
    if (logLevel >= 4) { hwc.log("exiting windowOpen()", "DEBUG", false); }
};

// PRIVATE FUNCTION
/**
 * Show the error coming from a native call
 * @param errMsg
 * @private
 * @memberOf hwc
 */
function showErrorFromNative(errMsg) {
    if (logLevel >= 4) { hwc.log("entering showErrorFromNative()", "DEBUG", false); }
    reportErrorFromNative(errMsg);
    if (logLevel >= 4) { hwc.log("exiting showErrorFromNative()", "DEBUG", false); }
};


//PRIVATE FUNCTION
/**
 * Actually report the error
 * @private
 * @memberOf hwc
 */
function reportErrorFromNative(errString) {
    if (logLevel >= 4) { hwc.log("entering reportErrorFromNative()", "DEBUG", false); }
    if (typeof(hwc.customBeforeReportErrorFromNative) === 'function' && !hwc.customBeforeReportErrorFromNative(errString)) {
        if (logLevel >= 4) { hwc.log("exiting reportErrorFromNative()", "DEBUG", false); }
        return;
    }
    // container knows how to get these details
    var callbackMethod = hwc.getCallbackFromNativeError(errString);
    var errorCode      = hwc.getCodeFromNativeError(errString);
    var onErrorMsg     = hwc.getOnErrorMessageFromNativeError(errString);
    var nativeMsg      = hwc.getNativeMessageFromNativeError(errString);
    if (callbackMethod) {
    	var nmspc = ("hwc."); /* strip the namespace only from the start of the callback */
    	var pos = callbackMethod.indexOf(nmspc);
    	if (pos != -1 && pos == 0)  
    	{
    		callbackMethod = callbackMethod.substring(pos + nmspc.length);
    	}

    	hwc[callbackMethod].call(this, errorCode, onErrorMsg, nativeMsg);
    }
    else if (onErrorMsg) {
        hwc.showAlertDialog(onErrorMsg);
    }
    else if (nativeMsg) {
        hwc.showAlertDialog(nativeMsg);
    }
    if (typeof(hwc.customAfterReportErrorFromNative) === 'function') {
        hwc.customAfterReportErrorFromNative(errString);
    }
    if (logLevel >= 4) { hwc.log("exiting reportErrorFromNative()", "DEBUG", false); }
};

/**
 * Private function:
 * @private
 * @memberOf hwc
 */
hwc.setSelectsSelectedIndex = function setSelectsSelectedIndex(select, aValue) {
    if (logLevel >= 4) { hwc.log("entering setSelectsSelectedIndex()", "DEBUG", false); }
    var i;
    for (i = 0; i < select.options.length; i++) {
        if (select.options[i].value === aValue) {
            select.selectedIndex = i;
        }
    }
    if (logLevel >= 4) { hwc.log("exiting setSelectsSelectedIndex()", "DEBUG", false); }
};

/**
 * Private function:
 * @private
 * @memberOf hwc
 */
hwc.reportRMIError = function reportRMIError(errorCode, onErrorMsg, nativeMsg) {
    if (onErrorMsg) {
        hwc.showAlertDialog(onErrorMsg);
    }
    else if (nativeMsg) {
        hwc.showAlertDialog(nativeMsg);
    }
};

/**
 * Private function:
 * @private
 * @memberOf hwc
 */
hwc.bindInputChanged = function bindInputChanged() {
	inputs = document.getElementsByTagName("input");
	for (var i = 0; i < inputs.length; i++) {
		var allowsNull = getAttribute(inputs[i], "sup_allows_null");
		if (allowsNull != null && allowsNull != undefined) {
			//inputs[i].onchange = function() {hwc.inputChanged(this)};
			inputs[i].onkeydown = function() {hwc.inputChanged(this);};
		}
	}
 };
 
/**
 * Private function:
 * @private
 * @memberOf hwc
 */
hwc.inputChanged = function inputChanged(element) {
	var valueChanged = element.getAttribute("sup_valuechanged");
	if (valueChanged != null && valueChanged != undefined && valueChanged == "true") {
		return;				// We've already been here and marked this.
	}
	element.setAttribute("sup_valuechanged", "true"); 
	var values = workflowMessage.getValues();
	var value = values.getData(element.id);
	value.setNullAttribute(false);
};

})(hwc, window);

/*
 * Sybase Hybrid App version 2.2.2
 * 
 * Custom.js
 * This file will not be regenerated, and it is expected that the user may want to
 * include customized code herein.
 *
 * The template used to create this file was compiled on Thu Jun 07 14:57:11 EDT 2012
 * 
 * Original file date: 2012-Oct-22
 * Copyright (c) 2012 Sybase Inc. All rights reserved.
 */

/**
 * @namespace The namespace for the Hybrid Web Container javascript
 */
hwc = (typeof hwc === "undefined" || !hwc) ? {} : hwc;		// SUP 'namespace'

// === legacy mapping - from HTML or Workflow.js ===
function customAfterShowScreen(screenToShow, screenToHide) { return hwc.customAfterShowScreen(screenToShow, screenToHide); }
function customBeforeMenuItemClick(screen, menuItem)       { return hwc.customBeforeMenuItemClick(screen, menuItem); }
function customAfterMenuItemClick(screen, menuItem)        { return hwc.customAfterMenuItemClick(screen, menuItem);  }

// === legacy mapping - MAKit ===
function customBeforeArrangeMAChart(screenName, chartNames, column, row)   { return hwc.customBeforeArrangeMAChart(screenName, chartNames, column, row); }
function customAfterInitiateMAChart(chartObj, screenName, chartName)       { return hwc.customAfterInitiateMAChart(chartObj, screenName, chartName); }
function customBeforeMaximizeMASplitChart(chartObj, screenName, chartName) { return hwc.customBeforeMaximizeMASplitChart(chartObj, screenName, chartName); }
function customAfterMaximizeMASplitChart(chartObj, screenName, chartName)  { return hwc.customAfterMaximizeMASplitChart(chartObj, screenName, chartName); }
function customBeforeExecuteMAQuery(chartObj, name, args)                  { return hwc.customBeforeExecuteMAQuery(chartObj, name, args); }
function customAfterExecuteMAQuery(chartObj, name, args)                   { return hwc.customAfterExecuteMAQuery(chartObj, name, args); }



(function(hwc, window, undefined) {
    // Private variables
    // var myVariable = ""; // example variable

//Use this method to add custom html to the top or bottom of a form
	
/**
 * Invoked when the application is first launched, before any data is loaded, or screens are opened.
 * Because workflow settings are not yet initialized at this point, you cannot call any SharedStorage functions here. <br/><br/>
 *   Please note some scenarios that should not be handled here:<br/>
 *    1)  There is no screen available before the application load finishes <br/>
 *    2)  You cannot called any SharedStorage functions here because the url parameters
 *        have not yet been parsed and application setting are not yet initialized.<br/>
 *        
 *  @example
 *  See source file for example
 *  @public
 *  @memberOf hwc
 */
hwc.customBeforeHybridAppLoad = function() {
/*
 * Example:
 * //Use this method to add custom html to the top or bottom of a form
 * function customBeforeWorkflowLoad() {
 * 
 * 	var form = document.forms[curScreenKey + "Form"];
 * 	   if (form) {
 * 	      // header
 * 	      var topOfFormElem = document.getElementById("topOf" + curScreenKey + "Form");
 * 	      
 * 	      if (topOfFormElem) {
 * 	         topOfFormElem.innerHTML = "<img id='ImgSylogo' src='./images/syLogo.gif'/><br/>";
 * 
 * 	         // footer
 * 	         var bottomOfFormElem = document.getElementById("bottomOf" + curScreenKey + "Form");
 * 	         bottomOfFormElem.innerHTML = "<p>Copyright 2010, Sybase Inc.</p>";
 * 	      } 
 * 	   }
 *     return true;
 * }
*/
	
    return true;
};

/**
 * Invoked when the application is first launched, after data is loaded and screens are opened.
 * @public
 * @memberOf hwc
 */
hwc.customAfterHybridAppLoad = function() {
    hwc.log("customAfterHybridAppLoad", "DEBUG", false );
    hwc.log("Application " + hwc.getVersionURLParam(), "DEBUG", false );
    hwc.log("Platform: isIOS=" + hwc.isIOS() + ", isAndroid="  + hwc.isAndroid() + ", isBB=" + hwc.isBlackBerry() + ", isWin=" + hwc.isWindows() + ", isWinMobile=" + hwc.isWindowsMobile(), "DEBUG", false );

/*
	//  Following fix is required to JSON payload when used with the OData SDK
	
	var originalJSONParse = window.JSON.parse;
	window.JSON.parse = function (text, reviver) {
		// There seems to be a bug on Blackberry where the last character of the response gets cut off.
		// So, check the last character of text; if it is not a "}" then add "}" to the end of text.
		// This should not affect any valid text, since the last character of any valid json must be "}"
		if( text.substring(text.length-1) != "}" )
		{
			text = text + "}";
		}
		// Also on Blackberry, \u0000 is the first character in the body of the response.
		// It needs to be removed for this parser to deem text parsable
		text = text.replace(/^\u0000/, '');
		
		return originalJSONParse(text, reviver);
	}	
	// end of OData required fix
	
    var screenKey = hwc.getCurrentScreen();
    var form = document.forms[screenKey + "Form"];
    if (form) {
        var topOfFormElem = document.getElementById("topOf" + screenKey + "Form");
        topOfFormElem.innerHTML = "Use this screen to ..."; 
        var bottomOfFormElem = document.getElementById("bottomOf" + screenKey + "Form");
        bottomOfFormElem.innerHTML = "<a href=\"help.html\">Click here to open help</a>";
    }
*/
};


/**
 * Invoked before an operation or object query is about to be called as the result of the user clicking a Submit menuitem.
 * You can set this to return false to prevent the default behaviour from occurring.
 * @public
 * @memberOf hwc
 */
hwc.customBeforeSubmit = function(screenKey, actionName, dataMessageToSend) {
/*
    if (screenKey == "Create" && (actionName == "Submit")) {
        var form = document.forms[screenKey + "Form"];
        if (form) {
            var itemCostVal = form.ExpenseTracking_create_itemCost_paramKey.value;
            if (itemCostVal >= 1000) {
                hwc.showAlertDialog("Warning, Items costing $1000 or more must also be approved by the accounting department.");
                return true;
            }
        }
    }
*/
/*
	// examine/save/modify the data before the submit action
	if ((screenKey === "Search") && (actionName === "By_First_Name")) {
		// ** Style 1 **
		// store data in a simple global variable by using 'var myVariable' at the top of this file.
		myVariable = new Date();

		// ** Style 2 **
		// store data in the HTML 'form' variable
		var form = document.forms[screenKey + "Form"];
		if (form) {
			form.MyGetTheServerData_Var1 = "a value to save away";
			form.MyGetTheServerData_TimeStamp = new Date();
		}

		// ** Style 3 **
		// Can also manipulate the data message itself
		var myNewValue1 = new MessageValue();
		myNewValue1.setKey("myKey1");
		myNewValue1.setValue(42);
		myNewValue1.setType("NUMBER");

		var myNewValue2 = new MessageValue();
		myNewValue2.setKey("myKey2");
		myNewValue2.setValue( new Date() );
		myNewValue2.setType("DATETIME");

		var mvc = dataMessageToSend.getValues();
		if( mvc ) {
			mvc.add( myNewValue1.getKey(), myNewValue1 );
			mvc.add( myNewValue2.getKey(), myNewValue2 );
		}
	}	
*/
    return true;
};

/**
 * Invoked after an operation or object query is called as the result of the user clicking a Submit menuitem.
 * @public
 * @memberOf hwc
 */
hwc.customAfterSubmit = function(screenKey, actionName) {
/*
	// Examine/save/modify the data after the event processing
	if((screenKey === "Search") && (actionName === "By_First_Name")) {
		// ** Style 1 **
		// the 'myGlobalVariable'
		var timeDiff1 = new Date() - myVariable;

		// ** Style 2 **
		// the HTML 'form' variable
		var form = document.forms[screenKey + "Form"];
		if (form) {
			// do something with the time difference...
			var timeDiff2 = new Date() - form.MyGetTheServerData_TimeStamp;
		}

		// ** Style 3 **
		// pull data out of the data message itself
		var mvc = hwc.getCurrentMessageValueCollection();
		if( mvc ) {
			var myValue0 = mvc.getData( "firstNameKey" );
			var myValue1 = mvc.getData( "privateServerData1" );
			var myValue2 = mvc.getData( "privateServerData2" );
		}
	}
*/
};


/**
 * Invoked when another screen is about to be opened. Set to false to prevent the screen from being opened.
 * @example
 * See source file for example
 * @public
 * @memberOf hwc
 */
hwc.customBeforeNavigateForward = function(screenKey, destScreenKey) {
/*
 * Example:
 * When using the customBeforeNavigateForward(screenKey, destScreenKey) { } function, if you want to create your own JQuery Mobile style listview, remember that JQueryMobile does not allow duplicate ID attributes. So if there is an existing listview with the same ID attribute, you must:
 * Delete the existing listview with the same ID attribute.
 * Re-create the listview.
 * Call refresh for your listview.
 * For example:
 * 
 * //Use this method to add custom code to a forward screen transition. If you return false, the screen
 * //transition will not occur.
 * function customBeforeNavigateForward(screenKey, destScreenKey) {
 * 
 * ..
 * try {
 * 		if (destScreenKey == 'Personal_Work_Queue') {
 * 			
 * 			//grab the results from our object query
 * 			var message = getCurrentMessageValueCollection();
 * 			var itemList = message.getData("PersonalWorkQueue");
 * 			var items = itemList.getValue();
 * 			var numOfItems = items.length;
 * 			var i = 0;
 * 						
 * 			//iterate through the results and build our list
 * 			var htmlOutput = '<div id="CAMSCustomViewList"><ul data-role="listview" data-filter="true">';
 * 			var firstOrder = '';
 * 	
 * 			while ( i < numOfItems ){
 * 				var currItem= items[i];
 * 				var opFlags = currItem.getData("PersonalWorkQueue_operationFlags_attribKey").getValue();
 * 				var orderId = currItem.getData("PersonalWorkQueue_orderId_attribKey").getValue();
 * 				var operationNumber = currItem.getData("PersonalWorkQueue_operationNumber_attribKey").getValue();
 * 				var description = currItem.getData("PersonalWorkQueue_description_attribKey").getValue();
 * 				try {
 * 					var promDate = currItem.getData("PersonalWorkQueue_datePromised_attribKey").getValue();				
 * 				} catch (err) {
 * 					var promDate = "";
 * 				}
 * 
 * 				try {
 * 					var planDate = currItem.getData("PersonalWorkQueue_dateStartPlan_attribKey").getValue();
 * 				} catch (err) {
 * 					var planDate = "";
 * 				}
 * 				
 * 				var onHold = currItem.getData("PersonalWorkQueue_onHold_attribKey").getValue();
 * 				
 * 				htmlOutput += '<li><a id ="' + currItem.getKey() + '" class="listClick">';
 * 				htmlOutput += '<p><b>Flags: </b>' + opFlags + '</p>';
 * 				htmlOutput += '<p><b>Order Id: </b>' + orderId + '</p>';
 * 				htmlOutput += '<p><b>Operation No: </b>' + operationNumber + '</p>';
 * 				htmlOutput += '<p><b>Title: </b>' + description + '</p>';
 * 				htmlOutput += '</a></li>';	
 * 				
 * 				i++;
 * 				
 * 			}
 * 			
 * 			htmlOutput += '</ul></div>';
 * 		
 * 			//append the html to the appropriate form depending on the key
 * 			if (destScreenKey == 'Personal_Work_Queue') {
 * 
 * 				var listview = $('div[id="CAMSCustomViewList"]');
 * 				//Try to remove it first if already added
 * 				if (listview.length > 0) {
 * 					var ul = $(listview[0]).find('ul[data-role="listview"]');
 * 					if (ul.length > 0) {
 * 						htmlOutput = htmlOutput.replace('<div id="CAMSCustomViewList"><ul data-role="listview" data-filter="true">','');
 * 						ul.html(htmlOutput);
 * 						ul.listview('refresh');
 * 					}
 * 				} else {
 * 					$('#Personal_Work_QueueForm').children().eq(2).hide();
 * 					$('#Personal_Work_QueueForm').children().eq(1).after(htmlOutput);
 * 				}
 * 			}	
 * 			//add the listener based on the class added in the code above
 * 			$(".listClick").click(function(){
 * 				currListDivID = $(this).parent().parent();
 * 				$(this).parent().parent().addClass("ui-btn-active");
 * 				
 * 				//special case for bb
 * 				navigateForward("Shop_Display",  this.id );
 * 				
 * 				if (isBlackBerry()) { 
 * 					return;
 * 				}		
 * 			});		
 * 		}
 * 
 * End Example
 */	
/*
    if (screenKey == "Desc" && (destScreenKey === "Create"))
    {
        var form = document.forms[screenKey + "Form"];
        if (form)
        {
            var desc = form.ExpenseTracking_create_itemDesc_paramKey.value;
            var reason = form.ExpenseTracking_create_reason_paramKey.value;
            if (desc.length == 0 && (reason.length == 0 )) {
                var helpElem = document.getElementById(screenKey + "Form_help");
                hwc.setValidationText(helpElem, "Desc or reason must be provided.  Preferably both.");
                return false;
            }
        }
    }
*/
    return true;
};

/**
 * Invoked after another screen has been opened.
 * @public
 * @memberOf hwc
 */
hwc.customAfterNavigateForward = function(screenKey, destScreenKey) {
};

/**
 * Invoked when another screen is about to be opened.
 * You can set to false to prevent the screen from being opened.
 * @public
 * @memberOf hwc
 */
hwc.customBeforeNavigateBackward = function(screenKey, isCancelled) {
    return true;
};

/**
 * Invoked after a screen has been closed.
 * @public
 * @memberOf hwc
 */
hwc.customAfterNavigateBackward = function(screenKey, isCancelled) {
};

/**
 * Handle whether to execute a conditional navigation. <br/><br/>
 *
 * For online request menu items and custom actions, this method is invoked to evaluate the given condition after a given action is executed. If the screen associated with the condition should be navigated to, the condition is true.<br/><br/>
 * For server-initiated starting points, the judgement condition is if((currentScreenKey === SERVERINITIATEDFLAG).<br/><br/>
 * 
 * This method is different from the others in two of its attributes:<br/>
 * <ul><li>
 * It returns true or false:  the custom code used to implement this method can peer into the workflow message and execute logic. This routine generally does not modify the HTML or anything else. </li><li>
 * There is no before or after behavior: this function is executed after the workflow message is received from the server, but before the screen is opened. Therefore, this is executed before the "customBeforeShowScreen()" because this function is used to help decide what screen to show next.</li></ul>
 * Conditions set by the user in the designer are executed serially, and the first one that returns true determines what the start screen is. As soon as a true condition is found, evaluation stops and the screen is executed.
 * 
 * @param currentScreenKey The current screen
 * @param actionKeyName The originating action of the data message
 * @param defaultNextScreen The original default next screen, which will be executed if this returns false.
 * @param conditionName The name of the check to perform, in the context of this screen and action.  Set in the IDE.
 * @param incomingDataMessage The incoming data for any calculations.
 * @returns (true) in order to execute the matching application screen.  By default this returns (false).
 * @public
 * @memberOf hwc
 * 
 */
hwc.customConditionalNavigation = function(currentScreenKey, actionKeyName, defaultNextScreen, conditionName, incomingDataMessage) {
/*
    // example code
    if((currentScreenKey === hwc.SERVERINITIATEDFLAG) && (actionKeyName === '')) {
        // conditional start screen uses this magic screen key and the empty action name.
        if( conditionName === 'Marge') {
            // custom logic
            return true;
        }
        else if(conditionName === 'Lisa'){
            // custom logic
            // return true or false
            return false;
        }
    }
    else if((currentScreenKey === 'Search') && (actionKeyName === 'By_First_Name')) {
        if( conditionName === 'Marge') {
            // custom logic
            return true;
        }
        else if(conditionName === 'Lisa'){
            // custom logic
            // return true or false
            return false;
        }
        else if(conditionName === 'Maggie'){
            // custom logic
            // return true or false
            return true;
        }
    }
	else if((defaultNextScreen === 'Employees') || (currentScreenKey === 'Search')) {
		if( conditionName === 'Marge') {
			// custom logic
			return true;
		}
		else if(conditionName === 'Lisa'){
			// custom logic
			// return true or false
			return false;
		}
		else if(conditionName === 'Maggie'){
			// custom logic
			// return true or false
			return true;
		}
	}
*/    
    // default case is to NOT change the flow
    return false;
};

/**
 * Invoked when a screen is about to be shown.
 * User can return false to prevent the screen from being shown.
 * @public
 * @memberOf hwc
*/
hwc.customBeforeShowScreen = function(screenToShow, screenToHide) {
    return true;
};

/**
 * Invoked after a screen is shown.
 * @public
 * @memberOf hwc
 */
hwc.customAfterShowScreen = function(screenToShow, screenToHide) {
};

/**
 * Invoked after a menuitem has been clicked. User can return false to prevent the default behavior 
 * (which might open a new screen, or perform a submit, and so on) from occurring.
 * @public
 * @memberOf hwc
 */
hwc.customBeforeMenuItemClick = function(screen, menuItem) {
/*
    if (screen === "Create" && menuItem === "Quit") {
        return confirm("Are you sure you want to quit?");
    }
*/
    return true;
};


/**
 * Invoked after a menuitem has been clicked and the default behavior has occurred.
 * @public
 * @memberOf hwc
 */
hwc.customAfterMenuItemClick = function(screen, menuItem) {
};

/**
 * Invoked before a screen's contents are persisted to the Mobile Workflow message.
 * User can return false to prevent the default behaviour from occurring.
 * @public
 * @memberOf hwc
 */
hwc.customBeforeSave = function(screen) {
    return true;
};

/**
 * Invoked after a screen's contents are persisted to the Mobile Workflow message through the default logic.
 * @public
 * @memberOf hwc
 */
hwc.customAfterSave = function(screen) {
};

/**
 * Invoked when the contents of a screen need to be validated.
 * User can return false to indicate that the contents of the screen are not valid.
 * @public
 * @memberOf hwc
 */
hwc.customValidateScreen = function(screenKey, values) {
/*
    var rc = true;
    if (screenKey === "Create")
    {
        var form = document.forms[screenKey + "Form"];
        if (form)
        {
            var cost = form.ExpenseTracking_create_itemCost_paramKey.value;
            var LName = form.ExpenseTracking_create_lastName_paramKey.value;
            if (cost > 500 && (LName === "van Leeuwen")) {
                var helpElem = document.getElementById(screenKey + "_" + controlKey + "_help");
                hwc.setValidationText(helpElem, "Sorry Dan, you are on a short leash with the company credit card.");
                return false;
            }
        }
    }
*/
    return true;
};

/**
 * Invoked after data is received from the server. This allows you to view and manipulate the data.
 * @public
 * @memberOf hwc
 */
hwc.customAfterDataReceived = function(incomingDataMessage) {
/*
    //  this example shows the manipulation of a dropdown list
    //  with datetime values being parsed to only date values.

    //  get the values from incoming data
    var mvc = incomingDataMessage.getValues();
    if (mvc) {
        //  look up specific messagevalue
        var deptid = narrowTo(mvc, "_options.dept_id");
        if (deptid) {
            //  get its data value
            var deptidVal = deptid.value;

            //  in this case it is a dropdown list, the display/data values are separated by $
            var idx1 = deptidVal.indexOf("$");
            var deptidVal1 = deptidVal.substring(0,idx1);
            var deptidVal2 = deptidVal.substring(idx1+1);

            var idx2 = deptidVal1.indexOf(" ");
            var deptIDDisp1 = deptidVal1.substring(0,idx2);

            idx2 = deptidVal2.indexOf(" ");
            var deptIDDisp2 = deptidVal2.substring(0,idx2);

            var newVal = deptIDDisp1 + "$" + deptIDDisp2;
            //  set the new value back in the data values collection
            mvc.setKey( "_options.dept_id" );
            mvc.setState("update");
            deptid.setValue(newVal);
            mvc.add( "_options.dept_id", deptid);
        }
    }
*/
};

//This method is called at the end of the method updateUIFromMessageValueCollection
/**
 * @public
 * @memberOf hwc
 */
hwc.customAfterUpdateUI = function(screenKey) {
};

/**
 * Called before the incoming data message is processed
 * @param incomingDataMessage The incoming data message string
 * @param loading If true, this is being called while the application is loading
 * @param fromActivationFlow If true, this is being called from within an activation flow
 * @param dataType If supplied, the data type of the value display on target screen
 * @returns True if normal application message processing should continue
 * @public
 * @memberOf hwc
 */
hwc.customBeforeProcessDataMessage = function(incomingDataMessage, loading, fromActivationFlow, dataType) {
    return true;
};

/**
 * Called after the incoming data message is processed
 * @param incomingDataMessage The incoming data message string
 * @param loading If true, this is being called while the application is loading
 * @param fromActivationFlow If true, this is being called from within an activation flow
 * @param dataType If supplied, the data type of the value display on target screen
 * @public
 * @memberOf hwc
 */
hwc.customAfterProcessDataMessage = function(incomingDataMessage, loading, fromActivationFlow, dataType) {
};

/**
 * Invoked when a native error is reported on. Return false to prevent the default behavior from executing 
 * (bringing up an alert dialog)
 * @public
 * @memberOf hwc
 */
hwc.customBeforeReportErrorFromNative = function(errorString) {
/*
    var callbackMethod = hwc.getURLParamFromNativeError("onErrorCallback", errorString);
    var errorCode      = hwc.getURLParamFromNativeError("errCode", errorString);
    var onErrorMsg     = hwc.getURLParamFromNativeError("onErrorMsg", errorString);
    var nativeMsg      = hwc.getURLParamFromNativeError("nativeErrMsg", errorString);
    if (onErrorMsg || nativeMsg) {
        hwc.close();
    }
*/
    return true;
};

/**
 * Invoked after a native error is reported.
 * @public
 * @memberOf hwc
 */
hwc.customAfterReportErrorFromNative = function(errorString) {
};

// Camera and picture methods.

/**
 * Use this method to get a picture URI from the camera for submission to the workflow message.
 * @public
 * @memberOf hwc
 */
hwc.customGetPictureURIFromCamera = function() {
	hwc.getPicture(hwc.customGetPictureError, 
	           hwc.customGetPictureURISuccess, 
	           { sourceType:      hwc.PictureOption.SourceType.CAMERA,
                 destinationType: hwc.PictureOption.DestinationType.IMAGE_URI}
               );
};

/**
 * Use this method to get a picture URI from the photo library for submission to the workflow message.
 * @public
 * @memberOf hwc
 */
hwc.customGetPictureURIFromLibrary = function() {
	hwc.getPicture(customGetPictureError, 
	           customGetPictureURISuccess, 
	           { sourceType:      hwc.PictureOption.SourceType.PHOTOLIBRARY,
                 destinationType: hwc.PictureOption.DestinationType.IMAGE_URI}
               );
};

/**
 * This callback handles getPictureURI success and inserts a new MessageValue with the URI into the server data message.
 * Set the key value appropriately
 * @public
 * @memberOf hwc
 */
hwc.customGetPictureURISuccess = function(fileName, imageURI ){
	var pictureURIValue = new MessageValue();
	pictureURIValue.setKey("");					// Must be set by the user.
	pictureURIValue.setValue(imageURI);
	pictureURIValue.setType(MessageValueType.FILE);
	var mvc = hwc.getDataMessage().getValues();
	if( mvc ) {
		mvc.add( pictureURIValue.getKey(), pictureURIValue );
		hwc.getDataMessage().setHasFileMessageValue(true);			// Must be set when using the URI option.
		// Add a message value for the MIME type of the image if desired.
		//var mimeType = getMimeType(fileName);
		//var mimeMessageValue = new MessageValue();
		//mimeMessageValue.setKey("");				// Must be set by the user.
		//mimeMessageValue.setValue(mimeType);
		//mimeMessageValue.setType(MessageValueType.TEXT);
		//mvc.add(mimeMessageValue.getKey(), mimeMessageValue);
	}	
};

/**
 * Use this method to get picture data from the camera for submission in the server data message.<br/><br/>
 * NOTE: the picture data length can be too large for the data payload.
 * @public
 * @memberOf hwc
 */
hwc.customGetPictureDataFromCamera = function(){
	hwc.getPicture(hwc.customGetPictureError, 
	           hwc.customGetPictureDataSuccess, 
	           { sourceType:      hwc.PictureOption.SourceType.CAMERA,
                 destinationType: hwc.PictureOption.DestinationType.IMAGE_DATA}
               );
};

/**
 * Use this method to get picture data from the photo library for submission in the server data message.<br/><br/>
 * NOTE: the picture data length can be too large for the data payload.
 * @public
 * @memberOf hwc
 */
hwc.customGetPictureDataFromLibrary = function(){
	hwc.getPicture(hwc.customGetPictureError, 
			hwc.customGetPictureDataSuccess, 
	           { sourceType:      hwc.PictureOption.SourceType.PHOTOLIBRARY,
                 destinationType: hwc.PictureOption.DestinationType.IMAGE_DATA}
               );
};

/**
 * This callback handles getPictureData success and inserts a new MessageValue with the image data
 * into with the server data message. <br/><br/>
 * NOTE: it is possible that this image data is too long for the payload message.<br/>
 * Set the key value appropriately.
 * @public
 * @memberOf hwc
 */
hwc.customGetPictureDataSuccess = function(fileName, imageData ){
	var pictureDataValue = new MessageValue();
	pictureDataValue.setKey("");					// Must be set by the user.
	pictureDataValue.setValue(imageData);
	pictureDataValue.setType(MessageValueType.TEXT);
	var mvc = hwc.getDataMessage().getValues();
	if( mvc ) {
		mvc.add( pictureDataValue.getKey(), pictureDataValue );
		// Add a message value for the MIME type of the image if desired.
		//var mimeType = getMimeType(fileName);
		//var mimeMessageValue = new MessageValue();
		//mimeMessageValue.setKey("");				// Must be set by the user.
		//mimeMessageValue.setValue(mimeType);
		//mimeMessageValue.setType(MessageValueType.TEXT);
		//mvc.add(mimeMessageValue.getKey(), mimeMessageValue);
	}	
};

/**
 * Invoked after an error is reported.
 * @public
 * @memberOf hwc
 */
hwc.customGetPictureError = function(result){
	alert("customGetPictureError result: " + result);
};

/**
 * A helper method that allows you to include the MIME data type in the workflow message.
 * @public
 * @memberOf hwc
 */
hwc.getMimeType = function(fileName) {
	var lastPeriod = fileName.lastIndexOf(".");
	var extension = fileName.substr(lastPeriod + 1);
	if (extension === "jpg") {
		extension = "jpeg";
	}
	var mimeType = "image/" + extension;
	return mimeType;
};

/**
 * Allows the user to override how a given line in a listview will be constructed
 * @param listview The listview
 * @param rowNumber The index of the row
 * @param lineNumber The index of the line
 * @param fields An array of field metadata (name, dataType, static, height, width, font)
 * @param data The list MessageValue this listview is associated with. Its value will be an array of MessageValueCollection.
 * @param isForHeader A boolean indicating whether this is a line in the listview header, or in a normal row
 * @param wrapData A boolean indicating whether or not the developer indicated that they want the values wrapped in PRE and CODE nodes
 * @returns The content of the listview line, if supplied
 * @public
 * @memberOf hwc
 */
hwc.customCreateListviewLineContent = function(listview, rowNumber, lineNumber, fields, data, isForHeader, wrapData) {
    return null;
};

/**
 * Use this method to customize how listview dividers break.
 * The method receives the listview line (line) which contains the fields,
 * and listValues which contains the field values.  The commented example
 * shows how to access the data.
 * If the listview should generate a divider, return true and set fieldValue to the divider display value 
 * @public
 * @memberOf hwc
 */
hwc.customShouldGenerateListViewDivider = function(line, listValues, fieldValue) {

    fieldValue.displayValue = "<set this to a display value for the divider>";
/*
    //  test fields within the line
    var lastName = line[0];  
    var firstName = line[1];  
    var department = line[2];
    
    var deptData = (listValues) ? listValues.getData(department.id) : listValues;
    var deptDataStr = deptData.value.toString();
    if (deptDataStr.indexOf("Quality") > -1)
    {
        fieldValue.displayValue = "Quality is JOB 1!";
        return true;
    }
*/
    return false;  //  return true, if this line should generate a divider, otherwise return false
};

/**
 * @public
 * @memberOf hwc
 */
hwc.customBeforeArrangeMAChart = function(screenName, chartNames, column, row) {
	return { w: -1, h: -1, columns:column, rows:row };
};

/**
 * @public
 * @memberOf hwc
 */
hwc.customAfterInitiateMAChart = function(chartObj, screenName, chartName) {
};

/**
 * @public
 * @memberOf hwc
 */
hwc.customBeforeMaximizeMASplitChart = function(chartObj, screenName, chartName) {
	//if return false customAfterMaximizeMASplitChart will not be called
    return true;
};

/**
 * @public
 * @memberOf hwc
 */
hwc.customAfterMaximizeMASplitChart = function(chartObj, screenName, chartName) {
/*
 * If using the expander control on Split View style charts, you must code something to happen 
 * when the expander is clicked. Here is example code that checks which chart's expander was 
 * clicked, and then navigates to an appropriate screen as a result.  In order for this to work, 
 * you must return true from hwc.customBeforeMaximizeMASplitChart
   if (chartName === 'One') {
       hwc.navigateForward('TestScreen1');
   }
   else if (chartName === 'Two') {
       hwc.navigateForward('TestScreen2');
   }
*/
};

/**
 * @public
 * @memberOf hwc
 */
hwc.customBeforeExecuteMAQuery = function(chartObj, name, args) {
	//if return false customAfterExecuteMAQuery will not be called
    return true;
};

/**
 * @public
 * @memberOf hwc
 */
hwc.customAfterExecuteMAQuery = function(chartObj, name, args) {
	//execute custom query here
/*	
	var dataTable; 
	if (name == "1_year_revenue")
		dataTable = get1YearRevenueData();
	else if (name == "1_year_revenue_by_product")
		dataTable = get1YearRevenueByProductData();
	else if (name == "storeRevenueByQuarter")
		dataTable = getStoreRevenueByQuarterData(args);
	else if (name == "storeRevenueByMonth")
		dataTable = getStoreRevenueByMonthData(args);
	
	chartObj.setDataTable(dataTable);
*/
};

})(hwc, window);

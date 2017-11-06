/*
 * Sybase Hybrid App version 2.2.2
 * 
 * HybridApp.js
 * This file will be regenerated, so changes made herein will be removed the
 * next time the hybrid app is regenerated. It is therefore strongly recommended
 * that the user not make changes in this file.
 * 
 * The template used to create this file was compiled on Mon Jan 21 21:59:22 EST 2013
 *
 * Copyright (c) 2012 Sybase Inc. All rights reserved.
 */

/**
 * @namespace The namespace for the Hybrid Web Container javascript
 */
hwc = (typeof hwc === "undefined" || !hwc) ? {} : hwc;            // SUP 'namespace'



function menuItemCallbackStartCancel() {
    if (!hwc.customBeforeMenuItemClick('Start', 'Cancel')) {
        return;
    }
    doCancelAction();
    hwc.customAfterMenuItemClick('Start', 'Cancel');
}


function menuItemCallbackStartSelect_CityMenuItemKey() {
    if (!hwc.customBeforeMenuItemClick('Start', 'Select_CityMenuItemKey')) {
        return;
    }
    hwc.navigateForward('GetCityWeatherByZIP');
    hwc.customAfterMenuItemClick('Start', 'Select_CityMenuItemKey');
}


function menuItemCallbackWeather_ConditionsBack() {
    if (!hwc.customBeforeMenuItemClick('Weather_Conditions', 'Back')) {
        return;
    }
    doSaveAction();
    hwc.customAfterMenuItemClick('Weather_Conditions', 'Back');
}
function menuItemCallbackWeather_ConditionsCancel() {
    if (!hwc.customBeforeMenuItemClick('Weather_Conditions', 'Cancel')) {
        return;
    }
    doCancelAction();
    hwc.customAfterMenuItemClick('Weather_Conditions', 'Cancel');
}


function menuItemCallbackGetCityWeatherByZIPCurrentWeatherMenuItem() {
    if (!hwc.customBeforeMenuItemClick('GetCityWeatherByZIP', 'CurrentWeatherMenuItem')) {
        return;
    }
    var rmiKeys = [];
    var rmiKeyTypes = [];
    var rmiInputOnlyKeys = [];
    var rmiInputOnlyKeyTypes = [];
    rmiKeys[0] = 'Enter_ZipEditBoxKey';
    rmiKeyTypes[0] = 'TEXT';
    rmiInputOnlyKeys[0] = 'Enter_ZipEditBoxKey';
    rmiInputOnlyKeyTypes[0] = 'TEXT';
    var dataMessageToSend = hwc.getMessageValueCollectionForOnlineRequest('GetCityWeatherByZIP', 'CurrentWeatherMenuItem', rmiKeys, rmiKeyTypes);
    var inputOnlyDataMessageToSend = hwc.getMessageValueCollectionForOnlineRequest('GetCityWeatherByZIP', 'CurrentWeatherMenuItem', rmiInputOnlyKeys, rmiInputOnlyKeyTypes);
    if (hwc.validateScreen('GetCityWeatherByZIP', hwc.getCurrentMessageValueCollection(), rmiKeys) && 
        hwc.saveScreens(true)) {
        hwc.doOnlineRequest('GetCityWeatherByZIP', 'CurrentWeatherMenuItem', 60, 0, '', null, dataMessageToSend, inputOnlyDataMessageToSend.serializeToString());
    }
    hwc.customAfterMenuItemClick('GetCityWeatherByZIP', 'CurrentWeatherMenuItem');
}


function menuItemCallbackGetCityWeatherByZIPCancel() {
    if (!hwc.customBeforeMenuItemClick('GetCityWeatherByZIP', 'Cancel')) {
        return;
    }
    doCancelAction();
    hwc.customAfterMenuItemClick('GetCityWeatherByZIP', 'Cancel');
}

function doAddRowAction() {
    var mvc = hwc.getCurrentMessageValueCollection();
    var listview = hwc.getListviewMessageValue();
    if (listview) {
        var childMVC = new MessageValueCollection();
        var key = guid();
        childMVC.setKey(key);
        childMVC.setState("new");
        childMVC.setParent(listview.getKey());
        childMVC.setParentValue(listview);
        listview.getValue().push(childMVC);
        console.log(workflowMessage.serializeToString());
        if (hwc.validateScreen(hwc.getCurrentScreen(), mvc)) {
            listViewValuesKey.pop();
            listViewValuesKey.push(childMVC.getKey());
            currentMessageValueCollection.pop();
            currentMessageValueCollection.push(childMVC);
            doListviewAddRowAction();
            console.log(workflowMessage.serializeToString());
        }
    }
}

function doCreateKeyCollectionAction(addScreen) {
    var mvc = hwc.getCurrentMessageValueCollection();
    var relationKey = hwc.getListViewKey(hwc.getCurrentScreen());
    var mv = mvc.getData(relationKey);
    var childMVC = new MessageValueCollection();
    var key = guid();
    childMVC.setKey(key);
    childMVC.setState("new");
    childMVC.setParent(mv.getKey());
    childMVC.setParentValue(mv);
    mv.getValue().push(childMVC);
    hwc.setDefaultValues(addScreen);
    // collect default values from the addScreen
    hwc.updateMessageValueCollectionFromUI(childMVC, addScreen);
    hwc.navigateForward(addScreen, childMVC.getFullKey());
}

function doListviewAddRowAction(listKey) {
    var mvc = hwc.getCurrentMessageValueCollection(listKey);
    if (mvc.getState() === "new") {
        // this action is triggered after AddRow action
        if (hwc.validateScreen(hwc.getCurrentScreen(), mvc)) {
            mvc.setState("add");
            doSaveAction(false);
        }
    }
}

function doListviewUpdateRowAction(listKey) {
    var mvc = hwc.getCurrentMessageValueCollection(listKey);
    if (hwc.validateScreen(hwc.getCurrentScreen(), mvc)) {
        if (mvc.getState() !== "add") {
            mvc.setState("update");            
        }
        doSaveAction(false);
    }
}

function doListviewDeleteRowAction(listKey) {
    var mvc = hwc.getCurrentMessageValueCollection(listKey);
    if (hwc.validateScreen(hwc.getCurrentScreen(), mvc)) {
        if (mvc.getState() !== "add") {
            mvc.setState("delete");            
            doSaveAction(false);
        }
        else {
            var valuesArray = mvc.getParentValue().getValue();
            for (var i = 0; i < valuesArray.length; i++) {
                if (valuesArray[i] == mvc) {
                    valuesArray.splice(i, 1);
                }
            }
            hwc.navigateBack(true);
            hwc.updateUIFromMessageValueCollection(hwc.getCurrentScreen(), hwc.getCurrentMessageValueCollection());
        }        
    }
}

function doSaveActionWithoutReturn() {
   doSaveAction();
   return;
}

function doSaveAction(needValidation) {
    if (!hwc.getPreviousScreen()) {
        if(hwc.saveScreen(hwc.getCurrentMessageValueCollection(), hwc.getCurrentScreen(), needValidation)) {
            hwc.doSubmitWorkflow(hwc.getCurrentScreen(), "Save", '', '');
            return false;
        }
        return true;
    }
    if(hwc.saveScreen(hwc.getCurrentMessageValueCollection(), hwc.getCurrentScreen(), needValidation)) {
        hwc.navigateBack(false, false);
        hwc.updateUIFromMessageValueCollection(hwc.getCurrentScreen(), hwc.getCurrentMessageValueCollection());
        return true;
    }
    return false;
}

function doCancelAction() {
    if (!hwc.getPreviousScreen()) {
        closeWorkflow();
        return;
    }
    
    var mvc = hwc.getCurrentMessageValueCollection();
    hwc.navigateBack(true);
    var mvc1 = hwc.getCurrentMessageValueCollection();
    
    //if we are moving onto a listview screen we should delete any newly added rows
    if (mvc != mvc1) {
        //find the items of the listview and if any of them are marked as new, delete them.
        var messValues = mvc1.getValues();
        for (var i = 0; i < messValues.length; i++) {
            if (messValues[i].getType() === "LIST") {
                var listViewValuesArray = messValues[i].getValue()
                for (var j = 0; j < listViewValuesArray.length; j++) {
                    if (listViewValuesArray[j].getState() === "new") {
                        listViewValuesArray.splice(j, 1);
                        j--;
                    }
                }
            }        
        }
        hwc.updateUIFromMessageValueCollection(hwc.getCurrentScreen(), hwc.getCurrentMessageValueCollection());
    }
    else if (mvc.getState() === "update") {
        mvc.setState("");
    }
}

function customNavigationEntry() {
    this.condition;
    this.screen;
}
function customNavigationEntry( a_condition, a_screen ) {
    this.condition = a_condition;
    this.screen = a_screen;
}

/**
 * For the specific pair - screen named 'currentScreenKey' and the action 'actionName', return
 * the list of custom navigation condition-names and their destination screens.
 */
function getCustomNavigations( currentScreenKey, actionName )  {
    var customNavigations = new Array();
    return customNavigations;
}

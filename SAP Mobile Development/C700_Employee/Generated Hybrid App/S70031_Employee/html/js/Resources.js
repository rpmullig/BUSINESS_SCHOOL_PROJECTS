/*
 * Sybase Hybrid App version 2.2.2
 * 
 * Resources.js
 * This file will be regenerated, so changes made herein will be removed the
 * next time the hybrid app is regenerated. It is therefore strongly recommended
 * that the user not make changes in this file.
 * 
 * The template used to create this file was compiled on Mon Jan 21 21:59:22 EST 2013
 *
 * Copyright (c) 2012 Sybase Inc. All rights reserved.
 */
  
function Resources(currentLocaleNameIn) {
	this.currentLocaleName = currentLocaleNameIn;
    
	this.resources = [];
}

Resources.prototype.hasLocale = function(localeName) {
    return this.resources[localeName];
};

Resources.prototype.getStringFromLocale = function(key, localeName) {
	return this.resources[localeName][key];
};
 
Resources.prototype.getString = function(key) {
	return this.getStringFromLocale(key, this.currentLocaleName);
};

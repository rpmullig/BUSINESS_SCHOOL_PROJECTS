/*
 * Sybase Hybrid App version 2.2
 *
 * Timezone.js
 * This file will not be regenerated, so it is possible to modify it, but it
 * is not recommended.
 *
 * Copyright (c) 2012 Sybase Inc. All rights reserved.
 */

/**
* @namespace
*/
hwc = (typeof hwc === "undefined" || !hwc) ? {} : hwc;      // SUP 'namespace'

(function(hwc, window, undefined) {

/**
 * Returns the current locale. The platform's locale string should be available. However, if it is
 * missing the function queries available JavaScript APIs for a suitable value.
 * @memberOf hwc
 * @public
 * @return {String} Returns a string containing the current locale, or null if it is not available.
 * @feature Timezone
 * @example
 * var sLocale = hwc.getCurrentLocale();
 *
 */
hwc.getCurrentLocale = function() {
    if(hwc.lang) {
        return hwc.lang;
    }
    else {
       if ( navigator ) {
            if ( navigator.language ) {
                if (hwc.isAndroid()) {
                    return navigator.userAgent.match(/Android \d+(?:\.\d+){1,2}; [a-z]{2}-[a-z]{2}/).toString().match(/[a-z]{2}-[a-z]{2}/).toString();
                }
                else {
                    return navigator.language;
                }
            }
            else if ( navigator.browserLanguage ) {
                return navigator.browserLanguage;
            }
            else if ( navigator.systemLanguage ) {
                return navigator.systemLanguage;
            }
            else if ( navigator.userLanguage ) {
                return navigator.userLanguage;
            }
        }
    }
};

/**
 * Returns a localized representation of the given Date object. Queries the platform OS for a locale-
 * formatted date/time string.
 * @param {Date} date Date to be localized, initialized to some valid time.
 * @return {String} Returns a localized date/time string, or undefined if platform is unsupported.
 * @feature Timezone
 * @memberOf hwc
 * @public
 * @example
 * var sDT = hwc.getLocalizedDateTime( date );
 *
 */
hwc.getLocalizedDateTime = function( date ) {
    var result, dMilliseconds, sTzId, response;
    if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("entering getLocalizedDateTime", "DEBUG", false); }
    if (hwc.isAndroid()) {
        dMilliseconds = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds() );
        sTzId = _HWC.getLocalizedDateTime( dMilliseconds )+ '';
        result = sTzId;
    }
    else if (hwc.isWindowsMobile()) {
        // Feature was not needed on this platform
        result = undefined;
    }
    else if (hwc.isIOS()) {
        dMilliseconds = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds() );
        response = hwc.getDataFromContainer("tz", "&command=tzdatetime&time=" + dMilliseconds);
        result = (response);
    }
    else if (hwc.isBlackBerry()) {
        dMilliseconds = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds() );
        sTzId = TimeZone.tzdatetime( dMilliseconds );
        result = sTzId;
    }
    else {
        result = undefined;
    }
    if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("exiting getLocalizedDateTime", "DEBUG", false); }
    return result;
};

/**
 * Returns a localized representation of the given Date object. Queries the platform OS for a locale-
 * formatted date string.
 * @param {Date} date Date to be localized, initialized to some valid time.
 * @return {String} Returns a localized date string, or undefined if platform is unsupported.
 * @feature Timezone
 * @memberOf hwc
 * @public
 * @example
 * var sD = hwc.getLocalizedDate( date );
 *
 */
hwc.getLocalizedDate = function( date ) {
    var dMilliseconds, sTzId, response, result;
    if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("entering getLocalizedDate", "DEBUG", false); }
    if (hwc.isAndroid()) {
        dMilliseconds = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0 );
        sTzId = _HWC.getLocalizedDate( dMilliseconds ) + '';
        result = sTzId;
    }
    else if (hwc.isWindowsMobile()) {
        // Feature was not needed on this platform
        result = undefined;
    }
    else if (hwc.isIOS()) {
        dMilliseconds = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0 );
        response = hwc.getDataFromContainer("tz", "&command=tzdate&time=" + dMilliseconds);
        result = (response);
    }
    else if (hwc.isBlackBerry()){
        dMilliseconds = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0 );
        sTzId = TimeZone.tzdate( dMilliseconds );
        result = sTzId;
    }
    else {
        result = undefined;
    }
    if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("exiting getLocalizedDate", "DEBUG", false); }
    return result;
};

/**
 * Returns a localized representation of the given Date object. Queries the platform OS for a locale-
 * formatted time string.
 * @param {Date} date Date to be localized, initialized to some valid time.
 * @return{String} Returns a localized time string, or undefined if platform is unsupported.
 * @feature Timezone
 * @memberOf hwc
 * @public
 * @example
 * var sT = hwc.getLocalizedTime( date );
 *
 */
hwc.getLocalizedTime = function( date ) {
    var dMilliseconds, sTzId, response, result;
    if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("entering getLocalizedTime", "DEBUG", false); }
    if (hwc.isAndroid()) {
        dMilliseconds = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds() );
        sTzId = _HWC.getLocalizedTime( dMilliseconds ) + '';
        result = sTzId;
    }
    else if (hwc.isWindowsMobile()) {
        // Feature was not needed on this platform
        result = undefined;
    }
    else if (hwc.isIOS()) {
        dMilliseconds = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds() );
        response = hwc.getDataFromContainer("tz", "&command=tztime&time=" + dMilliseconds);
        result = (response);
    }
    else if (hwc.isBlackBerry()){
        dMilliseconds = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds() );
        sTzId = TimeZone.tztime( dMilliseconds );
        result = sTzId;
    }
    else if (hwc.isWindows()){
        // For debugging on a browser of windows platform
        result = date.toString();
    }
    else {
        result = undefined;
    }
    if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("exiting getLocalizedTime", "DEBUG", false); }
    return result;
};

/**
 * Converts the given Date object to the device's local time, and returns the new Date.
 * @param {Date} date Date to be converted, initialized to some valid UTC time.
 * @return {Date} Returns the converted Date object.
 * @feature Timezone
 * @memberOf hwc
 * @public
 * @example
 * var localDate = hwc.convertUtcToLocalTime( date );
 *
 */
hwc.convertUtcToLocalTime = function( date )
{
    var iMilliseconds, totalOffsetInMinutes, time, localDate;
    iMilliseconds = date.valueOf();
    totalOffsetInMinutes = hwc.getOffsetFromUTC( date );
    totalOffsetInMinutes = totalOffsetInMinutes * 60000;
    time = iMilliseconds + totalOffsetInMinutes;
    localDate = new Date();
    localDate.setTime( time );
    return localDate;
};

/**
 * Converts the given Date object to UTC time, and returns the new Date.
 * @param {Date} date Date to be converted, initialized to some valid local time.
 * @return {Date} Returns the converted Date object.
 * @feature Timezone
 * @memberOf hwc
 * @public
 * @example
 * var utcDate = hwc.convertLocalTimeToUtc( date );
 *
 */
hwc.convertLocalTimeToUtc = function( date )
{
    var iMilliseconds, totalOffsetInMinutes, time, utcDate;
    iMilliseconds = date.valueOf();
    totalOffsetInMinutes = hwc.getOffsetFromUTC( date );
    totalOffsetInMinutes = totalOffsetInMinutes * 60000;
    time = iMilliseconds - totalOffsetInMinutes;
    utcDate = new Date();
    utcDate.setTime( time );
    return utcDate;
};

/**
 * Returns the total offset (difference) between the given "local" time and UTC including any daylight
 * savings offsets if applicable. Example: if the device was in London timezone (Gmt +1) and it is
 * currently practicing DST, the function would return "120": 60 minutes normal offset plus 60 minutes
 * for its daylight savings offset.
 * @param {Date} date Date at which time to determine offset, initialized to some valid time.
 * @return {int} Returns the GMT offset in minutes.
 * @feature Timezone
 * @memberOf hwc
 * @public
 * @example
 * var totalOffset = hwc.getOffsetFromUTC(date);
 *
 */
hwc.getOffsetFromUTC = function( date )
{
    var lMilliseconds, iMilliseconds, iMinutesOffset, response, dt,
        year,month, day, hour, minute, second, request, d,
        dMilliseconds, result;
        
    if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("entering getOffsetFromUTC", "DEBUG", false); }
    if (hwc.isAndroid()) {
        lMilliseconds = date.getTime();
        iMinutesOffset = _HWC.getOffsetFromUTC(lMilliseconds);
        result = iMinutesOffset;
    }
    else if (hwc.isWindows()) {
        dt = new Date();
        iMinutesOffset = dt.getTimezoneOffset() * (-1);
        result = iMinutesOffset;
    }
    else if (hwc.isWindowsMobile())
    {
        // JavaScript's Date and WM's DateTime objects differs in their base starting time
        // and definition.  It was necessary to pass a "time" to the OS - see below comment
        lMilliseconds = date.getTime();
        // Rather than pass a date string (which might be in a different locale format)
        // the raw parameters of the particular "date" are sent
        // this also avoids a date string parse on the OS side.
        year = date.getFullYear();
        month = date.getMonth() + 1;
        day = date.getDate();
        hour = date.getHours();
        minute = date.getMinutes();
        second = date.getSeconds();
        request = "utcoffset=utcoffset&";
        request += "year=";
        request += year.toString();
        request += "&";
        request += "month=";
        request += month.toString();
        request += "&";
        request += "day=";
        request += day.toString();
        request += "&";
        request += "hour=";
        request += hour.toString();
        request += "&";
        request += "minute=";
        request += minute.toString();
        request += "&";
        request += "second=";
        request += second.toString();

          response = hwc.postDataToContainer("tz", request);
          d = response * 1;
          iMinutesOffset = d;

        result = iMinutesOffset;
    }
    else if (hwc.isBlackBerry()){
        dMilliseconds = date.getTime();
        iMinutesOffset = TimeZone.totaloffset(dMilliseconds);
        result = iMinutesOffset;
    }
    else if (hwc.isIOS()) {
        lMilliseconds = date.getTime();
        result = hwc.getDataFromContainer("tz", "&command=utcoffset&time=" + lMilliseconds);
    }
    else {
        result = undefined;
    }
    if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("exiting getOffsetFromUTC", "DEBUG", false); }
    return result;
};

/**
 * Returns whether daylight savings rules are in effect for the current timezone at the given time.
 * @param {Date} date Date at which to determine whether daylight savings is in effect.
 * @return {Boolean} Returns true iff daylight savings rules are in effect at the given time in the
 * current timezone.
 * @feature Timezone
 * @memberOf hwc
 * @public
 * @example
 * var isAwareAtTime = hwc.isDstActiveAtGivenTime(date);
 *
 */
hwc.isDstActiveAtGivenTime = function( date )
{
    var lMilliseconds, iMilliseconds, iMinutesOffset, response, dt,
        year,month, day, hour, minute, second, request, d,
        dMilliseconds, result;
    if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("entering isDstActiveAtGivenTime", "DEBUG", false); }
    if (hwc.isAndroid()) {
        iMilliseconds = date.getTime();
        result = _HWC.isDstActiveAtGivenTime(iMilliseconds);
    }
    else if (hwc.isWindowsMobile())
    {
        // JavaScript's Date and WM's DateTime objects differs in their base starting time
        // and definition.  It was necessary to pass a "time" to the OS - see below comment
        lMilliseconds = date.getTime();
        // Rather than pass a date string (which might be in a different locale format)
        // the raw parameters of the particular "date" are sent
        // this also avoids a date string parse on the OS side.
        request = "indst=indst&";
        response = undefined;
        year = date.getFullYear();
        month = date.getMonth() + 1;
        day = date.getDate();
        hour = date.getHours();
        minute = date.getMinutes();
        second = date.getSeconds();

        request += "year=";
        request += year.toString();
        request += "&";
        request += "month=";
        request += month.toString();
        request += "&";
        request += "day=";
        request += day.toString();
        request += "&";
        request += "hour=";
        request += hour.toString();
        request += "&";
        request += "minute=";
        request += minute.toString();
        request += "&";
        request += "second=";
        request += second.toString();

        response = hwc.postDataToContainer("tz", request);

        result = (response === 'true');
    }
    else if (hwc.isBlackBerry()){
        dMilliseconds = date.getTime();
        result = TimeZone.indst(dMilliseconds);
    }
    else if (hwc.isIOS()) {
        lMilliseconds = date.getTime();
        response = hwc.getDataFromContainer("tz", "&command=indst&time=" + lMilliseconds);
        result = (hwc.parseBoolean(response));
    }
    else {
        result = false;
    }
    if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("exiting isDstActiveAtGivenTime", "DEBUG", false); }
    return result;
};

/**
 * Returns the daylight savings offset in minutes for the current timezone at the given time.
 * Example: for Mountain Standard Time, at March 31st (currently is practicing DST), the returned offset is 60.
 * Example: for Mountain Standard Time, at November 31st (currently is not practicing DST), the returned offset is 0.
 * @param {Date} date Date at which to determine daylight savings offset.
 * @return {int} Returns the number of minutes offset for daylight savings for the current
 * timezone and at the given Date, or 0 if the current timezone doesn't practice daylight savings.
 * @feature Timezone
 * @memberOf hwc
 * @public
 * @example
 * var iDstOffsetAtTime = hwc.getDstOffsetAtGivenTimeInMinutes(date);
 *
 */
hwc.getDstOffsetAtGivenTimeInMinutes = function ( date )
{
    var lMilliseconds, iMilliseconds, iMinutesOffset, response, dt,
        year,month, day, hour, minute, second, request, d,
        dMilliseconds, result;
        
    if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("entering getDstOffsetAtGivenTimeInMinutes", "DEBUG", false); }
    if (hwc.isAndroid()) {
        iMilliseconds = date.getTime();
        iMinutesOffset = _HWC.getDstOffsetAtGivenTimeInMinutes(iMilliseconds);
        result = iMinutesOffset;
    }
    else if (hwc.isWindowsMobile())
    {
        // JavaScript's Date and WM's DateTime objects differs in their base starting time
        // and definition.  It was necessary to pass a "time" to the OS - see below comment
        lMilliseconds = date.getTime();
        // Rather than pass a date string (which might be in a different locale format)
        // the raw parameters of the particular "date" are sent
        // this also avoids a date string parse on the OS side.
        request = "dstoffset=dstoffset&";
        year = date.getFullYear();
        month = date.getMonth() + 1;
        day = date.getDate();
        hour = date.getHours();
        minute = date.getMinutes();
        second = date.getSeconds();

        request += "year=";
        request += year.toString();
        request += "&";
        request += "month=";
        request += month.toString();
        request += "&";
        request += "day=";
        request += day.toString();
        request += "&";
        request += "hour=";
        request += hour.toString();
        request += "&";
        request += "minute=";
        request += minute.toString();
        request += "&";
        request += "second=";
        request += second.toString();

        response = hwc.postDataToContainer("tz", request);
        d = response * 1;
        iMinutesOffset = d;

        result = iMinutesOffset;
    }
    else if (hwc.isBlackBerry()){
        dMilliseconds = date.getTime();
        iMinutesOffset = TimeZone.dstoffset(dMilliseconds);
        result = iMinutesOffset;
    }
    else if (hwc.isIOS()) {
        lMilliseconds = date.getTime();
        response = hwc.getDataFromContainer("tz", "&command=dstoffset&time=" + lMilliseconds);
        result = parseInt(response, 10);
    }
    else {
        result = undefined;
    }
    if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("exiting getDstOffsetAtGivenTimeInMinutes", "DEBUG", false); }
    return result;
};

/**
 * Returns a string containing the current Timezone's standard name. The name will not change based
 * on daylight savings periods. The native OS returns the string in the current locale where applicable.
 * Currently this string is derived from using available platform OS APIs. The values for the same
 * timezone will be different among platforms.
 * @return {String} Returns a string containing the current Timezone's standard name.
 * @feature Timezone
 * @memberOf hwc
 * @public
 * @example
 * var sTzId = hwc.getTimezoneId();
 *
 */
hwc.getTimezoneId = function () {
    var sTzId, request, response, result;
    
    if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("entering getTimezoneId", "DEBUG", false); }
    if (hwc.isAndroid()) {
        sTzId = _HWC.getTimezoneId() + '';
        result = sTzId;
    }
    else if (hwc.isWindowsMobile())
    {
        request = "tzid=tzid";
        response = hwc.postDataToContainer("tz", request);
        result = response;
    }
    else if (hwc.isIOS()) {
        response = hwc.getDataFromContainer("tz", "&command=tzid");
        result = (response);
    }
    else if (hwc.isBlackBerry()){
        sTzId = TimeZone.tzid();
        result = sTzId;
    }
    else {
        result = undefined;
    }
    if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("exiting getTimezoneId", "DEBUG", false); }
    return result;
};

/**
 * Returns whether the device's current timezone practices daylight savings. If a device's current
 * timezone never practices daylight savings, this function returns "false". If a device's current
 * timezone practices DST, but DST rules are not currently in effect, function returns "true".
 * @feature Timezone
 * @return {Boolean} Returns true iff the device's current timezone practices daylight savings,
 * irrespective of whether daylight savings is currently in effect.
 * @memberOf hwc
 * @public
 * @example
 * var isDstAware = hwc.getUsesDST();
 *
 */
hwc.getUsesDST = function () {
    var date, lMilliseconds, request, response, result;
    
    if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("entering getUsesDST", "DEBUG", false); }

    if (hwc.isAndroid()) {
        result = _HWC.useDaylightTimeCurrently();
    }
    else if (hwc.isWindowsMobile())
    {
        date = new Date();
        lMilliseconds = date.getTime();
        request = "dstaware=";
        response = undefined;

        request += lMilliseconds.toString();  // left for potential future use

        response = hwc.postDataToContainer("tz", request);
        result = (response === 'true');
    }
    else if (hwc.isIOS()) {
        response = hwc.getDataFromContainer("tz", "&command=dstaware");
        result = hwc.parseBoolean(response);
    }
    else if (hwc.isBlackBerry()){
        result = TimeZone.dstaware();
    }
    if (hwc.getLoggingCurrentLevel() >= 4) { hwc.log("exiting getUsesDST", "DEBUG", false); }
    return result;
};

})(hwc, window);

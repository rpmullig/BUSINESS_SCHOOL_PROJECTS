/*
 * Sybase Hybrid App version 2.2
 *
 * ExternalResource.js
 *
 * This file will not be regenerated, so it is possible to modify it, but it
 * is not recommended.
 *
 * Copyright (c) 2012 Sybase Inc. All rights reserved.
 *
 */
/**
 * @namespace The namespace for the Hybrid Web Container javascript
 */
hwc = (typeof hwc === "undefined" || !hwc) ? {} : hwc;      // SUP 'namespace'

(function() {

    /**
    * Makes an external cross domain request.
    *
    * @public
    * @memberOf hwc
    * @param {String} url The url to make request to
    * @param {anonymous.options} options  a set of key/value pairs that configure the underlying request.
    *
    * @example
    *
    *    var options = {
    *        method: "GET",
    *        data: "data",
    *        async: true,
    *        headers: {
    *            "Content-Type": "text/plain;charset=UTF-8"
    *        },
    *        complete: function(response) {
    *           // invoked when the request completes (asynchronous mode)
    *           if (response.status === 200)
    *               alert("Update successful");
    *           else
    *               alert("Update Failed");
    *       }
    *    };
    *
    *    getExternalResource(url, options);
    *
    */
    hwc.getExternalResource = function(url, options) {
        var key, _options, params=[], queryString, request, callbackSet, jsonOptions, jsonText, xmlhttp;
        // Default options
        _options = {
            method: "GET",
            async: true
            //headers: {},
            //data: '',
            //complete: function() {}
        };

        // Fill in options
        options = options || {};

        for (key in options) {
            _options[key] = options[key];
        }

        options = _options;
        options.method = options.method.toUpperCase();

        if (typeof (options.data) === 'string') {
            params.push(options.data);
        }
        else if (Object.prototype.toString.call(options.data) === '[object Array]') {
            params = options.data;
        }
        else {
            for (key in options.data) {
                params.push(encodeURIComponent(key) + "=" + encodeURIComponent(options.data[key]));
            }
        }

        // Format query string and post data
        queryString = params.join("&");

        if (queryString) {
            if (options.method === "GET") {
                url = url + (url.indexOf("?") === -1 ? '?' : '&') + queryString;
                options.data = "";
            }
            else {
                options.data = queryString;
            }
        }

        // Make request
        if (hwc.isBlackBerry()) {
            request = hwc.getXMLHTTPRequest();
            request.open(options.method, url, options.async);

            if (options.headers) {
                for (key in options.headers) {
                    request.setRequestHeader(key, options.headers[key]);
                }
            }

            request.onreadystatechange = function() {
                if (request.readyState === 4) {
                    handleResponse(options, request);
                }
            };

            request.send(options.data);
        }
        else if (hwc.isAndroid()){
            if (options.async) {
                // Setup callbacks
                callbackSet = new hwc.CallbackSet();
                options.callback = callbackSet.registerCallback("callback", function(response) { handleResponse(options, response); });
            }

            // Create a json string for options
            jsonOptions = JSON.stringify(options);

            jsonText = _HWC.makeExternalRequest(url, jsonOptions) + "";

            if (!options.async && jsonText) {
                handleResponse(options, JSON.parse(jsonText));
            }
        }
        else if (hwc.isWindowsMobile() || hwc.isWindows()) {
            // Create a json string for options
            jsonOptions = JSON.stringify(options);

            try {
                //make xmlhttp request to load the rmi response from server
                xmlhttp = hwc.getXMLHTTPRequest();

                //container always sends the request as synced, javascript sends the request based on
                //caller's choice
                xmlhttp.open("POST", "/sup.amp?querytype=externalresource&" + hwc.versionURLParam, options.async);

                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState === 4) {
                        // Success
                        if (xmlhttp.status === 200) {
                            handleResponse(options, JSON.parse(xmlhttp.responseText));
                        }
                    }
                };

                xmlhttp.send("url=" + encodeURIComponent(url) + "&options=" + encodeURIComponent(jsonOptions));
            }
            catch (ex) {
                alert(ex);
            }
        }
        else if (hwc.isIOS()) {
            // Create a json string for options
            jsonOptions = JSON.stringify(options);

            try {
                //make xmlhttp request to load the rmi response from server
                xmlhttp = hwc.getXMLHTTPRequest();

                //container always sends the request as synced, javascript sends the request based on
                //caller's choice
                xmlhttp.open("GET", "http://localhost/sup.amp?querytype=externalresource&" + hwc.versionURLParam + "&url=" + encodeURIComponent(url) + "&options=" + encodeURIComponent(jsonOptions), options.async);
                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState === 4) {
                        // Success
                        handleResponse(options, JSON.parse(xmlhttp.responseText));
                    }
                };

                xmlhttp.send("");

            }
            catch (err) {
                alert(err);
            }
       }
    };

    /**
    * Internal method to wrap response in a fake xhr
    * @private
    * @param options The options provided for the request
    * @param response The response provided by the container
    */
    function handleResponse(options, response) {
        var fakeXHR = {
            "status": response.status,
            "statusText": response.statusText,
            "responseText": response.responseText,
            "getResponseHeader": function(key) {
                var headerValue, header;

                if (response.getResponseHeader) {
                    headerValue = response.getResponseHeader(key);
                }
                else if (response.headers)
                {
                    for ( header in response.headers) {
                        if ( key.toLowerCase() === header.toLowerCase() )
                        {
                            headerValue = response.headers[header];
                            break;
                        }
                    }
                }

                return headerValue === undefined ? null : headerValue;
            },
            "getAllResponseHeaders": function() {
                var allHeaders, key;
                if (response.getAllResponseHeaders) {
                    return response.getAllResponseHeaders();
                }
                if (response.headers) {
                    for (key in response.headers) {
                        if (allHeaders) {
                            allHeaders += "\r\n";
                        }    

                        allHeaders += (key + ":" + response.headers[key]);
                    }
                    return allHeaders;
                }

                return null;
            }
        };

        if (options.complete) {
            options.complete(fakeXHR);
        }
    }
} ());

/**
 * @namespace Used to group anonymous objects and callback functions used as method parameters only for purposes of API docs generation only.
 * Methods and fields in this namespace cannot be instantiated.
 * <br/>
 * <b>Used for API docs generation only.</b>
 */
anonymous = (typeof anonymous === "undefined" || !anonymous) ? {} : anonymous;      // SUP 'namespace'

    /**
     * Options object used with the {@link getExternalResource} function.
     *
     * Supported options are:
     * <ul>
     *  <li>  method:  one of GET, PUT, DELETE, HEAD, OPTIONS, or POST. The default is GET.</li> 
     *  <li>  HTTP and HTTPS urls are supported. </li>
     *  <li>  async:  request should be sent asynchronously. The default is true. </li>
     *  <li>  headers: request headers to be sent with request. </li>
     *  <li>  data: data to be sent. If this is an array, it is converted to a query string. For a GET request, this is added to the end of the URL. </li>
     *  <li>  {@link anonymous.complete} is a callback function that will be invoked with the resultXHR when this method completes </li>
     * </ul>
     * @name anonymous.options
     */

     /**
      * Callback function used in the {@link Options} object.
      *
      * @name anonymous.complete
      * @param {object} resultXHR the response object.
      * <br/>
      *    The fields/methods available on resultXHR are
      *    <ol>
      *        <li> status</li>
      *        <li>  statusText</li>
      *        <li>  responseText</li>
      *        <li>   getReponseHeader(key)</li>
      *        <li>  getAllResponesHeaders()</li>
      *  </ol>
      *    These fields and methods are not supported for resultXHR:
      *    <ul>
      *      <li> open() </li>
      *    </ul>  
      * @function
      */

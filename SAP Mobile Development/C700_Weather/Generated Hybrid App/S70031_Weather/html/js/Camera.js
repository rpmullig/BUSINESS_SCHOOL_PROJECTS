/*
 * Sybase Hybrid App version 2.2
 *
 * Camera.js
 * This file will not be regenerated, so it is possible to modify it, but it
 * is not recommended.
 *
 * Copyright (c) 2012 Sybase Inc. All rights reserved.
 */

 /* The feature comment is necessary at the class level for the custom template to work.
 */
/**
 * @namespace The namespace for the Hybrid Web Container javascript
 * @feature Camera
 */
hwc = (typeof hwc === "undefined" || !hwc) ? {} : hwc;      // SUP 'namespace'

(function(hwc, window, undefined) {

    /**
     * An array that holds all possible option codes for use with getPicture()
     * @private
    */
    hwc.PictureOption = [];

    /**
     * @memberOf hwc.PictureOption
     */
    hwc.PictureOption.SourceType = {
         /**
          * Constant that specifies the built-in camera as the image source for selecting the image using the {@link hwc.getPicture} method.
          * @memberOf hwc.PictureOption.SourceType
          */
        CAMERA: 1,              // Specifies the built-in camera as the image source where image content is not persisted by the device
        /**
          * Constant that specifies the photo library as the image source
          * @memberOf hwc.PictureOption.SourceType
          */
        PHOTOLIBRARY: 2,        // Specifies the photo library as the image source where image content is already persisted on the device
        /**
          * Constant that specifies the built-in camera and the photo library be used as an image source for selecting the image using the {@link hwc.getPicture} method.
          * @memberOf hwc.PictureOption.SourceType
          */
        BOTH: 3                 // Specifies the built-in camera as the image source where image content is persisted by the device
    };

    /**
     * @memberOf hwc.PictureOption
     */
    hwc.PictureOption.DestinationType = {
    /**
     * Use this constant to specify that base64 encoded image data be returned by the {@link hwc.getPicture} method.
     * @memberOf hwc.PictureOption.DestinationType
     * @deprecated
     */
        IMAGE_DATA: 0,          // Returns base64 encoded string (deprecated)
    /**
     * Use this constant to specify that the image URI be returned by the {@link hwc.getPicture} method.
     * @memberOf hwc.PictureOption.DestinationType
     */
        IMAGE_URI: 1            // Returns uniform reference identifier for the image
    };

    /**
     * Open a platform-specific application allowing the user to capture an image
     * using the built-in camera.
     * @deprecated
     */
    hwc.PictureOption.CAMERA = hwc.PictureOption.SourceType.CAMERA;

    /**
     * Open a platform-specific application allowing the user to select an
     * existing picture from a gallery.
     * @deprecated
     */
    hwc.PictureOption.PHOTOLIBRARY = hwc.PictureOption.SourceType.PHOTOLIBRARY;

    /**
     * An array that holds all possible error codes
     */
    hwc.PictureError = [];

    /**
     * Constant indicating that the {@link hwc.getPicture} method was successful.
     * @memberOf hwc
     */
    hwc.PictureError.NO_ERROR      =  0;

    /**
     * Constant indicating that the {@link hwc.getPicture} method is not implemented, camera not present, etc.
     * @memberOf hwc
     */
    hwc.PictureError.NOT_SUPPORTED = -1;

    /**
     * Constant indicating that the {@link hwc.getPicture} method has been invoked, but has not completed yet.
     * @memberOf hwc
     */
    hwc.PictureError.IN_PROGRESS   = -2;

    /**
     * Constant indicating that the user has cancelled the {@link hwc.getPicture} invocation.
     * @memberOf hwc
     */
    hwc.PictureError.USER_REJECT   = -3;

    /**
     * Constant indicating that the supplied options were not recognized by the {@link hwc.getPicture} method
     * @memberOf hwc
     */
    hwc.PictureError.BAD_OPTIONS   = -4;

    /**
     * Constant indicating that the returned image size was too large to be handled by JavaScript.
     * @memberOf hwc
     */
    hwc.PictureError.TOO_LARGE     = -5;

    /**
     * Constant indicating that the an unknown error occured during the execution of {@link hwc.getPicture} method.
     * @memberOf hwc
     */
    hwc.PictureError.UNKNOWN       = -6;

    /**
     * A namespace for our private use
     * @private
     */
    var _Picture = new function() {};           // private object '_Picture' within 'hwc'

    /**
     * Requests retrieval of a picture asynchronously.
     *
     * @param {anonymous.onGetPictureError} onGetPictureError Function to be invoked if the attempt to get
     *     a picture fails. err will be one of the PictureError codes.
     * @param {anonymous.onGetPictureSuccess} onGetPictureSuccess Function to be invoked if a picture is
     *     successfully retrieved. response will either be a Base64-encoded JPG string or a URI.
     * @param {anonymous.PictureOptions} options the options to control the sourceType and destinationType.
     * @feature Camera
     * @memberOf hwc
     * @public
     * @example
     * // Error handler. will be invoked asynchronously.
     * fail = function(errorCode){
     *      // handle error code and take appropriate action.
     * }
     * // Success handler. will be invoked asynchronously.
     * success = function(fileName, content){
     *      // handle the content. content may be a location or base64 encoded string that is
     *      // determined by the options passed to the destinationType argument.
     * }
     *
     * getPicture(fail,
     *            success,
     *            { sourceType: PictureOption.SourceType.CAMERA,
     *              destinationType: PictureOption.DestinationType.IMAGE_URI
     *            });
     */
    hwc.getPicture = function(onGetPictureError, onGetPictureSuccess, options)
    {
        // Return if callback functions are not provided
        if (typeof onGetPictureError !== 'function' ||
            typeof onGetPictureSuccess !== 'function') {
            return;
        }

        if ("_onGetPictureSuccess" in _Picture &&
                _Picture._onGetPictureSuccess !== null) {
            // Already requested but not yet complete
            onGetPictureError(hwc.PictureError.IN_PROGRESS);
            return;
        }

        _Picture._onGetPictureError = onGetPictureError;
        _Picture._onGetPictureSuccess = onGetPictureSuccess;

        // Convert options parameter to object notation if number type and return image data to preserve behavior
        // of previous release
        if (typeof options === 'number') {
            options =  { destinationType: hwc.PictureOption.DestinationType.IMAGE_DATA,
                         sourceType: options
                       };
        }

        // Convert options object to serialized JSON text in preparation for submission to the container
        options = JSON.stringify(options);

        if (hwc.isWindowsMobile())
       {
          hwc.getDataFromContainer("getPicture", "PictureOptions=" + encodeURIComponent(options));
       }
       else if (hwc.isIOS())
       {
          // Only difference between iOS and WindowsMobile above is the leading '&'
          hwc.getDataFromContainer("getPicture", "&PictureOptions=" + encodeURIComponent(options));
        }
       else
       {
            _HWC.getPicture(options);
         }
    };

    /**
     * (Internal) Invoked asynchronously when the image arrives.
     *
     * @private
     * @param result The PictureError code, or PictureError.NO_ERROR for
     *     success.
     * @param {string} filename Filename corresponding to the image.
     * @param {string} imageData Base64-encoded String containing the image data. Undefined
     *     if the result parameter indicates an error or the image URI was requested.
     * @param {string} imageUri Uniform resource indicator of the image resource.  Undefined
     *     if the result parameter indicates an error or the image data was requested.
     */
    _Picture._getPictureComplete = function(result, fileName, imageData, imageUri) {
        var response, successFunc, errorFunc;
        
        successFunc = _Picture._onGetPictureSuccess;
        errorFunc = _Picture._onGetPictureError;
        
        _Picture._onGetPictureSuccess = null;
        _Picture._onGetPictureError = null;

        if (result === hwc.PictureError.NO_ERROR) {
            if (imageData) {
                // For WM client, the picture data is too big to be passed from url, so only
                // the unique key is sent from container to JavaScript.  JavaScript needs to send
                // another xmlhttprequest to fetch the actual data
                if (hwc.isWindowsMobile()) {
                        response = hwc.getDataFromContainer("getpicturedata", "pictureid=" + imageData);
                    successFunc(fileName, response);
                } else {
                    successFunc(fileName, imageData);
                }
            } else if (imageUri) {
                successFunc(fileName, imageUri);
            } else {
                errorFunc(hwc.PictureError.UNKNOWN);
            }
        } else {
            errorFunc(result);
        }
    };

    window._Picture = _Picture;
})(hwc, window);


/**
 * @namespace Used to group anonymous objects and callback functions used as method parameters. Methods and fields in this
 * namespace cannot be instantiated. Used for API docs generation only.
 */
anonymous = (typeof anonymous === "undefined" || !anonymous) ? {} : anonymous;      // SUP 'namespace'

/**
 * User provided function that is invoked when the {@link hwc.getPicture} function fails.
 *
 * @name anonymous.onGetPictureError
 * @param {integer} err the error code returned. Possible values are
 * <ol>
 * <li>PictureError.NO_ERROR = 0;</li>
 * <li>PictureError.NOT_SUPPORTED = -1;  getPicture() not implemented, camera not present,</li>
 * <li>PictureError.IN_PROGRESS = -2; getPicture() has already been requested but has not yet completed.</li>
 * <li>PictureError.USER_REJECT = -3; the user has canceled the request.</li>
 * <li>PictureError.BAD_OPTIONS = -4; supplied options were not recognized.</li>
 * <li>PictureError.TOO_LARGE = -5; the returned image size was too large to be handled by JavaScript</li>
 * <li>PictureError.UNKNOWN = -6; an unknown error occurred.</li>
 * </ol>
 * @feature Camera
 * @function
 */

 /**
  * User provided function that will be invoked when the {@link hwc.getPicture} function is successful.
  *
  * @name anonymous.onGetPictureSuccess
  *
  * @param {string} filename file name of the image
  * @param {string} response  the response will be either a Base64-encoded JPG string or a URI depending on the options passed to
  * the {@link hwc.getPicture} function.
  * <ul>
  * <li> if options.destinationType == PictureOption.DestinationType.IMAGE_URI, response is an uniform reference identifier for the image. onGetPictureSuccess(fileName, imageURI)</li>
  * <li> if options.destinationType == PictureOption.DestinationType.IMAGE_DATA, response is a Base64-encoded string. onGetPictureSuccess(fileName, imageData )</li>
  * </ul>
  * @function
  */

  /**
   * Options object that is used with the {@link hwc.getPicture} method. Contains 2 fields that can be specified.
   *
   * <ul>
   * <li> sourceType: One of {@link hwc.Picture.SourceType} values </li>
   * <li> destinationType: One of {@link hwc.Picture.DestinationType} values </li>
   * </ul>
   * @name anonymous.PictureOptions
   * @see hwc.getPicture for an example.
   */
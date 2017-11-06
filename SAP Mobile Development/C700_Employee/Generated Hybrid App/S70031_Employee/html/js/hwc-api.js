/*
 * Sybase Hybrid App version 2.2
 *
 * hwc-api.js
 * This file will not be regenerated, so it is possible to modify it, but it
 * is not recommended.
 *
 * Copyright (c) 2011,2012 Sybase Inc. All rights reserved.
 */
/** @namespace Holds all the Hybrid Web Container javascript */
hwc = (typeof hwc === "undefined" || !hwc) ? {} : hwc;      // SUP 'namespace'


/**
 * Container API
 */
(function(hwc, undefined) {

   /**
    * Constant definitions for registration methods
    */
   /**
    * Constant indicating the manual registration method.  Used in {@link hwc.ConnectionSettings}.
    * @type number */
   hwc.REGISTRATION_METHOD_MANUAL = 0;
   /**
    * Constant indicating the automatic registration method.  Used in {@link hwc.ConnectionSettings}.
    * @type number */
   hwc.REGISTRATION_METHOD_AUTOMATIC = 1;
   /**
    * Constant indicating the Afaria registration method.  Used in {@link hwc.ConnectionSettings}.
    * @type number */
   hwc.REGISTRATION_METHOD_AFARIA = 3;
   /**
    * Constant indicating the certificate registration method.  Used in {@link hwc.ConnectionSettings}.
    * @type number */
   hwc.REGISTRATION_METHOD_CERTIFICATE = 4;

   /**
    * Represents the connection settings for connecting to the SUP Server.  Used in {@link hwc.loadSettings} and {@link hwc.saveSettings}.
    * 
    * @class
    * @param {number} regmethod A number representing the registration method (must be one of {@link hwc.REGISTRATION_METHOD_MANUAL},
    * {@link hwc.REGISTRATION_METHOD_AUTOMATIC}, {@link hwc.REGISTRATION_METHOD_AFARIA}, {@link hwc.REGISTRATION_METHOD_CERTIFICATE}).
    * @param {string} server The SUP/Relay server name.
    * @param {number} port The SUP/Relay server port number.
    * @param {string} server The farm id.
    * @param {string} user The user name.
    * @param {string} activationcode The activation code.
    * @param {string} protocol The protocol to use.  Must be "HTTP" or "HTTPS".
    * @param {string} password The password for automatic registration.
    * @param {string} urlsuffix The url suffix (used only when connecting to a relay server).
    * @memberOf hwc
    * @public
    * @example
    * // Create a new ConnectionSettings object.
    * var connectionSettings = new hwc.ConnectionSettings( hwc.REGISTRATION_METHOD_MANUAL,
    *                                            "999.999.999.999",
    *                                            5001,
    *                                            0,
    *                                            "sampleUsername",
    *                                            123,
    *                                            "HTTP",
    *                                            "samplePassword",
    *                                            "/" );
    * // Use the ConnectionSettings object we just created to set the connection settings.
    * hwc.saveSettings( connectionSettings );
    *
    */
   hwc.ConnectionSettings = function (regmethod, server, port, farm, user, activatecode, protocol, password, urlsuffix)
   {
      this.RegistrationMethod = regmethod;
      this.ServerName = server;
      this.Port = port;
      this.FarmID = farm;
      this.UserName = user;
      this.ActivationCode = activatecode;
      this.Protocol = protocol;
      this.Password = password;
      this.UrlSuffix = urlsuffix;
   };

   /**
    * Loads the current connection settings from the native application storage. 
    * <p>
    * <b> hwc.startClient() needs to be called after hwc.saveSettings() for the device to complete automatic/manual registration. </b>
    * </p>
    * @return {hwc.ConnectionSettings} The connection settings or null if there are no cached settings.
    * @memberOf hwc
    * @public
    * @example
    * // Load the connection settings.
    * var connectionSettings = hwc.loadSettings();
    * // Modify the connection settings.
    * connectionSettings.ServerName = "999.999.999.999";
    * // Save the modified connection settings.
    * hwc.saveSettings( connectionSettings );
    * // Start the client to for the device to complete automatic/manual registration.
    * hwc.startClient();
    */
   hwc.loadSettings = function () {
      var settings, response, jsonobj;
      settings = null;
      
      try {
             response = hwc.getDataFromContainer("loadsettings");
             jsonobj = JSON.parse(response);
             if (jsonobj !== null && jsonobj !== undefined) {
                settings = new hwc.ConnectionSettings(jsonobj.enableautoregistration, jsonobj.servername,
                                                          jsonobj.port, jsonobj.farmid, jsonobj.username,
                                                          jsonobj.activationcode, jsonobj.protocol, jsonobj.password,
                                                          jsonobj.urlsuffix);

            } 
        }catch (ex){
            hwc.log("loadSettings error:" + ex.message, "ERROR", false);
        }

      return settings;
   };

   /**
    * Constant definitions for device management in add device registration.
    * Some other error numbers may apply for technical support.
    */
   /**
    * Constant indicating that MMS Authentication failed.  Possible return value for {@link hwc.saveSettings}.
    * @type number */
   hwc.REG_ERR_MMS_AUTHENTICATION_FAILED             = 14814;
   /**
    * Constant indicating that the connection to the MMS service failed.  Possible return value for {@link hwc.saveSettings}.
    * @type number */
   hwc.REG_ERR_COULD_NOT_REACH_MMS_SERVER            = 14813;
   /**
    * Constant indicating that no MBS template was found for given AppId and/or Security configuration.  Possible return value for {@link hwc.saveSettings}.
    * @type number */
   hwc.REG_ERR_AUTO_REG_TEMPLATE_NOT_FOUND           = 14850;
   /**
    * Constant indicating that auto registration was not enabled in the template.  Possible return value for {@link hwc.saveSettings}.
    * @type number*/
   hwc.REG_ERR_AUTO_REG_NOT_ENABLED                  = 14851;
   /**
    * Constant indicating that the given device id is already registered for another user.  Possible return value for {@link hwc.saveSettings}.
    * @type number */
   hwc.REG_ERR_AUTO_REG_WRONG_USER_FOR_DEVICE        = 14853;
   /**
    * Constant indicating that the user name is longer than the legal limit.  Possible return value for {@link hwc.saveSettings}.
    * @type number */
   hwc.REG_ERR_AUTO_REG_USER_NAME_TOO_LONG          = 14854;
   /**
    * Constant indicating that the user name contains invalid characters.  Possible return value for {@link hwc.saveSettings}.
    * @type number */
   hwc.REG_ERR_INVALID_USER_NAME                     = 14856;
   /**
    * Constant indicating {@link hwc.saveSettings} completed successfully.  Possible return value for {@link hwc.saveSettings}.
    * @type number */
   hwc.SETTING_SUCCESS                               = 0;

   /**
    * Save the connection settings to native application storage.  Device registration will be performed if the
    * registration method is not manual and the activation code is empty.
    *
    * If the saveSettings() operation fails, a non-zero number will be returned.  See hwc.REG_ERR_* for device registration errors.
    * There can be other types of errors not listed here.
    *
    * @param {hwc.ConnectionSettings} settings The connection settings to be saved.
    *
    * @return {number} A status code indicating success ({@link hwc.SETTING_SUCCESS}) or an error (one of {@link hwc.REG_ERR_AUTO_REG_NOT_ENABLED},
    * {@link hwc.REG_ERR_AUTO_REG_TEMPLATE_NOT_FOUND}, {@link hwc.REG_ERR_AUTO_REG_USER_NAME_TOO_LONG}, {@link hwc.REG_ERR_AUTO_REG_WRONG_USER_FOR_DEVICE},
    * {@link hwc.REG_ERR_COULD_NOT_REACH_MMS_SERVER}, {@link hwc.REG_ERR_INVALID_USER_NAME}, {@link hwc.REG_ERR_MMS_AUTHENTICATION_FAILED}).
    * @public
    * @memberOf hwc
    * @example
    * // Load the connection settings.
    * var connectionSettings = hwc.loadSettings();
    * // Modify the connection settings.
    * connectionSettings.ServerName = "999.999.999.999";
    * // Save the modified connection settings.
    * hwc.saveSettings( connectionSettings );
    */
   hwc.saveSettings = function (settings) {
      try {
         // First compose the URL argument string
         var argumentString, ret;
         argumentString = "", ret = "";
         
         if (settings.RegistrationMethod !== null && settings.RegistrationMethod !== undefined)
         {
            argumentString = "&enableautoregistration=" + settings.RegistrationMethod;
         }
         if (settings.ServerName !== null && settings.ServerName !== undefined)
         {
            argumentString = argumentString + "&servername=" + encodeURIComponent(settings.ServerName);
         }
         if (settings.Port !== null && settings.Port !== undefined)
         {
            argumentString = argumentString + "&port=" + settings.Port;
         }
         if (settings.FarmID !== null && settings.FarmID !== undefined)
         {
            argumentString = argumentString + "&farmid=" + encodeURIComponent(settings.FarmID);
         }
         if (settings.UserName !== null && settings.UserName !== undefined)
         {
            argumentString = argumentString + "&username=" + encodeURIComponent(settings.UserName);
         }
         if (settings.ActivationCode !== null && settings.ActivationCode !== undefined)
         {
            argumentString = argumentString + "&activationcode=" + encodeURIComponent(settings.ActivationCode);
         }
         if (settings.Protocol !== null && settings.Protocol !== undefined)
         {
            argumentString = argumentString + "&protocol=" + encodeURIComponent(settings.Protocol);
         }
         if (settings.Password !== null && settings.Password !== undefined)
         {
            argumentString = argumentString + "&password=" + encodeURIComponent(settings.Password);
         }
         if (settings.UrlSuffix !== null && settings.UrlSuffix !== undefined)
         {
            argumentString = argumentString + "&urlsuffix=" + encodeURIComponent(settings.UrlSuffix);
         }

         // Only invoke the native function if we're saving at least one setting
         if (argumentString !== "")
         {
            ret = hwc.getDataFromContainer("savesettings", argumentString);
            return parseInt(ret, 10);
         }
       else
       {
         return hwc.SETTING_SUCCESS;
       }
      } catch (ex){
         hwc.log("saveSettings error:" + ex.message, "ERROR", false);
         throw ex;
      }
   };


   /**
    * Start of connection state listener callback functions
    */
   /**
    * An array of {@link anonymous.ConnectionStateListener} callback functions.
    * @type Array
    * @private
    */
   hwc._connectionListeners = [];
   /**
    * An array of objects containing {@link anonymous.ConnectionStateListener} callback functions.
    * The containing objects need to be kept track of since the callback functions may reference
    * variables in the containing object.
    * @type Array
    * @private
    */
   hwc._connectionListenerContainingObjects = [];

   /**
    * @private
    * This is the main entry of connection event notification. The native code
    * calls this function internally
    *
    * @param {number} event A flag indicating the current connection state (will be either {@link hwc.CONNECTED} or {@link hwc.DISCONNECTED}).
    * @param {number} errorCode An error code.  Will be 0 if there is no error.
    * @param {String} errorMessage Text of an error message.  Will be the empty string if there is no error.
    */
   hwc.connectionListenerNotification = function (event, errorCode, errorMessage)
   {
      var i, containingObject;
      
      if (hwc._connectionListeners.length === 0) {
         return;
      }

      for (i = 0; i < hwc._connectionListeners.length; i++)
      {
         containingObject = hwc._connectionListenerContainingObjects[i];
         if (containingObject !== null && containingObject !== undefined)
         {
            hwc._connectionListeners[i].call(containingObject, event, errorCode, errorMessage);
         }
         else
         {
            hwc._connectionListeners[i](event, errorCode, errorMessage);
         }
      }
   };

   /**
    * Register the connection state listener.
    *
    * @param {anonymous.ConnectionStateListener} ConnectionStateListener Callback for connection state changes.
    * @param {Object} [containingObject] Object containing definition for ConnectionStateListener.  If a connection state callback function
    * references variables in its containing object, then the containing object should be passed to this function.
    * @public
    * @memberOf hwc
    * @example
    * // doSomething is a global function that gets called from the connection listener.
    * var doSomething = function()
    * {
    *    alert("sample function that gets executed when the hwc becomes connected");
    * }
    * // connectionListener is the callback function that is given to addConnectionListener.
    * // When there is a connection event, connectionListener will be invoked with the details.
    * var connectionListener = function( event, errorCode, errorMessage )
    * {
    *    if( event == hwc.CONNECTED )
    *    {
    *       doSomething();
    *    }
    * }
    * hwc.addConnectionListener( connectionListener );
    *
    * @example
    * // connectionStateManager is an object that will contain the connection listener callback as well as
    * // a variable used by the callback.
    * var connectionStateManager = {};
    * // The connectionStateManager keeps track of whether the HWC is connected or not.
    * connectionStateManager.connected = false;
    * // A function called by the listener.
    * connectionStateManager.doSomething = function()
    * {
    *    if( this.connected )
    *    {
    *       alert("this alert gets displayed if the hwc is connected");
    *    }
    * }
    * // This is the callback function that will be passed to addConnectionListener.  This callback references variables
    * // from the containing object (this.connected and this.doSomething), so when we call addConnectionListener we have
    * // to give the containing object as the second parameter.
    * connectionStateManager.listener = function( event, errorCode, errorMessage )
    * {
    *    if( event == hwc.CONNECTED )
    *    {
    *       this.connected = true;
    *    }
    *    else
    *    {
    *       this.connected = false;
    *    }
    *    this.doSomething();
    * }
    * // Pass both the listener and the containing object.  This enables the listener to refer to variables in the containing object when it is invoked.
    * hwc.addConnectionListener( connectionStateManager.listener, connectionStateManager );
    */
   hwc.addConnectionListener = function (ConnectionStateListener, containingObject)
   {
      hwc._connectionListeners.push(ConnectionStateListener);
      hwc._connectionListenerContainingObjects.push(containingObject);
      if (hwc._connectionListeners.length === 1)
      {
         hwc.getDataFromContainer("startconnectionlistener");
      }
   };

    /**
    * Remove the connection state listener.  This function should be called with identical parameters that were used
    * when adding the connection state listener with {@link hwc.addConnectionListener}.
    *
    * @param {anonymous.ConnectionStateListener} ConnectionStateListener Callback function with connection state changes
    * @param {Object} [containingObject] Optional Object containing definition of ConnectionStateListener
    * @public
    * @memberOf hwc
    * @example
    * // doSomething is a global function that gets called from the connection listener.
    * var doSomething = function()
    * {
    *    alert("sample function that gets executed when the hwc becomes connected");
    * }
    * // connectionListener is the callback function that is given to addConnectionListener.
    * // When there is a connection event, connectionListener will be invoked with the details.
    * var connectionListener = function( event, errorCode, errorMessage )
    * {
    *    if( event == hwc.CONNECTED )
    *    {
    *       doSomething();
    *    }
    * }
    * hwc.addConnectionListener( connectionListener );
    * // At some other point if we want to remove the listener, we use the following line:
    * hwc.removeConnectionListener( connectionListener );
    *
    * @example
    * // connectionStateManager is an object that will contain the connection listener callback as well as
    * // a variable used by the callback.
    * var connectionStateManager = {};
    * // The connectionStateManager keeps track of whether the HWC is connected or not.
    * connectionStateManager.connected = false;
    * // A function called by the listener.
    * connectionStateManager.doSomething = function()
    * {
    *    if( this.connected )
    *    {
    *       alert("this alert gets displayed if the hwc is connected");
    *    }
    * }
    * // This is the callback function that will be passed to addConnectionListener.  This callback references variables
    * // from the containing object (this.connected and this.doSomething), so when we call addConnectionListener we have
    * // to give the containing object as the second parameter.
    * connectionStateManager.listener = function( event, errorCode, errorMessage )
    * {
    *    if( event == hwc.CONNECTED )
    *    {
    *       this.connected = true;
    *    }
    *    else
    *    {
    *       this.connected = false;
    *    }
    *    this.doSomething();
    * }
    * // Pass both the listener and the containing object.  This enables the listener to refer to variables in the containing object when it is invoked.
    * hwc.addConnectionListener( connectionStateManager.listener, connectionStateManager );
    * // At some other point if we want to remove the listener, we use the following line:
    * hwc.removeConnectionListener( connectionStateManager.listener, connectionStateManager );
    */
   hwc.removeConnectionListener = function (ConnectionStateListener, containingObject)
   {
      var i;
      if (hwc._connectionListeners.length === 0) {
         return;
      }

      for (i = 0; i < hwc._connectionListeners.length; i++)
      {
         if (hwc._connectionListeners[i] === ConnectionStateListener &&
             hwc._connectionListenerContainingObjects[i] === containingObject)
         {
            hwc._connectionListeners.splice(i, 1);
            hwc._connectionListenerContainingObjects.splice(i, 1);
            if (hwc._connectionListeners.length === 0)
            {
               hwc.getDataFromContainer("stopconnectionlistener");
            }
            return;
         }
      }
    };

    /**
    * A sample {@link anonymous.ConnectionStateListener} callback function.
    *
    * @param {number} event A number indicating the event that occurred (will be {@link hwc.CONNECTED} or {@link hwc.DISCONNECTED}).
    * @param {number} errorCode An error code (0 indicating success).
    * @param {string} errorMessage Text of the error message.  Will be empty of there is no error.
    */
   hwc.sample_ConnectionListener = function (event, errorCode, errorMessage) {
      switch (event)
      {
         case hwc.CONNECTED:
            alert('Connected event');
            break;
         case hwc.DISCONNECTED:
            alert('Disconnected event');
            break;
      }

      if (errorCode !== null && errorMessage !== null)
      {
         alert('Connection error\n' +
               'Code: ' + errorCode + '\n' +
               'Message: ' + errorMessage);
      }
   };

   /** 
    * Constant indicating that the hwc is connected.  Used in {@link anonymous.ConnectionStateListener} callback functions.
    * @type number
    */
   hwc.CONNECTED = 1;
   /**
    * Constant indicating that the hwc is disconnected.  Used in {@link anonymous.ConnectionStateListener} callback functions.
    * @type number
    */
   hwc.DISCONNECTED = 2;


   /**
    * Start the client connection to the SUP server.  Companion function to {@link hwc.shutdown}.
    * If a hybrid app is running in the context of the Hybrid Web Container
    * then it will probably never have to call this function unless {@link hwc.shutdown} client was called first.
    *
    * @param {anonymous.LogListener} [onNotification] A log listener callback function.  If you are interested in
    * the connection state it is recommended that you call {@link hwc.addConnectionListener} before calling hwc.startClient.
    * @public
    * @memberOf hwc
    * @example
    * hwc.startClient();
    *
    * @example
    * // Add a log listener while calling hwc.startClient.
    * var logListener = function( time, event, message )
    * {
    *    alert(message);
    * }
    * hwc.startClient( logListener );
    */
   hwc.startClient = function (onNotification) {
      try {
         if (hwc._defaultLogListener !== null && hwc._defaultLogListener !== undefined)
         {
            hwc.removeLogListener(hwc._defaultLogListener, null);
            hwc._defaultLogListener = null;
         }

         if (onNotification !== null && onNotification !== undefined)
         {
            hwc.addLogListener( onNotification, null );
            hwc._defaultLogListener = onNotification;
         }

         hwc.getDataFromContainer( "startclient" );

         return 0;
      } catch (ex){
        hwc.log("startClient error:" + ex.message, "ERROR", false);
      }
   };

   /**
    * Shutdown the client connection to the SUP server.  Companion function to {@link hwc.startClient}.  
    * If a hybrid app is running in the context of the Hybrid Web Container, then it will probably never have to call
    * this function.  If you want to temporarily stop the connection, then call {@link hwc.disconnectFromServer} instead.
    * @public
    * @memberOf hwc
    * @example
    * hwc.shutdown();
    */
   hwc.shutdown = function () {
      try {
         hwc.getDataFromContainer("shutdownclient");

         if (hwc._defaultLogListener !== null && hwc._defaultLogListener !== undefined)
         {
            hwc.removeLogListener(hwc._defaultLogListener, null);
            hwc._defaultLogListener = null;
         }
      } catch (ex){
        hwc.log("shutdown error:" + ex.message, "ERROR", false);
      }
   };

   /**
    * Resumes the connection to the SUP server.  Companion function to {@link hwc.disconnectFromServer}.  This function should
    * only be called after the connection to the SUP server has been suspened with a call to {@link hwc.disconnectFromServer}.
    *
    * @param {anonymous.LogListener} [onNotification] A log listener callback function.  If you are interested in
    * the connection state it is recommended that you call {@link hwc.addConnectionListener} before calling hwc.connectToServer.
    *
    * @public
    * @memberOf hwc
    * @example
    * hwc.connectToServer();
    *
    * @example
    * // Add a log listener while calling hwc.connectToServer.
    * var logListener = function( time, event, message )
    * {
    *    alert(message);
    * }
    * hwc.connectToServer( logListener );
    */
   hwc.connectToServer = function (onNotification) {
      try {
         if (hwc._defaultLogListener !== null && hwc._defaultLogListener !== undefined)
         {
            hwc.removeLogListener(hwc._defaultLogListener, null);
            hwc._defaultLogListener = null;
         }

         if (onNotification !== null && onNotification !== undefined)
         {
            hwc.addLogListener( onNotification, null );
            hwc._defaultLogListener = onNotification;
         }

         hwc.getDataFromContainer( "connecttoserver" );

         return 0;
      } catch (ex){
         hwc.log("connectToServer error:" + ex.message, "ERROR", false);
         throw ex;
      }
   };

   /**
    * This is the default one to keep the listener added in the connectionToServer call.
    * @private
    */
   hwc._defaultLogListener = null;

   /**
    * Suspends the connection to the SUP server.  Companion function to {@link hwc.connectToServer}.
    * @public
    * @memberOf hwc
    * @example
    * hwc.disconnectFromServer();
    */
   hwc.disconnectFromServer = function () {
      try {
         hwc.getDataFromContainer("disconnectfromserver");

         if (hwc._defaultLogListener !== null && hwc._defaultLogListener !== undefined)
         {
            hwc.removeLogListener(hwc._defaultLogListener, null);
            hwc._defaultLogListener = null;
         }

      } catch (ex){
        hwc.log("disconnectFromServer error:" + ex.message, "ERROR", false);
      }
   };

   /**
    * Start of connection functions
    */

   /**
    * An array of log listener callback functions.
    * @type Array
    * @private
    */
   hwc._logListeners = [];
   /**
    * An array of objects containing log listener callback functions.  The containing objects
    * need to be kept track of because the callback functions may reference variables in the
    * containing object.
    * @type Array
    * @private
    */
   hwc._logListenerContainingObjects = [];

   /**
    * @private
    * This is the main entry of log event notification. The native code
    * calls this function internally.
    *
    * @param {number} milliseconds The date of the log message represented in milliseconds.
    * @param {number} event The that represents which category this event falls under (It will be one of hwc.CONNECTION_* constants).
    * @param {string} optionalString The string carrying the message of the log event.
    */
   hwc._logListenerNotification = function ( milliseconds, event, optionalString )
   {
      var date, i, containingObject;
      if (hwc._logListeners.length === 0) {
         return;
      }

      // The incoming date is number of millisecond, we need to change it to real JavaScript Date type.
      date = new Date(milliseconds);

      for (i = 0; i < hwc._logListeners.length; i++)
      {
         containingObject = hwc._logListenerContainingObjects[i];
         if (containingObject !== null && containingObject !== undefined)
         {
            hwc._logListeners[i].call(containingObject, date, event, optionalString);
         }
         else
         {
            hwc._logListeners[i](date, event, optionalString);
         }
      }
   };

   /**
    * Register the log listener.
    * @public
    * @memberOf hwc
    * @param {anonymous.LogListener} LogListener Callback for changes to the log.
    * @param {Object} [containingObject] Object containing definition for LogListener.  If a log listener callback function
    * references variables in its containing object, then the containing object should be passed to this function.
    *
    * @example
    * // A global function called by the log listener.
    * var doSomething = function()
    * {
    *    alert("this gets displays when there is a log event.");
    * }
    * // The log listener callback function that will be passed to hwc.addLogListener.
    * // This function will be invoked whenever there is a log event.
    * var logListener = function( event, errorCode, errorMessage )
    * {
    *    doSomething();
    * }
    * // Add the log listener.
    * hwc.addLogListener( logListener );
    *
    * @example
    * // logListenerManager is an object that will contain the listener callback as well
    * // as a function that will be invoked from the listener callback function.
    * var logListenerManager = {};
    * // This is a function that is called from the listener callback.
    * logListenerManager.doSomething = function()
    * {
    *    alert("this gets displays when there is a log event.");
    * }
    * // This is the listener callback that will be passed to hwc.addLogListener.
    * // Since a variable is referenced from the containing object, the containing object
    * // will need to be passed to hwc.addLogListener.
    * logListenerManager.listener = function( event, errorCode, errorMessage )
    * {
    *    this.doSomething();
    * }
    * // Pass both the listener callback and the containing object.
    * hwc.addLogListener( logListenerManager.listener, logListenerManager );
    */
   hwc.addLogListener = function ( LogListener, containingObject)
   {
      hwc._logListeners.push(LogListener);
      hwc._logListenerContainingObjects.push(containingObject);
      if (hwc._logListeners.length === 1)
      {
         hwc.getDataFromContainer("startloglistener");
      }
   };

   /**
    * Remove the log listener.  This function should be called with identical parameters that were used
    * when adding the log listener with {@link hwc.addLogListener}.
    *
    * @param {anonymous.LogListener} LogListener The callback function for log events.
    * @param {Object} [containingObject] Object containing definition of ConnectionStateListener
    * @public
    * @memberOf hwc
    * @example
    * // A global function called by the log listener.
    * var doSomething = function()
    * {
    *    alert("this gets displays when there is a log event.");
    * }
    * // The log listener callback function that will be passed to hwc.addLogListener.
    * // This function will be invoked whenever there is a log event.
    * var logListener = function( event, errorCode, errorMessage )
    * {
    *    doSomething();
    * }
    * // Add the log listener.
    * hwc.addLogListener( logListener );
    * // at some other point if we want to remove the listener, we use the following line
    * hwc.removeLogListener( logListener );
    *
    * @example
    * // logListenerManager is an object that will contain the listener callback as well
    * // as a function that will be invoked from the listener callback function.
    * var logListenerManager = {};
    * // This is a function that is called from the listener callback.
    * logListenerManager.doSomething = function()
    * {
    *    alert("this gets displays when there is a log event.");
    * }
    * // This is the listener callback that will be passed to hwc.addLogListener.
    * // Since a variable is referenced from the containing object, the containing object
    * // will need to be passed to hwc.addLogListener.
    * logListenerManager.listener = function( event, errorCode, errorMessage )
    * {
    *    this.doSomething();
    * }
    * // Pass both the listener callback and the containing object.
    * hwc.addLogListener( logListenerManager.listener, logListenerManager );
    * // at some other point if we want to remove the listener, we use the following line
    * hwc.removeLogListener( logListenerManager.listener, logListenerManager );
    */
   hwc.removeLogListener = function (LogListener, containingObject)
   {
      var i;
      if (hwc._logListeners.length === 0){
         return;
      }

      for (i = 0; i < hwc._logListeners.length; i++)
      {
         if (hwc._logListeners[i] === LogListener &&
            hwc._logListenerContainingObjects[i] === containingObject)
         {
            hwc._logListeners.splice(i, 1);
            hwc._logListenerContainingObjects.splice(i, 1);

            if (hwc._logListeners.length === 0)
            {
               hwc.getDataFromContainer("stoploglistener");
            }
            return;
         }
      }
   };

   /**
    * Sample {@link anonymous.LogListener} callback function.
    *
    * @param {number} milliseconds The date of the log message represented in milliseconds.
    * @param {number} event The that represents which category this event falls under (It will be one of {@link hwc.CONNECTION_ERROR},
    * {@link hwc.CONNECTION_OTHER}, {@link hwc.CONNECTION_CONNECTED}, {@link hwc.CONNECTION_DISCONNECTED}, {@link hwc.CONNECTION_RETRIEVED_ITEMS}).
    * @param {string} optionalString The string carrying the message of the log event.
    */
   hwc.sample_LogListener = function ( date, event, optionalString ) {
   };

   // Connection event definitions
   /**
    * A constant indicating that the log message is about a connection error.  Used in {@link anonymous.LogListener} callback functions.
    * @type number
    */
   hwc.CONNECTION_ERROR = -1;
   /**
    * A constant indicating that the log message is not about the connection.  Used in {@link anonymous.LogListener} callback functions.
    * @type number
    */
   hwc.CONNECTION_OTHER = 0;
   /**
    * A constant indicating that the log message is about the connection being established.  Used in {@link anonymous.LogListener} callback functions.
    * @type number
    */
   hwc.CONNECTION_CONNECTED = 1;
   /**
    * A constant indicating that the log message is about the connection being disconnected.  Used in {@link anonymous.LogListener} callback functions.
    * @type number
    */
   hwc.CONNECTION_DISCONNECTED = 2;
   /**
    * a constant indicating that the log message is about retrieved items.  Used in {@link anonymous.LogListener} callback functions.
    * @type number
    */
   hwc.CONNECTION_RETRIEVED_ITEMS = 3;


   /**
    * Start of hybrid app installation callback functions
    */

   /**
    * An array of app installation listeners
    * @private
    * @type Array
    */
   hwc._appInstallationListeners = [];

   /**
    * This is the main entry of installation notification. The native code should be
    * hardcoded to call this function internally.
    *
    * @private
    * @param {number} event A constant indicating whether the app installation is beginning or has just ended
    * (will be either {@link hwc.INSTALLATION_BEGIN} or {@link hwc.INSTALLATION_END}).
    * @param {number} moduleId The module ID of the hybrid app being installed.
    * @param {number} version The version of the hybrid app being installed.
    * @param {string} moduleName The display name of the hybrid app being installed.
    */
   hwc.appInstallationListenerNotification = function (event, moduleId, version, moduleName)
   {
      var i;
      if (hwc._appInstallationListeners.length === 0) {
         return;
      }

      for (i = 0; i < hwc._appInstallationListeners.length; i++)
      {
         hwc._appInstallationListeners[i](event, moduleId, version, moduleName);
      }
   };

   /**
    * Register the application installation listener.
    *
    * @param {anonymous.AppInstallationListener} AppInstallationListener A callback for application installation changes.
    *
    * @example
    * // appInstallListener is the callback function that will be passed to hwc.addAppInstallationListener.
    * var appInstallListener = function( event, moduleId, version, moduleName )
    * {
    *    if( event == hwc.INSTALLATION_BEGIN )
    *    {
    *       alert(moduleName + " has just started the installation process.");
    *    }
    *    else if( event == hwc.INSTALLATION_END )
    *    {
    *       alert(moduleName + " has just finished the installation process.");
    *    }
    * }
    * hwc.addAppInstallationListener( appInstallListener );
    */
   hwc.addAppInstallationListener = function (AppInstallationListener)
   {
      hwc._appInstallationListeners.push(AppInstallationListener);
      if(hwc._appInstallationListeners.length === 1)
      {
         hwc.getDataFromContainer("startAppInstallationListener");
      }
   };

   /**
    * Remove the application installation listener.  This function should be called with identical parameters
    * that were used to add the application installation listener with {@link hwc.addAppInstallationListener}.
    *
    * @param {anonymous.AppInstallationListener} AppInstallationListener The callback for application installation changes.
    * @public
    * @memberOf hwc
    * @example
    * // appInstallListener is the callback function that will be passed to hwc.addAppInstallationListener.
    * var appInstallListener = function( event, moduleId, version, moduleName )
    * {
    *    if( event == hwc.INSTALLATION_BEGIN )
    *    {
    *       alert(moduleName + " has just started the installation process.");
    *    }
    *    else if( event == hwc.INSTALLATION_END )
    *    {
    *       alert(moduleName + " has just finished the installation process.");
    *    }
    * }
    * hwc.addAppInstallationListener( appInstallListener );
    * // when we want to remove this listener, we call the following line:
    * hwc.removeAppInstallationListener( appInstallListener );
    */
   hwc.removeAppInstallationListener = function (AppInstallationListener)
   {
      var i;
      if (hwc._appInstallationListeners.length === 0) {
         return;
      }

      for (i = 0; i < hwc._appInstallationListeners.length; i++)
      {
         if (hwc._appInstallationListeners[i] === AppInstallationListener)
         {
            hwc._appInstallationListeners.splice(i, 1);
            break;
         }
      }

      if (hwc._appInstallationListeners.length === 0)
      {
         hwc.getDataFromContainer("stopAppInstallationListener");
      }
   };

	/**
    * Sample application listener callback function
    * @param {Integer} event            Installation flags including, BEGIN(1), END(2)
    * @param {String} moduleId          Optional Module Id
	 * @param {String} version           Optional Module version
	 * @param {String} moduleName        Optional Module display name
    */
   hwc.sample_InstallationAppListener = function (event, moduleId, version, moduleName) {
   };

   // Installation event definitions
   /**
    * A constant indicating that the application is starting to be installed.  Used in {@link anonymous.AppInstallationListener} callback functions.
    * @type number
    */
   hwc.INSTALLATION_BEGIN = 1;
   /**
    * A constant indicating that the application has finished being installed.  Used in {@link anonymous.AppInstallationListener} callback functions.
    * @type number
    */
   hwc.INSTALLATION_END = 2;

   /**
    * Call this function to get an array of {@link hwc.LogEntry} objects.  There will be one
    * {@link hwc.LogEntry} object for each line in the HWC log.
    *
    * @return {hwc.LogEntry[]} An array of hwc.LogEntry objects.
    * @public
    * @memberOf hwc
    * @example
    * var log = hwc.getLogEntries();
    */
   hwc.getLogEntries = function () {
      var response, logEntries, i, entries, entry;
      
      response = "";
      logEntries = [];
      
      try {
         response = hwc.getDataFromContainer("getlogentries");

         if (response !== null && response !== undefined && response !== "")
         {
            entries = JSON.parse(response);
            for (i=0; i<entries.length; i++) {
               entry = entries[i];
               logEntries[i] = new hwc.LogEntry(new Date(entry.milliseconds), entry.event, entry.message);
            }
         }
      } catch (ex){
        hwc.log("getLogEntries error:" + ex.message, "ERROR", false);
      }

      return logEntries;
   };

   /**
    * This object represents a log entry.
    * @class
    * @public
    * @memberOf hwc
    * @param {number} date The date the log entry was recorded, in milliseconds since January 1, 1970, 00:00:00 GMT
    * @param {number} event The event ID of the log entry (will be one of {@link hwc.CONNECTION_ERROR}, {@link hwc.CONNECTION_OTHER},
    * {@link hwc.CONNECTION_CONNECTED}, {@link hwc.CONNECTION_DISCONNECTED}, {@link hwc.CONNECTION_RETRIEVED_ITEMS})
    * @param {string} msg The message of the log entry.
    */
   hwc.LogEntry = function (date, event, msg)
   {
      this.logdate = date;
      this.eventID = event;
      this.message = msg;

      /**
       * Gets the date of the log entry.
       * @public
       * @memberOf hwc.LogEntry
       * @return {number} The date the log entry was created in the HWC, in milliseconds.
       */
      this.getDate = function ()
      {
         return this.logdate;
      };

      /**
       * Gets the event ID of the log entry to see what this log entry is about.
       * @public
       * @memberOf hwc.LogEntry
       * @return {number} A constant indication what this log entry is about (will be one of {@link hwc.CONNECTION_ERROR}, {@link hwc.CONNECTION_OTHER},
       * {@link hwc.CONNECTION_CONNECTED}, {@link hwc.CONNECTION_DISCONNECTED}, {@link hwc.CONNECTION_RETRIEVED_ITEMS}).
       */
      this.getEventID = function ()
      {
         return this.eventID;
      };

      /**
       * Gets the message text of the log entry.
       * @public
       * @memberOf hwc.LogEntry
       * @return {string} The message text of the log entry.
       */
      this.getMessage = function ()
      {
         return this.message;
      };
   };

    /**
     * An array of push notification listeners
     * @private
     * @type Array
     */
    hwc._pushnotificationlisteners = [];
    /**
     * An array of objects containing push notification listeners
     * @private
     * @type Array
     */
    hwc._pushnotificationlistenerContainingObjects = [];

    /**
    * This is the main entry of push notification. The native code
    * calls this function internally.
    * @private
    * @param {String} jsonString      The notifications in JSON encoding
    * @param {Integer} [id]           ID of the communication area if required
    */
    hwc._pushnotificationListenerNotification = function(jsonString, id)
    {
        var ret, i, notifications, containingObject;
        ret = hwc.NOTIFICATION_CONTINUE;
        try
        {
            if (hwc._pushnotificationlisteners.length > 0) {
                notifications = JSON.parse(jsonString);
                // We must have a valid push data to continue
                if (!(notifications === null || notifications === undefined || notifications.length === 0))
                {
                    for (i = 0; i < hwc._pushnotificationlisteners.length; i++)
                    {
                        try
                        {
                            ret = hwc.NOTIFICATION_CONTINUE; // default status

                            containingObject = hwc._pushnotificationlistenerContainingObjects[i];
                            if (containingObject !== null && containingObject !== undefined)
                            {
                                ret = hwc._pushnotificationlisteners[i].call(containingObject, notifications);
                            }
                            else
                            {
                                ret = hwc._pushnotificationlisteners[i](notifications);
                            }

                            // If the return status is hwc.NOTIFICATION_CANCEL, we need to return immediately.
                            if (ret === hwc.NOTIFICATION_CANCEL) {
                                break;
                            }
                        }
                        catch (ex)
                        {
                            // Don't pop alert here because it will block the whole process of notifications
                        }
                    }  //for
                } //if
            } //if
        }
        catch (ex1)
        {
            // Don't pop alert here because it will block the whole process of notifications
        }
        if (hwc.isBlackBerry() || hwc.isIOS() )
        {
            return ret;
        }
        else
        {
            hwc.getDataFromContainer("jsmethodreturn", "&id=" + id + "&jsreturnvalue=" + ret);
        }
    };

    /**
    * Register a push notification listener.
    *
    * @param {anonymous.PushNotificationListener} PushNotificationListener The callback for push notifications.
    * @param {Object} [containingObject] Object containing definition for PushNotificationListener.  If the listener callback function
    * references variables in its containing object, then the containing object should be passed to this function.
    * @public
    * @memberOf hwc
    * @example
    * // pushListener is the callback function that will be passed to hwc.addPushNotificationListener.
    * var pushListener = function( notifications )
    * {
    *    alert( "push notification:\n" + JSON.stringify(notifications) );
    *    return hwc.NOTIFICATION_CONTINUE;
    * }
    * hwc.addPushNotificationListener( pushListener );
    *
    * @example
    * // pushListenerManager is an object that will contain the listener callback as well as a variable
    * // referenced from the callback.
    * var pushListenerManager = {};
    * // doSomething is a function that is called from inside the callback.
    * pushListenerManager.doSomething = function( notifications )
    * {
    *    alert( "push notification:\n" + JSON.stringify(notifications) );
    *    return hwc.NOTIFICATION_CONTINUE;
    * }
    * // This is the callback function.
    * pushListenerManager.listener = function( notifications )
    * {
    *    return this.doSomething( notifications );
    * }
    * // Since the callback function references variables in its containing object, the containing object
    * // must be passed to hwc.addPushNotificationListener as well.
    * hwc.addPushNotificationListener( pushListenerManager.listener, pushListenerManager );
    */
    hwc.addPushNotificationListener = function(PushNotificationListener, containingObject)
    {
        hwc._pushnotificationlisteners.push(PushNotificationListener);
        hwc._pushnotificationlistenerContainingObjects.push(containingObject);
        // The native side will start to notify the notification when the first
        // listener is added
        if (hwc._pushnotificationlisteners.length === 1)
        {
            hwc.getDataFromContainer("startpushnotificationlistener");
        }
    };

    /**
    * Remove the push notification listener.  This function should be called with identical parameters that were used
    * to add the push notification listener with {@link hwc.addPushNotificationListener}.
    *
    * @param {anonymous.PushNotificationListener} PushNotificationListener The callback for push notifications.
    * @param {Object} [containingObject] The containing object of the listener.
    * @public
    * @memberOf hwc
    * @example
    * // pushListener is the callback function that will be passed to hwc.addPushNotificationListener.
    * var pushListener = function( notifications )
    * {
    *    alert( "push notification:\n" + JSON.stringify(notifications) );
    *    return hwc.NOTIFICATION_CONTINUE;
    * }
    * hwc.addPushNotificationListener( pushListener );
    * // At some other point if we want to remove the push listener, we call the following line:
    * hwc.removePushNotificationListener( pushListener );
    *
    * @example
    * // pushListenerManager is an object that will contain the listener callback as well as a variable
    * // referenced from the callback.
    * var pushListenerManager = {};
    * // doSomething is a function that is called from inside the callback.
    * pushListenerManager.doSomething = function( notifications )
    * {
    *    alert( "push notification:\n" + JSON.stringify(notifications) );
    *    return hwc.NOTIFICATION_CONTINUE;
    * }
    * // This is the callback function.
    * pushListenerManager.listener = function( notifications )
    * {
    *    return this.doSomething( notifications );
    * }
    * // Since the callback function references variables in its containing object, the containing object
    * // must be passed to hwc.addPushNotificationListener as well.
    * hwc.addPushNotificationListener( pushListenerManager.listener, pushListenerManager );
    * // when we want to remove the push listener, we call the following line:
    * hwc.removePushNotificationListener( pushListener, pushListenerManager );
    */
    hwc.removePushNotificationListener = function(PushNotificationListener, containingObject)
    {
        var i;
        if (hwc._pushnotificationlisteners.length === 0) {
            return;
        }

        for (i = 0; i < hwc._pushnotificationlisteners.length; i++)
        {
            if (hwc._pushnotificationlisteners[i] === PushNotificationListener &&
            hwc._pushnotificationlistenerContainingObjects[i] === containingObject)
            {
                hwc._pushnotificationlisteners.splice(i, 1);
                hwc._pushnotificationlistenerContainingObjects.splice(i, 1);
                if (hwc._pushnotificationlisteners.length === 0)
                {
                    hwc.getDataFromContainer("stoppushnotificationlistener");
                }
                return;
            }
        }
    };

    /** 
     * A constant indicating that other push notification listeners should continue to be called.
     * Used as a return value for {@link anonymous.PushNotificationListener} functions.
     * @type number
     */
    hwc.NOTIFICATION_CONTINUE = 0;
    /**
     * A constant indicating that no more push notification listeners should be called.
     * Used as a return value for {@link anonymous.PushNotificationListener} functions.
     * @type
     */
    hwc.NOTIFICATION_CANCEL = 1;

    /**
     * A sample implementation of a {@link anonymous.PushNotificationListener} callback function.
     *
     * @param {Array} notifications Array of notifications.
     */
    hwc.sample_PushNotificationListener = function(notifications)
    {
        return hwc.NOTIFICATION_CONTINUE;
    };


   /**
    * This object represents a hybrid app.
    * @class
    * @public
    * @memberOf hwc
    * @param {number} moduleId The module id of this hybrid app.
    * @param {number} version The version of this hybrid app.
    * @param {string} displayName The display name of this hybrid app.
    * @param {number} iconIndex The index specifying the icon representing this Hybrid App.
    * @param {hwc.CustomIcon} defaultCustomIcon The default custom icon for this hybrid app.
    * @param {hwc.CustomIcon[]} customIconList An array of custom icon objects.
    */
   hwc.HybridApp = function (moduleId, version, displayName, iconIndex, defaultCustomIcon, customIconList)
   {
      this.ModuleID = moduleId;
      this.Version = version;
      this.DisplayName = displayName;
      this.IconIndex = iconIndex;
      this.defIcon = defaultCustomIcon;
      this.IconList = customIconList;

      /**
      * Gets the module ID for this hybrid app.
      * @public
      * @memberOf hwc.HybridApp
      * @return {number} The module ID.
      */
      this.getModuleID = function ()
      {
         return this.ModuleID;
      };

      /**
      * Gets the version number for this hybrid app.
      * @public
      * @memberOf hwc.HybridApp
      * @return {number} The version.
      */
      this.getVersion = function ()
      {
         return this.Version;
      };

      /**
      * Gets the display name for this hybrid app.
      * @public
      * @memberOf hwc.HybridApp
      * @return {string} The display name.
      */
      this.getDisplayName = function ()
      {
         return this.DisplayName;
      };

      /**
      * Gets the icon index used in the list of built-in icons.
      * @public
      * @memberOf hwc.HybridApp
      * @return {number} The icon index
      */
      this.getIconIndex = function ()
      {
         return this.IconIndex;
      };

      /**
      * Gets the default custom icon object of this hybrid app.
      * @public
      * @memberOf hwc.HybridApp
      * @return {hwc.CustomIcon} The default custom icon of this hybrid app.  Null if this hybrid app does not have a custom icon.
      */
      this.getDefaultCustomIcon = function ()
      {
         return this.defIcon;
      };

      /**
      * Gets the list of custom icons associated with this hybrid app.
      * @public
      * @memberOf hwc.HybridApp
      * @return {hwc.CustomIcon[]} The array of custom icon objects.  Null if this hybrid app has no custom icons.
      */
      this.getCustomIconList = function ()
      {
         return this.IconList;
      };

      /**
      * Return a {@link hwc.ClientVariables} object for the given module id and version.
      * @public
      * @memberOf hwc.HybridApp
      * @return {hwc.ClientVariables} The {@link hwc.ClientVariables} object for this hybrid app.
      */
      this.getClientVariables = function()
      {
        return hwc.getClientVariables( this.ModuleID, this.Version );
      };
   };

   /**
    * An array of {@link anonymous.ApplicationListener} callback functions.
    * @private
    * @type {anonymous.ApplicationListener[]}
    */
   hwc._applicationListeners = [];
   /**
    * An array of objects containing {@link anonymous.ApplicationListener} callback functions.
    * The containing objects need to be kept track of in the case that a callback function references
    * a variable from its containing object.
    * @private
    * @type {Array}
    */
   hwc._applicationListenerContainingObjects = [];

   /**
    * This is the main entry of application notification. The native code should be
    * hardcoded to call this function internally.
    * @private
    */
   hwc._applicationListenerNotification = function (event, moduleId, version)
   {
      var i, containingObject;
      if (hwc._applicationListeners.length === 0){
         return;
      }

      for (i = 0; i < hwc._applicationListeners.length; i++)
      {
         containingObject = hwc._applicationListenerContainingObjects[i];
         if (containingObject !== null && containingObject !== undefined)
         {
            hwc._applicationListeners[i].call(containingObject, event, moduleId, version);
         }
         else
         {
            hwc._applicationListeners[i](event, moduleId, version);
         }
      }
   };

   /**
    * Register the application listener.
    *
    * @param {anonymous.AppListener} ApplicationListener The callback function for application changes.
    * @param {Object} [containingObject] The containing object of the listener method.  This parameter is only
    * required if the ApplicationListener references the containing object.
    * @public
    * @memberOf hwc
    * @example
    * // This is the callback function that will be passed to hwc.addAppListener.
    * var appListener = function( event, moduleId, version )
    * {
    *    if( event == hwc.APP_ADDED )
    *    {
    *       alert("A hybrid app has been added.");
    *    }
    * }
    * hwc.addAppListener( appListener );
    *
    * @example
    * // appListenerManager is an object that will contain the callback function as well as variables
    * // the callback function references.
    * var appListenerManager = {};
    * // doSomething is a function that is called from inside the callback function.
    * appListenerManager.doSomething = function( event )
    * {
    *    if( event == hwc.APP_REMOVED )
    *    {
    *       alert("A hybrid app has been removed.");
    *    }
    * }
    * // This is the callback function that will be passed to hwc.addAppListener.  It calls doSomething,
    * // the definition of which is in the containing function.
    * appListenerManager.listener = function( event, moduleId, version )
    * {
    *    this.doSomething( event );
    * }
    * // Since the listener callback function references a variable from its containing object,
    * // the containing object must be passed to hwc.addAppListener.
    * hwc.addAppListener( appListenerManager.listener, appListenerManager );
    */
   hwc.addAppListener = function (ApplicationListener, containingObject)
   {
      hwc._applicationListeners.push(ApplicationListener);
      hwc._applicationListenerContainingObjects.push(containingObject);
      // The native side will start to notify the notification when the first
      // listener is added
      if (hwc._applicationListeners.length === 1)
      {
         hwc.getDataFromContainer("startapplistener");
      }
   };

   /**
    * Remove the application listener.  This function should be called with identical parameters
    * that were used to add the application listener with {@link hwc.addAppListener}.
    *
    * @param {anonymous.AppListener} ApplicationListener The callback for application changes.
    * @param {Object} [containingObject] The containing object of the application listener function.
    * @public
    * @memberOf hwc
    * @example
    * // This is the callback function that will be passed to hwc.addAppListener.
    * var appListener = function( event, moduleId, version )
    * {
    *    if( event == hwc.APP_ADDED )
    *    {
    *       alert("A hybrid app has been added.");
    *    }
    * }
    * hwc.addAppListener( appListener );
    * // At some other point, if we want to remove the listener we use the following line of code:
    * hwc.removeAppListener( appListener );
    *
    * @example
    * // appListenerManager is an object that will contain the callback function as well as variables
    * // the callback function references.
    * var appListenerManager = {};
    * // doSomething is a function that is called from inside the callback function.
    * appListenerManager.doSomething = function( event )
    * {
    *    if( event == hwc.APP_REMOVED )
    *    {
    *       alert("A hybrid app has been removed.");
    *    }
    * }
    * // This is the callback function that will be passed to hwc.addAppListener.  It calls doSomething,
    * // the definition of which is in the containing function.
    * appListenerManager.listener = function( event, moduleId, version )
    * {
    *    this.doSomething( event );
    * }
    * // Since the listener callback function references a variable from its containing object,
    * // the containing object must be passed to hwc.addAppListener.
    * hwc.addAppListener( appListenerManager.listener, appListenerManager );
    * // At some other point, if we want to remove the listener we use the following line of code:
    * hwc.removeAppListener( appListenerManager.listener, appListenerManager );
    */
   hwc.removeAppListener = function (ApplicationListener, containingObject)
   {
      var i;
      if (hwc._applicationListeners.length === 0) {
         return;
      }

      for (i = 0; i < hwc._applicationListeners.length; i++)
      {
         if (hwc._applicationListeners[i] === ApplicationListener &&
            hwc._applicationListenerContainingObjects[i] === containingObject)
         {
            hwc._applicationListeners.splice(i, 1);
            hwc._applicationListenerContainingObjects.splice(i, 1);
            if (hwc._applicationListeners.length === 0)
            {
               hwc.getDataFromContainer("stopapplistener");
            }
            return;
         }
      }
   };

   /**
    * A constant indicating that the application list requires a refresh.
    * Used in {@link anonymous.ApplicationListener} callback functions as a possible value for event.
    * @type number
    */
   hwc.APP_REFRESH = 1;
   /**
    * A constant indicating that a hybrid app has been added.
    * Used in {@link anonymous.ApplicationListener} callback functions as a possible value for event.
    * @type number
    */
   hwc.APP_ADDED = 2;
   /**
    * A constant indicating that a hybrid app was updated.
    * Used in {@link anonymous.ApplicationListener} callback functions as a possible value for event.
    * @type number
    */
   hwc.APP_UPDATED = 3;
   /**
    * A constant indicating that a hybrid app was removed.
    * Used in {@link anonymous.ApplicationListener} callback functions as a possible value for event.
    * @type number
    */
   hwc.APP_REMOVED = 4;

   /**
    * A sample {@link anonymous.ApplicationListener} callback function.
    *
    * @param {number} event A number indicating what event has taken place (will be one of {@link hwc.APP_REFRESH},
    * {@link hwc.APP_ADDED}, {@link hwc.APP_UPDATED}, {@link hwc.APP_REMOVED}).
    * @param {number} moduleId The module id of the hyrbid app the event is about.
    * @param {number} version module The version of the hybrid app the event is about.
    */
   hwc.sample_AppListener = function (event, moduleId, version) {
   };

   /**
    * Gets the hybrid app that is currently open.
    *
    * @return {hwc.HybridApp} The hybrid app that is currently open.
    * @public
    * @memberOf hwc
    * @example
    * var openHybridApp = hwc.getCurrentApp();
    */
   hwc.getCurrentApp = function()
   {
      var response, currentApp, app ;
      
      response = "";

      try {
         response = hwc.getDataFromContainer("getcurrentapp");

         if (response !== "")
         {
            app = JSON.parse(response);
            currentApp = new hwc.HybridApp(app.moduleId, app.version, app.displayName, app.iconIndex,
                                       hwc.createCustomIconObject(app.defaultCustomIcon, app.moduleId, app.version, hwc.DEFAULT_CUSTOM_ICON_INDEX),
                                       hwc.createCustomIconList(app.customIconList, app.moduleId, app.version));
         }
      } catch (ex){
        hwc.log("getCurrentApp error:" + ex.message, "ERROR", false);
      }

      return currentApp;
   };

   /**
    * Returns an array of {@link hwc.HybridApp} objects.
    *
    * @param {boolean} [completeList] If this parameter is set to true, then all apps that are user invocable or require
    *        activation will be returned.  If set to false or if it is not set, then if there is a default hybrid app
    *        only the default hybrid app will be returned (and if there is no default hybrid app it will return all hybrid apps
    *        that are user invocable or require activation).
    *        
    * @return {hwc.HybridApp[]} An array of hybrid app objects.
    * @public
    * @memberOf hwc
    * @example
    * var apps = hwc.getInstalledApps();
    *
    * @example
    * var apps = hwc.getInstalledApps( true );
    */
   hwc.getInstalledApps = function( completeList )
   {
      var formattedCompleteList, response, installedApps, app, apps, i;
      
      formattedCompleteList = false;
      response = "";
      installedApps = [];
      
      if( completeList )
      {
         formattedCompleteList = true;
      }
      

      try {
         response = hwc.getDataFromContainer("getinstalledapps", "&getcompletelist=" + formattedCompleteList);

         if (response !== null && response !== undefined && response !== "")
         {
            apps = JSON.parse(response);
            for (i=0; i<apps.length; i++) {
               app = apps[i];
               installedApps[i] = new hwc.HybridApp(app.moduleId, app.version, app.displayName, app.iconIndex,
                                    hwc.createCustomIconObject(app.defaultCustomIcon, app.moduleId, app.version, hwc.DEFAULT_CUSTOM_ICON_INDEX),
                                    hwc.createCustomIconList(app.customIconList, app.moduleId, app.version));
            }
         }
      } catch (ex){
        hwc.log("getInstalledApps error:" + ex.message, "ERROR", false);
      }

      return installedApps;
   };

   /**
    * Returns an array of {@link hwc.HybridApp} objects that are server initiated.
    *
    * @return {hwc.HybridApp[]} An array of server initiated hybrid apps.
    * @public
    * @memberOf hwc
    * @example
    * var serverInitiatedApps = hwc.getServerInitiatedApps();
    */
   hwc.getServerInitiatedApps = function()
   {
      var response = "", serverInitiatedApps = [], app, apps, i;

      try {
         response = hwc.getDataFromContainer("getserverinitiatedapps");

         if (response !== null && response !== undefined && response !== "")
         {
            apps = JSON.parse(response);
            for (i=0; i<apps.length; i++) {
               app = apps[i];
               serverInitiatedApps[i] = new hwc.HybridApp(app.moduleId, app.version, app.displayName, app.iconIndex,
                                    hwc.createCustomIconObject(app.defaultCustomIcon, app.moduleId, app.version, hwc.DEFAULT_CUSTOM_ICON_INDEX),
                                    hwc.createCustomIconList(app.customIconList, app.moduleId, app.version));
            }
         }
      } catch (ex){
        hwc.log("getServerInitiatedApps error:" + ex.message, "ERROR", false);
      }

      return serverInitiatedApps;
   };

   /**
    * Gets a {@link hwc.HybridApp} object with the given module id and version.
    *
    * @param {number} moduleID The module ID of the hybrid app.
    * @param {number} version The version of the hybrid app.
    *
    * @return {hwc.HybridApp} The hybrid app object, or null if there is no hybrid app with the given ID and version.
    * @public
    * @memberOf hwc
    *
    * @example
    * // Messages do not have a direct link to the hybrid app they belong to.  Instead they have
    * // the module ID and version of the hybrid app they belong to.  If you have a message and
    * // need to access its hybrid app, first you must call hwc.getAppByID.
    * var messages = hwc.getAllMessages();
    * if( messages.length > 0 )
    * {
    *   var app = hwc.getAppByID( messages[0].getModuleId(), messages[0].getModuleVersion() );
    * }
    */
   hwc.getAppByID = function (moduleID, version)
   {
      var response, appInstance, app, params;
      
      response = "";
      params = "&moduleid=" + moduleID + "&moduleversion=" + version;

      try {
         response = hwc.getDataFromContainer("getappbyid", params);

         if (response !== "")
         {
            app = JSON.parse(response);
            appInstance = new hwc.HybridApp(app.moduleId, app.version, app.displayName, app.iconIndex,
                                       hwc.createCustomIconObject(app.defaultCustomIcon, app.moduleId, app.version, hwc.DEFAULT_CUSTOM_ICON_INDEX),
                                       hwc.createCustomIconList(app.customIconList, app.moduleId, app.version));
         }
      } catch (ex){
        hwc.log("getAppByID error:" + ex.message, "ERROR", false);
      }

      return appInstance;
   };

   /**
    * A constant indicating that {@link hwc.openApp} completed successfully.
    * This is a possible return value for {@link hwc.openApp}.
    * @type number
    */
   hwc.OPEN_APP_SUCCESS = 0;
   /**
    * A constant indicating that {@link hwc.openApp} failed because the specified app does not exist.
    * This is a possible return value for {@link hwc.openApp}.
    * @type number
    */
   hwc.OPEN_APP_NOT_EXIST = 1;
   /**
    * A constant indicating that {@link hwc.openApp} failed for an unspecified reason.
    * This is a possible return value for {@link hwc.openApp}.
    * @type number
    */
   hwc.OPEN_APP_OTHER = 2;

   /**
    * Launch the hybrid app with the given module ID and version.  The hybrid app will be opened on top of the hybrid app
    * that is open when hwc.openApp is called.  When the hybrid app that was opened with hwc.openApp exits, it will exit
    * to the hybrid app that was open when hwc.openApp was called.  It is possible to nest open hybrid apps, but it is
    * best not to have too many nested hybrid apps (eg: recursively opening hybrid apps) because each open hybrid app
    * takes up device memory.
    * 
    * @param {number} moduleId Module id of the hybrid app.
    * @param {number} version Version of the hybrid app.
    *
    * @return {number} A constant indicating the result of opening the hybrid app (will be one of {@link hwc.OPEN_APP_SUCCESS},
    * {@link hwc.OPEN_APP_NOT_EXIST}, {@link hwc.OPEN_APP_OTHER}).
    * @public
    * @memberOf hwc
    *
    * @example
    * var apps = hwc.getInstalledApps();
    * if( apps.length > 0 )
    * {
    *    // Check to make sure the first app is not this app (the app that is currently running),
    *    // since we don't want to recursively open this app until memory runs out.
    *    if( hwc.getCurrentHybridApp.getDisplayName() != apps[0].getDisplayName() )
    *    {
    *       hwc.openApp( apps[0].getModuleID(), apps[0].getVersion() );
    *    }
    * }
    */
   hwc.openApp = function (moduleId, version)
   {
      var response;
      try {
          response = hwc.getDataFromContainer("openhybridapp", "&moduleid=" + moduleId + "&moduleversion=" + version);
          return parseInt(response, 10);
      } catch (ex){
        hwc.log("app.open error:" + ex.message, "ERROR", false);
      }
   };

   /**
    * A constant indicating the custom icon index.
    * @type number
    */
   hwc.DEFAULT_CUSTOM_ICON_INDEX = -1;

   /**
   * Gets the Hybrid Web Container application connection ID.
   *
   * @return {string} Application connection ID
   * @public
   * @memberOf hwc
   * @example
   * var appConnectionID = hwc.getApplicationConnectionID();
   */
   hwc.getApplicationConnectionID = function() {
       var response = "";
       try
       {
           response = hwc.getDataFromContainer("getconnectionid");
       }
       catch (ex) { 
        hwc.log("get connection id error:" + ex.message, "ERROR", false); 
       }

       return String(response);
   };

   /**
    * Gets the client variables of the hybrid app with given module id and version.
    *
    * @param {number} moduleID The module ID of the hybrid app.
    * @param {number} version The version of the hybrid app.
    * 
    * @return {hwc.ClientVariables} A {@link hwc.ClientVariables} object, or null if there are no
    * ClientVariables for the hybrid app with the given module id and version.
    * @public
    * @memberOf hwc
    * @example
    * var apps = hwc.getInstalledApps();
    * // Loop through the apps, showing the client variables for each one.
    * for( var i = 0; i < apps.length; i++ )
    * {
    *    var app = apps[i];
    *    // Get the client variables.
    *    var clientVariables = hwc.getClientVariables( app.getModuleID(), app.getVersion() );
    *    if( clientVariables.getCount() > 0 )
    *    {
    *       // Get all the names of the variables for this app.
    *       var keys = clientVariables.getAllVariableNames();
    *       // Loop through all the variable for this app.
    *       for( var index = 0; index < keys.length; index++ )
    *       {
    *          // Get a specific variable by name.
    *          var variable = clientVariables.getVariableValueByName( keys[index] );
    *          alert( "variable name: " + keys[index] + "\nvariable value: " + variable );
    *       }
    *    }
    * }
    */
   hwc.getClientVariables = function (moduleID, version)
   {
      var response, clientVariables, parsedResponse, params; 
      
      response = "";
      clientVariables = null;

      params = "&moduleid=" + moduleID + "&moduleversion=" + version;
      try
      {
         response = hwc.getDataFromContainer("getclientvariables", params);

         if (response !== "")
         {
            parsedResponse = JSON.parse( response );
            clientVariables = new hwc.ClientVariables( parsedResponse.version, parsedResponse.items );
         }
      }
      catch (ex)
      {
        hwc.log("getClientVariables error:" + ex.message, "ERROR", false);
      }

      return clientVariables;
   };

   /**
    * Represents a ClientVariables object.
    *
    * @class
    *
    * @param {number} clientVariablesVersion  The version of client variables.
    * @param {Object} clientVariableItems    The json object that contains key/value pairs of client variable items.
    * @public
    * @memberOf hwc
    */
   hwc.ClientVariables = function ( clientVariablesVersion, clientVariablesItems )
   {
      this.version = clientVariablesVersion;
      this.items = clientVariablesItems;

      /**
      * Gets the version of the client variables.
      * @return {number} The version of the client variables.
      * @public
      * @memberOf hwc.ClientVariables
      */
      this.getVersion = function ()
      {
         return this.version;
      };

      /**
      * Gets the number of variables this {@link hwc.ClientVariables} contains.
      * @return {number} The number of variables.
      * @public
      * @memberOf hwc.ClientVariables
      */
      this.getCount = function ()
      {
         var keys = this.getAllVariableNames();

         return keys.length;
      };

      /**
      * Gets an array containing the names of all variables in this {@link hwc.ClientVariables}.
      *
      * @return {string[]} The array holding the names of all variables contained in this {@link hwc.ClientVariables}.
      * @public
      * @memberOf hwc.ClientVariables
      */
      this.getAllVariableNames = function ()
      {
         var result, prop;
         result = [];

         if ( this.items !== undefined  && this.items !== null )
         {
             for ( prop in this.items )
            {
               if ( this.items.hasOwnProperty( prop ) && typeof this.items[ prop ]  === 'string' )
               {
                  result.push( prop );
               }
           }
         }
         result.sort();
         return result;
      };


      /**
      * Check if this {@link hwc.ClientVariables} has a variable by the given name.
      *
      * @param {string} variableName The name of variable to check for.
      * 
      * @return {boolean} True if this {@link hwc.ClientVariables} has a variable by the given name, false otherwise.
      * @public
      * @memberOf hwc.ClientVariables
      */
      this.containsName = function ( variableName )
      {
         if ( this.items === undefined || this.items === null || ( typeof this.items[ variableName ]  !== 'string' ) )
         {
            return false;
         }

         return true;
      };

      /**
      * Gets the value of the variable with the given name.  If this {@link hwc.ClientVariables} does not have a variable
      * by the given name, a {@link hwc.ClientVariablesException} will be thrown.
      *
      * @param {string} variableName The name of the variable to get the value of.
      *
      * @return {string} The value of the variable.
      *
      * @throws {hwc.ClientVariableException} This exception is thrown when there is no variable by the given name in this {@link hwc.ClientVariables}.
      * @public
      * @memberOf hwc.ClientVariables
      */
      this.getVariableValueByName = function ( variableName )
      {
         if ( !this.containsName( variableName ) )
         {
            throw new hwc.ClientVariablesException( hwc.ClientVariables.ITEM_NOT_FOUND, "Unable to find variable name: " + variableName );
         }

         return this.items[ variableName ];
      };
   };

    /**
    * This exception is thrown when {@link hwc.ClientVariables#getVariableValueByName} is called with a variable name that does not exist. 
    * @param {number} errCode The error code (will be {@link hwc.ClientVariables.ITEM_NOT_FOUND}).
    * @param {string} errMsg A message describing the error.
    * @public
    * @memberOf hwc
    * @class
    */
    hwc.ClientVariablesException = function(errCode, errMsg) {
        this.errCode = errCode;
        this.errMsg = errMsg;
    };

    /**
     * A constant indicating that a variable does not exist in a {@link hwc.ClientVariables} object.
     * @type number
     */
    hwc.ClientVariables.ITEM_NOT_FOUND = 1;

   /**
    * Represents a CustomIcon.  Used with the {@link hwc.HybridApp} object.
    * @class
    * @param {number} width The width of this custom icon.
    * @param {number} height The height of this custom icon.
    * @param {string} type The image type of this custom icon.
    * @param {string} name The name of this custom icon.
    * @param {string} path The file path of the unprocessed icon.
    * @param {string} processedPath The file path of the processed icon.
    * @param {number} moduleId The module ID of the hybrid app this icon is for.
    * @param {number} moduleVersion The module version of the hybrid app this icon is for.
    * @param {number} index The index of this custom icon.
    * @public
    * @memberOf hwc
    */
   hwc.CustomIcon = function (width, height, type, name, path, processedPath, moduleId, moduleVersion, index)
   {
      this.w = width;
      this.h = height;
      this.t = type;
      this.n = name;
      this.p = path;
      this.pp = processedPath;
      this.mi = moduleId;
      this.mv = moduleVersion;
      this.index = index;

      /**
       * Gets the width of this custom icon.
       * @return {number} The width of this custom icon.
       * @public
       * @memberOf hwc.CustomIcon
       */
      this.getWidth = function ()
      {
         return this.w;
      };

      /**
       * Gets the height of this custom icon.
       * @return {number} The height of this custom icon.
       * @public
       * @memberOf hwc.CustomIcon
       */
      this.getHeight = function ()
      {
         return this.h;
      };

      /**
       * Gets the image type of this custom icon.
       * @return {string} The file type of the image.
       * @public
       * @memberOf hwc.CustomIcon
       */
      this.getType = function ()
      {
         return this.t;
      };

      /**
       * Gets the name of this custom icon.
       * @return {string} The name of this custom icon.
       * @public
       * @memberOf hwc.CustomIcon
       */
      this.getName = function ()
      {
         return this.n;
      };

      /**
       * Gets the file path of the unprocessed icon.
       * @return {string} The file path of the unprocessed icon.
       * @public
       * @memberOf hwc.CustomIcon
       */
      this.getImagePath = function ()
      {
         return this.p;
      };

      /**
       * Gets the file path of the processed icon.
       * @return {string} The file path of the processed icon.
       * @public
       * @memberOf hwc.CustomIcon
       */
      this.getProcessedImagePath = function ()
      {
         return this.pp;
      };

      /**
       * Gets the URL of this custom icon.  It is possible to call this function directly, but generally
       * it is easier simply to call {@link hwc.getAppIconUrl} or {@link hwc.getMsgIconUrl}.  Those
       * functions handle both cases where there is and isn't a custom icon for the hybrid app or message.
       *
       * @param {boolean} processed When set to true, the URL of the processed icon will be returned.
       * When set to false, the URL of the unprocessed icon will be returned.
       *
       * @return {string} The URL to the target icon.
       * @public
       * @memberOf hwc
       * @example
       * var apps = hwc.getInstalledApps();
       * var app = apps[0];
       * // If app doesn't have a custom icon, then customIcon will be null.
       * var customIcon = app.getDefaultCustomIcon();
       * if( customIcon != null )
       * {
       *    // Create the image element.
       *    var image = document.createElement( "img" );
       *    // Set the source of the image to the icon URL.
       *    image.setAttribute( 'src', customIcon.getIconUrl() );
       *    // Add the image element to the page.
       *    document.body.appendChild( image );
       * }
       */
      this.getIconUrl = function (processed)
      {
          return hwc.getCustomIconUrl(this.mi, this.mv, this.index, processed);
      };
   };

   /**
    * @private
    * This method is called internally.
    * @param {Object} jsonObj The JSON object containing information about the custom icon.
    * @param {number} moduleId The module ID of the hybrid app this custom icon belongs to.
    * @param {number} moduleVersion The module version of the hybrid app this custom icon belongs to.
    * @param {number} index The index of this custom icon.
    * @return {hwc.CustomIcon} The new CustomIcon object.
    */
   hwc.createCustomIconObject = function(jsonObj, moduleId, moduleVersion, index)
   {
      if (jsonObj === null) {
         return null;
      }

      if (jsonObj === undefined) {
         return undefined;
      }

      return new hwc.CustomIcon(jsonObj.width, jsonObj.height, jsonObj.type, jsonObj.name, jsonObj.path, jsonObj.processedPath,
            moduleId, moduleVersion, index);
   };

   /**
    * @private
    * This method is called internally
    * @param {Array} jsonArr An array of JSON objects that contain information about custom icons
    * @param {number} moduleId The module ID that will be associated with the custom icons
    * @param {number} moduleVersion The module version that will be associated with the custom icons
    * @return {hwc.CustomIcon[]} An array of CustomIcon objects
    */
   hwc.createCustomIconList = function (jsonArr, moduleId, moduleVersion)
   {
      var iconArray, i, icon;
      iconArray = [];
      
      if (jsonArr === null) {
         return null;
      }

      if (jsonArr === undefined) { 
         return undefined;
      }

      if (jsonArr.length > 0)
      {
         for (i=0; i<jsonArr.length; i++)
         {
            icon = hwc.createCustomIconObject(jsonArr[i], moduleId, moduleVersion, i);
            if (icon !== null && icon !== undefined){
               iconArray.push(icon);
            }
         }
      }

      return iconArray;
   };


   /**
    * Gets the URL to the custom icon.  This function is used by {@link hwc.CustomIcon#getIconUrl}.
    *
    * @param {number} moduleId The module Id of the hybrid app the custom icon belongs to.
    * @param {number} moduleVersion The version of the hybrid app the custom icon belongs to.
    * @param {number} iconIndex The index of the custom icon.
    * @param {boolean} processed Whether to get the processed icon (true), or the unprocessed icon (false).
    *
    * @return {string} The URL to the target icon.
    * @public
    * @memberOf hwc
    */
   hwc.getCustomIconUrl = function (moduleId, moduleVersion, iconIndex, processed)
   {
      return getRequestUrl("customicon", "moduleid=" + moduleId+ "&moduleversion=" + moduleVersion + "&iconindex=" + iconIndex + "&processed=" + processed);
   };

   /**
    * Gets the icon URL for the built-in icon.  This function is used by {@link hwc.getMsgIconUrl} and {@link hwc.getAppIconUrl}.
    * It is possible to call this function directly, but generally it is easier simply to call {@link hwc.getAppIconUrl} or
    * {@link hwc.getMsgIconUrl} instead.  Those functions handle both cases where there is and isn't a custom icon for the hybrid app or message.
    *
    * @param {number} iconIndex The index of the built-in icon.
    * @param {boolean} processed Whether or not to get the URL of the processed icon (true) or the unprocessed icon (false).
    *
    * @return {string} The URL to the icon.
    * @public
    * @memberOf hwc
    * @example
    * // Create the image element.
    * var builtInIcon = document.createElement( "img" );
    * // Set the source of the image to the icon URL.
    * builtInIcon.setAttribute( 'src', hwc.getBuiltInIconUrl(56, false) );
    * // Add the image element to the page.
    * document.body.appendChild( builtInIcon );
    */
   hwc.getBuiltInIconUrl = function (iconIndex, processed)
   {
       return getRequestUrl("clienticon", "iconindex=" + iconIndex + "&processed=" + processed);
   };

   /**
    * This function gets the URL of the icon for a message object depending on its
    * processed status and whether there are custom icons defined.
    *
    * @param {hwc.Message} msg The message object
    *
    * @return {string} The url to access the icon.
    * @public
    * @memberOf hwc
    * @example
    * var messages = hwc.getAllMessages();
    * if( messages.length > 0 )
    * {
    *    // Create the image element.
    *    var messageIcon = document.createElement("img");
    *    // Set the source of the image to the icon URL.
    *    messageIcon.setAttribute( 'src', hwc.getMsgIconUrl( messages[0] ) );
    *    // Add the image element to the page.
    *    document.body.appendChild( messageIcon );
    * }
    */
   hwc.getMsgIconUrl = function (msg)
   {
      var app = hwc.getAppByID(msg.getModuleId(), msg.getModuleVersion());
      if (app === null || app === undefined) {
         return hwc.getBuiltInIconUrl(msg.getIconIndex(), msg.isProcessed());
      } else {
         return hwc.getAppIconUrl(app, msg.isProcessed());
      }
   };


   /**
    * This function gets the URL of the icon for a hybrid app depending on whether custom icons are defined.
    *
    * @param {hwc.HybridApp} app The hybrid app for which the icon URL is desired.
    * @param {boolean} processed Whether to get the URL of the processed icon (true) or the URL of the unprocessed icon (false).
    *
    * @return {string} The URL of the icon.
    * @public
    * @memberOf hwc
    * @example
    * var apps = hwc.getInstalledApps();
    * if( apps.length > 0 )
    * {
    *    var hybridApp = apps[0];
    *    // Create the image element.
    *    var hybridAppIcon = document.createElement("img");
    *    // Set the source of the image to the icon URL.
    *    hybridAppIcon.setAttribute( 'src', hwc.getAppIconUrl( hybridApp, false ) );
    *    // Add the image element to the page.
    *    document.body.appendChild( hybridAppIcon );
    * }
    */
   hwc.getAppIconUrl = function(app, processed)
   {
      var ci = app.getDefaultCustomIcon();
      if (ci !== null && ci !== undefined)
      {
         return ci.getIconUrl(processed);
      }
      else
      {
         return hwc.getBuiltInIconUrl(app.getIconIndex(), processed);
      }
   };

   /**
    * Represents a message received by the HWC.
    *
    * @class
    * @param {number} msgId The message ID of this message.
    * @param {Date} date The date this message was received.
    * @param {number} icon The icon index for this message.
    * @param {string} sender The sender of this message.
    * @param {boolean} isRead Whether this message has been read or not.
    * @param {boolean} processed Whether this message has been processed or not.
    * @param {number} priority The priority of this message (must be either {@link hwc.MSG_PRIORITY_HIGH} or {@link hwc.MSG_PRIORITY_NORMAL}).
    * @param {string} subject The subject of this message.
    * @param {number} module The module ID of the hybrid app associated with this message.
    * @param {number} version The version of the hybrid app associated with this message.
    * @public
    * @memberOf hwc
    */
   hwc.Message = function (msgId, date, icon, sender, isRead, processed, priority, subject, module, version)
   {
      this.msgId = msgId;
      this.recvDate = date;
      this.iconIndex = icon;
      this.subject = subject;
      this.moduleId = module;
      this.version = version;
      this.processed = processed;
      this.sender = sender;
      this.isread = isRead;
      this.priority = priority;

      /**
       * Gets the message ID of this message.
       * @return {number} The message ID of this message.\
       * @public
       * @memberOf hwc.Message
       */
      this.getMessageId = function ()
      {
         return this.msgId;
      };

      /**
       * Gets the date this message was received.
       * @return {Date} The date this message was received.
       * @public
       * @memberOf hwc.Message
       */
      this.getReceivedDate = function ()
      {
         return this.recvDate;
      };

      /**
       * Gets the icon index of this message.
       * @return {number} The icon index of this message.
       * @public
       * @memberOf hwc.Message
       */
      this.getIconIndex = function ()
      {
         return this.iconIndex;
      };

      /**
       * Gets the sender of this message.
       * @return {string} The sender of this message.
       * @public
       * @memberOf hwc.Message
       */
      this.getSender = function ()
      {
         return this.sender;
      };

      /**
       * Gets whether this message has been read or not.
       * @return {boolean} Whether this message has been read (true) or not (false).
       * @public
       * @memberOf hwc.Message
       */
      this.isRead = function ()
      {
         return this.isread;
      };

      /**
       * Gets the subject of this message.
       * @return {string} The subject of this message.
       * @public
       * @memberOf hwc.Message
       */
      this.getSubject = function ()
      {
         return this.subject;
      };

      /**
       * Gets the module ID of the hybrid app this message belongs to.
       * @return {number} The module ID of the hybrid app this message belongs to.
       * @public
       * @memberOf hwc.Message
       */
      this.getModuleId = function ()
      {
         return this.moduleId;
      };

      /**
       * Gets the version of the hybrid app this message belongs to.
       * @return {number} The version of the hybrid app this message belongs to.
       * @public
       * @memberOf hwc.Message
       */
      this.getModuleVersion = function ()
      {
         return this.version;
      };

      /**
       * Gets whether this message has been processed or not. A message is generally marked as processed once
       * the user submits changes from the hybrid app that was launched from the message.
       *
       * @return {boolean} True if this message has been processed, false otherwise.
       * @public
       * @memberOf hwc.Message
       */
      this.isProcessed = function ()
      {
         return this.processed;
      };

      /**
       * Gets the priority of the message.
       *
       * @return {number} A constant indicating the priority of the message.
       * Will be either {@link hwc.MSG_PRIORITY_NORMAL} or {@link hwc.MSG_PRIORITY_HIGH}.
       * @public
       * @memberOf hwc.Message
       */
      this.getPriority = function ()
      {
         if (this.priority === hwc.MSG_PRIORITY_HIGH) {
            return hwc.MSG_PRIORITY_HIGH;
         } else {
            return hwc.MSG_PRIORITY_NORMAL;
         }
      };
      

      /**
       * Updates the read status of the message.
       *
       * @param {boolean} status The new read status.
       * @public
       * @memberOf hwc.Message
       */
      this.updateRead = function(status)
      {
         hwc.updateMessageRead(this.msgId, status);
         this.isread = status;
      };

      /**
       * Updates the processed status of the message.
       * @param {boolean} status The new processed status.
       * @public
       * @memberOf hwc.Message
       */
      this.updateProcessed = function(status)
      {
         hwc.updateMessageProcessed(this.msgId, status);
         this.processed = status;
      };
   };

   /**
    * Represents a filter used to filter messages.
    * Pass in null for any parameter you do not wish to filter (or do not pass in such parameters at all).
    *
    * @param {string} [sender] The sender of the message.
    * @param {string} [subject] The subject of the message.
    * @param {number} [moduleId] The associated application module ID.
    * @param {number} [version] The associated application module verions.
    * @param {boolean} [isread] The read status.
    * @param {boolean} [processed] The processed status.
    *
    * @class
    * @public
    * @memberOf hwc
    */
   hwc.MessageFilter = function (sender, subject, moduleId, version, isread, processed)
   {
      this.sender = sender;
      this.subject = subject;
      this.moduleId = moduleId;
      this.version = version;
      this.isRead = isread;
      this.processed = processed;
   };

   /**
    * An array of message listener callback functions.
    * @private
    * @type {anonymous.MessageListener[]}
    */
   hwc._messageListeners = [];
   /**
    * An array of objects containing message listener callback functions.
    * The containing objects need to be kept track of since the callback functions may reference
    * variables in the containing object.
    * @private
    * @type Array
    */
   hwc._messageListenerContainingObjects = [];
   /**
    * An array of {@link hwc.MessageFilter} objects.
    * @private
    * @type {hwc.MessageFilter[]}
    */
   hwc._messageListenerFilters = []; // Array of MessageFilter

   /**
    * This is the main entry of message notification. The native code should be
    * hardcoded to call this function
    * @private
    * @param {number} flag Will be one of: {@link hwc.MSG_ADDED}, {@link hwc.MSG_REMOVED}, {@link hwc.MSG_UPDATED}, {@link hwc.MSG_REFRESH}
    * @param {number} msgId The message id that this notification is about.
    */
   hwc._messageListenerNotification = function (flag, msgId)
   {
      var i, filter, msg, containingObject;
      if (hwc._messageListeners.length === 0)
      {
         return;
      }

      msg = hwc.getMessageByID(msgId);
      for (i = 0; i < hwc._messageListeners.length; i++)
      {
         filter = hwc._messageListenerFilters[i];
         if (filter !== null && filter !== undefined)
         {
            if( msg === null )
            {
               // a null message should pass no filter
                  continue;
            }
            if (filter.sender !== null && filter.sender !== undefined)
            {
               if (msg.getSender().toLowerCase() !== filter.sender.toLowerCase()) {
                  continue;
               }
            }

            if (filter.subject !== null && filter.subject !== undefined)
            {
               if (msg.getSubject() !== filter.subject) {
                  continue;
               }
            }

            if (filter.moduleId !== null && filter.moduleId !== undefined)
            {
               if (msg.getModuleId() !== filter.ModuleId) {
                  continue;
               }
            }

            if (filter.version !== null && filter.version !== undefined)
            {
               if (msg.getVersion() !== filter.version) {
                  continue;
               }
            }

            if (filter.isRead !== null && filter.isRead !== undefined)
            {
               if (msg.getRead() !== filter.isRead) {
                  continue;
               }
            }

            if (filter.processed !== null && filter.processed !== undefined)
            {
               if (msg.getProcessed() !== filter.processed) {
                  continue;
               }
            }
         }

         containingObject = hwc._messageListenerContainingObjects[i];
         if (containingObject !== null && containingObject !== undefined)
         {
            hwc._messageListeners[i].call(containingObject, flag, msgId);
         }
         else
         {
            hwc._messageListeners[i](flag, msgId);
         }
      }
   };

   /**
    * Registers a message listener.
    *
    * @param {hwc.MessageFilter} filters The message filter that message events must pass to get passed to the {@link anonymous.MessageListener}.
    * If no filter is desired, then null can be used for this parameter.
    * @param {anonymous.MessageListener} MessageListener The callback function for message changes.
    * @param {Object} [containingObject] The containing object of the message listener.  If a message listener callback function
    * references variables in its containing object, then the containing object should be passed to this function.
    * @public
    * @memberOf hwc
    * @example
    * // soSomething is a global function called by the listener callback.
    * var doSomething = function()
    * {
    *    alert("New message!");
    * }
    * // messageListener is the callback function passed to hwc.addMessageListener.
    * var messageListener = function( flag, messageId )
    * {
    *    if( flag == hwc.MSG_ADDED )
    *    {
    *       doSomething();
    *    }
    * }
    * // We do not want to filter the message events the listener will get invoked for, so pass null for the first parameter.
    * hwc.addMessageListener( null, messageListener );
    *
    * @example
    * // someObject is an object that will contain the listener callback as well as a variable referenced by the callback.
    * var someObject = {};
    * // doSomething is a function referenced by the callback function.
    * someObject.doSomething = function()
    * {
    *    alert("New message!");
    * }
    * // messageListener is the callback that will be passed to hwc.addMessageListener.
    * someObject.messageListener = function( flag, messageId )
    * {
    *    if( flag == hwc.MSG_ADDED )
    *    {
    *       this.doSomething();
    *    }
    * }
    * // Create a filter so that not all message events will invoke our callback function.
    * // Only events about messages with a subject of "Subject" will trigger our callback function.
    * var filter = new hwc.MessageFilter( null, "Subject", null, null, null, null);
    * // The callback function references a variable in its containing object, so we need to pass in the containing object
    * // in addition to the filter and the callback function.
    * hwc.addMessageListener( filter, someObject.messageListener, someObject );
    */
   hwc.addMessageListener = function (filters, MessageListener, containingObject)
   {
      hwc._messageListenerFilters.push(filters);
      hwc._messageListeners.push(MessageListener);
      hwc._messageListenerContainingObjects.push(containingObject);
      if (hwc._messageListeners.length === 1)
      {
         hwc.getDataFromContainer("startmsglistener");
      }
   };

   /**
    * Removes the message listener.  The two parameters passed in to this function should match exactly the corresponding
    * parameters passed into {@link hwc.addMessageListener} when the message listener was added.
    *
    * @param {anonymous.MessageListener} MessageListener The callback for message changes.
    * @param {Object} [containingObject] If the containing object was given to {@link hwc.addMessageListener} when the message
    * listener was added, then it also must be passed into this function.
    * @public
    * @memberOf hwc
    * @example
    * // soSomething is a global function called by the listener callback.
    * var doSomething = function()
    * {
    *    alert("New message!");
    * }
    * // messageListener is the callback function passed to hwc.addMessageListener.
    * var messageListener = function( flag, messageId )
    * {
    *    if( flag == hwc.MSG_ADDED )
    *    {
    *       doSomething();
    *    }
    * }
    * // We do not want to filter the message events the listener will get invoked for, so pass null for the first parameter.
    * hwc.addMessageListener( null, messageListener );
    * // If we want to remove the listener at some other point, use the following line of code:
    * hwc.removeMessageListener( messageListener );
    *
    * @example
    * // someObject is an object that will contain the listener callback as well as a variable referenced by the callback.
    * var someObject = {};
    * // doSomething is a function referenced by the callback function.
    * someObject.doSomething = function()
    * {
    *    alert("New message!");
    * }
    * // messageListener is the callback that will be passed to hwc.addMessageListener.
    * someObject.messageListener = function( flag, messageId )
    * {
    *    if( flag == hwc.MSG_ADDED )
    *    {
    *       this.doSomething();
    *    }
    * }
    * // Create a filter so that not all message events will invoke our callback function.
    * // Only events about messages with a subject of "SI<4>" will trigger our callback function.
    * var filter = new hwc.MessageFilter( null, "SI<4>", null, null, null, null);
    * // The callback function references a variable in its containing object, so we need to pass in the containing object
    * // in addition to the filter and the callback function.
    * hwc.addMessageListener( filter, someObject.messageListener, someObject );
    * // If we want to remove the listener at some other point, use the following line of code:
    * hwc.removeMessageListener( messageListener, someObject );
    */
   hwc.removeMessageListener = function (MessageListener, containingObject)
   {
      var i;
      if (hwc._messageListeners.length === 0) {
         return;
      }

      for (i = 0; i < hwc._messageListeners.length; i++)
      {
         if (hwc._messageListeners[i]+"" === MessageListener+"" &&
            hwc._messageListenerContainingObjects[i] === containingObject)
         {
            hwc._messageListeners.splice(i, 1);
            hwc._messageListenerFilters.splice(i, 1);
            hwc._messageListenerContainingObjects.splice(i, 1);
            if (hwc._messageListeners.length === 0)
            {
               hwc.getDataFromContainer("stopmsglistener");
            }
            return;
         }
      }
   };

   /**
    * A constant indicating that a message needs to be refreshed.  Used in {@link anonymous.MessageListener} callback functions.
    * @type number
    */
   hwc.MSG_REFRESH = 1;
   /**
    * A constant indicating that a message has been added.  Used in {@link anonymous.MessageListener} callback functions.
    * @type number
    */
   hwc.MSG_ADDED = 2;
   /**
    * A constant indicating that a message has been updated.  Used in {@link anonymous.MessageListener} callback functions.
    * @type number
    */
   hwc.MSG_UPDATED = 3;
   /**
    * A constant indicating that a message has been removed.  Used in {@link anonymous.MessageListener} callback functions.
    * @type number
    */
   hwc.MSG_REMOVED = 4;
   /**
    * A constant indicating a message has normal priority.  Used in {@link hwc.Message}.
    * @type number
    */
   hwc.MSG_PRIORITY_NORMAL = 1;
   /**
    * A constant indicating a message has high priority.  Used in {@link hwc.Message}.
    * @type number
    */
   hwc.MSG_PRIORITY_HIGH = 3;

   /**
    * A sample {@link anonymous.MessageListener} callback function.
    *
    * @param {number} flag A number indicating which message event occured (will be one of MSG_* constants).
    * @param {number} msgId The message id of the affected message.
    */
   hwc.sample_MessageListener = function (flag, msgId) {
   };

   /**
    * Gets received messages based on a filter and the existance of a default hybrid app.
    *
    * @param {hwc.MessageFilter} [messageFilter] A filter that all returned messages will pass.
    * If you do not want to filter based on a certain atribute, use null for that attribute when creating the filter.
    * If you do not want to filter at all, pass in null for this parameter or do not pass in this parameter at all.
    * @param {boolean} [completeList] If this parameter is set to true, then all messages will be returned.
    * If this parameter is set to false or if it is not set, then if there is a default hybrid app only the messages belonging
    * to the default hybrid app will be returned (and if there is no default hybrid app all messages will be returned).
    *
    * @return {hwc.Message[]} An array of {@link hwc.Message} objects - the received messages.
    * @public
    * @memberOf hwc
    * @example
    * // get all messages that have the subject "a subject".
    * var filter = new hwc.MessageFilter( null, "a subject", null, null, null, null );
    * var messages = hwc.getAllMessages(filter);
    *
    * @example
    * // Get all messages without filtering, but if there is a default hybrid app only return its messages.
    * var messages = hwc.getAllMessages();
    *
    * @example
    * // Get all messages (without filtering) for all hybrid apps, even if there is a default hybrid app.
    * var messages = hwc.getAllMessages( null, true );
    */
   hwc.getAllMessages = function (filters, completeList) {
      var filtersUrlString, messages, i, message, formattedCompleteList,response, messageInstances;
          
      formattedCompleteList = false;
      response = "";
      messageInstances = [];
      
      if ( completeList )
      {
         formattedCompleteList = true;
      }
      
      try {
         // Create filter url argument
         filtersUrlString = "";
         if( filters )
         {
            if( filters.sender !== undefined && filters.sender !== null )
            {
               filtersUrlString = filtersUrlString + "&filtermessagesender=" + encodeURIComponent(filters.sender);
            }
            if( filters.subject !== undefined && filters.subject !== null &&  filters.subject !== undefined)
            {
               filtersUrlString = filtersUrlString + "&filtermessagesubject=" + encodeURIComponent(filters.subject);
            }
            if( filters.moduleId !== undefined && filters.moduleId !== null )
            {
               filtersUrlString = filtersUrlString + "&filtermessagemoduleid=" + encodeURIComponent(filters.moduleId);
            }
            if( filters.version !== undefined && filters.version !== null )
            {
               filtersUrlString = filtersUrlString + "&filtermessageversion=" + encodeURIComponent(filters.version);
            }
            if( filters.isRead !== undefined && filters.isRead !== null )
            {
               filtersUrlString = filtersUrlString + "&filtermessageisread=" + encodeURIComponent(filters.isRead);
            }
            if( filters.processed !== undefined && filters.processed !== null )
            {
               filtersUrlString = filtersUrlString + "&filtermessageisprocessed=" + encodeURIComponent(filters.processed);
            }
         }

         filtersUrlString += "&getcompletelist=" + formattedCompleteList;

         response = hwc.getDataFromContainer("getmessages", filtersUrlString);

         if (response !== null && response !== undefined && response !== "")
         {
            messages = JSON.parse(response);
            for (i=0; i<messages.length; i++){
               message = messages[i];
               messageInstances[i] = new hwc.Message(message.id, new Date(message.milliseconds), message.iconIndex, message.sender, message.isRead,
                  message.isProcessed, message.priority, message.subject, message.module, message.version);
            }
         }

      }catch (ex){
        hwc.log("messages.getAll error:" + ex.message, "ERROR", false);
      }

      return messageInstances;
   };

   /**
    * Gets a {@link hwc.Message} object with the given message ID.
    *
    * @param {number} msgId The message ID of the message to get.
    *
    * @return {hwc.Message} A message object, or null if no message with given ID.
    * @public
    * @memberOf hwc
    * @example
    * // A message listener is one place that would likely need to call hwc.getMessageByID.
    * var messageListener = function( flag, messageID )
    * {
    *    // Since the callback function only gets the messageID, not the message itself, if we want
    *    // more information about the message we must call hwc.getMessageByID.
    *    var message = hwc.getMessageByID( messageID );
    *    if( message.getSubject() == "a special subject" )
    *    {
    *       alert( "An event occured for a special message!" );
    *    }
    * }
    * hwc.addMessageListener( null, messageListener );
    */
   hwc.getMessageByID = function (msgId)
   {
      var response, messageInstance, message;
      
      response = "";
      messageInstance = null;

      try {
         response = hwc.getDataFromContainer("getmessagebyid", "&msgid=" + msgId);

         if (response !== null && response !== undefined && response !== "")
         {
            message = JSON.parse(response);
            messageInstance = new hwc.Message(message.id, new Date(message.milliseconds), message.iconIndex, message.sender, message.isRead,
                  message.isProcessed, message.priority, message.subject, message.module, message.version);
         }
      }catch (ex){ 
        hwc.log("messages.getMessageByID error:" + ex.message, "ERROR", false);
      }

      return messageInstance;
   };

   /**
    * Updates the message read status.
    *
    * @param {number} msgId The id of message to update the read status for.
    * @param {boolean} status Whether the message will be set to read (true) or unread (false).
    * @public
    * @memberOf hwc
    * @example
    * // set all messages as read
    * var messages = hwc.getAllMessages();
    * for( var index = 0; index < messages.length; index++ )
    * {
    *    hwc.updateMessageRead( messages[index].getMessageId(), true );
    * }
    */
   hwc.updateMessageRead = function (msgId, status)
   {    
      var updateParms;
      try {
         updateParms = "&msgid=" + msgId + "&msgfield=read" + "&status=" + status;
         hwc.getDataFromContainer("updatemessage", updateParms);
      } catch (ex){
        hwc.log("Message.updateMsgRead error:" + ex.message, "ERROR", false);
      }
   };

   /**
    * Updates the message processed status.
    *
    * @param {number} msgId The id of message to update the processed status for.
    * @param {boolean} status Whether the message will be set to processed (true) or unprocessed (false).
    * @public
    * @memberOf hwc
    * @example
    * // set all messages as processed
    * var messages = hwc.getAllMessages();
    * for( var index = 0; index < messages.length; index++ )
    * {
    *    hwc.updateMessageProcessed( messages[index].getMessageId(), true );
    * }
    */
   hwc.updateMessageProcessed = function (msgId, status)
   {
      var updateParms;
      try {
         updateParms = "&msgid=" + msgId + "&msgfield=processed" + "&status=" + status;
         hwc.getDataFromContainer("updatemessage", updateParms);
      } catch (ex){
        hwc.log("Message.updateMsgProcessed error:" + ex.message, "ERROR", false);
      }
   };

   /**
    * Removes (deletes) a message.
    *
    * @param {number} msgId The id of the message to be removed.
    * @public
    * @memberOf hwc
    * @example
    * // remove all messages
    * var messages = hwc.getAllMessages();
    * for( var index = 0; index < messages.length; index++ )
    * {
    *    hwc.removeMessage( messages[index].getMessageId() );
    * }
    */
   hwc.removeMessage = function(msgId) {
      try {
         hwc.getDataFromContainer("removemessage", "&msgid=" + msgId);
      } catch (ex){hwc.log("messages.remove error:" + ex.message, "ERROR", false);}
   };

   /**
    * A constant indicating that a message was successfully opened.  This is a possible return value for {@link hwc.openMessage}.
    * @type number
    */
   hwc.OPEN_MSG_SUCCESS = 0;
   /**
    * A constant indicating that a message could not be opened because no message with the given ID exists.
    * This is a possible return value for {@link hwc.openMessage}.
    * @type number
    */
   hwc.OPEN_MSG_NOT_EXIST = 1;
   /**
    * A constant indicating that a message could not be opened because there was no associated hybrid app.
    * This is a possible return value for {@link hwc.openMessage}.
    * @type number
    */
   hwc.OPEN_MSG_APP_NOT_EXIST = 2;
   /**
    * A constant indicating that a message could not be opened due to an unspecified error.
    * This is a possible return value for {@link hwc.openMessage}.
    * @type number
    */
   hwc.OPEN_MSG_OTHER = 3;

   /**
    * Launch the server initiated hybrid app associated with a message.  The hybrid app will be opened on top of the hybrid app
    * that is open when hwc.openMessage is called.  When the hybrid app that was opened with hwc.openMessage exits, it will exit
    * to the hybrid app that was open when hwc.openMessage was called.  It is possible to nest open hybrid apps, but it is
    * best not to have too many nested hybrid apps (eg: recursively opening hybrid apps) because each open hybrid app
    * takes up device memory.
    *
    * @param {number} msgId The id of message to open.
    *
    * @return {number} A number indicating the success or failure of opening the message (will be one of {@link hwc.OPEN_MSG_SUCCESS},
    * {@link hwc.OPEN_MSG_NOT_EXIST}, {@link hwc.OPEN_MSG_APP_NOT_EXIST}, {@link hwc.OPEN_MSG_OTHER}).
    * @public
    * @memberOf hwc
    * @example
    * // get all messages, then open the first one
    * var messages = hwc.getAllMessages();
    * if( messages.length > 0 )
    * {
    *    hwc.openMessage( messages[0].getMessageId() );
    * }
    */
   hwc.openMessage = function(msgId) {
      var response;
      try {
         response = hwc.getDataFromContainer("openmessage", "&msgid=" + msgId);
         return parseInt(response, 10);
      } catch (ex){
        hwc.log("messages.open error:" + ex.message, "ERROR", false);
      }
   };

   /**
    * This function takes care of handling the XML HTTP request to communicate with the HWC native code on the different platforms.
    *
    * @private
    *
    * @param {string} queryType A string indicating the type of query being sent to the native code.
    * This parameter must match up with a constant defined in the native code of the HWC.
    * @param {string} urlParams A string of parameters for the query, in a format such that it can
    * be added directly to the url.
    *
    * @return {string} The response text of the request.
    * @memberOf hwc
    * @example
    * // This example is an excerpt from hwc.getInstalledApps.  There are many examples of how to use this function in this file.
    * response = hwc.getDataFromContainer("getinstalledapps", "&getcompletelist=true");
    * if (response != null && response != undefined && response != "")
    * {
    *    var apps = JSON.parse(response);
    *    for(var i=0; i<apps.length; i++) {
    *       var app = apps[i];
    *       installedApps[i] = new hwc.HybridApp(app.moduleId, app.version, app.displayName, app.iconIndex,
    *                            hwc.createCustomIconObject(app.defaultCustomIcon, app.moduleId, app.version, hwc.DEFAULT_CUSTOM_ICON_INDEX),
    *                            hwc.createCustomIconList(app.customIconList, app.moduleId, app.version));
    *    }
    * }
    */
   hwc.getDataFromContainer = function( queryType, urlParams)
   {
      var response, xmlhttp;
      response = "";
      try
      {
         if (urlParams === null || urlParams === undefined) {
             urlParams = "";
         }

         if (hwc.isWindowsMobile()) {
            xmlhttp = hwc.getXMLHTTPRequest();
            xmlhttp.open("GET", "/sup.amp?querytype=" + queryType + "&" + hwc.versionURLParam + "&" + urlParams, false );
            xmlhttp.send("");
             response = xmlhttp.responseText;
         }
         else if (hwc.isAndroid()) {
            response = _HWC.getData("http://localhost/sup.amp?querytype=" + queryType + "&" + hwc.versionURLParam + urlParams);
         }
         else if (hwc.isBlackBerry()) {
            xmlhttp = hwc.getXMLHTTPRequest();
            xmlhttp.open("POST", "http://localhost/sup.amp?querytype=" + queryType + "&" + hwc.versionURLParam + urlParams, false);
            xmlhttp.send();
            response = xmlhttp.responseText;
         }
         else if (hwc.isIOS()) {
            xmlhttp = hwc.getXMLHTTPRequest();
            xmlhttp.open("GET", "http://localhost/sup.amp?querytype=" + queryType + "&" + hwc.versionURLParam + urlParams, false);
            try
            {
               xmlhttp.send("");
            }
            catch (ex)
            {
               if (ex.message.search(/XMLHttpRequest Exception 101/) === -1)
               {
                  throw ex;
               }
            }
            response = xmlhttp.responseText;
         }
         return response;
      }
      catch (ex1)
      {
         hwc.log( "hwc.getDataFromContainer error: " + ex1.message, "ERROR", false);
      }
   };

   /**
    * This function takes care of handling the XML HTTP request to communicate with the HWC native code on different platforms.
    *
    * @private
    * @memberOf hwc
    * @param {string} queryType Indicates the type of query being sent to the native code.
    * This parameter must match up with a constant defined in the native code of the HWC.
    * @param {string} data Data to be sent with the request.
    *
    * @return {string} The response text of the request.
    */
   hwc.postDataToContainer = function( queryType, data)
   {
      var response, xmlhttp;
      response = "";
      try
      {
         
         if (hwc.isWindowsMobile()) {
            xmlhttp = hwc.getXMLHTTPRequest();
            xmlhttp.open("POST", "/sup.amp?querytype=" + queryType + "&" + hwc.versionURLParam, false);
            xmlhttp.send(data);
            response = xmlhttp.responseText;
         }
         else if (hwc.isAndroid()) {
            response = _HWC.postData("http://localhost/sup.amp?querytype=" + queryType + "&" + hwc.versionURLParam, data);
         }
         else if (hwc.isBlackBerry()) {
            xmlhttp = hwc.getXMLHTTPRequest();
            xmlhttp.open("POST", "http://localhost/sup.amp?querytype=" + queryType + "&" + hwc.versionURLParam, false);
            xmlhttp.send(data);
            response = xmlhttp.responseText;
         }
         else if (hwc.isIOS()) {
            xmlhttp = hwc.getXMLHTTPRequest();
            xmlhttp.open("POST", "http://localhost/sup.amp?querytype=" + queryType + "&" + hwc.versionURLParam, false);
            try
            {
               xmlhttp.send(data);
            }
            catch (ex)
            {
               if (ex.message.search(/XMLHttpRequest Exception 101/) === -1)
               {
                  throw ex;
               }
            }
            response = xmlhttp.responseText;
         }
         return response;
      }
      catch (ex1)
      {
         hwc.log( "hwc.postDataToContainer error: " + ex1.message, "ERROR", false);
      }
   };

   var partialRequestUrl = null;

    /**
     * Gets a URL that can be used to get resources from the HWC.
     *
     * @private
     * @memberOf hwc
     * @param {string} queryType The type of query
     * @param {string} urlParams Additional parameters to send with the request.  Must be formated such that it can be appended to the url
     * (eg: "firstParam=value1&secondParam=value2").
     *
     * @return {string} A URL that can be used to access resources.
     */
   getRequestUrl = function ( queryType, urlParams )
   {
      // Lazy load to prevent platform identification errors
      if (!partialRequestUrl)
      {
         partialRequestUrl = hwc.isWindowsMobile() ? "/sup.amp?querytype=" :
            hwc.isAndroid() ?
            ( window.location.protocol + "//" + window.location.hostname + "/" + window.location.pathname.split( '/' )[1] + "/sup.amp/querytype=" ) :
            hwc.isBlackBerry() || hwc.isIOS() ? "http://localhost/sup.amp?querytype=" :
            "";
      }

      return partialRequestUrl + queryType + "&" + hwc.versionURLParam + (urlParams ? '&' : "") + urlParams;
   };

   /**
    * Represents a Media Cache.  This object gives the option to use the cache when accessing .
    *
    * @class
    * @public
    * @memberOf hwc
    * @static
    */
   hwc.MediaCache = {};

   /**
    * hwc.MediaCache.Policy An object containing constants representing the different caching policies.
    * @memberOf hwc.MediaCache
    */
   hwc.MediaCache.Policy = {};

   /**
    * hwc.MediaCache.Policy.SERVER_FIRST Use server first policy: requests will only be served from the cache if the server is unavailable.
    * @type {string}
    * @memberOf hwc.MediaCache
    */
   hwc.MediaCache.Policy.SERVER_FIRST = "ServerFirst";
   /**
    * hwc.MediaCache.Policy.CACHE_FIRST Use cache first policy: requests will be served from the cache if possible.
    * @type {string}
    * @memberOf hwc.MediaCache
    */
   hwc.MediaCache.Policy.CACHE_FIRST = "CacheFirst";

   /**
    * Creates a media cache URL for the resource.  The cache first policy will be used if no policy is specified.
    *
    * @param {string} resourceUrl The URL to the resource
    * @param {hwc.MediaCache.Policy} [policy] The optional cache policy to use.
    * If set, it must be either {@link hwc.MediaCache.Policy.SERVER_FIRST} or {@link hwc.MediaCache.Policy.CACHE_FIRST}.
    * Default policy is cache first.
    *
    * @return {string} The URL that can be used to access the resource with the specified caching policy.
    * @public
    * @memberOf hwc.MediaCache
    * @example
    * // This line creates a url that can be used to retrieve the picture from the cache if possible, and from the server otherwise.
    * var mediaCacheURL = hwc.MediaCache.getUrl( "http://yourserver.com/Pictures/pentagon.jpg", hwc.MediaCache.Policy.CACHE_FIRST );
    * // The following function adds a picture to the page. Since the mediaCacheURL variable is used for the url, the picure will be
    * // retrieved from the cache if possible.
    * var addPicFromMediaCache = function()
    * {
    *    // Create the image element.
    *    var image = document.createElement( "img" );
    *    // Set the source of the image to the media cache URL.
    *    image.setAttribute( 'src', mediaCacheURL );
    *    // Add the image element to the page.
    *    document.body.appendChild( image );
    * }
    *
    * @example
    * // This line creates a url that can be used to retrieve the picture from the server if it is available, or the cache otherwise.
    * var mediaCacheURL_serverFirst = hwc.MediaCache.getUrl( "http://yourserver.com/Pictures/pentagon.jpg", hwc.MediaCache.Policy.SERVER_FIRST );
    * // The following function adds a picture to the page.  Since the mediaCacheURL_serverFirst variable is used for the url, the picture will be gotten
    * // from the server if the server is available, and from the cache otherwise.
    * var addPicFromMediaCache_ServerFirst = function()
    * {
    *    // Create the image element.
    *    var image = document.createElement( "img" );
    *    // Set the source of the image to the media cache URL.
    *    image.setAttribute( 'src', mediaCacheURL_serverFirst );
    *    // Add the image element to the page.
    *    document.body.appendChild( image );
    * }
    *
    */
   hwc.MediaCache.getUrl = function ( resourceUrl, policy ) {
      policy = policy ? policy : hwc.MediaCache.Policy.CACHE_FIRST;
      return getRequestUrl( "mediacache", "url=" + encodeURIComponent(resourceUrl)
         + "&policy=" + policy + "&bustCache=" + Math.random() );
   };

   /**
    * Represents an E2E Trace.  This object is used for debugging and analysis.
    * @class
    */
   hwc.e2eTrace = {};

   hwc.e2eTrace.TraceLevel = {};

   /**
    * A constant indicating a high level of detail for the trace.
    * Use this level for functional analysis and detailed functional logging and tracing.
    * @type string
    * @memberOf hwc.e2eTrace
    */
   hwc.e2eTrace.TraceLevel.HIGH = "HIGH";

   /**
    * A constant indicating a low level of detail for the trace.
    * Use this level for response-time-distribution analysis: see how much time is spent on each server component to find bottlenecks.
    * @type string
    * @memberOf hwc.e2eTrace
    */
   hwc.e2eTrace.TraceLevel.LOW = "LOW";

   /**
    * A constant indicating a medium level of detail for the trace.
    * Use this level for performance analysis (performance traces are triggered on server-side).
    * @type string
    * @memberOf hwc.e2eTrace
    */
   hwc.e2eTrace.TraceLevel.MEDIUM = "MEDIUM";

   /**
    * Gets whether the e2e tracing has been requested to be started.
    * This function returns true between calls to {@link hwc.e2eTrace#startTrace} and {@link hwc.e2eTrace#stopTrace}.
    * @memberOf hwc.e2eTrace
    * @return {boolean} True if trace is enabled, false otherwise.
    */
   hwc.e2eTrace.isTraceEnabled = function() {
      return parseBoolean(hwc.getDataFromContainer("e2etrace", "&method=istraceenabled"));
   };

   /**
    * Sets the passport e2eTrace level.  This function must be called before {@link hwc.e2eTrace#startTrace}.
    *
    * @param {string} The trace level.  Must be one of {@link hwc.e2eTrace.TraceLevel.LOW}, {@link hwc.e2eTrace.TraceLevel.MEDIUM}, or
    * {@link hwc.e2eTrace.TraceLevel.HIGH}.
    * @memberOf hwc.e2eTrace
    */
   hwc.e2eTrace.setTraceLevel = function(level) {
      hwc.getDataFromContainer("e2etrace", "&method=settracelevel&level=" + level);
   };

   /**
    * Starts tracing user actions and requests.  Before this function is called, the trace level must be set with {@link hwc.e2eTrace#setTracelevel}.
    * @memberOf hwc.e2eTrace
    */
   hwc.e2eTrace.startTrace = function() {
      hwc.getDataFromContainer("e2etrace", "&method=starttrace");
   };

   /**
    * Stops tracing user actions and requests.
    * @memberOf hwc.e2eTrace
    */
   hwc.e2eTrace.stopTrace = function() {
      hwc.getDataFromContainer("e2etrace", "&method=stoptrace");
   };

   /**
    * Upload the e2e trace xml (Business Transaction Xml – BTX) to the server.
    * To upload, the SAP Solution Manager URL must be set in Sybase Control Center configuration.
    * @return {boolean} True if the upload is successful, false otherwise.
    * @memberOf hwc.e2eTrace
    */
   hwc.e2eTrace.uploadTrace = function() {
      return parseBoolean(hwc.getDataFromContainer("e2etrace", "&method=uploadtrace"));
   };

   /**
    * Represents the Performance Manager.
    * @class
    * @memberOf hwc
    * @example
    * // Start performance collection. 
    * if (hwc.perf.isEnabled())
    * {
    *     hwc.perf.stopInteraction();
    * }
    * 
    * hwc.perf.startInteraction('someinteraction');
    * 
    * hwc.perf.startInterval('IntervalName', 'CustomType'); // Start an optional interval.
    * 
    * // Stop performance collection.  Logs will be written.
    * if (hwc.perf.isEnabled())
    * {
    *   hwc.perf.stopInterval('IntervalName'); // Stop an optional interval.
    *   hwc.perf.stopInteraction();
    * }
    */
hwc.perf = {};

   /**
    * Gets whether the performance agent is enabled.
    * @return {boolean} True if the performance agent is enabled, false otherwise.
    * @memberOf hwc.perf
    */
   hwc.perf.isEnabled = function() {
      return parseBoolean(hwc.getDataFromContainer("perf", "&method=isenabled"));
   };
	  
   /**
    * Starts the interaction.
    * @param {string} interactionName The name of the interaction.
    * @memberOf hwc.perf
    */
   hwc.perf.startInteraction = function(interactionName) {
      hwc.getDataFromContainer("perf", "&method=startinteraction&interactionname=" + encodeURIComponent(interactionName));
   };
	  
   /**
    * Stops the interaction.
    * @memberOf hwc.perf
    */
   hwc.perf.stopInteraction = function() {
      hwc.getDataFromContainer("perf", "&method=stopinteraction");
   };
	  
   /**
    * Starts an interval.
    * @param {string} intervalName The name of the interval.
    * @param {string} intervalType The type of the interval.\
    * @memberOf hwc.perf
    */
   hwc.perf.startInterval = function(intervalName, intervalType) {
      hwc.getDataFromContainer("perf", "&method=startinterval&intervalname=" + encodeURIComponent(intervalName) + "&intervaltype=" + encodeURIComponent(intervalType));
   };
	  
   /**
    * Stops the interval.
    * @param {string} intervalName The name of the interval.
    * @memberOf hwc.perf
    */
   hwc.perf.stopInterval = function(intervalName) {
      hwc.getDataFromContainer("perf", "&method=stopinterval&intervalname=" + encodeURIComponent(intervalName));
   };

   /**
    * Internal function to parse a boolean
    * @private
    */
   function parseBoolean(val)
   {
      return val === 'true';
   }
})(hwc);

/**
 * @namespace Used to group anonymous objects and callback functions used as method parameters. Methods and fields in this
 * namespace cannot be instantiated. Used for API docs generation only.
 */
anonymous = (typeof anonymous === "undefined" || !anonymous) ? {} : anonymous;      // SUP 'namespace'


/**
 * Callback function that will be invoked when the connection state changes.  Connection listeners can be added with {@link hwc.addConnectionListener}.
 *
 * @name anonymous.ConnectionStateListener
 *
 * @param {number} event A number indicating the event that occurred (will be {@link hwc.CONNECTED} or {@link hwc.DISCONNECTED}).
 * @param {number} errorCode An error code (0 indicating success).
 * @param {string} errorMessage Text of the error message.  Will be empty of there is no error.
 *
 * @function
 */

/**
 * Callback function that will be invoked when events are logged to the event log.  Log listeners can be added with {@link hwc.addLogListener}.
 *
 * @name anonymous.LogListener
 *
 * @param {number} milliseconds The date of the log message represented in milliseconds.
 * @param {number} event A number that represents which category this event falls under (It will be one of {@link hwc.CONNECTION_ERROR},
 * {@link hwc.CONNECTION_OTHER}, {@link hwc.CONNECTION_CONNECTED}, {@link hwc.CONNECTION_DISCONNECTED}, {@link hwc.CONNECTION_RETRIEVED_ITEMS}).
 * @param {string} optionalString The string carrying the message of the log event.
 *
 * @function
 */

/**
 * Callback function that will be invoked on hybrid app installation events.  App installation listeners can be added with
 * {@link hwc.addAppInstallationListener}.
 *
 * @name anonymous.AppInstallationListener
 *
 * @param {number} event A number indicating the event (will be either {@link hwc.INSTALLATION_BEGIN} or {@link hwc.INSTALLATION_END}).
 * @param {string} moduleId The module ID of the hybrid app the event is about.
 * @param {string} version The version of the hybrid app the event is about.
 * @param {string} moduleName The display name of the hybrid app the event is about.
 *
 * @function
 */

/**
 * Callback function that will be invoked when push notifications are available.
 * Push notification listeners can be added with {@link hwc.addPushNotificationListener}.
 *
 * @name anonymous.PushNotificationListener
 *
 * @param {Array} notifications An array of notifications.
 *
 * @return {number} A number indicating whether other push notification listeners should be called after this one.
 * Must be either {@link hwc.NOTIFICATION_CANCEL} (if no more listener callbacks should be called) or {@link hwc.NOTIFICATION_CONTINUE}
 * (if more listener callbacks should be called).
 *
 * @function
 */
   /**
    * Callback function that will be invoked on hybrid app installation events.
    * @name anonymous.AppInstallationListener
    * @param {Integer} event            Installation flags including, BEGIN(1), END(2)
    * @param {String} moduleId          Optional Module Id
   	* @param {String} version           Optional Module version
   	* @param {String} moduleName        Optional Module display name
   	* @callback
   	* @function
    */

/**
 * Callback function that will be invoked on hybrid app events.
 * Application listeners can be added with {@link hwc.addAppListener}.
 *
 * @name anonymous.ApplicationListener
 *
 * @param {number} event A number indicating what event has taken place (will be one of {@link hwc.APP_REFRESH},
 * {@link hwc.APP_ADDED}, {@link hwc.APP_UPDATED}, {@link hwc.APP_REMOVED}).
 * @param {number} moduleId The module id of the hyrbid app the event is about.
 * @param {number} version module The version of the hybrid app the event is about.
 *
 * @function
 */

/**
 * Callback function that will be invoked on message events.  Message listeners can be added with {@link hwc.addMessageListener}.
 *
 * @name anonymous.MessageListener
 *
 * @param {number} flag A number indicating which message event occured (will be one of {@link hwc.MSG_ADDED}, {@link hwc.MSG_REMOVED},
 * {@link hwc.MSG_UPDATED}, {@link hwc.MSG_REFRESH}).
 * @param {number} msgId The message id of the affected message.
 *
 * @function
 */

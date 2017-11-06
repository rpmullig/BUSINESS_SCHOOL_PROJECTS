/*
 * Sybase Hybrid App version 2.2
 *
 * Certificate.js
 * This file will not be regenerated, so it is possible to modify it, but it
 * is not recommended.
 *
 * Last Updated: 2011/6/29
 *
 * Copyright (c) 2012 Sybase Inc. All rights reserved.
 *
 * Note a certificate object will have the following fields
    - issuerCN - The common name (CN) from the certificate issuer's distinguished name.
    - issuerDN - The certificate issuer's distinguished name, in string form.
    - notAfter - End time for certificate's validity period, with date/time fields as they would appear in UTC.
    - notBefore - Start time for the certificate's validity period, with date/time fields as they would appear in UTC.
    - signedCertificate - The digitally signed certificate in Base64 format
    - subjectCN - The common name (CN) from the certificate subject's distinguished name.
    - subjectDN - The certificate subject's distinguished name, in string form.
  */

/**
 * This class represents an X.509 public certificate store.
 */

/**
 * @namespace The namespace for the Hybrid Web Container javascript
 */
hwc = (typeof hwc === "undefined" || !hwc) ? {} : hwc;      // SUP 'namespace'


(function(hwc, window, undefined) {
/**
 * Use these functions for X.509 credential handling.
 * <p>
 * Use these functions to create a user interface in HTML and JavaScript, that uses X.509 certificates as the Workflow credentials.
 * </p>
 * <p>
 * This file contains the functions that allow parsing a certificate date, creating a certificate from a JSON string value, retrieving a certificate from a file (Android), retrieving a certificate from the server (iOS), and so on. 
 * </p>
 * @class
 * @memberOf hwc
 */
hwc.CertificateStore = function() {
};

(function() {
    /**
     * Private function
     * Convert string type date to JavaScript Date
     * Format: 2014-05-24T20:00:12Z -> Sat May 24 2014 16:00:12 GMT-0400 (Eastern Daylight Time)
     *
     * @private
     * @param value Date string to parse
     * @return Javascript type Date object
     */
    function parseCertDate(value) {
        var a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
    }

    /**
     * Private function
     * Create certificate object
     *
     * @private
     * @param value JSON string type certificate
     *              {"subjectDN":"CN=android, OU=SUP, O=Sybase, L=Dublin, ST=California, C=US",
     *              "notBefore":"2012-05-24T20:00:12Z",
     *              "notAfter":"2014-05-24T20:00:12Z",
     *              "subjectCN":"android",
     *              "signedCertificate":"base64 encoded string here",
     *              "issuerDN":"CN=teva, CN=sybase.com, OU=Unwired Enterprise, O=Sybase Inc., L=Dublin, ST=California, C=US",
     *              "issuerCN":"teva"}
     * @return Certificate object
     */
    function createCert(value) {
        var cert;
        if (value === null || typeof value === 'undefined' || value.length === 0) {
            return null;
        }

        cert = JSON.parse(value);

        if (cert.notAfter) {
            cert.notAfter = new Date(parseCertDate(cert.notAfter));
        }
        if (cert.notBefore) {
            cert.notBefore = new Date(parseCertDate(cert.notBefore));
        }

        return cert;
    }

    /**
    * Returns a list of all the certificate labels in this store (can be empty). Each certificate in this store has a unique label.
    *
    * <b>Supported Platforms: </b> Windows Mobile and BlackBerry.
    * @feature Certificate
    * @public
    * @memberOf hwc.CertificateStore
    * @param {String} filterSubject filter of subject
    * @param {String} filterIssuer filter of issuer
    * @return {String[]} Only filtered certificate labels
    * @example
    * // The following script gets all the labels for certificates
    * // with the provided subject and issuer
    * var certStore = CertificateStore.getDefault();
    * var labels = certStore.certificateLabels("MyUser", "mydomain.com");
    */
    hwc.CertificateStore.prototype.certificateLabels = function(filterSubject, filterIssuer) {
        var response = "";
        
        filterSubject = filterSubject ? filterSubject : "";
        filterIssuer = filterIssuer ? filterIssuer : "";

        if (hwc.isWindowsMobile()) {
              response = hwc.getDataFromContainer("certificatestore", "&command=certificateLabels" +
                    "&filterSubject=" + encodeURIComponent(filterSubject) + "&filterIssuer=" + encodeURIComponent(filterIssuer));
        }
        else if (hwc.isBlackBerry()) {
            response = _HWC.getCertificateLabels(filterSubject, filterIssuer);
        }
        else {
            throw "Not supported on this platform";
        }

        return eval('(' + response + ')');
    };

    /**
    * Returns a certificate without the signedCertificate part set.
    * @feature Certificate
    * @public
    * @memberOf hwc.CertificateStore
    * @return {hwc.CertificateStore} a certificate without the signedCertificate part set
    */
    hwc.CertificateStore.getDefault = function() {
        return new hwc.CertificateStore();
    };

    /**
    * Returns a certificate without the signedCertificate part set.
    *
    * <b> Supported Platforms </b>: Windows Mobile and BlackBerry.
    * @feature Certificate
    * @public
    * @memberOf hwc.CertificateStore
    * @param {String} label label of the desired certificate
    * @return certificate object
    * @example
    * // The following script gets the certificate data for the first
    * // certificate to match the provided subject and issuer
    * var certStore = CertificateStore.getDefault();
    * var labels = certStore.certificateLabels("MyUser", "mydomain.com");
    * var cert = certStore.getPublicCertificate(labels[0]);
    */
    hwc.CertificateStore.prototype.getPublicCertificate = function(label) {
        var response = "";

        if (hwc.isWindowsMobile()) {
              response = hwc.getDataFromContainer("certificatestore", "&command=getPublicCertificate" +
                    "&label=" + encodeURIComponent(label));
        }
        else if (hwc.isBlackBerry()) {
            response = _HWC.getPublicCertificate(label);
        }
        else {
            throw "Not supported on this platform";
        }

        return createCert(response);
    };


    /**
    * Returns the certificate with the specified label, and decrypts it if necessary using the specified password,
    * or returns null if the certificate is encrypted and the password is incorrect.
    *
    * <b>Supported Platforms</b>: Windows Mobile and BlackBerry
    * @feature Certificate
    *
    * @public
    * @memberOf hwc.CertificateStore
    * @param {String} label label of the desired certificate
    * @param {String} password Access password for the private key of the certificate. Pass null unless the platform requires a password.
    * @return Certificate object
    * @example
    * // The following script gets the signed certificate data for the first
    * // certificate to match the provided subject and issuer
    * var certStore = CertificateStore.getDefault();
    * var labels = certStore.certificateLabels("MyUser", mydomain.com");
    * var cert = certStore.getSignedCertificate(labels[0]);
    *
    * var username = cert.subjectCN;
    * var password = cert.signedCertificate;
    */
   hwc.CertificateStore.prototype.getSignedCertificate = function(label, password) {
        var response = "";

        if (hwc.isWindowsMobile()) {
              response = hwc.getDataFromContainer("certificatestore", "&command=getSignedCertificate" +
                    "&label=" + encodeURIComponent(label));
        } else if (hwc.isBlackBerry()) {
            response = _HWC.getSignedCertificate(label);
        } else {
            throw "Not supported on this platform";
        }

        return createCert(response);
    };

    /**
    * Returns a list of full path names for the certificate files found in the
    * file system for import.
    *
    * <b>Supported Platforms</b>: Android
    * @feature Certificate
    * @memberOf hwc.CertificateStore
    * @public
    * @param {String} sFolder Folder in which to search for files.  This should be a full
    *        absolute path, based on the root of the device file system.  The
    *        separator may be either "/" or "\".   For example, "\sdcard\mycerts"
    *        or "/sdcard/mycerts" is acceptable.   Do not include any http
    *        prefixes, such as "file:".
    * @param {String} sFileExtension File extension to which the list should be
    *        restricted.  Pass the string expected after the "." in the file
    *        name.  For example, to match *.p12, pass "p12" as the argument.
    *        Pass null to return all files in the folder.
    * @return {String[]} A list of Strings, each String being the full path name of a
    *         matched file in the given folder.
    * @example
    * // The following script gets an array of file paths for files on
    * // the sdcard with the extension p12
    * var certStore = CertificateStore.getDefault();
    * var certPaths = certStore.listAvailableCertificatesFromFileSystem("/sdcard/", "p12");
    */
    hwc.CertificateStore.prototype.listAvailableCertificatesFromFileSystem = function(sFolder, sFileExtension) {
        var response = "";

        if (hwc.isAndroid()) {
            response = _HWC.listAvailableCertificatesFromFileSystem(sFolder, sFileExtension);
        } else {
            throw "Not supported on this platform";
        }

        return eval('(' + response + ')');
    };

    /**
    * Gets a certificate from a file.
    *
    * <b>Supported Platforms</b>: Android
    * @feature Certificate
    * @public
    * @memberOf hwc.CertificateStore
    * @param {String} filePath The absolute path to the file.
    * @param {String} password The password needed to access the certificate's private data.
    * @example
    *   // The following script gets the signed certificate data for the first
    *   // p12 file found on the sdcard
    *   var certStore = CertificateStore.getDefault();
    *   var certPaths = certStore.listAvailableCertificatesFromFileSystem("/sdcard/", "p12");
    *   var cert = certStore.getSignedCertificateFromFile(certPaths[0], "password");
    */
    hwc.CertificateStore.prototype.getSignedCertificateFromFile = function(filePath, password) {
        var response = "";

        if (hwc.isAndroid()) {
            response = _HWC.getSignedCertificateFromFile(filePath, password);
        } else if (hwc.isIOS()) {
              response = hwc.getDataFromContainer("certificatestore", "&command=getSignedCertificateFromFile" +
                    "&filePath=" + encodeURIComponent(filePath) + "&password=" + encodeURIComponent(password));
        }
        else {
            throw "Not supported on this platform";
        }

        return createCert(response);
    };


    /**
    * Gets a certificate from the server.
    *
    * <b>Supported Platforms</b>: iOS
    * @feature Certificate
    * @public
    * @memberOf hwc.CertificateStore
    * @param {String} username The username for the Windows user (in the form "DOMAIN\\username")
    * @param {String} serverPassword The password for the Windows user
    * @param {String} certPassword The password needed to access the certificate (may be the same or different from the Windows password)
    * @example
    * // The following script gets the signed certificate data for the
    * // user MYDOMAIN\MYUSERNAME from the server
    * var certStore = CertificateStore.getDefault();
    * cert = certStore.getSignedCertificateFromServer("MYDOMAIN\\MYUSERNAME", "myserverpassword", "mycertpassword");
    */
    hwc.CertificateStore.prototype.getSignedCertificateFromServer = function(username, serverPassword, certPassword) {
        var response = "";

        if (hwc.isIOS()) {
              response = hwc.getDataFromContainer("certificatestore", "&command=getSignedCertificateFromServer" +
                    "&username=" + encodeURIComponent(username) + "&serverPassword=" + encodeURIComponent(serverPassword) +
                    "&certPassword=" + encodeURIComponent(certPassword));
        } else {
            throw "Not supported on this platform";
        }

        return eval('(' + response + ')');
    };

    /**
    * Gets a certificate from the Afaria server.
    * To retrieve an x509 certificate from Afaria, you must get a CertificateStore and then call getSignedCertificateFromAfaria. If Afaria is installed and configured on the device, this gets the Afaria seeding file from the Afaria server. 
    * If the seeding file is retrieved from the Afaria server, the user is prompted to update user specific information in the Settings screen.
    *
    * <b>Supported Platforms</b>: iOS, Android & BlackBerry
    * @feature Certificate
    * @public
    * @memberOf hwc.CertificateStore
    * @param {String} commonName Common name used to generate the certificate by Afaria
    * @param {String} challengeCode Challenge code for the user so that CA can verify and sign it
    * @return JSON object with CertBlob in Base64 encoded format and other information about certificate
    * @throws If called on a platform that is not supported.
    * @example
    * // The following script gets a signed certificate from the Afaria server.
    * var certStore = CertificateStore.getDefault();
    * cert = certStore.getSignedCertificateFromAfaria("Your_CN", "CA_challenge_code");
    */
    hwc.CertificateStore.prototype.getSignedCertificateFromAfaria = function(commonName, challengeCode) {
        var response = "";

        if (hwc.isIOS()) {
              response = hwc.getDataFromContainer("certificatestore", "&command=getSignedCertificateFromAfaria" +
                    "&commonname=" + encodeURIComponent(commonName) + "&challengecode=" + encodeURIComponent(challengeCode));
        } else if (hwc.isAndroid() || hwc.isBlackBerry()) {
            response = _HWC.getSignedCertificateFromAfaria(commonName, challengeCode);
        }
        else {
            throw "Not supported on this platform";
        }

        return eval('(' + response + ')');
    };
} ());

})(hwc, window);

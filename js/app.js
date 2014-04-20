/*global $ */
/*jshint unused:false */
var app = app || {};
var ENTER_KEY = 13;
var ESC_KEY = 27;

Appacitive.config.apiBaseUrl = "http://appacitivenext.cloudapp.net:1877/v1.0/";


Appacitive.initialize({
	apikey: '3clnQYQrR3+2cpcBSl5ISC9ut+3ygqu3Kc5aQoZuCDw=', 
    env: 'sandbox', 
    appId: '56846109403906314'
});

$(function () {
	'use strict';

	// kick things off by creating the `App`
	new app.AppView();
});
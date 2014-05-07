/*global $ */
/*jshint unused:false */
var app = app || {};
var ENTER_KEY = 13;
var ESC_KEY = 27;

Appacitive.initialize({
	apikey: 'MDQ2NWZlNjVhZjgxNjc5MDMxZTNkMmQ0ZmQxNDI4MjMxYjY3OWE3MDdjMmZiMmNhZGRkY2UyMjc0ZWZlNjUwNA==', 
    env: 'sandbox', 
    appId: '56564813671825740'
});

$(function () {
	'use strict';

	// kick things off by creating the `App`
	new app.AppView();
});
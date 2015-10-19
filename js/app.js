/*global $ */
/*jshint unused:false */
var app = app || {};
var ENTER_KEY = 13;
var ESC_KEY = 27;

var renderAppView = function() {
	$(function () {
		'use strict';

		// kick things off by creating the `App`
		new app.AppView();
	});
}


//======== Replace this function call with `Appacitive.initialize` here =========
renderAppView();
/*global Backbone, jQuery, _, ENTER_KEY , Appacitive/Backbone.LocalStorage  */
var app = app || {};

(function ($) {
	'use strict';

	// The Application
	// ---------------

	// Our overall **AppView** is the top-level piece of UI.
	// The main view for the app
	app.AppView = Backbone.View.extend({
		// Instead of generating a new element, bind to the existing skeleton of
		// the App already present in the HTML.
		el: $("#todoapp"),

		initialize: function() {
		  this.render();
		},

		// Renders either of the 2 views viz. LoginView or TodosView
		// Depending on whether the user is logged-in or not.
		// Check this ysing mockedUser value in localStorage
		render: function() {
			app.user = (typeof Appacitive != 'undefined') ? Appacitive.User.currrent() : (window.localStorage['backbone-user'] ? new app.User(window.localStorage['backbone-user']) : null);

			if (app.user) {
				new app.TodosView();
			} else {
				new app.LogInView();
			}
		}
	});
})(jQuery);
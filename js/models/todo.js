/*global Backbone, Appacitive/Backbone.LocalStorage */
var app = app || {};

(function () {
	'use strict';

	// Todo Model
	// ----------

	// Our basic **Todo** model has `title`, `order`, and `completed` attributes.
	/* Replace Backbone.Model.extend() call  with 
	   Appacitive.Object.extend('todo', {
		    //.....
	   }); */
	// To use Appacitive as data store
	app.Todo = Backbone.Model.extend({
		
		// Default attributes for the todo
		// and ensure that each todo created has `title` and `completed` keys.
		defaults: {
			title: '',
			completed: false
		},

		// Toggle the `completed` state of this todo item.
		toggle: function () {
			this.set('completed', !this.get('completed', 'boolean'));
			this.save();
		},

		// To cast toJSON response
		getParsed: function() {
			var attrs = this.toJSON();
			attrs.completed = this.get('completed', 'boolean');
			attrs.order = this.get('order', 'integer');
			return attrs;
		}
	});

	// User Model
	// ----------
	// Our basic **User** model has `username`, `password`,`firstname`, `lastname` and `email` attributes.
	// Remove this model once you start integration with Appacitive
	// To use Appacitive as data store

	app.User = Backbone.Model.extend();
})();
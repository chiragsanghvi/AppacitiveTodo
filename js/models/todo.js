/*global Backbone, , Appacitive */
var app = app || {};

(function () {
	'use strict';

	// Todo Model
	// ----------

	// Our basic **Todo** model has `title`, `order`, and `completed` attributes.
	app.Todo = Appacitive.Object.extend("todo", {
		
		initialize: function() {
			this.fields(["completed", "title", "order"])
		},

		// Default attributes for the todo
		// and ensure that each todo created has `title` and `completed` keys.
		defaults: {
			title: '',
			completed: false
		},

		// Toggle the `completed` state of this todo item.
		toggle: function () {
			this.set('completed', !this.tryGet('completed', false, 'boolean'));
			this.save();
		}
	});
})();
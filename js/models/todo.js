/*global Backbone, , Appacitive */
var app = app || {};

(function () {
	'use strict';

	// Todo Model
	// ----------

	// Our basic **Todo** model has `title`, `order`, and `completed` attributes.
	app.Todo = Appacitive.Object.extend({
		
		//type name to which this object binds on Appacitive
    	typeName: "todo",

		// Function called after object is created
		// Set fields property for this object
		// Ro return specific attributes on fetch call
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
			this.set('completed', !this.get('completed'));
			this.save();
		}
	});

	// Owner connection model
	// ----------

	// Our basic **owner** relation model, which connects logged-in user
	// to todo model
	app.Owner = Appacitive.Connection.extend({
		
		//relation name to which this connection binds on Appacitive
    	relationName: "owner",

		// Override internal constructor to add endpoints for connection
		// If `todo`, an instance of app.Todo is passed then only we change the attributes to add endpoints
		// Finally we call the internal constructor
		constructor: function() {
			
			var args = Array.prototype.slice.call(arguments);

			// To avoid other parsing conflicts with connectedObjects
			if (args[0] instanceof app.Todo) {
				arguments[0] = {
					endpoints: [{
						label: 'user',
						object: Appacitive.Users.current()
					}, {
						label: 'todo',
						object: args[0]
					}]
				};
			}
			//Invoke internal constructor
    		Appacitive.Connection.apply(this, arguments);
		}
	});
})();
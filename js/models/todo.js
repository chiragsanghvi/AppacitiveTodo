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
		},

		// To cast toJSON response
		// Cast completed into boolean and order into integer type
		getParsed: function() {
			var attrs = this.toJSON();
			attrs.completed = this.get('completed', 'boolean');
			attrs.order = this.get('order', 'integer');
			return attrs;
		}
	});

	// Owner connection model
	// ----------

	// Our basic **owner** relation model, which will connects logged-in user
	// to todo model
	app.Owner = Appacitive.Connection.extend("owner", {
		constructor: function(todo) {
			// To avoid other parsing conflicts
			if (todo instanceof app.Todo) {
				var attrs = {
					endpoints: [{
						label: 'user',
						object: Appacitive.Users.current()
					}, {
						label: 'todo',
						object: todo
					}]
				};
			}
			//Invoke internal constructor
    		Appacitive.Connection.call(this, attrs); 
	    	
		}
	});
})();
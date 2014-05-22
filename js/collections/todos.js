/*global Backbone , Appacitive*/
var app = app || {};

(function () {
	'use strict';

	// Todo Collection
	// ---------------

	// The collection of todos is backed by *Appacitive* 
	var Todos = Appacitive.Collection.extend({
		// Reference to this collection's model.
		model: app.Todo,

		// Filter down the list of all todo items that are finished.
		completed: function () {
			return this.filter(function (todo) {
				return todo.get('completed', false);
			});
		},

		// Filter down the list to only todo items that are still not finished.
		remaining: function () {
			return this.filter(function (todo) {
				return !(todo.get('completed'));
			});
		},

		// As we're using Appacitive, we won't need this 
		// As we sort todos based on their created date
		nextOrder: function () {
			return 1;
		},

		// Todos are sorted by their created date.
		comparator: function (todo) {
			return todo.createdAt;
		},

		create: function(todo) {
			var todo = new app.Todo(todo);
			var owner = new app.Owner(todo).save();
			this.add(todo, { sort: true });
		}
	});

	// Create our global collection of **Todos**.
	app.todos = new Todos();
})();
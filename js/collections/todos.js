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

		// We keep the Todos in sequential order, despite being saved by unordered
		// GUID in the database. This generates the next order number for new items.
		nextOrder: function () {
			if (!this.length) return 1;
			return this.last().get('order') + 1;
		},

		// Todos are sorted by their original insertion order.
		comparator: function (todo) {
			return todo.get('order');
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
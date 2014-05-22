/*global Backbone, jQuery, _, ENTER_KEY, Appacitive/Backbone.LocalStorage  */
var app = app || {};

(function ($) {
	'use strict';

	// The Application
	// ---------------

	// Our overall **TodosView** is the top-level piece of UI.
	app.TodosView = Backbone.View.extend({

		// Instead of generating a new element, bind to the existing skeleton Aof
		// the App already present in the HTML.
		el: '.main',

		// Main todos template
        todosTemplate: $("#todos-template").html(),

		// Our template for the line of statistics at the bottom of the app.
		statsTemplate: _.template($('#stats-template').html()),

		// Delegated events for creating new items, and clearing completed ones.
		events: {
			'keypress #new-todo': 'createOnEnter',
			'click #clear-completed': 'clearCompleted',
			'click #toggle-all': 'toggleAllComplete',
			'click .log-out': 'logOut'
		},

		// At initialization we bind to the relevant events on the `Todos`
		// collection, when items are added or changed. Kick things off by
		// loading any preexisting todos for logged-in user from Appacitive
		initialize: function () {
			this.$el.html(_.template(this.todosTemplate));

			$('#help-info').show();

			this.allCheckbox = this.$('#toggle-all')[0];
			this.$input = this.$('#new-todo');
			this.$footer = this.$('#footer');
			this.$main = this.$('#main');
			this.$list = $('#todo-list');

			this.listenTo(app.todos, 'add', this.addOne);
			this.listenTo(app.todos, 'reset', this.addAll);
			this.listenTo(app.todos, 'change:completed', this.filterOne);
			this.listenTo(app.todos, 'filter', this.filterAll);
			this.listenTo(app.todos, 'all', this.render);

			var self = this;

			/*==========Mocked Section starts============*/

			// Suppresses 'add' events with {reset: true} and prevents the app view
			// from being re-rendered for every model. Only renders when the 'reset'
			// event is triggered at the end of the fetch.
			app.todos.fetch({
				reset: true, 
				success: function() {
					self.$input.removeAttr('disabled');	
				}
			});
			
			/*==========Mocked Section ends============*/
		},

		// Re-rendering the App just means refreshing the statistics -- the rest
		// of the app doesn't change.
		render: function () {

			var completed = app.todos.completed().length;
			var remaining = app.todos.remaining().length;

			if (app.todos.length) {
				this.$main.show();
				this.$footer.show();

				this.$footer.html(this.statsTemplate({
					completed: completed,
					remaining: remaining
				}));

				this.$('#filters li a')
					.removeClass('selected')
					.filter('[href="#/' + (app.TodoFilter || '') + '"]')
					.addClass('selected');
			} else {
				//this.$main.hide();
				this.$footer.hide();
			}

			this.allCheckbox.checked = !remaining;
			if (remaining) this.allCheckbox.title = "Mark all as complete";
			else this.allCheckbox.title = "Mark all as incomplete";
		},

		// Logs out the user from Appacitive and shows the login view
	    logOut: function(e) {
	    	delete window.localStorage['backbone-user'];
			new app.LogInView();
			this.undelegateEvents();
			delete this;
	    },

		// Add a single todo item to the list by creating a view for it, and
		// appending its element to the `<ul>`.
		addOne: function (todo) {
			var view = new app.TodoView({ model: todo });
			this.$list.append(view.render().el);
		},

		// Add all items in the **Todos** collection at once.
		addAll: function () {
			this.$list.html('');
			app.todos.each(this.addOne, this);
		},

		filterOne: function (todo) {
			todo.trigger('visible');
		},

		filterAll: function () {
			app.todos.each(this.filterOne, this);
		},

		// Generate the attributes for a new Todo item to save on Appacitive.
		newAttributes: function () {
			return {
				title: this.$input.val().trim(),
				order: app.todos.nextOrder(),
				completed: false
			};
		},

		// If you hit return in the main input field, create new **Todo** model and connecting it to loggedin user using owner relation,
		// and persist it on Appacitive server
		createOnEnter: function (e) {
			if (e.which === ENTER_KEY && this.$input.val().trim().length > 0) {
				app.todos.create(this.newAttributes());
				this.$input.val('');
			}
		},

		// Clear all completed todo items, destroying their models.
		clearCompleted: function () {
			app.todos.completed().forEach(function(todo) {
				todo.destroy(true);
			});
			return false;
		},

		// Mark all items either completed or not and persist them on Appacitive
		toggleAllComplete: function () {
			var completed = this.allCheckbox.checked;

			app.todos.each(function (todo) {
				todo.set('completed', completed)
					.save();
			});
		}
	});
})(jQuery);
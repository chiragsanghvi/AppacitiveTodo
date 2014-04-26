/*global Backbone, jQuery, _, Appacitive*/
var app = app || {};

(function ($) {
  'use strict';

  // The Application
  // ---------------

  // Our overall **TodosView** is the top-level piece of UI.

  app.LogInView = Backbone.View.extend({

      // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: ".main",

    // The DOM events specific to an login and signup.
    events: {
      "submit form.login-form ": "logIn",
      "submit form.signup-form": "signUp",
      "click form.login-form #signup": "showSignup",
      "click form.signup-form #cancel": "showLogin",
      "click form.login-form #forgot": "forgotPassword"
    },

    // Our template for showing login.
    loginTemplate: _.template($('#login-template').html()),

    // At initialization we bind to the relevant events on the login and signup
    
    initialize: function() {
      //_.bindAll(this, "logIn", "signUp");
      this.render();
    },

    // Render login section by default 
    render: function() {
      this.$el.html(this.loginTemplate);
      //this.delegateEvents();
    },

    // Show signup section and hide login section
    // Reset input textboxes for signup and hide error
    showSignup: function() {
      this.$("#signup-username").val('');
      this.$("#signup-password").val('');
      this.$("#signup-firstname").val('');
      this.$("#signup-email").val('');
      this.hideMessages("signup");
      this.$(".login-form").hide();
      this.$(".signup-form").show();
      return false;
    },

    // Show login section and hide signup section
    // Reset input textboxes for login and hide error
    showLogin: function() {
      this.$("#login-username").val('');
      this.$("#login-password").val('');
      this.hideMessages("login");
      this.$(".signup-form").hide();
      this.$(".login-form").show();
      return false;
    },

    // Shows error div depending on type (signup/login)
    showError: function(type, message) {
      this.hideSuccess();
      this.$("." + type + "-form .error").html(message).show();
      return false;
    },

    // Hides error and success div depending on type (signup/login)
    hideMessages: function(type) {
      this.hideSuccess();
      this.hideInfo();
      this.$("." + type + "-form .error").html("").hide();
      return false;
    },

    showSuccess: function(message) {
      this.hideMessages();
      this.$(".login-form .success").html(message).show();
      return false;
    },

    hideSuccess: function() {
      this.$(".login-form .success").html("").hide();
      return false;
    },

    showInfo: function(message) {
      this.hideMessages();
      this.$(".login-form .info").html(message).show();
      return false;
    },

    hideInfo: function() {
      this.$(".login-form .info").html("").hide();
      return false;
    },

    // If you click on login, this function is invoked
    // It validates all inputs, where username and password are mandatory
    // Performs user login using Appacitive and on success render TodosView
    // On Error shows the error
    logIn: function(e) {
      var self = this;
      var username = this.$("#login-username").val();
      var password = this.$("#login-password").val();
      
      this.hideMessages("login");

      if (username.trim().length == 0) return this.showError("login", "Please provide username");
      if (password.trim().length == 0) return this.showError("login", "Please provide password");

      Appacitive.Users.login(username, password).then(function(user) {
          new app.TodosView();
          self.undelegateEvents();
      }, function(error) {
          self.showError("login", "Invalid username or password. Please try again.");
          self.$(".login-form button").removeAttr("disabled");
          self.$('.login-form #login').html("LogIn");
      });

      this.$('.login-form #login').html("Logging In");
      this.$(".login-form button").attr("disabled", "disabled");

      return false;
    },

    // If you click on signup in singup section, this function is invoked
    // It validates all inputs, where all fields are mandatory
    // Performs user signup using Appacitive and on success render TodosView
    // On Error shows the error
    signUp: function(e) {
      var self = this;
      var username = this.$("#signup-username").val().trim();
      var password = this.$("#signup-password").val().trim();
      var firstName = this.$("#signup-firstname").val().trim();
      var email = this.$("#signup-email").val().trim();
      var lastName = '';

      this.hideMessages("signup");

      if (username.length == 0) return this.showError("signup", "Please provide username");
      if (password.length == 0) return this.showError("signup", "Please provide password");
      if (firstName.length == 0) return this.showError("signup", "Please provide name");
      if (email.length == 0) return this.showError("signup", "Please provide email");

      var split = firstName.split(' ');
      if (split.length > 1) firstName = split[0], lastName  = split[1];

      Appacitive.Users.signup({
          username: username.toLowerCase(),
          password: password,
          firstname: firstName,
          email: email,
          lastname: lastName
      }).then(function(user) {
          new app.TodosView();
          self.undelegateEvents();
      }, function(error) {
          self.showError('signup', error.message);
          self.$(".signup-form button").removeAttr("disabled");
          self.$('.signup-form #login').html("Sign Up");
      });

      this.$(".signup-form button").attr("disabled", "disabled");
      this.$('.signup-form #login').html("Signing Up");

      return false;
    },

    forgotPassword: function() {
      this.hideMessages('login');
      var username = prompt("Enter you username");
      if (!username || username.trim().length == 0) return this.showError('login', 'Invalid username');
      
      var self = this;
      this.$(".login-form button").attr("disabled", "disabled");

      this.showInfo("Sending reset password mail. Please wait..!");

      Appacitive.Users.sendResetPasswordEmail(username, 'Reset your Appacitive ToDo App password').then(function() {
          self.showSuccess("Reset password mail sent.");
          self.$(".login-form button").removeAttr("disabled");
      }, function(status) {
          self.showError('login', status.message);
          self.$(".login-form button").removeAttr("disabled");
      })
      return false;
    }
  });

})(jQuery);
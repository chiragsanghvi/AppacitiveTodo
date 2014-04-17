/*global Backbone, jQuery, _, Appacitive*/
var app = app || {};

(function ($) {
  'use strict';

  // The Application
  // ---------------

  // Our overall **TodosView** is the top-level piece of UI.

  app.LogInView = Backbone.View.extend({
    events: {
      "click .login-form #login": "logIn",
      "click .signup-form #signup": "signUp",
      "click .login-form #signup": "showSignup",
      "click .signup-form #cancel": "showLogin"
    },

    el: ".main",

    initialize: function() {
      _.bindAll(this, "logIn", "signUp");
      this.render();
    },

    showSignup: function() {
      this.$("#signup-username").val('');
      this.$("#signup-password").val('');
      this.$("#signup-firstname").val('');
      this.$("#signup-email").val('');
      this.hideError("signup");
      this.$(".login-form").hide();
      this.$(".signup-form").show();
      return false;
    },

    showLogin: function() {
      this.$("#login-username").val('');
      this.$("#login-password").val('');
      this.hideError("login");
      this.$(".signup-form").hide();
      this.$(".login-form").show();
      return false;
    },

    showError: function(type, message) {
      this.$("." + type + "-form .error").html(message).show();
      return false;
    },

    hideError: function(type) {
      this.$("." + type + "-form .error").html("").hide();
      return false;
    },

    logIn: function(e) {
      var self = this;
      var username = this.$("#login-username").val();
      var password = this.$("#login-password").val();
      
      this.hideError("login");

      if (username.trim().length == 0) return this.showError("login", "Please provide username");
      if (password.trim().length == 0) return this.showError("login", "Please provide password");

      Appacitive.Users.login(username, password).then(function(user) {
          new app.TodosView();
          self.undelegateEvents();
      }, function(error) {
          self.showError("login", "Invalid username or password. Please try again.").show();
          self.$(".login-form button").removeAttr("disabled");
          this.$('.login-form #login').html("LogIn");
      });

      this.$('.login-form #login').html("Logging In");

      this.$(".login-form button").attr("disabled", "disabled");

      return false;
    },

    signUp: function(e) {
      var self = this;
      var username = this.$("#signup-username").val().trim();
      var password = this.$("#signup-password").val().trim();
      var firstName = this.$("#signup-firstname").val().trim();
      var email = this.$("#signup-email").val().trim();
      
      this.hideError("signup");

      if (username.length == 0) return this.showError("signup", "Please provide username");
      if (password.length == 0) return this.showError("signup", "Please provide password");
      if (firstName.length == 0) return this.showError("signup", "Please provide name");
      if (email.length == 0) return this.showError("signup", "Please provide email");
      Appacitive.Users.signup({
        username: username.toLowerCase(),
        password: password,
        firstname: firstName,
        email: email
      }).then(function(user) {
          new app.TodosView();
          self.undelegateEvents();
      }, function(error) {
          self.showError(error.message).show();
          this.$(".signup-form button").removeAttr("disabled");
          this.$('.signup-form #login').html("Sign Up");
      });

      this.$(".signup-form button").attr("disabled", "disabled");
      this.$('.signup-form #login').html("Signing Up");

      return false;
    },

    render: function() {
      this.$el.html(_.template($("#login-template").html()));
      this.delegateEvents();
    }
  });

})(jQuery);
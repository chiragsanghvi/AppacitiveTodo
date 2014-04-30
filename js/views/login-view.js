/*global Backbone, jQuery, _, , Appacitive/Backbone.LocalStorage */
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
    // Hides success div
    showError: function(type, message) {
      this.hideSuccess();
      this.$("." + type + "-form .error").html(message).show();
      return false;
    },

    // Hides error, success and info div depending on type (signup/login)
    hideMessages: function(type) {
      this.hideSuccess();
      this.hideInfo();
      this.$("." + type + "-form .error").html("").hide();
      return false;
    },

    // Shows success div depending on type (signup/login)
    // Hides other div's
    showSuccess: function(message) {
      this.hideMessages();
      this.$(".login-form .success").html(message).show();
      return false;
    },

    // Hides success div
    hideSuccess: function() {
      this.$(".login-form .success").html("").hide();
      return false;
    },

    // Shows info div 
    // Hides other div's
    showInfo: function(message) {
      this.hideMessages();
      this.$(".login-form .info").html(message).show();
      return false;
    },

    // Hides info 
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


      /*==========Mocked Section starts============*/

      app.user = new app.User({
        username: username,
        password: password,
        firstname: username
      });

      window.localStorage["backbone-user"] = app.user.toJSON();

      new app.TodosView();
      self.undelegateEvents();
  
      /*==========Mocked Section ends============*/

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


      /*==========Mocked Section starts============*/

      app.user = new app.User({
          username: username,
          password: password,
          firstname: firstName,
          email: email,
          lastname: lastName
      });

      window.localStorage["backbone-user"] = app.user.toJSON();

      new app.TodosView();
      self.undelegateEvents();

      /*==========Mocked Section ends============*/

      this.$(".signup-form button").attr("disabled", "disabled");
      this.$('.signup-form #login').html("Signing Up");

      return false;
    },

    // If you click on forgot password, this function is invoked
    // It prompts for username and sends a reset password mail to the intended user
    // On Error shows the error
    forgotPassword: function() {
      this.hideMessages('login');
      var username = prompt("Enter you username");
      if (!username || username.trim().length == 0) return this.showError('login', 'Invalid username');
      
      var self = this;
      this.$(".login-form button").attr("disabled", "disabled");

      this.showInfo("Sending reset password mail. Please wait..!");

      /*==========Mocked Section starts============*/

      // sendResetPasswordEmail method accepts 2 arguments
      // One is the username and other is subject
      // Both are mandatory
      // Sends a reset password mail to the intended user

      /*==========Mocked Section starts============*/
      return false;
    }
  });

})(jQuery);
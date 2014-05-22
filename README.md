# Javascript Todo App

A simple todo app backed by [Appacitive Cloud Platform](http://www.appacitive.com) and uses [Appacitive Javascript SDK](http://devcenter.appacitive.com/javascript/downloads/) for managing application data. 

This app demonstrates ***Data Store*** and ***Users*** features provided by the Appacitive Javascript SDK.

### Getting Started

To execute this app you will require an <a target="_blank" href="https://portal.appacitive.com/">Appacitive Account</a>.

If you don't have an Appacitive Account, [sign up](https://portal.appacitive.com/signup.html) for a free account today.

##### Step 1: Modeling the Backend
To model your application backend on Appacitive Platform, please watch [this](http://devcenter.appacitive.com/javascript/samples/todo/#model-backend) video. If you already have the backend ready with you; you can jump to the next step.

##### Step 2: Download Source Code
You can download the source code for this sample Todo App [here](https://github.com/chiragsanghvi/AppacitiveTodo/archive/master.zip).

##### Step 3: Authenticating App
Once you have the source code, open `app.js` and replace replace the `{{App Id}}` and `{{API Key}}` by your Appacitive Application Id and API Key.

```javascript
Appacitive.initialize({ 
  apikey: "{{API Key}}", 
  env: "sandbox", 
  appId: "{{App Id}}"
});
```

To get these details, open your app on [Appacitive Portal](https://portal.appacitive.com). `API key` and `App Id` for the app is available on your app's home page at the bottom.

!["Getting your apikey"](http://cdn.appacitive.com/devcenter/root/dashboard.png)

Once you're done, open `index.html` in a browser.

### Build your own Todo App 

If you want to build your own Todo App, please refer this [tutorial](http://devcenter.appacitive.com/javascript/samples/todo/). This tutorial will explain each and every step required to build this sample app.

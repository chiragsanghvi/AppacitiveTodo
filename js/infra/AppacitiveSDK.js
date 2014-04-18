/*
 * AppacitiveSDK.js v1.0 - Javascript SDK to integrate applications using Appacitive
 * Copyright (c) 2013 Appacitive Software Pvt Ltd
 * MIT license  : http://www.apache.org/licenses/LICENSE-2.0.html
 * Project      : https://github.com/chiragsanghvi/JavascriptSDK
 * Contact      : support@appacitive.com | csanghvi@appacitive.com
 * Build time   : Fri Apr 18 10:03:43 IST 2014
 */
"use strict";

// Add ECMA262-5 method binding if not supported natively
//
if (!('bind' in Function.prototype)) {
    Function.prototype.bind= function(owner) {
        var that= this;
        if (arguments.length<=1) {
            return function() {
                return that.apply(owner, arguments);
            };
        } else {
            var args= Array.prototype.slice.call(arguments, 1);
            return function() {
                return that.apply(owner, arguments.length===0? args : args.concat(Array.prototype.slice.call(arguments)));
            };
        }
    };
}

// Add ECMA262-5 string trim if not supported natively
//
if (!('trim' in String.prototype)) {
    String.prototype.trim= function() {
        return this.replace(/^\s+/, '').replace(/\s+$/, '');
    };
}


// Add ECMA262-5 Array methods if not supported natively
//
if (!('indexOf' in Array.prototype)) {
    Array.prototype.indexOf= function(find, i /*opt*/) {
        if (i===undefined) i= 0;
        if (i<0) i+= this.length;
        if (i<0) i= 0;
        for (var n= this.length; i<n; i++)
            if (i in this && this[i]===find)
                return i;
        return -1;
    };
}
if (!('lastIndexOf' in Array.prototype)) {
    Array.prototype.lastIndexOf= function(find, i /*opt*/) {
        if (i===undefined) i= this.length-1;
        if (i<0) i+= this.length;
        if (i>this.length-1) i= this.length-1;
        for (i++; i-->0;) /* i++ because from-argument is sadly inclusive */
            if (i in this && this[i]===find)
                return i;
        return -1;
    };
}
if (!('forEach' in Array.prototype)) {
    Array.prototype.forEach= function(action, that /*opt*/) {
        for (var i= 0, n= this.length; i<n; i++)
            if (i in this)
                action.call(that, this[i], i, this);
    };
}
if (!('map' in Array.prototype)) {
    Array.prototype.map= function(mapper, that /*opt*/) {
        var other= new Array(this.length);
        for (var i= 0, n= this.length; i<n; i++)
            if (i in this)
                other[i]= mapper.call(that, this[i], i, this);
        return other;
    };
}
if (!('filter' in Array.prototype)) {
    Array.prototype.filter= function(filter, that /*opt*/) {
        var other= [], v;
        for (var i=0, n= this.length; i<n; i++)
            if (i in this && filter.call(that, v= this[i], i, this))
                other.push(v);
        return other;
    };
}
if (!('every' in Array.prototype)) {
    Array.prototype.every= function(tester, that /*opt*/) {
        for (var i= 0, n= this.length; i<n; i++)
            if (i in this && !tester.call(that, this[i], i, this))
                return false;
        return true;
    };
}
if (!('some' in Array.prototype)) {
    Array.prototype.some= function(tester, that /*opt*/) {
        for (var i= 0, n= this.length; i<n; i++)
            if (i in this && tester.call(that, this[i], i, this))
                return true;
        return false;
    };
}
if (!('find' in Array.prototype)) {
    Array.prototype.find = function(mapper, that /*opt*/) {
        var list = this;
        var length = list.length;
        if (length === 0) return undefined;
        for (var i = 0, value; i < length && i in list; i++) {
          value = list[i];
          if (predicate.call(that, value, i, list)) return value;
        }
        return undefined;
    }
}
if (!('each' in Array.prototype)) {
    Array.prototype.each = function(callback, that){
        for (var i =  0; i < this.length; i++){
            callback.apply(that, [this[i]]);
        }
    }
}

var _lookupIterator = function(value, context) {
    if (value == null) return _.identity;
    if (!_.isFunction(value)) return function(obj) { return obj[value]; };
    if (!context) return value;
    return function() { return value.apply(context, arguments); };
};

Array.prototype.pluck = function(property) {
    var results = [];
    this.each(function(value) {
      results.push(value[property]);
    });
    return results;
};
Array.prototype.sortBy = function(iterator, context) {
    iterator = _lookupIterator(iterator, context);
    return this.map(function(value, index) {
      return {
        value: value,
        criteria: iterator.call(context, value, index, this)
      };
    }, this).sort(function(left, right) {
      var a = left.criteria, b = right.criteria;
      return a < b ? -1 : a > b ? 1 : 0;
    }).pluck('value');
};

// Override only if native toISOString is not defined
if ( !Date.prototype.toISOString ) {
    ( function() {

        function pad(number) {
            var r = String(number);
            if ( r.length === 1 ) {
                r = '0' + r;
            }
            return r;
        }

        Date.prototype.toISOString = function() {
            return this.getUTCFullYear()
                + '-' + pad( this.getUTCMonth() + 1 )
                + '-' + pad( this.getUTCDate() )
                + 'T' + pad( this.getUTCHours() )
                + ':' + pad( this.getUTCMinutes() )
                + ':' + pad( this.getUTCSeconds() )
                + '.' + String( (this.getUTCMilliseconds()/1000).toFixed(3) ).slice( 2, 5 )
                + 'Z';
        };

    }() );
};

String.addSlashes = function (str) {
    if (!str) return str;
    str = str.replace(/\\/g, '\\\\');
    str = str.replace(/\'/g, '\\\'');
    str = str.replace(/\"/g, '\\"');
    str = str.replace(/\0/g, '\\0');
    return str;
};

String.stripSlashes = function (str) {
    if (!str) return str;
    str = str.replace(/\\'/g, '\'');
    str = str.replace(/\\"/g, '"');
    str = str.replace(/\\0/g, '\0');
    str = str.replace(/\\\\/g, '\\');
    return str;
};

if (typeof console === 'undefined' || console === null) {
    console = { log: function() {}, dir: function() {} };
}

var _type = function (o) {

    // handle null in old IE
    if (o === null || typeof o === 'undefined' || o === 'undefined') {
        return 'null';
    }

    // handle DOM elements
    if (o && (o.nodeType === 1 || o.nodeType === 9)) {
        return 'element';
    }

    var s = Object.prototype.toString.call(o);
    var type = s.match(/\[object (.*?)\]/)[1].toLowerCase();

    // handle NaN and Infinity
    if (type === 'number') {
        if (isNaN(o)) {
            return 'nan';
        }
        if (!isFinite(o)) {
            return 'infinity';
        }
    }

    return type;
};

var types = [
    'Null',
    'Undefined',
    'Object',
    'Array',
    'String',
    'Number',
    'Boolean',
    'Function',
    'RegExp',
    'Element',
    'NaN',
    'Infinite'
];

var generateMethod = function (t) {
    _type['is' + t] = function (o) {
        return _type(o) === t.toLowerCase();
    };
};

for (var i = 0; i < types.length; i++) {
    generateMethod(types[i]);
}

_type['isNullOrUndefined'] = function(o) {
    return _type(o) == 'null' || _type(o) == 'undefined';
};

_type['isNumeric'] = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

var _clone = function(obj) {
    if (!_type.isObject(obj)) return obj;
    return _type.isArray(obj) ? obj.slice() : _extend({}, obj);
};

Array.prototype.removeAll = function(obj){
    // Return null if no objects were found and removed
    var destroyed = null;

    for(var i = 0; i < this.length; i++){

        // Use while-loop to find adjacent equal objects
        while(this[i] === obj){

            // Remove this[i] and store it within destroyed
            destroyed = this.splice(i, 1)[0];
        }
    }

    return destroyed;
};

// attach the .compare method to Array's prototype to call it on any array
Array.prototype.compare = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].compare(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
};
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array, strict) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // set strict mode as false 
    if (arguments.length == 1)
        strict = false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0; i < this.length; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            if (!this[i].equals(array[i], strict))
                return false;
        }
        else if (strict && this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
        else if (!strict) {
            return this.sort().equals(array.sort(), true);
        }
    }
    return true;
};// monolithic file

var global = {};

(function () {

    "use strict";

    // create the global object

    if (typeof window === 'undefined') {
        global = process;
    } else {
        global = window;
    }

    var _initialize = function () {
        var t;
        if (!global.Appacitive) {
            global.Appacitive = {
                runtime: {
                    isNode: typeof process != typeof t,
                    isBrowser: typeof window != typeof t
                }
            };
        }
    };
    _initialize();



    // httpBuffer class, stores a queue of the requests
    // and fires them. Global level pre and post processing 
    // goes here. 
    // requires httpTransport class that is able to actually 
    // send the request and receive the response
    /**
     * @constructor
     */
    var HttpBuffer = function (httpTransport) {

        // validate the httpTransport passed
        // and assign the callback
        if (!httpTransport || !httpTransport.send || !_type.isFunction(httpTransport.send)) {
            throw new Error('No applicable httpTransport class found');
        } else {
            httpTransport.onResponse = this.onResponse;
        }

        // internal handle to the http requests
        var _queue = [];

        // handle to the list of pre-processing functions
        var _preProcessors = {}, _preCount = 0;

        // handle to the list of post-processing functions
        var _postProcessors = {}, _postCount = 0;

        // public method to add a processor
        this.addProcessor = function (processor) {
            if (!processor) return;
            processor.pre = processor.pre || function () {};
            processor.post = processor.post || function () {};

            addPreprocessor(processor.pre);
            addPostprocessor(processor.post);
        };

        // stores a preprocessor
        // returns a numeric id that can be used to remove this processor
        var addPreprocessor = function (preprocessor) {
            _preCount += 1;
            _preProcessors[_preCount] = preprocessor;
            return _preCount;
        };

        // removes a preprocessor
        // returns true if it exists and has been removed successfully
        // else false
        var removePreprocessor = function (id) {
            if (_preProcessors[id]) {
                delete(_preProcessors[id]);
                return true;
            } else {
                return false;
            }
        };

        // stores a postprocessor
        // returns a numeric id that can be used to remove this processor
        var addPostprocessor = function (postprocessor) {
            _postCount += 1;
            _postProcessors[_postCount] = postprocessor;
            return _postCount;
        };

        // removes a postprocessor
        // returns true if it exists and has been removed successfully
        // else false
        var removePostprocessor = function (id) {
            if (_postProcessors[id]) {
                delete(_postProcessors[id]);
                return true;
            } else {
                return false;
            }
        };

        // enqueues a request in the queue
        // returns true is succesfully added
        this.enqueueRequest = function (request) {
            _queue.push(request);
        };


        this.changeRequestForCors = function(request) {
            var body = {
                m : request.method.toUpperCase()
            };
            request.headers.forEach(function(h) {
                body[h.key] = h.value;
            });
            request.prevHeaders = request.headers;
            request.headers = [];
            request.headers.push({ key:'Content-Type', value: 'text/plain' });
            request.method = 'POST';

            if (request.data) body.b = request.data;
            delete request.data;
            
            if (global.Appacitive.config.debug) {
                if (request.url.indexOf('?') === -1) request.url = request.url + '?debug=true';
                else request.url = request.url + '&debug=true';
            }

            try { request.data = JSON.stringify(body); } catch(e) {}
            return request;
        };

        // notifies the queue that there are requests pending
        // this will start firing the requests via the method 
        // passed while initalizing
        this.notify = function () {
            if (_queue.length === 0) return;

            // for convienience, extract the postprocessing object into an array
            var _callbacks = [];
            for (var processor in _postProcessors) {
                if (_postProcessors.hasOwnProperty(processor)) {
                    _callbacks.push(_postProcessors[processor]);
                }
            }

            while (_queue.length > 0) {
                var toFire = _queue.shift();

                // execute the preprocessors
                // if they return anything, pass it along
                // to be able to access it in the post processing callbacks
                var _state = [];
                for (var processor in _preProcessors) {
                    if (_preProcessors.hasOwnProperty(processor)) {
                        _state.push(_preProcessors[processor](toFire));
                    }
                }

                this.changeRequestForCors(toFire);

                // send the requests
                // and the callbacks and the 
                // results returned from the preprocessors
                httpTransport.send(toFire, _callbacks, _state);
            }
        };

        // callback to be invoked when a request has completed
        this.onResponse = function (responseData) {
            console.dir(responseData);
        };

    };

    // base httpTransport class
    /**
     * @constructor
     */
    var _HttpTransport = function () {
        var _notImplemented = function () {
            throw new Error('Not Implemented Exception');
        };
        var _notProvided = function () {
            throw new Error('Delegate not provided');
        };

        // implements this
        this.send = _notImplemented;
        this.inOnline = _notImplemented;

        // needs these callbacks to be set
        this.onResponse = function (response, request) {
            _notImplemented();
        };
        this.onError = function (request) {
            _notImplemented();
        };
    };

    // base xmlhttprequest class
    /**
      * @constructor
      */

    var _XMLHttpRequest = null;

    _XMLHttpRequest = (global.Appacitive.runtime.isBrowser) ?  XMLHttpRequest : require('xmlhttprequest-with-globalagent').XMLHttpRequest;

    var _XDomainRequest = function(request) {
        var promise = global.Appacitive.Promise.buildPromise({ success: request.onSuccess, error: request.onError });
        var xdr = new XDomainRequest();
        xdr.onload = function() {
            var response = xdr.responseText;
            try {
                var contentType = xdr.contentType;
                if (contentType.toLowerCase() == 'application/json' ||  contentType.toLowerCase() == 'application/javascript' || contentType.toLowerCase() == 'application/json; charset=utf-8' || contentType.toLowerCase() == 'application/json; charset=utf-8;') { 
                    var jData = response;
                    if (!global.Appacitive.runtime.isBrowser) {
                        if (jData[0] != "{") {
                            jData = jData.substr(1, jData.length - 1);
                        }
                    }
                    response = JSON.parse(jData);
                }
            } catch(e) {}
            promise.fulfill(response, this);       
        };
        xdr.onerror = xdr.ontimeout = function() {
           promise.reject(xdr);
        };
        xdr.onprogress = function() {};
        if (request.url.indexOf('?') === -1)
            request.url = request.url + '?ua=ie';
        else
            request.url = request.url + '&ua=ie';

        xdr.open(request.method, request.url, true);
        xdr.send(request.data);
        return promise;
    };


    var _XMLHttp = function(request) {

        if (!request.url) throw new Error("Please specify request url");
        if (!request.method) request.method = 'GET' ;
        if (!request.headers) request.headers = [];
        var data = {};

        if (!request.onSuccess || !_type.isFunction(request.onSuccess)) request.onSuccess = function() {};
        if (!request.onError || !_type.isFunction(request.onError)) request.onError = function() {};
        

        var promise = global.Appacitive.Promise.buildPromise({ success: request.onSuccess, error: request.onError });
        
        var doNotStringify = true;
        request.headers.forEach(function(r){
            if (r.key.toLowerCase() == 'content-type') {
                doNotStringify = true;
                if (r.value.toLowerCase() == 'application/json' || r.value.toLowerCase() == "application/javascript" || r.value.toLowerCase() == 'application/json; charset=utf-8' || r.value.toLowerCase() == 'application/json; charset=utf-8;') {
                    doNotStringify = false;
                }
            }
        });


        if (doNotStringify) data = request.data;
        else {
            if (request.data) { 
                data = request.data;
                if (_type.isObject(request.data)) {
                    try { data = JSON.stringify(data); } catch(e) {}
                }
            }
        }

        
        if (global.navigator && (global.navigator.userAgent.indexOf('MSIE 8') != -1 || global.navigator.userAgent.indexOf('MSIE 9') != -1)) {
            request.data = data;
            var xdr = new _XDomainRequest(request);
            return xdr;
        } else {
            var xhr = new _XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (this.readyState == 4) {
                    if ((this.status >= 200 && this.status < 300) || this.status == 304) {
                        var response = this.responseText;
                        try {
                            var contentType = this.getResponseHeader('content-type') || this.getResponseHeader('Content-Type');
                            if (contentType.toLowerCase() == 'application/json' ||  contentType.toLowerCase() == 'application/javascript' || contentType.toLowerCase() == 'application/json; charset=utf-8' || contentType.toLowerCase() == 'application/json; charset=utf-8;') { 
                                var jData = response;
                                if (!global.Appacitive.runtime.isBrowser) {
                                    if (jData[0] != "{") {
                                        jData = jData.substr(1, jData.length - 1);
                                    }
                                }
                                response = JSON.parse(jData);
                            }
                        } catch(e) {}
                        promise.fulfill(response, this);
                    } else {
                        promise.reject(this);
                    }
                }
            };
            xhr.open(request.method, request.url, true);

            for (var x = 0; x < request.headers.length; x += 1)
                xhr.setRequestHeader(request.headers[x].key, request.headers[x].value);
            
            if (!global.Appacitive.runtime.isBrowser)
                xhr.setRequestHeader('User-Agent', 'Appacitive-NodeJSSDK'); 
            
            xhr.send(data);

            return promise;
        }
    };


    // httpRequest class, encapsulates the request 
    // without bothering about how it is going to be fired.
    /**
     * @constructor
     */
    var HttpRequest = function (o) {
        o = o || {};
        this.url = o.url || '';
        this.data = o.data || {};
        this.headers = o.headers || [];
        this.method = o.method || 'GET';
        this.onSuccess = o.onSuccess || function(){};
        this.onError = o.onError || function(){};

        this.send = function(doNotStringify) {
            return new _XMLHttp(this, doNotStringify);
        };
    };

    // browser based http transport class
    /**
     * @constructor
     */
    var BasicHttpTransport = function () {

        var _super = new _HttpTransport();

        _super.isOnline = function () { return true; };

        var _executeCallbacks = function (response, callbacks, states) {
            if (callbacks.length != states.length) {
                throw new Error('Callback length and state length mismatch!');
            }
            for (var x = 0; x < callbacks.length; x += 1) {
                callbacks[x].apply({}, [response, states[x]]);
            }
        };

        var that = _super;

        var _trigger = function(request, callbacks, states) {
            new  _XMLHttp({
                method: request.method,
                url: request.url,
                headers: request.headers,
                data: request.data,
                onSuccess: function(data, xhr) {
                    if (!data) {
                        that.onError(request, { responseText: JSON.stringify({ code:'400', message: 'Invalid request' }) });
                        return;
                    }
                    try { data = JSON.parse(data);} catch(e) {}
                    // execute the callbacks first
                    _executeCallbacks(data, callbacks, states);

                    if ((data.code >= '200' && data.code <= '300') || (data.status && data.status.code >= '200' && data.status.code <= '300')) {
                        that.onResponse(request, data);
                    } else {
                        data = data || {};
                        data = data.status || data;
                        data.message = data.message || 'Bad Request';
                        data.code = data.code || '400';
                        that.onError(request, { responseText: JSON.stringify(data) });
                    }
                },
                onError: function(xhr) {
                    var data = {};
                    data.message = xhr.responseText || 'Bad Request';
                    data.code = xhr.status || '400';
                    
                    that.onError(request, { responseText: JSON.stringify(data) });
                }
            });
        };

        _super.send = function (request, callbacks, states) {
            if (!global.Appacitive.Session.initialized) throw new Error("Initialize Appacitive SDK");
            if (_type.isFunction(request.beforeSend)) {
                request.beforeSend(request);
            }
            _trigger(request, callbacks, states);
        };

        return _super;
    };

    // http functionality provider
    /**
     * @constructor
     */
    var HttpProvider = function () {

        // actual http provider
        //var _inner = global.Appacitive.runtime.isBrowser ? new JQueryHttpTransport() : new NodeHttpTransport();
        var _inner = new BasicHttpTransport();

        // the http buffer
        var _buffer = new HttpBuffer(_inner);

        // used to pause/unpause the provider
        var _paused = false;

        // allow pausing/unpausing
        this.pause = function () {
            _paused = true;
        };

        this.unpause = function () {
            _paused = false;
        };

        // allow adding processors to the buffer
        this.addProcessor = function (processor) {
            var _processorError = new Error('Must provide a processor object with either a "pre" function or a "post" function.');
            if (!processor) throw _processorError;
            if (!processor.pre && !processor.post) throw _processorError;

            _buffer.addProcessor(processor);
        };

        // the method used to send the requests
        this.send = function (request) {
            
            request.promise = (global.Appacitive.Promise.is(request.promise)) ? request.promise : new global.Appacitive.Promise.buildPromise({ error: request.onError });

            _buffer.enqueueRequest(request);

            // notify the queue if the actual transport 
            // is ready to send the requests
            if (_inner.isOnline() && _paused === false) {
                _buffer.notify();
            }
            
            return request.promise;
        };

        // method used to clear the queue
        this.flush = function (force) {
            if (!force) {
                if (_inner.isOnline()) {
                    _buffer.notify();
                }
            } else {
                _buffer.notify();
            }
        };

        // the error handler
        this.onError = function (request, response) {
            var error;
            if (response && response.responseText) {
                try {
                  error = JSON.parse(response.responseText);
                } catch (e) {}
            }

            error = error || { code: response.status, message: response.responseText, referenceid: response.headers["TransactionId"] };
            global.Appacitive.logs.logRequest(request, response, error, 'error');
            request.promise.reject(error, request.entity);
        };
        _inner.onError = this.onError;

        // the success handler
        this.onResponse = function (request, response) {
            if (request.onSuccess) {
                if (request.context) {
                    request.onSuccess.apply(request.context, [response]);
                } else {
                    request.onSuccess(response);
                }
            }
            global.Appacitive.logs.logRequest(request, response, response ? response.status : null, 'successful');
        };
        _inner.onResponse = this.onResponse;
    };

    // create the http provider and the request
    global.Appacitive.http = new HttpProvider();
    global.Appacitive.HttpRequest = HttpRequest;

    /* PLUGIN: Http Utilities */

    // compulsory plugin
    // handles session and shits
    (function (global) {

        if (!global.Appacitive) return;
        if (!global.Appacitive.http) return;

        global.Appacitive.http.addProcessor({
            pre: function (request) {
                return request;
            },
            post: function (response, request) {
                try {
                    var _valid = global.Appacitive.Session.isSessionValid(response);
                    if (!_valid.status) {
                        if (_valid.isSession) {
                            if (global.Appacitive.Session.get() !== null) {
                                global.Appacitive.Session.resetSession();
                            }
                            global.Appacitive.http.send(request);
                        }
                    } else {
                        if (response && ((response.status && response.status.code && (response.status.code == '19036' || response.status.code == '421')) || (response.code && (response.code == '19036' || response.code == '421')))) {
                            global.Appacitive.Users.logout();
                        } else {
                            global.Appacitive.Session.incrementExpiry();
                        }
                    }
                } catch(e){}
            }
        });

        global.Appacitive.http.addProcessor({
            pre: function (req) {
                return { start: new Date().getTime(), request: req };
            },
            post: function (response, args) {
                args.request.timeTakenInMilliseconds = new Date().getTime() - args.start;
            }
        });

    })(global);

    /* Http Utilities */

})(this);
(function(global) {

    "use strict";

    global.Appacitive.logs = {};

    var invoke = function(callback, log) {
        setTimeout(function() {
            try { callback.call({}, log); } catch(e) {}
        }, 0);
    };

    global.Appacitive.logs.logRequest = function(request, response, status, type) {
        response = response || {};
        status = status || {};
        var body = {};
        try {
            body = JSON.parse(request.data) ;
            if (!_type.isObject(body)) body = {};
        } catch(e) {}

        var log = {
            status: type,
            referenceId: status.referenceid,
            date: new Date().toISOString(),
            method: body['m'],
            url: decodeURIComponent(request.url),
            responseTime : request.timeTakenInMilliseconds,
            headers: {},
            request: null,
            response: response.responseText,
            description: request.description
        };

        if (request.headers) {
            request.headers.forEach(function(h) {
                log.headers[h.key] = h.value;
            });
        }

        if (request.prevHeaders) {
            request.prevHeaders.forEach(function(h) {
                log.headers[h.key] = h.value;
            });
        }

        if (log.method !== 'GET') {
            log.request = body['b'];
        }

        if (type == 'error') {
            if (global.Appacitive.runtime.isBrowser) console.dir(log);

            if (_type.isFunction(global.Appacitive.logs.apiErrorLog)) {
                invoke(global.Appacitive.logs.apiErrorLog, log);
            }
        }

        if (_type.isFunction(global.Appacitive.logs.apiLog)) {
            invoke(global.Appacitive.logs.apiLog, log);
        }
    };    

    global.Appacitive.logs.logException = function(error) {  
        if (_type.isFunction(global.Appacitive.logs.exceptionLog)) {
            invoke(global.Appacitive.logs.exceptionLog, error);
        }
    };

})(global);(function (global) {

    "use strict";

    /**
     * @param {...string} var_args
     */
    String.format = function (text, var_args) {
        if (arguments.length <= 1) {
            return text;
        }
        var tokenCount = arguments.length - 2;
        for (var token = 0; token <= tokenCount; token++) {
            //iterate through the tokens and replace their placeholders from the original text in order
            text = text.replace(new RegExp("\\{" + token + "\\}", "gi"),
                                                arguments[token + 1]);
        }
        return text;
    };
    String.prototype.toPascalCase = function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };
    String.prototype.trimChar = function (char1) {
        var pattern = new RegExp("^" + char1);
        var returnStr = this;
        if (pattern.test(returnStr)) returnStr = returnStr.slice(1, returnStr.length);
        pattern = new RegExp(char1 + "$");
        if (pattern.test(returnStr)) returnStr = returnStr.slice(0, -1);
        return returnStr;
    };
    String.toSearchString = function (text) {
        if (typeof (text) === 'undefined')
            text = '';

        var result = '';
        for (var x = 0; x < text.length; x = x + 1) {
            if (' .,;#'.indexOf(text[x]) === -1)
                result += text[x];
        }

        result = result.toLowerCase();

        return result;
    };

    String.contains = function (s1, s2) {
        return (s1.indexOf(s2) !== -1);
    };

    String.startsWith = function (s1, s2) {
        return (s1.indexOf(s2) === 0);
    };

    Array.distinct = function(orgArr) {
        var newArr = [],
            origLen = orgArr.length,
            found,
            x, y;
            
        for ( x = 0; x < origLen; x++ ) {
            found = undefined;
            for ( y = 0; y < newArr.length; y++ ) {
                if ( orgArr[x].toLowerCase() === newArr[y].toLowerCase() ) { 
                  found = true;
                  break;
                }
            }
            if (!found) newArr.push(orgArr[x]);    
        }
       return newArr;
    };

    Object.isEmpty = function (object) {
        if(!object) return true;
        var isEmpty = true;
        for (var keys in object) {
            isEmpty = false; 
            break; // exiting since we found that the object is not empty
        }
        return isEmpty;
    };

    global.dateFromWcf = function (input, throwOnInvalidInput) {
        var pattern = /Date\(([^)]+)\)/;
        var results = pattern.exec(input);
        if (results.length != 2) {
            if (!throwOnInvalidInput) {
                return s;
            }
            throw new Error(s + " is not .net json date.");
        }
        return new Date(parseFloat(results[1]));
    };

    /**
     * @constructor
     */
    var UrlFactory = function () {

        global.Appacitive.bag = global.Appacitive.bag || {};
        
        var baseUrl = (global.Appacitive.config || { apiBaseUrl: '' }).apiBaseUrl;
        
        var _getFields = function(fields) {
            if (typeof fields === 'object' && fields.length > 0 && (typeof fields[0] === 'string' || typeof fields[0] === 'number')) fields = fields.join(',');
            if (!fields) fields = '';
            return fields;
        };

        this.application = {
            applicationServiceUrl : 'application',

            getSessionCreateUrl: function() {
                return String.format("{0}/session", this.applicationServiceUrl);
            }
        };

        this.email = {
            emailServiceUrl: 'email',
            
            getSendEmailUrl: function() {
                return String.format("{0}/send", this.emailServiceUrl);
            }
        };
        this.user = {

            userServiceUrl:  'user',

            getCreateUrl: function (type, fields) {
                return String.format("{0}/create?fields={1}", this.userServiceUrl, _getFields(fields));
            },
            getAuthenticateUserUrl: function () {
                return String.format("{0}/authenticate", this.userServiceUrl);
            },
            getGetUrl: function (type, userId, fields) {
                return String.format("{0}/{1}?fields={2}", type, userId, _getFields(fields));
            },
            getUserByTokenUrl: function(userToken) {
                return String.format("{0}/me?useridtype=token&token={1}", this.userServiceUrl, userToken);
            },
            getUserByUsernameUrl: function(username) {
                return String.format("{0}/{1}?useridtype=username", this.userServiceUrl, username);
            },
            getUpdateUrl: function (userId, fields, revision) {
                if (!revision) {
                    return String.format("{0}/{1}?fields={2}", this.userServiceUrl, userId, _getFields(fields));
                } else {
                    return String.format("{0}/{1}?fields={2}&revision={3}", this.userServiceUrl, userId, _getFields(fields), revision);
                }
            },
            getDeleteUrl: function (type, userId, deleteConnections) {
                if (deleteConnections === true ) {
                    return String.format("{0}/{1}?deleteconnections=true", this.userServiceUrl, userId);
                } else {
                    return String.format("{0}/{1}", this.userServiceUrl, userId);
                }

            },
            getGetAllLinkedAccountsUrl: function(userId) {
                var url = String.format("{0}/{1}/linkedaccounts", this.userServiceUrl, userId);
                return url;
            },
            getValidateTokenUrl: function(token) {
                return String.format("{0}/validate?userToken={1}", this.userServiceUrl, token);
            },
            getInvalidateTokenUrl: function(token) {
                return String.format("{0}/invalidate?userToken={1}", this.userServiceUrl, token);
            },
            getSendResetPasswordEmailUrl: function() {
                return String.format("{0}/sendresetpasswordemail", this.userServiceUrl);
            },
            getUpdatePasswordUrl: function(userId) {
                return String.format("{0}/{1}/changepassword", this.userServiceUrl, userId);
            },
            getLinkAccountUrl: function(userId) {
                return String.format("{0}/{1}/link", this.userServiceUrl, userId);
            },
            getDelinkAccountUrl: function(userId, type){
                return String.format("{0}/{1}/{2}/delink", this.userServiceUrl, userId, type);
            },
            getCheckinUrl: function(userId, lat, lng) {
                return String.format("{0}/{1}/chekin?lat={2}&lng={3}", this.userServiceUrl, userId, lat, lng);
            },
            getResetPasswordUrl: function(token) {
                return String.format("{0}/resetpassword?token={1}", this.userServiceUrl, token);
            },
            getValidateResetPasswordUrl: function(token) {
                return String.format("{0}/validateresetpasswordtoken?token={1}", this.userServiceUrl, token);
            }
        };
        this.device = {
            deviceServiceUrl: 'device',

            getCreateUrl: function (type, fields) {
                return String.format("{0}/register?fields={1}", this.deviceServiceUrl, _getFields(fields));
            },
            getGetUrl: function (type, deviceId, fields) {
                return String.format("{0}/{1}?fields={2}", this.deviceServiceUrl, deviceId, _getFields(fields));
            },
            getUpdateUrl: function (deviceId, fields, revision) {
                if (!revision) {
                    return String.format("{0}/{1}?fields={2}", this.deviceServiceUrl, deviceId, _getFields(fields));
                } else {
                    return String.format("{0}/{1}?fields={2}&revision={3}", this.deviceServiceUrl, deviceId, _getFields(fields), revision);
                }
            },
            getDeleteUrl: function (type, deviceId, deleteConnections) {
                if (deleteConnections === true ) {
                    return String.format('{0}/{1}?deleteconnections=true', this.deviceServiceUrl, deviceId);
                } else {
                    return String.format('{0}/{1}', this.deviceServiceUrl, deviceId);
                }
            }
        };
        this.object = {
            objectServiceUrl: 'object',

            getSearchAllUrl: function (typeName, queryParams, pageSize) {
                var url = '';

                url = String.format('{0}/search/{1}/all', this.objectServiceUrl, typeName);

                if (pageSize)
                    url = url + '?psize=' + pageSize;
                else
                    url = url + '?psize=10';
                if (typeof (queryParams) !== 'undefined' && queryParams.length > 0) {
                    for (var i = 0; i < queryParams.length; i = i + 1) {
                        if (queryParams[i].trim().length === 0) continue;
                        url = url + "&" + queryParams[i];
                    }
                }
                return url;
            },
            getProjectionQueryUrl: function() {
                return String.format('{0}/search/project', this.objectServiceUrl);
            },
            getPropertiesSearchUrl: function (typeName, query) {
                return String.format('{0}/search/{1}/all?properties={2}', this.objectServiceUrl, typeName, query);
            },
            getMultiGetUrl: function (typeName, objectIds, fields) {
                return String.format('{0}/{1}/multiGet/{2}?fields={3}', this.objectServiceUrl, typeName, objectIds, _getFields(fields));
            },
            getCreateUrl: function (typeName, fields) {
                return String.format('{0}/{1}?fields={2}', this.objectServiceUrl, typeName, _getFields(fields));
            },
            getGetUrl: function (typeName, objectId, fields) {
                return String.format('{0}/{1}/{2}?fields={3}', this.objectServiceUrl, typeName, objectId, _getFields(fields));
            },
            getUpdateUrl: function (typeName, objectId, fields, revision) {
                if (!revision) {
                    return String.format('{0}/{1}/{2}?fields={3}', this.objectServiceUrl, typeName, objectId, _getFields(fields));
                } else {
                    return String.format('{0}/{1}/{2}?fields={3}&revision={4}', this.objectServiceUrl, typeName, objectId, _getFields(fields), revision);
                }
            },
            getDeleteUrl: function (typeName, objectId, deleteConnections) {
                if (deleteConnections === true ) {
                    return String.format('{0}/{1}/{2}?deleteconnections=true', this.objectServiceUrl, typeName, objectId);
                } else {
                    return String.format('{0}/{1}/{2}', this.objectServiceUrl, typeName, objectId);
                }
            },
            getMultiDeleteUrl: function (typeName) {
                return String.format('{0}/{1}/bulkdelete', this.objectServiceUrl, typeName);
            }
        };
        this.connection = {

            connectionServiceUrl: 'connection',

            getGetUrl: function (relationName, connectionId, fields) {
                return String.format('{0}/{1}/{2}?fields={3}', this.connectionServiceUrl, relationName, connectionId, _getFields(fields));
            },
            getMultiGetUrl: function (relationName, connectionIds, fields) {
                return String.format('{0}/{1}/multiGet/{2}?fields={3}', this.connectionServiceUrl, relationName, connectionIds, _getFields(fields));
            },
            getCreateUrl: function (relationName, fields) {
                return String.format('{0}/{1}?fields={2}', this.connectionServiceUrl, relationName, _getFields(fields));
            },
            getUpdateUrl: function (relationName, connectionId, fields, revision) {
                if (!revision) {
                    return String.format('{0}/{1}/{2}?fields={3}', this.connectionServiceUrl, relationName, connectionId, _getFields(fields));
                } else {
                    return String.format('{0}/{1}/{2}?fields={3}&revision={4}', this.connectionServiceUrl, relationName, connectionId, _getFields(fields), revision);
                }
            },
            getDeleteUrl: function (relationName, connectionId) {
                return String.format('{0}/{1}/{2}', this.connectionServiceUrl, relationName, connectionId);
            },
            getMultiDeleteUrl: function (relationName) {
                return String.format('{0}/{1}/bulkdelete', this.connectionServiceUrl, relationName);
            },
            getSearchByArticleUrl: function (relationName, objectId, label, queryParams) {
                var url = '';

                url = String.format('{0}/{1}/find/all?label={2}&objectid={3}', this.connectionServiceUrl, relationName, label, objectId);
                // url = url + '?psize=1000';
                if (typeof (queryParams) !== 'undefined' && queryParams.length > 0) {
                    for (var i = 0; i < queryParams.length; i = i + 1) {
                        url = url + "&" + queryParams[i];
                    }
                }
                return url;
            },
            getConnectedArticles: function (relationName, objectId, queryParams) {
                var url = '';
                url = String.format('{0}/{1}/{2}/find', this.connectionServiceUrl, relationName, objectId);
                if (queryParams && queryParams.length && queryParams.length > 0) {
                    for (var x = 0; x < queryParams.length; x += 1) {
                        if (x === 0) {
                            url += '?' + queryParams[x];
                        } else {
                            url += '&' + queryParams[x];
                        }
                    }
                }
                return url;
            },
            getInterconnectsUrl: function () {
                return String.format('{0}/interconnects', this.connectionServiceUrl);
            },
            getPropertiesSearchUrl: function (relationName, query) {
                return String.format('{0}/{1}/find/all?properties=', this.connectionServiceUrl, relationName, query);
            }
        };
        this.cannedList = {

            cannedListServiceUrl: 'list',

            getGetListItemsUrl: function (cannedListId) {
                return String.format('{0}/list/{1}/contents', this.cannedListServiceUrl, cannedListId);
            }
        };
        this.push = {
            
            pushServiceUrl: 'push',

            getPushUrl: function () {
                return String.format('{0}/', this.pushServiceUrl);
            },

            getGetNotificationUrl: function (notificationId) {
                return String.format('{0}/notification/{1}', this.pushServiceUrl, notificationId);
            },

            getGetAllNotificationsUrl: function (pagingInfo) {
                return String.format('{0}/getAll?psize={1}&pnum={2}', this.pushServiceUrl, pagingInfo.psize, pagingInfo.pnum);
            }
        };
        this.file = {

            fileServiceUrl: 'file',

            getUploadUrl: function (contentType, fileName) {
                if (fileName && fileName.length > 0) {
                    return String.format('{0}/uploadurl?contenttype={1}&expires=20&filename={2}', this.fileServiceUrl, escape(contentType), escape(fileName));
                } else {
                    return String.format('{0}/uploadurl?contenttype={1}&expires=20', this.fileServiceUrl, escape(contentType));
                }
            },

            getUpdateUrl: function (fileId, contentType) {
                return String.format('{0}/updateurl/{1}?contenttype={2}&expires=20', this.fileServiceUrl, fileId, escape(contentType));
            },

            getDownloadUrl: function (fileId, expiryTime) {
                return String.format('{0}/download/{1}?expires={2}', this.fileServiceUrl, fileId, expiryTime);
            },

            getDeleteUrl: function (fileId) {
                return String.format('{0}/delete/{1}', this.fileServiceUrl, fileId);
            }
        };
        this.query = {
            params: function (key) {
                var match = [];
                if (location.search === "" || location.search.indexOf("?") === -1) return match;
                if (!key) return location.search.split("?")[1].split("=");
                else {
                    key = key.toLowerCase();
                    var splitQuery = location.search.split("?")[1].split("&");
                    splitQuery.forEach(function (i, k) {
                        var splitKey = k.split("=");
                        var value = splitKey[1];
                        if (splitKey.length > 2) {
                            splitKey.forEach(function (ii, kk) {
                                if (ii === 0 || ii === 1) return;
                                value = value + "=" + splitKey[ii];
                            });
                        }
                        if (splitKey[0].toLowerCase() === key) match = [splitKey[0], value];
                    });
                    return match;
                }
            }
        };

    };

    global.Appacitive.storage = global.Appacitive.storage || {};
    global.Appacitive.storage.urlFactory = new UrlFactory();

})(global);

/* 
* Copyright (c) 2012 Kaerus (kaerus.com), Anders Elo <anders @ kaerus com>.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

(function(global) {

    "use strict";

    var setImmediate;

    if (global.Appacitive.runtime.isNode) {
        setImmediate = process.nextTick;
    } else {
        setImmediate = setTimeout;
    }

    var PROMISE = 0, FULFILLED = 1, REJECTED = 2;

    var Promise = function () {

        if (!(this instanceof Promise)) return new Promise();

        this.calls = [];
    };

    Promise.prototype.isResolved = function() {
        if (this.state === 1) return true;
        return false;
    };

    Promise.prototype.isRejected = function() {
        if (this.state === 2) return true;
        return false;
    };

    Promise.prototype.isFulfilled = function() {
        if (this.state === 1 || this.state === 2) return true;
        return false;
    };

    Promise.prototype.done = function() {
        var then, promise, res, state = this.state, value = this.value;

        if (!state) return this;

        while (then = this.calls.shift()) {
            promise = then[PROMISE];

            if (typeof then[state] === 'function') {
                
                try {
                    value = then[state].apply(promise, this.value);  
                } catch(error) {
                    var err = {name: error.name, message: error.message, stack: error.stack};
                    global.Appacitive.logs.logException(err);
                    
                    if (promise.calls.length == 0) throw error;
                    else promise.reject(error);
                }

                if (value instanceof Promise || Promise.is(value) )  {
                    /* assume value is thenable */
                    value.then(function(v){
                        promise.fulfill(v); 
                    }, function(r) {
                        promise.reject(r);
                    });
                } else {
                    if (state === FULFILLED)
                        promise.fulfill(value);
                    else 
                        promise.reject(value);
                }  
            } else {
                if (state === FULFILLED)
                    promise.fulfill(value);
                else 
                    promise.reject(value);
            }
        }
    };

    Promise.prototype.fulfill = function() {
        if (this.state) return this;

        this.state = FULFILLED;
        this.value = arguments;

        this.done();

        return this;
    };

    Promise.prototype.resolve = Promise.prototype.fulfill;

    Promise.prototype.reject = function() {
        if(this.state) return this;

        this.state = REJECTED;
        this.reason = this.value = arguments;

        this.done();

        return this;
    };

    Promise.prototype.then = function(onFulfill, onReject) {
        var self = this, promise = new Promise();

        this.calls[this.calls.length] = [promise, onFulfill, onReject];

        if (this.state) {
            setImmediate(function(){
                self.done();
            });
        }    

        return promise;
    };

    Promise.when = function(task) {
        
        var values = [], reasons = [], total, numDone = 0;

        var promise = new Promise();

        /* If no task found then simply fulfill the promise */
        if (!task) {
            promise.fulfill(values);
            return promise;
        }

        /* Check whether all promises have been resolved */
        var notifier = function() {
            numDone += 1;
            if (numDone == total) {
                if (!promise.state) {
                    if (reasons.length > 0) {
                        promise.reject(reasons, values ? values : []);
                    } else {
                        promise.fulfill(values ? values : []);
                    }
                }
            }
        };

        /* Assign callbacks for task depending on its type (function/promise) */
        var defer = function(i) {
            var value;
            var proc = task[i];
            if (proc instanceof Promise || (proc && typeof proc.then === 'function')) {
                 setImmediate(function() {
                    /* If proc is a promise, then wait for fulfillment */
                    proc.then(function(value) {
                        values[i] = value;
                        notifier();
                    }, function(reason) {
                        reasons[i] = reason;
                        notifier();
                    });
                });
            } else {
                setImmediate(function() {
                    /* Call the proc and set values/errors and call notifier */
                    try {
                        values[i] = proc.call();
                    } catch (e) {
                        reasons[i] = e;
                    }
                    notifier();
                });
            }
        };

        /* Single task */
        if (!Array.isArray(task)) { 
            task = [task];
        }

        /* Set count for future notifier */
        total = task.length;

        /* Iterate over all task */
        for (var i = 0; i < total; i = i + 1) {
            defer(i);
        }

        return promise;
    }; 

    Promise.is = function(p) {
        if (p instanceof Promise) return true; return false; 
    };

    Promise.buildPromise = function(options) {
        var promise = new Promise(); 
        
        if (_type.isObject(options)) {
            promise.then(options.success, options.error);
        }
        return promise;
    };

    global.Appacitive.Promise = Promise;

})(global);/**
Depends on  NOTHING
**/

(function(global) {

    "use strict";

    /**
     * @constructor
    */

    var EventManager = function () {

        function GUID() {
            var S4 = function () {
                return Math.floor(
                    Math.random() * 0x10000 /* 65536 */
                ).toString(16);
            };

            return (
                S4() + S4() + "-" +
                S4() + "-" +
                S4() + "-" +
                S4() + "-" +
                S4() + S4() + S4()
            );
        }

        var _subscriptions = {};

        this.subscribe = function (eventName, callback) {
            if (typeof (eventName) != "string" || typeof (callback) != "function")
                throw new Error("Incorrect subscription call");

            if (typeof (_subscriptions[eventName]) == "undefined")
                _subscriptions[eventName] = [];

            var _id = GUID();
            _subscriptions[eventName].push({
                callback: callback,
                id: _id
            });

            return _id;
        };

        this.unsubscribe = function (id) {
            if (!id) return false;
            var index = -1, eN = null;
            for (var eventName in _subscriptions) {
                for (var y = 0; y < _subscriptions[eventName].length; y = y + 1) {
                    if (_subscriptions[eventName][y].id == id) {
                        index = y;
                        eN = eventName;
                        break;
                    }
                }
            }
            if (index != -1) {
                _subscriptions[eN].splice(index, 1);
                return true;
            }
            return false;
        };

        this.fire = function (eventName, sender, args) {
            if (typeof (eventName) != "string") throw new Error("Incorrect fire call");

            if (typeof (args) == "undefined" || args === null)
                args = {};
            args.eventName = eventName;

            // shifted logging here
            // for better debugging
            //if (console && console.log && typeof console.log == 'function')
               // console.log(eventName + ' fired');

            if (typeof (_subscriptions["all"]) != "undefined") {
                for (var x = 0; x < _subscriptions["all"].length; x = x + 1) {
                    //try {
                    _subscriptions["all"][x].callback(sender, args);
                    //} catch (e) { }
                }
            }

            var _callback = function (f, s, a) {
                setTimeout(function () {
                    f(s, a);
                }, 0);
            };

            if (typeof (_subscriptions[eventName]) != "undefined") {
                for (var y= 0; y < _subscriptions[eventName].length; y = y + 1) {
                    _callback(_subscriptions[eventName][y].callback, sender, args);
                }
            }
        };

        this.clearSubscriptions = function (eventName) {
            if (typeof (eventName) != 'string')
                throw new Error('Event Name must be string in EventManager.clearSubscriptions');

            if (_subscriptions[eventName]) _subscriptions[eventName].length = 0;

            return this;
        };

        this.clearAndSubscribe = function (eventName, callback) {
            this.clearSubscriptions(eventName);
            this.subscribe(eventName, callback);
        };

        this.dump = function () {
            console.dir(_subscriptions);
        };

    };

    global.Appacitive.eventManager = new EventManager();

})(global);(function (global) {

    "use strict";

    global.Appacitive.config = {
        apiBaseUrl: 'https://apis.appacitive.com/v1.0/'
    };

    if (typeof XDomainRequest != 'undefined') {
        global.Appacitive.config.apiBaseUrl = window.location.protocol + '//apis.appacitive.com/v1.0/';
    }

}(global));

(function(global) {

    "use strict";
    
    var getUrl = function(options) {
        var ctx = global.Appacitive.storage.urlFactory[options.type];

        var description =  options.op.replace('get','').replace('Url', '') + ' ' + options.type;

        return { 
            url:  global.Appacitive.config.apiBaseUrl + ctx[options.op].apply(ctx, options.args || []),
            description: description
        };
    };

    var _request = function(options) {

        if (!options || !_type.isObject(options)) throw new Error("Please specify request options");

        this.promise = global.Appacitive.Promise.buildPromise(options.callbacks);

        var request = this.request = new global.Appacitive.HttpRequest();
        
        var tmp = getUrl(options);

        request.url = tmp.url;

        request.description = tmp.description;

        request.method = options.method || 'get';
        
        request.data = options.data || {} ;

        request.onSuccess = options.onSuccess;
        
        request.onError = options.onError;

        request.promise = this.promise;

        request.options = options.callbacks;

        if (options.entity) request.entity = options.entity; 

        return this;
    };

    _request.prototype.send = function() {
        return global.Appacitive.http.send(this.request);
    };

    global.Appacitive._Request = _request;

})(global);(function (global) {

    "use strict";

    /**
     * @constructor
     */
    var SessionManager = function() {

        /**
         * @constructor
         */

        this.initialized = false;

        var _sessionRequest = function() {
            this.apikey = '';
            this.isnonsliding = false;
            this.usagecount = -1;
            this.windowtime = 240;
        };

        var _sessionKey = null, _appName = null, _options = null, _apikey = null, _authToken = null, authEnabled = false;

        this.useApiKey = true ;

        this.onSessionCreated = function() {};

        this.recreate = function(callbacks) {
            return global.Appacitive.Session.create(callbacks);
        };

        this.create = function(callbacks) {

            if (!this.initialized) throw new Error("Intialize Appacitive SDK");

            // create the session
            var _sRequest = new _sessionRequest();

            _sRequest.apikey = _apikey;

            var request = new global.Appacitive._Request({
                method: 'PUT',
                type: 'application',
                op: 'getSessionCreateUrl',
                callbacks: callbacks,
                data: _sRequest,
                onSuccess: function(data) {
                    _sessionKey = data.session.sessionkey;
                    global.Appacitive.Session.useApiKey = false;
                    request.promise.fulfill(data);
                    global.Appacitive.Session.onSessionCreated();
                }
            });
            return request.send();
        };

        global.Appacitive.http.addProcessor({
            pre: function(request) {
                if (global.Appacitive.Session.useApiKey) {
                    request.headers.push({ key: 'ak', value: _apikey });
                } else {
                    request.headers.push({ key: 'as', value: _sessionKey });
                }

                if (authEnabled === true) {
                    var userAuthHeader = request.headers.filter(function (uah) {
                        return uah.key == 'ut';
                    });
                    if (userAuthHeader.length == 1) {
                        request.headers.forEach(function (uah) {
                            if (uah.key == 'ut') {
                                uah.value = _authToken;
                            }
                        });
                    } else {
                        request.headers.push({ key: 'ut', value: _authToken });
                    }
                }
            }
        });

        this.setUserAuthHeader = function(authToken, expiry, doNotSetInStorage) {
            try {
                if (authToken) {
                    authEnabled = true;
                    _authToken = authToken;
                    if (!doNotSetInStorage) {
                        if (!expiry) expiry = -1;
                        if (expiry == -1) expiry = null;

                        global.Appacitive.localStorage.set('Appacitive-UserToken', authToken);
                        global.Appacitive.localStorage.set('Appacitive-UserTokenExpiry', expiry);
                        global.Appacitive.localStorage.set('Appacitive-UserTokenDate', new Date().getTime());
                    }
                }
            } catch(e) {}
        };

        this.incrementExpiry = function() {
            try {
                if (global.Appacitive.runtime.isBrowser && authEnabled) {
                    global.Appacitive.localStorage.set('Appacitive-UserTokenDate', new Date().getTime());
                }
            } catch(e) {}
        };

        this.removeUserAuthHeader = function(makeApiCall, options) {
            
            global.Appacitive.localStorage.remove('Appacitive-User');
            if (_authToken && makeApiCall) {
                try {
                    var promise = new global.Appacitive.Promise();

                    var _request = new global.Appacitive.HttpRequest(options);
                    _request.url = global.Appacitive.config.apiBaseUrl + global.Appacitive.storage.urlFactory.user.getInvalidateTokenUrl(_authToken);
                    _request.method = 'POST';
                    _request.data = {};
                    _request.type = 'user';
                    _request.options = options;
                    _request.description = 'InvalidateToken user';
                    _request.onSuccess = _request.onError = function() {
                        authEnabled = false;
                        _authToken = null;
                        global.Appacitive.localStorage.remove('Appacitive-UserToken');
                        global.Appacitive.localStorage.remove('Appacitive-UserTokenExpiry');
                        global.Appacitive.localStorage.remove('Appacitive-UserTokenDate');
                        promise.fulfill();  
                    };

                    global.Appacitive.http.send(_request);

                    return promise;
                } catch (e){}
            } else {
                authEnabled = false;
                _authToken = null;
                global.Appacitive.localStorage.remove('Appacitive-UserToken');
                global.Appacitive.localStorage.remove('Appacitive-UserTokenExpiry');
                global.Appacitive.localStorage.remove('Appacitive-UserTokenDate');
                return global.Appacitive.Promise().fulfill();
            }
        };

        this.isSessionValid = function(response) {
            if (response.status) {
                if (response.status.code) {
                    if (response.status.code == '420' || response.status.code == '19027' || response.status.code == '19002') {
                        return { status: false, isSession: (response.status.code == '19027' || response.status.code == '420') ? true : false };
                    }
                }
            } else if (response.code) {
                if (response.code == '420' || response.code == '19027' || response.code == '19002') {
                    return { status: false, isSession: (response.code == '19027' || response.code == '420') ? true : false };
                }
            }
            return { status: true };
        };

        this.resetSession = function() {
            _sessionKey = null;
            this.useApiKey = true;
        };

        this.get = function() {
            return _sessionKey;
        };

        this.setSession = function(session) {
            if (session) {
                _sessionKey = session;
                this.useApiKey = false;
            }
        };

        this.setApiKey = function(apikey) {
            if (apikey) {
                _apikey = apikey;
                this.useApiKey = true;
            }
        };

        // the name of the environment, simple public property
        var _env = 'sandbox';
        this.environment = function() {
            if (arguments.length == 1) {
                var value = arguments[0];
                if (value != 'sandbox' && value != 'live')  value = 'sandbox';
                _env = value;
            }
            return _env;
        };
    };

    global.Appacitive.Session = new SessionManager();

    global.Appacitive.getAppPrefix = function(str) {
        return global.Appacitive.Session.environment() + '/' + global.Appacitive.appId + '/' + str;
    };

    global.Appacitive.initialize = function(options) {
        
        options = options || {};

        if (global.Appacitive.Session.initialized) return;
        
        if (!options.apikey || options.apikey.length === 0) throw new Error("apikey is mandatory");
        
        if (!options.appId || options.appId.length === 0) throw new Error("appId is mandatory");


        global.Appacitive.Session.setApiKey( options.apikey) ;
        global.Appacitive.Session.environment(options.env || 'sandbox' );
        global.Appacitive.useApiKey = true;
        global.Appacitive.appId = options.appId;
        
        global.Appacitive.Session.initialized = true;
        global.Appacitive.Session.persistUserToken = options.persistUserToken;
        
        if (options.debug) global.Appacitive.config.debug = true;

        if (_type.isFunction(options.apiLog)) global.Appacitive.logs.apiLog = options.apiLog;
        if (_type.isFunction(options.apiErrorLog)) global.Appacitive.logs.apiErrorLog = options.apiErrorLog;
        if (_type.isFunction(options.exceptionLog)) global.Appacitive.logs.exceptionLog = options.exceptionLog;

        if (options.userToken) {

            if (options.expiry == -1)  options.expiry = null;
            else if (!options.expiry)  options.expiry = 3600;

            global.Appacitive.Session.setUserAuthHeader(options.userToken, options.expiry);

            if (options.user) {
                global.Appacitive.Users.setCurrentUser(options.user);   
            } else {
                //read user from from localstorage and set it;
                var user = global.Appacitive.localStorage.get('Appacitive-User');   
                if (user) global.Appacitive.Users.setCurrentUser(user);
            }

        } else {

            if (global.Appacitive.runtime.isBrowser) {
                //read usertoken from localstorage and set it
                var token = global.Appacitive.localStorage.get('Appacitive-UserToken');
                if (token) { 
                    var expiry = global.Appacitive.localStorage.get('Appacitive-UserTokenExpiry');
                    var expiryDate = global.Appacitive.localStorage.get('Appacitive-UserTokenDate');
                    
                    if (!expiry) expiry = -1;
                    if (expiryDate && expiry > 0) {
                        if (new Date(expiryDate + (expiry * 1000)) < new Date()) return;
                    }
                    if (expiry == -1) expiry = null;
                    //read usertoken and user from from localstorage and set it;
                    var user = global.Appacitive.localStorage.get('Appacitive-User');   
                    if (user) global.Appacitive.Users.setCurrentUser(user, token, expiry);
                }
            }
        }           
    };

} (global));


// compulsory http plugin
// attaches the appacitive environment headers
(function (global){

    "use strict";

    if (!global.Appacitive) return;
    if (!global.Appacitive.http) return;

    global.Appacitive.http.addProcessor({
        pre: function(req) {
            req.headers.push({ key: 'e', value: global.Appacitive.Session.environment() });
        }
    });

})(global);
(function (global) {

    "use strict";

    var Appacitive = global.Appacitive;

    Appacitive.GeoCoord = function(lat, lng) {
        
        var _validateGeoCoord = function(lat, lng) {
          if (isNaN(lat) || isNaN(lng)) throw new Error("Invalid Latitiude or longitiude provided");
          if (lat < -90.0 || lat > 90.0) throw new Error("Latitude " + lat + " should be in range of  -90.0 to 90.");
          if (lng < -180.0 || lng > 180.0) throw new Error("Latitude " + lng + " should be in range of  -180.0 to 180.");
        };

        // Parses string geocode value and return Appacitive geocode object or false
        var getGeocode = function(geoCode) {
          // geoCode is not string or its length is 0, return false
          if (typeof geoCode !== 'string' || geoCode.length == 0) return false;
          
          // Split geocode string by ,
          var split = geoCode.split(',');

          // split length is not equal to 2 so return false
          if (split.length !== 2 ) return false;

          // validate the geocode
          try {
            return new Appacitive.GeoCoord(split[0], split[1]);
          } catch(e) {
            return false;
          }
        };

        if (_type.isString(lat) && !lng) {
            var geoCode = getGeocode(lat);
            if (geoCode) return geoCode;
        }

        if (!lat || !lng) {
          this.lat = 0, this.lng = 0;
        } else {
          _validateGeoCoord(lat, lng);
          this.lat = lat, this.lng = lng;
        }

        this.toJSON = function() {
            return {
                latitude : this.lat,
                longitude: this.lng
            };
        };

        this.getValue = function() {
            return String.format("{0},{1}", lat, lng);
        };

        this.toString = function() { return this.getValue(); };
    };

    var _filter = function() { 
        this.toString = function() { }; 

        this.Or = function() {
            var args = Array.prototype.slice.call(arguments, 0);
            args.splice(0, 0, this);
            return new _compoundFilter(_operators.or, args); 
        };

        this.And = function() {
            var args = Array.prototype.slice.call(arguments, 0);
            args.splice(0, 0, this);
            return new _compoundFilter(_operators.and, args); 
        };
    };

    var _fieldFilter = function(options) {

        _filter.call(this);

        options = options || {};
        this.fieldType = options.fieldType;
        this.field = options.field || '';
        this.value = options.value;
        this.operator = options.operator;

        this.getFieldType = function() {
            switch (this.fieldType) {
                case 'property' : return '*';
                case 'attribute' : return '@';
                case 'aggregate' : return '$';
                default : return '*';
            }
        };

        this.toString = function() {
             return String.format("{0}{1} {2} {3}",
                    this.getFieldType(),
                    this.field.toLowerCase(),
                    this.operator,
                    this.value.getValue());
        };

    };

    _fieldFilter.prototype = new _filter();
    _fieldFilter.prototype.constructor = _fieldFilter;


    var _containsFilter = function(options) {
        
        options = options || '';

        if (!_type.isArray(options.value) || !options.value.length) throw new Error("Specify field value as array");
        
        _fieldFilter.call(this, options);

        var _getValue = function(value) {
            if (_type.isString(value)) return "'" + value + "'";
            else if (_type.isNumber(value)) return value;  
            else return value.toString();
        };

        this.toString = function() {
            var values = [];
            for (var i = 0; i < this.value.length; i = i + 1) {
                values.push(String.format("{0}{1} {2} {3}",
                            this.getFieldType(),
                            this.field.toLowerCase(),
                            this.operator,
                            _getValue(this.value[i])));
            }
            return "("  + values.join(' or ') + ")"; 
        };

    };

    _containsFilter.prototype = new _fieldFilter();
    _containsFilter.prototype.constructor = _containsFilter;

    var _betweenFilter = function(options) {
        options = options || '';

        if (!options.val1) throw new Error("Specify field value1 ");
        if (!options.val2) throw new Error("Specify field value2 ");

        this.val1 = options.val1;
        this.val2 = options.val2;

        _fieldFilter.call(this, options);

        delete this.value;

        this.toString = function() {
             return String.format("{0}{1} {2} ({3},{4})",
                    this.getFieldType(),
                    this.field.toLowerCase(),
                    this.operator,
                    this.val1.getValue(),
                    this.val2.getValue());
        };

    };

    _betweenFilter.prototype = new _fieldFilter();
    _betweenFilter.prototype.constructor = _betweenFilter;


    var _radialFilter = function(options) {

        options = options || '';

        if (!options.geoCoord || !(options.geoCoord instanceof Appacitive.GeoCoord)) throw new Error("withinCircle filter needs Appacitive.GeoCoord object as argument");

        _fieldFilter.call(this, options);

        this.value = options.geoCoord;

        this.unit = options.unit || 'mi';

        this.distance = options.distance || 5;

        this.toString = function() {
             return String.format("{0}{1} {2} {3},{4} {5}",
                    this.getFieldType(),
                    this.field.toLowerCase(),
                    this.operator,
                    this.value.getValue(),
                    this.distance,
                    this.unit);
        };
    };

    _radialFilter.prototype = new _fieldFilter();
    _radialFilter.prototype.constructor = _betweenFilter;


    var _polygonFilter = function(options) {

        options = options || '';

        if (!options.geoCoords || options.geoCoords.length === 0) throw new Error("polygon filter needs array of Appacitive.GeoCoord objects as argument");

        if (options.geoCoords.length < 3) throw new Error("polygon filter needs atleast 3 Appacitive.GeoCoord objects as arguments");

        _fieldFilter.call(this, options);

        this.value = options.geoCoords;

        var _getPipeSeparatedList = function(coords) {
            var value = '';
            coords.forEach(function(c) {
                if (value.length === 0) value = c.toString();
                else value += " | " + c.toString();
            });
            return value;
        };

        this.toString = function() {
             return String.format("{0}{1} {2} {3}",
                    this.getFieldType(),
                    this.field.toLowerCase(),
                    this.operator,
                    _getPipeSeparatedList(this.value));
        };
    };

    _polygonFilter.prototype = new _fieldFilter();
    _polygonFilter.prototype.constructor = _betweenFilter;

    var _tagFilter = function(options) {

        _filter.call(this);

        options = options || {};
        if (!options.tags || _type.isArray(options.tags) || options.tags.length === 0) throw new Error("Specify valid tags");

        this.tags = options.tags;
        this.operator = options.operator;
        
        this.toString = function() {
             return String.format("{0}('{1}')", this.operator, this.tags.join(','));
        };
    };

    _tagFilter.prototype = new _filter();
    _tagFilter.prototype.constructor = _tagFilter;

    var _compoundFilter = function(operator, filters) {
        
        if (!filters || !filters.length || filters.length < 2) throw new Error("Provide valid or atleast 2 filters");

        this.operator = operator;

        this.innerFilters = [];

        for (var i = 0; i < filters.length ; i = i + 1) {
            if (!(filters[i] instanceof _filter)) throw new Error("Invalid filter provided");
            this.innerFilters.push(filters[i]);
        }

        this.toString = function() {
            var op = this.operator;
            var value = "(";
            this.innerFilters.forEach(function(f) {
                if (value.length === 1) value += ' ' + f.toString();
                else value += String.format(' {0} {1} ', op, f.toString());
            });
            value += ")";
            return value;
        };
    };

    _compoundFilter.prototype = new _filter();
    _compoundFilter.prototype.constructor = _compoundFilter;


    var _operators = {
        isEqualTo: "==",
        isGreaterThan: ">",
        isGreaterThanEqualTo: ">=",
        isLessThan: "<",
        isLessThanEqualTo: "<=",
        like: "like",
        match: "match",
        between: "between",
        withinCircle: "within_circle",
        withinPolygon: "within_polygon",
        or: "or",
        and: "and",
        taggedWithAll: "tagged_with_all",
        taggedWithOneOrMore: "tagged_with_one_or_more"
    };

    var _primitiveFieldValue = function(value, type) {

        if (value === null || value === undefined || value.length === 0) throw new Error("Specify value");

        this.value = value;

        if (type) this.type = type;
        else this.type = typeof this.value; 

        if (this.type === 'number') {
          if (!_type.isNumeric(this.value)) throw new Error("Value should be numeric for filter expression");  
        }

        this.getValue = function() {
            if (this.type === 'string') return "'" + this.value + "'";
            else if (this.type === 'number' || _type.isBoolean(this.value))return this.value;  
            else if (this.type === 'object' && this.value instanceof date) return "datetime('" + Appacitive.Date.toISOString(this.value) + "')";
            else return this.value.toString();
        };
    };

    var _dateFieldValue = function(value) {
        this.value = value;
        
        this.getValue = function() {
            if (this.value instanceof Date) return "date('" + Appacitive.Date.toISODate(this.value) + "')";
            else return "date('" + this.value + "')";
        };
    };

    var _timeFieldValue = function(value) {
        this.value = value;
        
        this.getValue = function() {
            if (this.value instanceof Date) return "time('" + Appacitive.Date.toISOTime(this.value) + "')";
            else return "time('" + this.value + "')";
        };
    };

    var _dateTimeFieldValue = function(value) {
        this.value = value;
        
        this.getValue = function() {
            if (this.value instanceof Date) return "datetime('" + Appacitive.Date.toISOString(this.value) + "')";
            else return "datetime('" + this.value + "')";
        };
    };

    var _fieldFilterUtils = function(type, name, context) { 

        if (!context) context = this;

        context.type = type;

        context.name = name;

        /* Helper functions for EqualTo */
        context.equalTo = function(value) {
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _primitiveFieldValue(value), operator: _operators.isEqualTo });
        };

        context.equalToNumber = function(value){
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _primitiveFieldValue(value, 'number'), operator: _operators.isEqualTo });
        };

        context.equalToDate = function(value) {
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _dateFieldValue(value), operator: _operators.isEqualTo });
        };

        context.equalToTime = function(value) {
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _timeFieldValue(value), operator: _operators.isEqualTo });
        };

        context.equalToDateTime = function(value) {
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _dateTimeFieldValue(value), operator: _operators.isEqualTo });
        };


        /* Helper functions for GreaterThan */
        context.greaterThan = function(value) {
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _primitiveFieldValue(value, 'number'), operator: _operators.isGreaterThan });
        };

        context.greaterThanDate = function(value) {
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _dateFieldValue(value), operator: _operators.isGreaterThan });
        };

        context.greaterThanTime = function(value) {
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _timeFieldValue(value), operator: _operators.isGreaterThan });
        };

        context.greaterThanDateTime = function(value) {
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _dateTimeFieldValue(value), operator: _operators.isGreaterThan });
        };


        /* Helper functions for GreaterThanEqualTo */
        context.greaterThanEqualTo = function(value) {
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _primitiveFieldValue(value, 'number'), operator: _operators.isGreaterThanEqualTo });
        };

        context.greaterThanEqualToDate = function(value) {
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _dateFieldValue(value), operator: _operators.isGreaterThanEqualTo });
        };

        context.greaterThanEqualToTime = function(value) {
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _timeFieldValue(value), operator: _operators.isGreaterThanEqualTo });
        };

        context.greaterThanEqualToDateTime = function(value) {
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _dateTimeFieldValue(value), operator: _operators.isGreaterThanEqualTo });
        };

        /* Helper functions for LessThan */
        context.lessThan = function(value) {
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _primitiveFieldValue(value, 'number'), operator: _operators.isLessThan });
        };

        context.lessThanDate = function(value) {
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _dateFieldValue(value), operator: _operators.isLessThan });
        };

        context.lessThanTime = function(value) {
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _timeFieldValue(value), operator: _operators.isLessThan });
        };

        context.lessThanDateTime = function(value) {
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _dateTimeFieldValue(value), operator: _operators.isLessThan });
        };


        /* Helper functions for LessThanEqualTo */
        context.lessThanEqualTo = function(value) {
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _primitiveFieldValue(value, 'number'), operator: _operators.isLessThanEqualTo });
        };

        context.lessThanEqualToDate = function(value) {
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _dateFieldValue(value), operator: _operators.isLessThanEqualTo });
        };

        context.lessThanEqualToTime = function(value) {
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _timeFieldValue(value), operator: _operators.isLessThanEqualTo });
        };

        context.lessThanEqualToDateTime = function(value) {
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _dateTimeFieldValue(value), operator: _operators.isLessThanEqualTo });
        };

        /* Helper functions for string operations */
        context.like = function(value) {
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _primitiveFieldValue("*" + value + "*"), operator: _operators.like });
        };

        context.match = function(value) {
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _primitiveFieldValue("*" + value + "*"), operator: _operators.match });
        };

        context.startsWith = function(value) {
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _primitiveFieldValue(value + "*"), operator: _operators.like });
        };

        context.endsWith = function(value) {
            return new _fieldFilter({ field: this.name, fieldType: this.type, value: new _primitiveFieldValue("*" + value), operator: _operators.like });
        };

        context.contains = function(values) {
            return new _containsFilter({ field: this.name, fieldType: this.type, value: values, operator: _operators.isEqualTo });
        };

        /* Helper functions for between */
        context.between = function(val1, val2) {
            return new _betweenFilter({ field: this.name, fieldType: this.type, val1: new _primitiveFieldValue(val1, 'number'), val2: new _primitiveFieldValue(val2, 'number'), operator: _operators.between });
        };

        context.betweenDate = function(val1, val2) {
            return new _betweenFilter({ field: this.name, fieldType: this.type, val1: new _dateFieldValue(val1), val2: new _dateFieldValue(val2), operator: _operators.between });
        };

        context.betweenTime = function(val1, val2) {
            return new _betweenFilter({ field: this.name, fieldType: this.type, val1: new _timeFieldValue(val1), val2: new _timeFieldValue(val2), operator: _operators.between });
        };

        context.betweenDateTime = function(val1, val2) {
            return new _betweenFilter({ field: this.name, fieldType: this.type, val1: new _dateTimeFieldValue(val1), val2: new _dateTimeFieldValue(val2), operator: _operators.between });
        };

        /*Helper functionf for geolocation search */
        context.withinCircle = function(geoCoord, distance, unit) {
            return new _radialFilter({ field: this.name, fieldType: this.type, geoCoord: geoCoord, distance: distance, unit: unit, operator: _operators.withinCircle });
        };

        context.withinPolygon = function(geoCoords) {
            return new _polygonFilter({ field: this.name, fieldType: this.type, geoCoords: geoCoords, operator: _operators.withinPolygon });
        };
    };

    var _propertyExpression = function(name) {
        
        if (!name || name.length === 0) throw new Error("Specify field name");
        
        this.field = name;

        _fieldFilterUtils("property", name, this);

        return this;
    };

    var _aggregateExpression = function(name) {
        
        if (!name || name.length === 0) throw new Error("Specify field name");
        
        this.field = name;

        var _fieldFilters = new _fieldFilterUtils("aggregate", name);

        this.equalTo = function(value) {
            return _fieldFilters.equalTo(value);
        };

        this.greaterThan = function(value) {
            return _fieldFilters.greaterThan(value);
        };

        this.greaterThanEqualTo = function(value) {
            return _fieldFilters.greaterThanEqualTo(value);
        };

        this.lessThan = function(value) {
            return _fieldFilters.lessThan(value);
        };

        this.lessThanEqualTo = function(value) {
            return _fieldFilters.lessThanEqualTo(value);
        };

        this.between = function(val1, val2) {
            return _fieldFilters.between(val1, val2);
        };

        return this;
    };

    var _attributeExpression = function(name) {
        if (!name || name.length === 0) throw new Error("Specify field name");
        
        this.field = name;

        var _fieldFilters = new _fieldFilterUtils("attribute", name);

        /* Helper functions for string operations */
        this.like = function(value) {
            return _fieldFilters.like(value);
        };

        this.like = function(value) {
            return _fieldFilters.match(value);
        };

        this.startWith = function(value) {
            return _fieldFilters.startsWith(value);
        };

        this.endsWith = function(value) {
            return _fieldFilters.endsWith(value);
        };

        this.equalTo = function(value) {
            return _fieldFilters.equalTo(value);
        };        

        this.contains = function(values) {
            return _fieldFilters.contains(values);
        };

        return this;
    };

    Appacitive.Filter = {
        Property: function(name) {
            return new _propertyExpression(name);
        },
        Aggregate: function(name) {
            return new _aggregateExpression(name);
        },
        Attribute: function(name) {
            return new _attributeExpression(name);
        },
        Or: function() {
            return new _compoundFilter(_operators.or, arguments); 
        },
        And: function() {
            return new _compoundFilter(_operators.and, arguments); 
        },
        taggedWithOneOrMore: function(tags) {
            return new _tagFilter({ tags: tags, operator: _operators.taggedWithOneOrMore });
        },
        taggedWithAll: function(tags) {
            return new _tagFilter({ tags: tags, operator: _operators.taggedWithAll });
        }
    };

})(global);(function (global) {

    "use strict";

    global.Appacitive.Queries = {};

    // basic query for contains pagination
    /** 
    * @constructor
    **/
    var PageQuery = function(o) {
        var options = o || {};
        var _pageNumber = 1;
        var _pageSize = 20;

        //define getter and setter for pageNumber
        this.pageNumber =  function() { 
            if (arguments.length == 1) {
                _pageNumber = arguments[0] || 1;
                return this;
            }
            return _pageNumber; 
        };

        //define getter and setter for pageSize
        this.pageSize =  function() { 
            if (arguments.length == 1) {
                _pageSize = arguments[0] || 20;
                return this;
            }
            return _pageSize; 
        };

        this.pageNumber(options.pageNumber);
        this.pageSize(options.pageSize);
    };
    PageQuery.prototype.toString = function() {
        return 'psize=' + this.pageSize() + '&pnum=' + this.pageNumber();
    };

    // sort query
    /** 
    * @constructor
    **/
    var SortQuery = function(o) {
        var options = o || {};
        var _orderBy = null;
        var _isAscending = false;

        //define getter/setter for orderby
        this.orderBy =  function() { 
            if (arguments.length === 1 && _type.isString(arguments[0])) {
                _orderBy = arguments[0];
                return this;
            }
            return _orderBy; 
        };

        //define getter for isAscending
        this.isAscending =  function() { 
            if (arguments.length === 1) {
                _isAscending = (arguments[0] === undefined || arguments[0] == null) ? false : arguments[0];
                return this;
            }
            return _isAscending; 
        };

        this.orderBy(options.orderBy);
        this.isAscending(options.isAscending);
    };
    SortQuery.prototype.toString = function() {
        if (this.orderBy() && this.orderBy().length > 0) {
            return 'orderBy=' + this.orderBy() + '&isAsc=' + this.isAscending();
        } else {
            return '';
        }
    };

    // base query
    /** 
    * @constructor
    **/
    var BasicQuery = function(o) {

        var options = o || {};

        //set filters , freetext and fields
        var _filter = '';
        var _freeText = '';
        var _fields = '';
        var _queryType = options.queryType || 'BasicQuery';
        var _pageQuery = new PageQuery(o);
        var _sortQuery = new SortQuery(o);
        var _entityType = options.type || options.relation;
        var _etype = (options.relation) ? 'connection' : 'object';
        
        var self = this;

        // 
        if (options.entity) this.entity = options.entity;

        // define getter for type (object/connection)
        this.type = function() { return _etype; };

        // define getter for basetype (type/relation)
        this.entityType = function() { return _entityType; };

        // define getter for querytype (basic,connectedobjects etc)
        this.queryType = function() { return _queryType; };

        // define getter for pagequery 
        this.pageQuery = function() { return _pageQuery; };

        
        // define getter and setter for pageNumber
        this.pageNumber =  function() { 
            if (arguments.length === 1) {
                _pageQuery.pageNumber(arguments[0]);
                return this;
            }
            return _pageQuery.pageNumber(); 
        };

        // define getter and setter for pageSize
        this.pageSize =  function() { 
            if (arguments.length === 1) {
                _pageQuery.pageSize(arguments[0]);
                return this;
            }
            return _pageQuery.pageSize(); 
        };

        // define getter for sortquery
        this.sortQuery = function() { return _sortQuery; };

        // define getter and setter for orderby
        this.orderBy =  function() { 
            if (arguments.length === 1) {
                _sortQuery.orderBy(arguments[0]);
                return this;
            }
            return _sortQuery.orderBy(); 
        };

        // define getter and setter for isAscending
        this.isAscending =  function() { 
            if (arguments.length === 1) {
                _sortQuery.isAscending(arguments[0]);
                return this;
            }
            return _sortQuery.isAscending(); 
        };

        // define getter and setter for filter
        this.filter =  function() { 
            if (arguments.length === 1) {
                _filter = arguments[0];
                return this;
            }
            return _filter; 
        };      
        
        // define getter and setter for freetext
        this.freeText =  function() { 
            if (arguments.length === 1) {
                var value = arguments[0];
                if (_type.isString(value)) _freeText = arguments[0];
                else if (_type.isArray(value) && value.length) _freeText = arguments[0].join(' ');
                return this;
            }
            return _freeText; 
        };      
        
        // define fields
        this.fields = function() {
            if (arguments.length === 1) {
                var value = arguments[0];
                if (_type.isString(value)) _fields = value;
                else if (_type.isArray(value) && value.length) _fields = value.join(',');
                return this;
            } else {
                return _fields;
            }
        };

        // set filters , freetext and fields
        this.filter(options.filter || '');
        this.freeText(options.freeText || '');
        this.fields(options.fields || '');

        this.setFilter = function() { this.filter(arguments[0]); };
        this.setFreeText = function() { this.freeText(arguments[0]); };
        this.setFields = function() { this.fields(arguments[0]); };

        this.extendOptions = function(changes) {
            for (var key in changes) {
                options[key] = changes[key];
            }
            _pageQuery = new PageQuery(options);
            _sortQuery = new SortQuery(options);
            return this;
        };

        this.getQueryString = function() {

            var finalUrl = _pageQuery.toString();

            var sortQuery =  _sortQuery.toString();

            if (sortQuery) finalUrl += '&' + sortQuery;

            
            if (this.filter()) {
                var filter = encodeURIComponent(this.filter().toString());
                if (filter.trim().length > 0) finalUrl += '&query=' + filter;
            }

            if (this.freeText() && this.freeText().trim().length > 0) {
                finalUrl += "&freetext=" + encodeURIComponent(this.freeText()) + "&language=en";
            }

            if (this.fields() && this.fields().trim().length > 0) {
                finalUrl += "&fields=" + this.fields();
            }

            return finalUrl;
        };

        this.toUrl = function() {
            return {
                url: global.Appacitive.config.apiBaseUrl + _etype + '/' + _entityType + '/find/all?' + this.getQueryString(),
                description: 'FindAll ' + _entityType + ' ' + _etype + 's'
            }
        };

        this.toRequest = function(options) {
            var r = new global.Appacitive.HttpRequest();
            var obj = this.toUrl();
            r.url = obj.url;
            r.options = options;
            r.description = obj.description;
            r.method = 'get';
            return r;
        };

        this.getOptions = function() {
            var o = {};
            for (var key in this) {
                if (this.hasOwnProperty(key) && !_type.isFunction(this[key])) {
                    o[key] = this[key];
                }
            }
            return o;
        };

        this._setPaging = function(pi) {
            if (pi) {
                _pageQuery.pageNumber(pi.pagenumber);
                _pageQuery.pageSize(pi.pagesize);
                
                this.results = this.results || [];

                this.results.isLastPage = false;
                this.results.total = pi.totalrecords;
                this.results.pageNumber = pi.pagenumber;
                this.results.pageSize = pi.pagesize;
                
                if ((pi.pagenumber * pi.pagesize) >= pi.totalrecords) {
                    this.results.isLastPage = true;
                }
            }
        };

        var _parse = function(entities) {
            var entityObjects = [];
            if (!entities) entities = [];
            var eType = (_etype === 'object') ? 'Object' : 'Connection';

            return global.Appacitive[eType]._parseResult(entities, options.entity);
        };

        this.fetch = function(opts) {
            var promise = global.Appacitive.Promise.buildPromise(opts);

            var request = this.toRequest(opts);
            request.onSuccess = function(d) {
               self.results = _parse(d[_etype + 's']);
               self._setPaging(d.paginginfo);

               promise.fulfill(self.results, d.paginginfo);
            };
            request.promise = promise;
            request.entity = this;
            return global.Appacitive.http.send(request);
        };

        /**
         * Returns a new instance of Appacitive.Collection backed by this query.
         * @param {Array} items An array of instances of <code>Appacitive.Object</code>
         *     with which to start this Collection.
         * @param {Object} options An optional object with Backbone-style options.
         * Valid options are:<ul>
         *   <li>model: The Appacitive.Object subclass that this collection contains.
         *   <li>query: An instance of Appacitive.Queries to use when fetching items.
         *   <li>comparator: A string property name or function to sort by.
         * </ul>
         * @return {Appacitive.Collection}
         */
        this.collection = function(items, opts) {
            opts = opts || {};
            items = items || [];
            if (_type.isObject(items)) opts = items, items = null;

            if (!items) items = this.results ? this.results : [];

            var model = options.entity;

            if (!model && items.length > 0 && items[0] instanceof global.Appacitive.BaseObject) {
                var eType = items[0].type == 'object'  ? 'Object' : 'Connection';
                model = global.Appacitive[eType]._getClass(items[0].className);
            }

            if (!model) {
                var eType = (_etype === 'object') ? 'Object' : 'Connection';
                model = global.Appacitive[eType]._getClass(this[eType]);
            }

            return new Appacitive.Collection(items, _extend(opts, {
                model: this.model,
                query: this
            }));
        };

        this.fetchNext = function(options) {
            var pNum = this.pageNumber();
            this.pageNumber(++pNum);
            return this.fetch(options);
        };

        this.fetchPrev = function(options) {
            var pNum = this.pageNumber();
            pNum -= 1;
            if (pNum <= 0) pNum = 1;
            this.pageNumber(pNum);
            return this.fetch(options);
        };

        this.count = function(options) {
            var promise = global.Appacitive.Promise.buildPromise(options);

            var _queryRequest = this.toRequest(options);
            _queryRequest.onSuccess = function(data) {
                data = data || {};
                var pagingInfo = data.paginginfo;

                var count = 0;
                if (!pagingInfo) {
                    count = 0;
                } else {
                    count = pagingInfo.totalrecords;
                }
                promise.fulfill(count);
            };
            _queryRequest.promise = promise;
            _queryRequest.entity = this;
            return global.Appacitive.http.send(_queryRequest);
        };
    };

    /** 
    * @constructor
    **/
    global.Appacitive.Query = BasicQuery;

    /** 
    * @constructor
    **/
    global.Appacitive.Queries.FindAllQuery = function(options) {

        options = options || {};

        if (!options.type && !options.relation) throw new Error('Specify either type or relation for basic filter query');

        options.queryType = 'FindAllQuery';

        BasicQuery.call(this, options);

        return this;
    };

    global.Appacitive.Queries.FindAllQuery.prototype = new BasicQuery();

    global.Appacitive.Queries.FindAllQuery.prototype.constructor = global.Appacitive.Queries.FindAllQuery;

    /** 
    * @constructor
    **/
    global.Appacitive.Queries.ConnectedObjectsQuery = function(options) {

        options = options || {};

        if (!options.relation) throw new Error('Specify relation for connected objects query');
        if (!options.objectId) throw new Error('Specify objectId for connected objects query');
        if (!options.type) throw new Error('Specify type of object id for connected objects query');
        
        var type = options.type;
        delete options.type;

        options.queryType = 'ConnectedObjectsQuery';

        BasicQuery.call(this, options);

        this.objectId = options.objectId;
        this.relation = options.relation;
        this.type = type;
        if (options.object instanceof global.Appacitive.Object) this.object = options.object;

        this.returnEdge = true;
        if (options.returnEdge !== undefined && options.returnEdge !== null && !options.returnEdge && !this.prev) this.returnEdge = false;
        
        this.label = '';
        var self = this;

        if (_type.isString(options.label) && options.label.length > 0) this.label = '&label=' + options.label;

        this.toUrl = function() {
            return {
                url: global.Appacitive.config.apiBaseUrl + 'connection/' + this.relation + '/' + this.type + '/' + this.objectId + '/find?' +
                        this.getQueryString() + this.label + '&returnEdge=' + this.returnEdge,
                description: 'GetConnectedObjects for relation ' + this.relation + ' of type ' + this.type + ' for object ' + this.objectId
            }; 
        };


        var parseNodes = function(nodes, endpointA) {
            var objects = [];
            nodes.forEach(function(o) {
                var edge = o.__edge;
                delete o.__edge;

                var tmpObject = global.Appacitive.Object._create(o, true);

                if (edge) {
                    edge.__endpointa = endpointA;
                    edge.__endpointb = {
                        objectid: o.__id,
                        label: edge.__label,
                        type: o.__type
                    };
                    delete edge.label;
                    tmpObject.connection = global.Appacitive.Connection._create(edge, true);
                }
                objects.push(tmpObject);
            });
            
            if (self.object) self.object.children[self.relation] = objects;

            return objects;
        };

        this.fetch = function(opts) {
            var promise = global.Appacitive.Promise.buildPromise(opts);
            
            var request = this.toRequest(opts);
            request.onSuccess = function(d) {
                var _parse = parseNodes;
                self.results = _parse(d.nodes ? d.nodes : [], { objectid : options.objectId, type: type, label: d.parent });
                self._setPaging(d.paginginfo);

                promise.fulfill(self.results, d.paginginfo);   
            };
            request.promise = promise;
            request.entity = this;
            return global.Appacitive.http.send(request);
        };

        return this;
    };

    global.Appacitive.Queries.ConnectedObjectsQuery.prototype = new BasicQuery();

    global.Appacitive.Queries.ConnectedObjectsQuery.prototype.constructor = global.Appacitive.Queries.ConnectedObjectsQuery;

    /** 
    * @constructor
    **/
    global.Appacitive.Queries.GetConnectionsQuery = function(options) {

        options = options || {};

        if (!options.relation) throw new Error('Specify relation for GetConnectionsQuery query');
        if (!options.objectId) throw new Error('Specify objectId for GetConnectionsQuery query');
        if (!options.label || options.label.trim().length === 0) throw new Error('Specify label for GetConnectionsQuery query');
        if (options.type) delete options.type;

        options.queryType = 'GetConnectionsQuery';

        BasicQuery.call(this, options);

        this.objectId = options.objectId;
        this.relation = options.relation;
        this.label = options.label;

        this.toUrl = function() {
            return {
                url: global.Appacitive.config.apiBaseUrl + 'connection/' + this.relation + '/find/all?' +
                this.getQueryString() + 
                '&objectid=' + this.objectId +
                '&label=' + this.label,
                description: 'FindAllConnections for relation ' + this.relation + ' from object id '  + this.objectId
            };
        };

        return this;
    };

    global.Appacitive.Queries.GetConnectionsQuery.prototype = new BasicQuery();

    global.Appacitive.Queries.GetConnectionsQuery.prototype.constructor = global.Appacitive.Queries.GetConnectionsQuery;

    /** 
    * @constructor
    **/
    global.Appacitive.Queries.GetConnectionsBetweenObjectsQuery = function(options, queryType) {

        options = options || {};

        delete options.entity;

        if (!options.objectAId || !_type.isString(options.objectAId) || options.objectAId.length === 0) throw new Error('Specify valid objectAId for GetConnectionsBetweenObjectsQuery query');
        if (!options.objectBId || !_type.isString(options.objectBId) || options.objectBId.length === 0) throw new Error('Specify objectBId for GetConnectionsBetweenObjectsQuery query');
        if (options.type) delete options.type;

        options.queryType = queryType || 'GetConnectionsBetweenObjectsQuery';

        BasicQuery.call(this, options);

        this.objectAId = options.objectAId;
        this.objectBId = options.objectBId;
        this.label = (this.queryType() === 'GetConnectionsBetweenObjectsForRelationQuery' && options.label && _type.isString(options.label) && options.label.length > 0) ? '&label=' + options.label : '';
        this.relation = (options.relation && _type.isString(options.relation) && options.relation.length > 0) ? options.relation + '/' : '';

        this.toUrl = function() {
            return {
                url: global.Appacitive.config.apiBaseUrl + 'connection/' + this.relation + 'find/' + this.objectAId + '/' + this.objectBId + '?'
                            + this.getQueryString() + this.label,
                description: 'FindConnectionBetween for relation ' + this.relation + ' between object ids '  + this.objectAId + ' and ' + this.objectBId
            };
        };

        return this;
    };

    global.Appacitive.Queries.GetConnectionsBetweenObjectsQuery.prototype = new BasicQuery();

    global.Appacitive.Queries.GetConnectionsBetweenObjectsQuery.prototype.constructor = global.Appacitive.Queries.GetConnectionsBetweenObjectsQuery;

    /** 
    * @constructor
    **/
    global.Appacitive.Queries.GetConnectionsBetweenObjectsForRelationQuery = function(options) {
        
        options = options || {};
        
        if (!options.relation) throw new Error('Specify relation for GetConnectionsBetweenObjectsForRelationQuery query');
        
        var inner = new global.Appacitive.Queries.GetConnectionsBetweenObjectsQuery(options, 'GetConnectionsBetweenObjectsForRelationQuery');

        inner.fetch = function(opts) {
            var promise = global.Appacitive.Promise.buildPromise(opts);

            var request = this.toRequest(opts);
            request.onSuccess = function(d) {
                inner.results = d.connection ? [global.Appacitive.Connection._create(d.connection, true, options.entity)] :  null
                promise.fulfill(inner.results ? inner.results[0] : null);
            };
            request.promise = promise;
            request.entity = this;
            return global.Appacitive.http.send(request);
        };

        return inner;
    };

    /** 
    * @constructor
    **/
    global.Appacitive.Queries.InterconnectsQuery = function(options) {

        options = options || {};

        delete options.entity;

        if (!options.objectAId || !_type.isString(options.objectAId) || options.objectAId.length === 0) throw new Error('Specify valid objectAId for InterconnectsQuery query');
        if (!options.objectBIds || !_type.isArray(options.objectBIds) || !(options.objectBIds.length > 0)) throw new Error('Specify list of objectBIds for InterconnectsQuery query');
        if (options.type) delete options.type;

        options.queryType = 'InterconnectsQuery';

        BasicQuery.call(this, options);

        this.objectAId = options.objectAId;
        this.objectBIds = options.objectBIds;
        
        this.toRequest = function(options) {
            var r = new global.Appacitive.HttpRequest();
            var obj = this.toUrl();
            r.url = obj.url;
            r.options = options;
            r.description = obj.description;
            r.method = 'post';
            r.data = {
                object1id: this.objectAId,
                object2ids: this.objectBIds
            };
            return r;
        };

        this.toUrl = function() {
            return {
                url: global.Appacitive.config.apiBaseUrl + 'connection/interconnects?' + this.getQueryString(),
                description: 'GetInterConnections between objects'
            };
        };

        return this;
    };

    global.Appacitive.Queries.InterconnectsQuery.prototype = new BasicQuery();

    global.Appacitive.Queries.InterconnectsQuery.prototype.constructor = global.Appacitive.Queries.InterconnectsQuery;


    /** 
    * @constructor
    **/
    global.Appacitive.Queries.GraphFilterQuery = function(name, placeholders) {
        
        if (!name || name.length === 0) throw new Error("Specify name of filter query");
        
        this.name = name;
        this.data = { };
        this.queryType = 'GraphFilterQuery';

        if (placeholders) { 
            this.data.placeholders = placeholders;
            for (var ph in this.data.placeholders) {
                this.data.placeholders[ph] = this.data.placeholders[ph];
            }
        }
        
        this.toRequest = function(options) {
            var r = new global.Appacitive.HttpRequest();
            var obj = this.toUrl();
            r.url = obj.url;
            r.options = options;
            r.description = obj.description;
            r.method = 'post';
            r.data = this.data;
            return r;
        };

        this.toUrl = function() {
            return {
                url: global.Appacitive.config.apiBaseUrl + 'search/' + this.name + '/filter',
                description: 'Filter Query with name ' + this.name
            };
        };

        this.fetch = function(options) {
            var promise = global.Appacitive.Promise.buildPromise(options);

            var request = this.toRequest(options);
            request.onSuccess = function(d) {
                promise.fulfill(d.ids ? d.ids : []);
            };
            request.promise = promise;
            request.entity = this;
            return global.Appacitive.http.send(request);
        };

    };

    /** 
    * @constructor
    **/
    global.Appacitive.Queries.GraphProjectQuery = function(name, ids, placeholders) {

        if (!name || name.length === 0) throw new Error("Specify name of project query");
        if (!ids || !ids.length) throw new Error("Specify ids to project");
        
        this.name = name;
        this.data = { ids: ids };
        this.queryType = 'GraphProjectQuery';
        var self = this;

        if (placeholders) { 
            this.data.placeholders = placeholders;
            for (var ph in this.data.placeholders) {
                this.data.placeholders[ph] = this.data.placeholders[ph];
            }
        }

        this.toRequest = function(options) {
            var r = new global.Appacitive.HttpRequest();
            var obj = this.toUrl();
            r.url = obj.url;
            r.description = obj.description;
            r.method = 'post';
            r.data = this.data;
            r.options = options;
            return r;
        };

        this.toUrl = function() {
            return {
                url: global.Appacitive.config.apiBaseUrl + 'search/' + this.name + '/project',
                description: 'Project Query with name ' + this.name
            };
        };

        var _parseResult = function(result) {
            var root;
            for (var key in result) {
                if (key !== 'status') {
                    root = result[key];
                    break;
                }
            }
            var parseChildren = function(obj, parentLabel, parentId) {
                var props = [];
                obj.forEach(function(o) {
                    var children = o.__children;
                    delete o.__children;
                    
                    var edge = o.__edge;
                    delete o.__edge;

                    var tmpObject = global.Appacitive.Object._create(o, true);
                    tmpObject.children = {};
                    for (var key in children) {
                        tmpObject.children[key] = [];
                        tmpObject.children[key] = parseChildren(children[key].values, children[key].parent, tmpObject.id);
                    }

                    if (edge) {
                        edge.__endpointa = {
                            objectid : parentId,
                            label: parentLabel
                        };
                        edge.__endpointb = {
                            objectid: tmpObject.id(),
                            label: edge.__label
                        };
                        delete edge.__label;
                        tmpObject.connection = global.Appacitive.Connection._create(edge, true);
                    }
                    props.push(tmpObject);
                });
                return props;
            };
            return parseChildren(root.values);
        };


        this.collection = function(items, opts) {
            opts = opts || {};
            items = items || [];
            if (_type.isObject(items)) opts = items, items = null;

            if (!items) items = this.results ? ths.results : [];

            var model;

            if (items.length > 0 && items[0] instanceof global.Appacitive.BaseObject) {
                model = global.Appacitive.Object._getClass(items[0].className);
            }

            return new Appacitive.Collection(items, _extend(opts, {
                model: this.model,
                query: this
            }));
        };

        this.fetch = function(options) {
            
            var promise = global.Appacitive.Promise.buildPromise(options);

            var request = this.toRequest(options);
            request.onSuccess = function(d) {
                self.results = _parseResult(d);
                promise.fulfill(results);
            };
            request.promise = promise;
            request.entity = this;
            return global.Appacitive.http.send(request);
        };
    };

})(global);/**
 * Standalone extraction of Backbone.Events, no external dependency required.
 * Degrades nicely when Backone/underscore are already available in the current
 * global context.
 *
 * Note that docs suggest to use underscore's `_.extend()` method to add Events
 * support to some given object. A `mixin()` method has been added to the Events
 * prototype to avoid using underscore for that sole purpose:
 *
 *     var myEventEmitter = BackboneEvents.mixin({});
 *
 * Or for a function constructor:
 *
 *     function MyConstructor(){}
 *     MyConstructor.prototype.foo = function(){}
 *     BackboneEvents.mixin(MyConstructor.prototype);
 *
 * (c) 2009-2013 Jeremy Ashkenas, DocumentCloud Inc.
 * (c) 2013 Nicolas Perriault
 */
/* global exports:true, define, module */
(function(global) {
  var root = global,
      breaker = {},
      nativeForEach = Array.prototype.forEach,
      hasOwnProperty = Object.prototype.hasOwnProperty,
      slice = Array.prototype.slice,
      idCounter = 0;

  // Returns a partial implementation matching the minimal API subset required
  // by Backbone.Events
  function miniscore() {
    return {
      keys: Object.keys,

      uniqueId: function(prefix) {
        var id = ++idCounter + '';
        return prefix ? prefix + id : id;
      },

      has: function(obj, key) {
        return hasOwnProperty.call(obj, key);
      },

      each: function(obj, iterator, context) {
        if (obj == null) return;
        if (nativeForEach && obj.forEach === nativeForEach) {
          obj.forEach(iterator, context);
        } else if (obj.length === +obj.length) {
          for (var i = 0, l = obj.length; i < l; i++) {
            if (iterator.call(context, obj[i], i, obj) === breaker) return;
          }
        } else {
          for (var key in obj) {
            if (this.has(obj, key)) {
              if (iterator.call(context, obj[key], key, obj) === breaker) return;
            }
          }
        }
      },

      once: function(func) {
        var ran = false, memo;
        return function() {
          if (ran) return memo;
          ran = true;
          memo = func.apply(this, arguments);
          func = null;
          return memo;
        };
      }
    };
  }

  var _ = miniscore(), Events;

  // Backbone.Events
  // ---------------

  // A module that can be mixed in to *any object* in order to provide it with
  // custom events. You may bind with `on` or remove with `off` callback
  // functions to an event; `trigger`-ing an event fires all callbacks in
  // succession.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.on('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  Events = {

    // Bind an event to a `callback` function. Passing `"all"` will bind
    // the callback to all events fired.
    on: function(name, callback, context) {
      if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
      this._events || (this._events = {});
      var events = this._events[name] || (this._events[name] = []);
      events.push({callback: callback, context: context, ctx: context || this});
      return this;
    },

    // Bind an event to only be triggered a single time. After the first time
    // the callback is invoked, it will be removed.
    once: function(name, callback, context) {
      if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
      var self = this;
      var once = _.once(function() {
        self.off(name, once);
        callback.apply(this, arguments);
      });
      once._callback = callback;
      return this.on(name, once, context);
    },

    // Remove one or many callbacks. If `context` is null, removes all
    // callbacks with that function. If `callback` is null, removes all
    // callbacks for the event. If `name` is null, removes all bound
    // callbacks for all events.
    off: function(name, callback, context) {
      var retain, ev, events, names, i, l, j, k;
      if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
      if (!name && !callback && !context) {
        this._events = {};
        return this;
      }

      names = name ? [name] : _.keys(this._events);
      for (i = 0, l = names.length; i < l; i++) {
        name = names[i];
        if (events = this._events[name]) {
          this._events[name] = retain = [];
          if (callback || context) {
            for (j = 0, k = events.length; j < k; j++) {
              ev = events[j];
              if ((callback && callback !== ev.callback && callback !== ev.callback._callback) ||
                  (context && context !== ev.context)) {
                retain.push(ev);
              }
            }
          }
          if (!retain.length) delete this._events[name];
        }
      }

      return this;
    },

    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    trigger: function(name) {
      if (!this._events) return this;
      var args = slice.call(arguments, 1);
      if (!eventsApi(this, 'trigger', name, args)) return this;
      var events = this._events[name];
      var allEvents = this._events.all;
      if (events) triggerEvents(events, args);
      if (allEvents) triggerEvents(allEvents, arguments);
      return this;
    },

    // Tell this object to stop listening to either specific events ... or
    // to every object it's currently listening to.
    stopListening: function(obj, name, callback) {
      var listeners = this._listeners;
      if (!listeners) return this;
      var deleteListener = !name && !callback;
      if (typeof name === 'object') callback = this;
      if (obj) (listeners = {})[obj._listenerId] = obj;
      for (var id in listeners) {
        listeners[id].off(name, callback, this);
        if (deleteListener) delete this._listeners[id];
      }
      return this;
    }

  };

  // Regular expression used to split event strings.
  var eventSplitter = /\s+/;

  // Implement fancy features of the Events API such as multiple event
  // names `"change blur"` and jQuery-style event maps `{change: action}`
  // in terms of the existing API.
  var eventsApi = function(obj, action, name, rest) {
    if (!name) return true;

    // Handle event maps.
    if (typeof name === 'object') {
      for (var key in name) {
        obj[action].apply(obj, [key, name[key]].concat(rest));
      }
      return false;
    }

    // Handle space separated event names.
    if (eventSplitter.test(name)) {
      var names = name.split(eventSplitter);
      for (var i = 0, l = names.length; i < l; i++) {
        obj[action].apply(obj, [names[i]].concat(rest));
      }
      return false;
    }

    return true;
  };

  // A difficult-to-believe, but optimized internal dispatch function for
  // triggering events. Tries to keep the usual cases speedy (most internal
  // Backbone events have 3 arguments).
  var triggerEvents = function(events, args) {
    var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
    switch (args.length) {
      case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
      case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
      case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
      case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
      default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args);
    }
  };

  var listenMethods = {listenTo: 'on', listenToOnce: 'once'};

  // Inversion-of-control versions of `on` and `once`. Tell *this* object to
  // listen to an event in another object ... keeping track of what it's
  // listening to.
  _.each(listenMethods, function(implementation, method) {
    Events[method] = function(obj, name, callback) {
      var listeners = this._listeners || (this._listeners = {});
      var id = obj._listenerId || (obj._listenerId = _.uniqueId('l'));
      listeners[id] = obj;
      if (typeof name === 'object') callback = this;
      obj[implementation](name, callback, this);
      return this;
    };
  });

  // Aliases for backwards compatibility.
  Events.bind   = Events.on;
  Events.unbind = Events.off;

  // Mixin utility
  Events.mixin = function(proto) {
    var exports = ['on', 'once', 'off', 'trigger', 'stopListening', 'listenTo', 'listenToOnce', 'bind', 'unbind'];
    _.each(exports, function(name) {
      proto[name] = this[name];
    }, this);
    return proto;
  };

  //changed to match with Appacitive
  root.Appacitive.Events = Events;
 
})(global);var ArrayProto = Array.prototype;
var ObjectProto = Object.prototype;

var each = function(obj, iterator, context) {
    if (obj == null) return;
    if (ArrayProto.forEach && obj.forEach === ArrayProto.forEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (iterator.call(context, obj[i], i, obj) === {}) return;
      }
    } else {
      for (var key in obj) {
        if (ObjectProto.hasOwnProperty.call(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === {}) return;
        }
      }
    }
};

  // Extend a given object with all the properties in passed-in object(s).
var _extend = function(obj) {
    each(ArrayProto.slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
};

// Helper function to correctly set up the prototype chain, for subclasses.
// Similar to `goog.inherits`, but uses a hash of prototype properties and
// class properties to be extended.
var extend = function(protoProps, staticProps) {
    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (_type.isObject(protoProps) && protoProps.hasOwnProperty('constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ 
        return parent.apply(this, arguments); 
      };
    }

    // Add static properties to the constructor function, if supplied.
    _extend(child, parent, staticProps);
    
    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function(){ this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _extend(child.prototype, protoProps);

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
};

(function (global) {

  "use strict";

  global.Appacitive._extend = function(parent, protoProps, staticProps) {
    return extend.apply(parent, [protoProps, staticProps]);
  };

})(global);
(function (global) {

    "use strict";

    //base object for objects and connections
    /**
    * @constructor
    **/
    var _BaseObject = function(objectOptions, optns) {

        var _snapshot = {};

        optns = optns || {};

        if (optns && optns.parse) objectOptions = this.parse(objectOptions);
        
        if (_type.isObject(this.defaults) && !optns.setSnapShot) objectOptions = _extend({}, this.defaults, objectOptions);
        
        if (optns && optns.collection) this.collection = optns.collection;
        
        //atomic properties
        var _atomicProps = {};

        //mutlivalued properties
        var _multivaluedProps = {};

        var _setOps = {};

        //Copy properties to current object
        var _copy = function(src, des) {
            for (var property in src) {
                if (_atomicProps[property]) delete _atomicProps[property];
                if (_multivaluedProps[property]) delete _multivaluedProps[property];
                if (_setOps[property]) delete _setOps[property];

                if (_type.isString(src[property])) {
                    des[property] = src[property];
                } else if(src[property] instanceof Date){
                    des[property] = global.Appacitive.Date.toISOString(src[property]);
                } else if (_type.isObject(src[property]))  {
                    
                    if (src[property] instanceof global.Appacitive.GeoCoord) {
                        des[property] = src[property].toString();
                    } else {

                        if (!des[property]) des[property] = {};

                        for (var p in src[property]) {
                            des[property][p] = src[property][p];
                        }
                    }
                } else if (_type.isArray(src[property])) {
                    des[property] = [];
                
                    src[property].forEach(function(v) {
                        if (_type.isString(v)) { des[property].push(v); }
                        else if (_type.isNumber(v) || _type.isBoolean(v)) { des[property].push(value + ''); }
                        else if (v instanceof Date) des[property].push(global.Appacitive.Date.toISOString(v));
                        else if (property == '__link') des[property].push(v);
                        else throw new Error("Multivalued property cannot have values of property as an object");
                    });

                    if (property !== '__tags' || property !== '__link') {
                        des[property].push = function(v) {
                            var len = this.length;
                            if (_type.isString(v)) { this[len] = v; }
                            else if (_type.isNumber(v) || _type.isBoolean(v)) { this[len] = v + ''; }
                            else if (v instanceof Date) {
                                this[len] = global.Appacitive.Date.toISOString(v);
                            } else {
                                throw new Error("Multivalued property cannot have values of property as an object");
                            } 
                            return this;
                        }
                    }
                } else {
                    des[property] = src[property];
                }
            }
        };

        var that = this;

        var raw = {};
        _copy(objectOptions, raw);
        var object = raw;

        //will be used in case of creating an appacitive object for internal purpose
        if (optns.setSnapShot) _copy(object, _snapshot);
        
        if (!_snapshot.__id && raw.__id) _snapshot.__id = raw.__id;

        //Check whether __type or __relationtype is mentioned and set type property
        if (raw.__type) { 
            raw.__type = raw.__type.toLowerCase();
            this.entityType = 'type';
            this.type = 'object';
            this.className = raw.__type;
        } else if (raw.__relationtype) {
            raw.__relationtype = raw.__relationtype.toLowerCase();
            this.entityType = 'relation';
            this.type = 'connection';
            this.className = raw.__relationtype;
        }

        var __cid = parseInt(Math.random() * 100000000, 10);

        this.cid = __cid;

        //attributes
        if (!object.__attributes) object.__attributes = {};
        if (!_snapshot.__attributes) _snapshot.__attributes = {};

        //tags
        var _removeTags = []; 
        if (!object.__tags) object.__tags = [];
        if (!_snapshot.__tags) _snapshot.__tags = [];

        //fields to be returned
        var _fields = '';

        //Fileds to be ignored while update operation
        var _ignoreTheseFields = ["__id", "__revision", "__endpointa", "__endpointb", "__createdby", "__lastmodifiedby", "__type", "__relationtype", "__typeid", "__relationid", "__utcdatecreated", "__utclastupdateddate", "__tags", "__authType", "__authtype", "__link"];
        
        var _allowObjectSetOperations = ["__link", "__endpointa", "__endpointb"];

        /* parse api output to get error info
           TODO: define error objects in future depending on codes and messages */
        var _getOutpuStatus = function(data) {
            data = data || {};
            data.message = data.message || 'Server error';
            data.code = data.code || '500';
            return data;
        };

        this.attributes = this.toJSON = this.getObject = function() { return JSON.parse(JSON.stringify(object)); };

        this.properties = function() {
            var properties = this.attributes();
            delete properties.__attributes;
            delete properties.__tags;
            return properties;
        };

        this.id = function() {
            if (arguments.length === 1) {
                this.set('__id', arguments[0]);
                return this;
            }
            return this.get('__id');    
        };

        this.parse = function(resp, options) {
          return resp;
        };

        // accessor function for the object's attributes
        this.attr = function() {
            if (arguments.length === 0) {
                if (!object.__attributes) object.__attributes = {};
                return object.__attributes;
            } else if (arguments.length === 1) {
                if (!object.__attributes) object.__attributes = {};
                return object.__attributes[arguments[0]];
            } else if (arguments.length === 2) {
                if (!_type.isString(arguments[1]) && arguments[1] !== null)
                    throw new Error('only string values can be stored in attributes.');
                if (!object.__attributes) object.__attributes = {};
                object.__attributes[arguments[0]] = arguments[1];
            } else throw new Error('.attr() called with an incorrect number of arguments. 0, 1, 2 are supported.');

            triggerChangeEvent('__attributes');

            return object.__attributes;
        };

        //accessor function to get changed attributes
        var _getChangedAttributes = function() {
            if (!object.__attributes) return null;
            if (!_snapshot.__attributes) return object.__attributes;

            var isDirty = false;
            var changeSet = JSON.parse(JSON.stringify(_snapshot.__attributes));
            for (var property in object.__attributes) {
                if (object.__attributes[property] == null || object.__attributes[property] == undefined) {
                    changeSet[property] = null;
                    isDirty = true;
                } else if (object.__attributes[property] != _snapshot.__attributes[property]) {
                    changeSet[property] = object.__attributes[property];
                    isDirty = true;
                } else if (object.__attributes[property] == _snapshot.__attributes[property]) {
                    delete changeSet[property];
                }
            }
            if (!isDirty) return null;
            return changeSet;
        };

        this.getChangedAttributes = _getChangedAttributes;

        // accessor function for the object's aggregates
        this.aggregate = function() {
            var aggregates = {};
            for (var key in object) {
                if (!object.hasOwnProperty(key)) return;
                if (key[0] == '$') {
                    aggregates[key.substring(1)] = object[key];
                }
            }
            if (arguments.length === 0) return aggregates;
            else if (arguments.length == 1) return aggregates[arguments[0]];
            else throw new Error('.aggregates() called with an incorrect number of arguments. 0, and 1 are supported.');
        };

        this.tags = function()  {
            if (!object.__tags) return [];
            return object.__tags;
        };

        this.addTag = function(tag) {
            if (!tag || !_type.isString(tag) || !tag.length) return this;
            
            if (!object.__tags) object.__tags = [];

            object.__tags.push(tag);
            object.__tags = Array.distinct(object.__tags);

            if (!_removeTags || !_removeTags.length) {
                triggerChangeEvent('__tags');
                return this;
            } 

            var index = _removeTags.indexOf(tag);
            if (index != -1) _removeTags.splice(index, 1);

            triggerChangeEvent('__tags');

            return this;
        };

        this.removeTag = function(tag) {
            if (!tag || !_type.isString(tag) || !tag.length) return this;
            //tag = tag.toLowerCase();
            _removeTags.push(tag);
            _removeTags = Array.distinct(_removeTags);

            if (!object.__tags || !object.__tags.length) {
                triggerChangeEvent('__tags');
                return this;
            }

            var index = object.__tags.indexOf(tag);
            if (index != -1) object.__tags.splice(index, 1);

            triggerChangeEvent('__tags');

            return this;
        };

        var _getChangedTags = function() {
            if (!object.__tags) return [];
            if (!_snapshot.__tags) return object.__tags;

            var _tags = [];
            object.__tags.forEach(function(a) {
                if (_snapshot.__tags.indexOf(a) == -1)
                    _tags.push(a);
            });
            return _tags.length > 0 ? _tags : null;
        };

        this.getChangedTags = _getChangedTags;

        this.getRemovedTags = function() { return _removetags; };

        var setMutliItems = function(key, value, op, options) {
            if (!key || !_type.isString(key) ||  key.length === 0  || key.trim().indexOf('__') == 0 || key.trim().indexOf('$') === 0 || value == undefined || value == null) return this; 
            
            key = key.toLowerCase();

            try {

                var addItem = function(item) {
                    var val;
                    if (_type.isString(item)) { val = item; }
                    else if (_type.isNumber(item) || _type.isBoolean(item)) { val = item + ''; }
                    else throw new Error("Multivalued property cannot have values of property as an object");

                    if (object[key] && _type.isArray(object[key])) {

                        var index = object[key].indexOf(val);
                        if (op == 'additems') {
                            object[key].push(val);
                        } else if (index == -1 && op == 'adduniqueitems') {
                            object[key].push(val);
                        } else if (op == 'removeitems') {
                            object[key].removeAll(val);
                        }
                    } else {
                        if (op != 'removeitems') object[key] = [val];
                    }

                    if (!_multivaluedProps[key]) _multivaluedProps[key] = { additems: [], adduniqueitems: [], removeitems: [] };

                    _multivaluedProps[key][op].push(val);
                };

                if (_type.isArray(value)) {
                    value.forEach(function(v) {
                        addItem(v);
                    });
                } else {
                    addItem(value);
                }

                triggerChangeEvent(key, options);

            } catch(e) {
                throw new Error("Unable to add item to " + key);
            }

            return that; 
        };

        this.add = function(key, value, options) {
            return setMutliItems.apply(this, [key, value, 'additems', options]);
        };

        this.addUnique = function(key, value, options) {
            return setMutliItems.apply(this, [key, value, 'adduniqueitems', options]);
        };

        this.remove = function(key, value, options) {
            return setMutliItems.apply(this, [key, value, 'removeitems', options]);
        };

        var _getChanged = function(isInternal) {
            var isDirty = false;
            var changeSet = JSON.parse(JSON.stringify(_snapshot));
            for (var property in object) {
                if (object[property] == null || object[property] == undefined) {
                    changeSet[property] = null;
                    isDirty = true;
                } else if (object[property] != _snapshot[property]) {
                    if (property == '__tags' || property == '__attributes') {
                        delete changeSet[property];
                    } else {
                        if (_type.isArray(object[property])) {
                            if (_multivaluedProps[property] && !_setOps[property]) {
                                changeSet[property] = _multivaluedProps[property];
                                isDirty = true;
                            } else if (!object[property].equals(_snapshot[property])) {
                                changeSet[property] = object[property];
                                isDirty = true;
                            } else {
                                delete changeSet[property];
                            }
                        } else if (_atomicProps[property] && !_setOps[property]) {
                            changeSet[property] = { incrementby : _atomicProps[property].value };
                            isDirty = true;
                        } else {
                            changeSet[property] = object[property];
                            isDirty = true;
                        }
                    }
                } else if (object[property] == _snapshot[property]) {
                    delete changeSet[property];
                }
            }

            try {
                _ignoreTheseFields.forEach(function(c) {
                    if (changeSet[c]) delete changeSet[c];
                });
            } catch(e) {}

            var changedTags = _getChangedTags();
            if (isInternal) {
                if (changedTags) { 
                    changeSet["__addtags"] = changedTags; 
                    isDirty = true;
                }
                if (_removeTags && _removeTags.length > 0) {
                    changeSet["__removetags"] = _removeTags;
                    isDirty = true;
                }
            } else {
                if (changedTags) { 
                    changeSet["__tags"] = changedTags; 
                    isDirty = true;
                }
            }

            var attrs = _getChangedAttributes();
            if (attrs) { 
                changeSet["__attributes"] = attrs;
                isDirty = true;
            }
            else delete changeSet["__attributes"];

            for (var p in changeSet) {
                if (p[0] == '$') delete changeSet[p];
            }

            if (isDirty && !Object.isEmpty(changeSet)) return changeSet;
            return false;
        };

        this.changed = function() {
            if (this.isNew()) return this.toJSON();
            
            return _getChanged();
        };

        this.hasChanged = function() {
            if (this.isNew()) return true;

            var changeSet = _getChanged(true);
            if (arguments.length === 0) {
                return Object.isEmpty(changeSet) ? false : true;
            } else if (arguments.length == 1 && _type.isString(arguments[0]) && arguments[0].length > 0) {
                if (changeSet && changeSet[arguments[0]]) {
                    return true;
                } return false;
            }
            return false;
        };

        this.changedAttributes  = function() {
            if (this.isNew()) return this.toJSON();

            var changeSet = _getChanged(true);
            
            if (arguments.length === 0) {
                return changeSet;
            } else if (arguments.length == 1 && _type.isArray(arguments[0]) && arguments[0].length) {
                var attrs = {};
                arguments[0].forEach(function(c) {
                    if (changeSet[c]) attrs.push(changeSet[c]);
                });
                return attrs;
            }
            return false;
        };

        this.previous = function() {
            if (this.isNew()) return null;

            if (arguments.length == 1 && _type.isString(arguments[0]) && arguments[0].length) {
                return _snapshot[arguments[0]]; 
            }
            return null;
        };

        this.previousAttributes = function() { 
            if (this.isNew()) return null; 
            return _snapshot; 
        };

        this.fields = function() {
            if (arguments.length == 1) {
                var value = arguments[0];
                if (_type.isString(value)) _fields = value;
                else if (_type.isArray(value)) _fields = value.join(',');
                return this;
            } else {
                return _fields;
            }
        };

        var _types = {
            "integer": function(value) { 
                if (value) {
                    var res = parseInt(value);
                    if (!isNaN(res)) return res;
                }
                return value;
            }, "decimal": function(value) { 
                if (value) {
                    var res = parseFloat(value);
                    if (!isNaN(res)) return res;
                }
                return value;
            }, "boolean": function(value) { 
                if (value !== undefined && value !== null && (value.toString().toLowerCase() === 'true' || value === true || value > 0)) return true;
                return false;
            }, "date": function(value) { 
                if (value) {
                    var res = global.Appacitive.Date.parseISODate(value);
                    if (res) return res;
                }
                return value;
            }, "datetime": function(value) { 
                if (value) {
                    var res = global.Appacitive.Date.parseISODate(value);
                    if (res) return res;
                }
                return value;
            }, "time": function(value) { 
                if (value) {
                    var res = global.Appacitive.Date.parseISOTime(value);
                    if (res) return res;
                }
                return value;
            }, "string": function(value) { 
                if (value) return value.toString();
                return value;
            }, "geocode": function(value) {
                // value is not string or its length is 0, return false
                if (!_type.isString(value) || value.trim().length == 0) return false;
                  
                // Split value string by ,
                var split = value.split(',');

                // split length is not equal to 2 so return false
                if (split.length !== 2 ) return false;

                // validate the value
                return new global.Appacitive.GeoCoord(split[0], split[1]);
            }
        };

        this.get = function(key, type) { 
            if (key) { 
                if (type && _types[type.toLowerCase()]) {
                    if (_types[type.toLowerCase()]) {
                        var res = _types[type.toLowerCase()](object[key]);
                        return res;
                    } else {
                        throw new Error('Invalid cast-type "' + type + '"" provided for get "' + key + '"');
                    }
                }
                return object[key];
            }
        };

        this.tryGet = function(key, value, type) {
            var res = this.get(key, type);
            if (res !== undefined) return res;
            return value;
        };

        var getDateValue = function(type, value) {
            if (type == 'date') {
                return global.Appacitive.Date.toISODate(value);
            } else if (type == 'time') {
                return global.Appacitive.Date.toISOTime(value);
            } 
            return global.Appacitive.Date.toISOString(value);
        };

        var triggerChangeEvent = function(key, options) {
            if (options && !options.silent) {
                var changed = _getChanged();

                if(changed[key]) {
                    // Trigger all relevant attribute changes.
                    that.trigger('change:' + key, that, changed[key], {});
                    that.trigger('change', that, options);
                }
            }
        };

        var triggerDestroy = function(opts) {
            if (opts && !opts.silent) that.trigger('destroy', that, that.collection, opts);
        };

        this.set = function(key, value, options) {
            options = options || {};

            var oType = options.dataType;

            if (!key || !_type.isString(key) ||  key.length === 0 || key.trim().indexOf('$') === 0) return this; 
            
            key = key.toLowerCase();

            try {

                if (value == undefined || value == null) { object[key] = null;}
                else if (_type.isString(value)) { object[key] = value; }
                else if (_type.isNumber(value) || _type.isBoolean(value)) { object[key] = value + ''; }
                else if (value instanceof Date) {
                    object[key] = getDateValue(dataType, value);
                } else if (_type.isObject(value)) {
                    if (_allowObjectSetOperations.indexOf(key) !== -1) {
                        object[key] = value;
                    } else {
                        if (value instanceof global.Appacitive.GeoCoord) {
                            object[key] = value.toString();
                        } else {
                            throw new Error("Property cannot have value as an object");
                        }
                    }
                } else if (_type.isArray(value)) {
                    object[key] = [];

                    value.forEach(function(v) {
                        if (_type.isString(v)) { object[key].push(v); }
                        else if (_type.isNumber(v) || _type.isBoolean(v)) { object[key].push(v + ''); }
                        else if (value instanceof Date) throw new Error("Multivalued property cannot have values of property as date");
                        else throw new Error("Multivalued property cannot have values of property as an object");
                    });

                    if (key !== 'tags' || key !== '__link') {
                        object[key].push = function(v) {
                            var len = this.length;
                            if (_type.isString(v)) { this[len] = v; }
                            else if (_type.isNumber(v) || _type.isBoolean(v)) { this[len] = v + ''; }
                            else throw new Error("Multivalued property cannot have values of property as an object");
                            
                            triggerChangeEvent(key, options);

                            return this; 
                        }
                    }
                }

                delete _atomicProps[key];
                delete _multivaluedProps[key];
                delete _setOps[key];

                if (object[key] !== _snapshot[key]) {
                    if ((_type.isArray(object[key]) && !object[key].equals(_snapshot[key])) || _type.isString(object[key]) || _type.isObject(object[key])) {
                        _setOps[key] = true;
                    }
                }

                triggerChangeEvent(key, options);

                return this;
            } catch(e) {
                throw new Error("Unable to set " + key);
            } 
        };

        this.unset = function(key, options) {
            if (!key || !_type.isString(key) ||  key.length === 0 || key.indexOf('__') === 0) return this; 
            key = key.toLowerCase();
            delete object[key];
            triggerChangeEvent(key, options);
            return this;
        };

        this.has = function(key) {
            if (!key || !_type.isString(key) ||  key.length === 0) return false; 
            if (object[key] && !_type.isUndefined(object[key])) return true;
            return false;
        };

        this.isNew = function() {
            if (object.__id && object.__id.length) return false;
            return true;
        };

        this.clone = function() {
            if (this.type == 'object') return global.Appacitive.Object._create(this.toJSON());
            return new global.Appacitive.connection._create(this.toJSON());
        };

        this.copy = function(properties, setSnapShot) { 
            if (properties) { 
                _copy(properties, object);
                if (setSnapShot) {
                    _copy(properties, _snapshot);
                }
            }
            return this;
        };

        this.mergeWithPrevious = function() {
            _copy(object, _snapshot);
            _removeTags = [];
            _atomicProps = {};
            _multivaluedProps = {};
            _setOps = {};
            return this;
        };

        var _merge = function() {
            _copy(_snapshot, object);
            _removeTags = [];
            _atomicProps = {};
            _multivaluedProps = {};
            _setOps = {};
        };

        this.rollback = function() {
            object = raw = {};
            _merge();
            return this;
        };

        var _atomic = function(key, amount, multiplier, options) {
            if (!key || !_type.isString(key) ||  key.length === 0 || key.indexOf('__') === 0) return this;

            key = key.toLowerCase();

            if (_type.isObject(object[key]) ||  _type.isArray(object[key])) {
                throw new Error("Cannot increment/decrement array/object");
            }

            try {
                if (_type.isObject(amount)) {
                    options = amount;
                    amount = multiplier;
                } else {
                    if (!amount || isNaN(Number(amount))) amount = multiplier;
                    else amount = Number(amount) * multiplier;
                }
                object[key] = isNaN(Number(object[key])) ? amount : Number(object[key]) + amount;

                if (!that.isNew()) {
                    _atomicProps[key] = { value : (_atomicProps[key] ? _atomicProps[key].value : 0) + amount };
                }

            } catch(e) {
                throw new Error('Cannot perform increment/decrement operation');
            }

            triggerChangeEvent(key, options);

            return that;
        };

        this.increment = function(key, amount, options) {
            return _atomic(key, amount, 1, options);
        };

        this.decrement = function(key, amount, options) {
            return _atomic(key, amount, -1, options);
        };

        /* crud operations  */

        /* save
           if the object has an id, then it has been created -> update
           else create */
        this.save = function() {
            if (object.__id) return _update.apply(this, arguments);
            else return _create.apply(this, arguments);
        };

        // to create the object
        var _create = function(options) {

            var type = that.type;
            if (object.__type &&  ( object.__type.toLowerCase() == 'user' ||  object.__type.toLowerCase() == 'device')) {
                type = object.__type.toLowerCase()
            }

            //remove __revision and aggregate poprerties
            for (var p in object) {
                if (p[0] == '$') delete object[p];
            }
            if (object["__revision"]) delete object["__revision"];
            
            var request = new global.Appacitive._Request({
                method: 'PUT',
                type: type,
                op: 'getCreateUrl',
                args: [this.className, _fields],
                data: object,
                callbacks: options,
                entity: that,
                onSuccess: function(data) {
                    var savedState = null;
                    if (data && data[type]) {
                        savedState = data[type];

                        _snapshot = savedState;
                        object.__id = savedState.__id;
                        
                        _merge();

                        if (that.type == 'connection') that.parseConnection();
                        global.Appacitive.eventManager.fire(that.entityType + '.' + type + '.created', that, { object : that });

                        that.created = true;

                        that.trigger('sync', that, data[type], options);

                        request.promise.fulfill(that);
                    } else {
                        global.Appacitive.eventManager.fire(that.entityType + '.' + type + '.createFailed', that, { error: data.status });
                        request.promise.reject(data.status, that);
                    }
                }
            });
                
            return request.send();
        };

        // to update the object
        var _update = function(options, promise) {

            if (!global.Appacitive.Promise.is(promise)) promise = global.Appacitive.Promise.buildPromise(options);

            var changeSet = _getChanged(true);
            for (var p in changeSet) {
                if (p[0] == '$') delete changeSet[p];
            }

            if (!Object.isEmpty(changeSet)) {

                var type = that.type;
                
                var args = [that.className, (_snapshot.__id) ? _snapshot.__id : object.__id, _fields];

                // for User and Device objects
                if (object && object.__type &&  ( object.__type.toLowerCase() == 'user' ||  object.__type.toLowerCase() == 'device')) { 
                    type = object.__type.toLowerCase();
                    args.splice(0, 1);
                }

                var request = new global.Appacitive._Request({
                    method: 'POST',
                    type: type,
                    op: 'getUpdateUrl',
                    args: args,
                    data: changeSet,
                    callbacks: options,
                    entity: that,
                    onSuccess: function(data) {
                        if (data && data[type]) {
                            _snapshot = data[type];
                            
                            _merge();
                            
                            delete that.created;
                            
                            that.trigger('sync', that, data[type], options);

                            global.Appacitive.eventManager.fire(that.entityType  + '.' + type + "." + object.__id +  '.updated', that, { object : that });
                            request.promise.fulfill(that);
                        } else {
                            data = data || {};
                            data.status =  data.status || {};
                            data.status = _getOutpuStatus(data.status);
                            global.Appacitive.eventManager.fire(that.entityType  + '.' + type + "." + object.__id +  '.updateFailed', that, { object : data.status });
                            request.promise.reject(data.status, that);
                        }
                    }
                });
                
                return request.send();
            } else {
                promise.fulfill(that);
            }
            
            return promise;
        };

        var _fetch = function (options) {

            if (!object.__id) throw new Error('Please specify id for get operation');
            
            var type = this.type;

            // for User and Device objects
            if (object && object.__type &&  ( object.__type.toLowerCase() == 'user' ||  object.__type.toLowerCase() == 'device')) { 
                type = object.__type.toLowerCase();
            }

            var request = new global.Appacitive._Request({
                method: 'GET',
                type: type,
                op: 'getGetUrl',
                args: [this.className, object.__id, _fields],
                callbacks: options,
                entity: that,
                onSuccess: function(data) {
                    if (data && data[type]) {
                        _snapshot = data[type];
                        _copy(_snapshot, object);
                        if (data.connection) {
                            if (!that.endpoints && (!that.endpointA || !that.endpointB)) {
                                that.setupConnection(object.__endpointa, object.__endpointb);
                            }
                        }
                        that.trigger('sync', that, data[type], options);
                        request.promise.fulfill(that);
                    } else {
                        data = data || {};
                        data.status =  data.status || {};
                        data.status = _getOutpuStatus(data.status);
                        request.promise.reject(data.status, that);
                    }
                }
            });
            return request.send();
        };

        // fetch ( by id )
        this.fetch = function(callbacks) {
            return _fetch.apply(this ,[callbacks]);
        };

        // delete the object
        this.destroy = function(opts) {
            opts = opts || {};

            var deleteConnections = opts.deleteConnections;
            
            if (_type.isBoolean(opts)) {
                deleteConnections = opts;
                opts = {};
            }

            // if the object does not have __id set, 
            // just call success
            // else delete the object

            if (!object['__id']) return new global.Appacitive.Promise.buildPromise(opts).fulfill();

            var type = this.type;
            if (object.__type &&  ( object.__type.toLowerCase() == 'user' ||  object.__type.toLowerCase() == 'device')) {
                type = object.__type.toLowerCase()
            }

            if (!opts.wait)  triggerDestroy(opts);

            var request = new global.Appacitive._Request({
                method: 'DELETE',
                type: type,
                op: 'getDeleteUrl',
                args: [this.className, object.__id, deleteConnections],
                callbacks: opts,
                entity: this,
                onSuccess: function(data) {
                    request.promise.fulfill(data);

                    if (data && data.status) {
                        if (opts.wait) triggerDestroy(opts);
                        request.promise.fulfill(data.status);
                    } else {
                        data = data || {};
                        data.status =  data.status || {};
                        data.status = _getOutpuStatus(data.status);
                        request.promise.reject(data.status, that);
                    }
                }
            });
            return request.send();
        };
        this.del = this.destroy;


        if (this.type == 'object') {
            this.destroyWithConnections = function(options) {
                return this.destroy(_extend({ deleteConnections: true}, options));
            };
        }

    };

    global.Appacitive.BaseObject = _BaseObject;

    global.Appacitive.BaseObject.prototype.toString = function() {
        return JSON.stringify(this.getObject());
    };

    global.Appacitive.Events.mixin(global.Appacitive.BaseObject.prototype);

})(global);
(function (global) {

    "use strict";

    var S4 = function () {
        return Math.floor(Math.random() * 0x10000).toString(16);
    };

    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    var _utf8_encode = function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    };

    var encodeToBase64 = function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = _utf8_encode(input);
        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }

        return output;
    };

    /**
     * @constructor
     **/
    global.Appacitive.GUID = function () {
        return encodeToBase64(
        S4() + S4() + "-" +
            S4() + "-" +
            S4() + "-" +
            S4() + "-" +
            S4() + S4() + S4()).toString();
    };

})(global);
(function (global) {

    "use strict";

    global.Appacitive.Object = function(attrs, options) {
        attrs = attrs || {};
        options = options || {};

        if (this.className) attrs.__type = this.className;
        
        if (_type.isString(attrs)) attrs = { __type : attrs };

        if (!attrs.__type) throw new Error("Cannot set object without __type");

        if (_type.isBoolean(options)) options = { setSnapShot: true };

        global.Appacitive.BaseObject.call(this, attrs, options);

        this.type = 'object';
        this.getObject = this.getObject;
        this.children = {};

        this.toJSON = function(recursive) {
            if (recursive) {
                var parseChildren = function(root) {
                    var objects = [];
                    root.forEach(function(obj) {
                        var tmp = obj.getObject();
                        if (obj.children && !Object.isEmpty(obj.children)) {
                            tmp.children = {};
                            for (var c in obj.children) {
                                tmp.children[c] = parseChildren(obj.children[c]);
                            }
                        }
                        if (obj.connection) tmp.__connection = obj.connection.toJSON();
                        objects.push(tmp);
                    });
                    return objects;
                };
                return parseChildren([this])[0];
            } else {
                return this.getObject();
            }
        };

        this.typeName = attrs.__type;

        if (_type.isFunction(this.initialize)) {
            this.initialize.apply(this, [attrs]);
        }

        return this;
    };

    global.Appacitive.Object.prototype = new global.Appacitive.BaseObject();

    global.Appacitive.Object.prototype.constructor = global.Appacitive.Object;

    global.Appacitive.Object.extend = function(typeName, protoProps, staticProps) {
    
        if (!_type.isString(typeName)) {
          throw new Error("Appacitive.Object.extend's first argument should be the type-name.");
        }

        var entity = null;
    
        protoProps = protoProps || {};
        protoProps.className = typeName;

        entity = global.Appacitive._extend(global.Appacitive.Object, protoProps, staticProps);

        // Do not allow extending a class.
        delete entity.extend;

        // Set className in entity class
        entity.className = typeName;

        entity.type = typeName;

        __typeMap[typeName] = entity;

        return entity;
    };

    var __typeMap = {};

    var _getClass = function(className) {
        if (!_type.isString(className)) {
          throw "_getClass requires a string argument.";
        }
        var entity = __typeMap[className];
        if (!entity) {
          entity = global.Appacitive.Object.extend(className);
          __typeMap[className] = entity;
        }
        return entity;
    };

    global.Appacitive.Object._getClass = _getClass;

    global.Appacitive.Object._create = function(attributes, setSnapshot, typeClass) {
        var entity;
        if (this.className) entity = this;
        else entity = (typeClass) ? typeClass : _getClass(attributes.__type);
        return new entity(attributes).copy(attributes, setSnapshot);
    };

    //private function for parsing objects
    var _parseObjects = function(objects, typeClass) {
        var tmpObjects = [];
        objects.forEach(function(a) {
            var obj = global.Appacitive.Object._create(a, true, typeClass);
            tmpObjects.push(obj);
        });
        return tmpObjects;
    };

    global.Appacitive.Object._parseResult = _parseObjects;

    global.Appacitive.Object.multiDelete = function(attrs, options) {
        attrs = attrs || {};
        options = options || {};
        var models = [];
        if (this.className) attrs.type = this.className;

        if (_type.isArray(attrs) && attrs.length > 0) {
            models = attrs;
            attrs = { 
                type:  models[0].className ,
                ids : models.map(function(o) { return o.id(); }).filter(function(o) { return o; }) 
            };
        }
        if (!attrs.type || !_type.isString(attrs.type) || attrs.type.length === 0) throw new Error("Specify valid type");
        if (attrs.type.toLowerCase() === 'user' || attrs.type.toLowerCase() === 'device') throw new Error("Cannot delete user and devices using multidelete");
        if (!attrs.ids || attrs.ids.length === 0) throw new Error("Specify ids to delete");

        var request = new global.Appacitive._Request({
            method: 'POST',
            data: { idlist : attrs.ids },
            type: 'object',
            op: 'getMultiDeleteUrl',
            args: [attrs.type],
            callbacks: options,
            onSuccess: function(d) {
                if (options && !options.silent) {
                    models.forEach(function(m) {
                        m.trigger('destroy', m, m.collection, options);
                    });
                }
                request.promise.fulfill();
            }
        });
        
        return request.send();
    };


    //takes typename and array of objectids and returns an array of Appacitive object objects
    global.Appacitive.Object.multiGet = function(options, callbacks) {
        options = options || {};
        if (this.className) {
            options.relation = this.className;
            options.entity = this;
        }
        if (!options.type || !_type.isString(options.type) || options.type.length === 0) throw new Error("Specify valid type");
        if (!options.ids || options.ids.length === 0) throw new Error("Specify ids to delete");

        var request = new global.Appacitive._Request({
            method: 'GET',
            type: 'object',
            op: 'getMultiGetUrl',
            args: [options.type, options.ids.join(','), options.fields],
            callbacks: callbacks,
            onSuccess: function(d) {
                request.promise.fulfill(_parseObjects(d.objects, options.entity));
            }
        });
            
        return request.send();
    };

    //takes object id , type and fields and returns that object
    global.Appacitive.Object.get = function(options) {
        options = options || {};
        if (this.className) {
            options.relation = this.className;
            options.entity = this;
        }
        if (!options.type) throw new Error("Specify type");
        if (!options.id) throw new Error("Specify id to fetch");

        var obj = global.Appacitive.Object._create({ __type: options.type, __id: options.id });
        obj.fields = options.fields;

        return obj.fetch(options);
    };

    //takes relation type and returns query for it
    global.Appacitive.Object.prototype.getConnections = function(options) {
        if (this.isNew()) throw new Error("Cannot fetch connections for new object");
        options.objectId = this.get('__id');
        return new global.Appacitive.Queries.GetConnectionsQuery(options);
    };

    //takes relation type and returns a query for it
    global.Appacitive.Object.prototype.getConnectedObjects = function(options) {
        if (this.isNew()) throw new Error("Cannot fetch connections for new object");
        options = options || {};
        if (_type.isString(options)) options = { relation: options };
        options.type = this.get('__type');
        options.objectId = this.get('__id');
        options.object = this;
        return new global.Appacitive.Queries.ConnectedObjectsQuery(options);
    };
    global.Appacitive.Object.prototype.fetchConnectedObjects = global.Appacitive.Object.prototype.getConnectedObjects;
    
    // takes type and return a query for it
    global.Appacitive.Object.findAll = global.Appacitive.Object.findAllQuery = function(options) {
        options = options || {};
        if (this.className) {
            options.type = this.className;
            options.entity = this;
        }
        return new global.Appacitive.Queries.FindAllQuery(options);
    };

})(global);
(function (global) {

    "use strict";

    var _parseEndpoint = function(endpoint, type, base) {
        var result = { label: endpoint.label };
        if (endpoint.objectid)  result.objectid = endpoint.objectid;
        if (endpoint.object) {
            if (endpoint.object instanceof global.Appacitive.Object) {
                // provided an instance of Appacitive.ObjectCollection
                // stick the whole object if there is no __id
                // else just stick the __id
                if (endpoint.object.id()) result.objectid = endpoint.object.id();
                else result.object = endpoint.object.getObject();
            } else if (_type.isObject(endpoint.object)) {
                // provided a raw object
                // if there is an __id, just add that
                // else add the entire object
                if (endpoint.object.__id) result.objectid = endpoint.object.__id;
                else result.object = endpoint.object;

                endpoint.object =  global.Appacitive.Object._create(endpoint.object);
            } 
        } else {
            if (!result.objectid && !result.object) throw new Error('Incorrectly configured endpoints provided to parseConnection');
        }

        base["endpoint" + type] = endpoint;
        return result;
    };

    var _convertEndpoint = function(endpoint, type, base) {
        if ( endpoint.object && _type.isObject(endpoint.object)) {
            if (!base['endpoint' + type]) {
                base["endpoint" + type] = {};
                base['endpoint' + type].object = global.Appacitive.Object._create(endpoint.object, true);
            } else {
                if (base['endpoint' + type] && base['endpoint' + type].object && base['endpoint' + type].object instanceof global.Appacitive.Object)
                    base["endpoint" + type].object.copy(endpoint.object, true);
                else 
                    base['endpoint' + type].object = global.Appacitive.Object._create(endpoint.object, true);
            }
            base["endpoint" + type].objectid = endpoint.object.__id;
            base["endpoint" + type].label = endpoint.label;
            base["endpoint" + type].type = endpoint.type;
        } else {
            base["endpoint" + type] = endpoint;
        }
    };

    global.Appacitive.Connection = function(attrs, options) {
        attrs = attrs || {};
        options = options || {};

        if (this.className) attrs.__relationtype = this.className;
        
        if (_type.isString(attrs)) attrs = { __relationtype : attrs };
        
        if (!attrs.__relationtype && !attrs.relation ) throw new Error("Cannot set connection without relation");

        if (attrs.relation) {
            attrs.__relationtype = attrs.relation;
            delete attrs.relation;
        }

        if (_type.isBoolean(options)) options = { setSnapShot: true };

        if (attrs.endpoints && attrs.endpoints.length === 2) {
            attrs.__endpointa = attrs.endpoints[0];
            attrs.__endpointb = attrs.endpoints[1];
            delete attrs.endpoints;
        }

        global.Appacitive.BaseObject.call(this, attrs, options);
        this.type = 'connection';
        this.getConnection = this.getObject;

        this.parseConnection = function() {
            
            var typeA = 'A', typeB ='B';
            if ( attrs.__endpointa.label.toLowerCase() === this.get('__endpointb').label.toLowerCase() ) {
                if ((attrs.__endpointa.label.toLowerCase() != attrs.__endpointb.label.toLowerCase()) && (attrs.__endpointa.objectid == this.get('__endpointb').objectid || !attrs.__endpointa.objectid)) {
                    typeA = 'B';
                    typeB = 'A';
                }
            }

            _convertEndpoint(this.get('__endpointa'), typeA, this);
            _convertEndpoint(this.get('__endpointb'), typeB, this);

            this.endpoints = function() {
                if (arguments.length === 1 && _type.isString(arguments[0])) {
                    if (this.endpointA.label.toLowerCase() === arguments[0].toLowerCase()) return this.endpointA;
                    else if (this.endpointB.label.toLowerCase() === arguments[0].toLowerCase()) return this.endpointB;
                    else throw new Error("Invalid label provided");
                }
                var endpoints = [];
                endpoints.push(this.endpointA);
                endpoints.push(this.endpointB);
                return endpoints;
            };

            return this;
        };

        if (options.setSnapShot) {
            this.parseConnection(attrs);
        } else {
            if (attrs.__endpointa && attrs.__endpointb) this.setupConnection(this.get('__endpointa'), this.get('__endpointb'));
        } 

        this.relationName = attrs.__relationtype;

        if (_type.isFunction(this.initialize)) {
            this.initialize.apply(this, [attrs]);
        }

        return this;
    };

    global.Appacitive.Connection.prototype = new global.Appacitive.BaseObject();

    global.Appacitive.Connection.prototype.constructor = global.Appacitive.Connection;

    global.Appacitive.Connection.extend = function(typeName, protoProps, staticProps) {
    
        if (!_type.isString(typeName)) {
          throw new Error("Appacitive.Connection.extend's first argument should be the relation-name.");
        }

        var entity = null;
    
        protoProps = protoProps || {};
        protoProps.className = typeName;

        entity = global.Appacitive._extend(global.Appacitive.Connection, protoProps, staticProps);

        // Do not allow extending a class.
        delete entity.extend;

        // Set className in entity class
        entity.className = typeName;

        entity.relation = typeName;

        __relationMap[typeName] = entity;

        return entity;
    };

    var __relationMap = {};

    var _getClass = function(className) {
        if (!_type.isString(className)) {
          throw "_getClass requires a string argument.";
        }
        var entity = __relationMap[className];
        if (!entity) {
          entity = global.Appacitive.Connection.extend(className);
          __relationMap[className] = entity;
        }
        return entity;
    };

    global.Appacitive.Connection._getClass = _getClass;

    global.Appacitive.Connection._create = function(attributes, setSnapshot, relationClass) {
        var entity;
        if (this.className) entity = this;
        else entity = (relationClass) ? relationClass : _getClass(attributes.__relationtype);
        return new entity(attributes).copy(attributes, setSnapshot);
    };

    //private function for parsing api connections in sdk connection object
    var _parseConnections = function(connections, relationClass) {
        var connectionObjects = [];
        if (!connections) connections = [];
        connections.forEach(function(c) {
            connectionObjects.push(global.Appacitive.Connection._create(c, true, relationClass));
        });
        return connectionObjects;
    };

    global.Appacitive.Connection._parseResult = _parseConnections;


    global.Appacitive.Connection.prototype.setupConnection = function(endpointA, endpointB) {
        
        // validate the endpoints
        if (!endpointA || (!endpointA.objectid &&  !endpointA.object) || !endpointA.label || !endpointB || (!endpointB.objectid && !endpointB.object) || !endpointB.label) {
            throw new Error('Incorrect endpoints configuration passed.');
        }

        // there are two ways to do this
        // either we are provided the object id
        // or a raw object
        // or an Appacitive.Object instance
        // sigh
        
        // 1
        this.set('__endpointa', _parseEndpoint(endpointA, 'A', this), { silent: true });

        // 2
        this.set('__endpointb', _parseEndpoint(endpointB, 'B', this), { silent: true });

        // 3
        this.endpoints = function() {

            if (arguments.length === 1 && _type.isString(arguments[0])) {
                if (this.endpointA.label.toLowerCase() === arguments[0].toLowerCase()) return this.endpointA;
                else if (this.endpointB.label.toLowerCase() === arguments[0].toLowerCase()) return this.endpointB;
                else throw new Error("Invalid label provided");
            }

            var endpoints = [];
            endpoints.push(this.endpointA);
            endpoints.push(this.endpointB);
            return endpoints;
        };

    };

    global.Appacitive.Connection.prototype.get = global.Appacitive.Connection.get = function(options, callbacks) {
        options = options || {};
        if (this.className) options.relation = this.className;
        if (!options.relation) throw new Error("Specify relation");
        if (!options.id) throw new Error("Specify id to fetch");
        var obj = global.Appacitive.Connection._create({ __relationtype: options.relation, __id: options.id });
        obj.fields = options.fields;
        return obj.fetch(callbacks);
    };

    //takes relationname and array of connectionids and returns an array of Appacitive object objects
    global.Appacitive.Connection.multiGet = function(options, callbacks) {
        options = options || {};
        if (this.className) {
            options.relation = this.className;
            options.entity = this;
        }
        if (!options.relation || !_type.isString(options.relation) || options.relation.length === 0) throw new Error("Specify valid relation");
        if (!options.ids || options.ids.length === 0) throw new Error("Specify ids to delete");

        var request = new global.Appacitive._Request({
            method: 'GET',
            type: 'connection',
            op: 'getMultiGetUrl',
            args: [options.relation, options.ids.join(','), options.fields],
            callbacks: callbacks,
            onSuccess: function(d) {
                request.promise.fulfill(_parseConnections(d.connections, options.entity));
            }
        });
            
        return request.send();
    };

    //takes relationame, and array of connections ids
    global.Appacitive.Connection.multiDelete = function(attrs, options) {
        attrs = attrs || {};
        options = options || {};
        var models = [];
        if (this.className) attrs.relation = this.className;

        if (_type.isArray(attrs) && attrs.length > 0) {
            models = attrs;
            attrs = { 
                relation:  models[0].className ,
                ids : models.map(function(o) { return o.id(); }).filter(function(o) { return o; }) 
            };
        }
        if (!attrs.relation || !_type.isString(attrs.relation) || attrs.relation.length === 0) throw new Error("Specify valid relation");
        if (!attrs.ids || attrs.ids.length === 0) throw new Error("Specify ids to delete");

        var request = new global.Appacitive._Request({
            method: 'POST',
            data: { idlist : attrs.ids },
            type: 'connection',
            op: 'getMultiDeleteUrl',
            args: [attrs.relation],
            callbacks: callbacks,
            onSuccess: function(d) {
                if (options && !options.silent) {
                    models.forEach(function(m) {
                        m.trigger('destroy', m, m.collection, options);
                    });
                }
                request.promise.fulfill();
            }
        });
        
        return request.send();
    };

    
    //takes relation type and returns all connections for it
    global.Appacitive.Connection.findAll = global.Appacitive.Connection.findAllQuery = function(options) {
        options = options || {};
        if (this.className) {
            options.relation = this.className;
            options.entity = this;
        }
        return new global.Appacitive.Queries.FindAllQuery(options);
    };

    //takes 1 objectid and multiple aricleids and returns connections between both 
    global.Appacitive.Connection.interconnectsQuery = global.Appacitive.Connection.getInterconnects = function(options) {
        return new global.Appacitive.Queries.InterconnectsQuery(options);
    };

    //takes 2 objectids and returns connections between them
    global.Appacitive.Connection.betweenObjectsQuery = global.Appacitive.Connection.getBetweenObjects = function(options) {
        return new global.Appacitive.Queries.GetConnectionsBetweenObjectsQuery(options);
    };

    //takes 2 objects and returns connections between them of particluar relationtype
    global.Appacitive.Connection.betweenObjectsForRelationQuery = global.Appacitive.Connection.getBetweenObjectsForRelation = function(options) {
        options = options || {};
        if (this.className) {
            options.relation = this.className;
            options.entity = this;
        }
        return new global.Appacitive.Queries.GetConnectionsBetweenObjectsForRelationQuery(options);
    };

})(global);
(function (global) {

    "use strict";

    var UserManager = function() {

        var _authenticatedUser = null;

        this.current = function() {
            return _authenticatedUser;
        };

        this.currentUser = this.current;

        var _updatePassword = function(oldPassword, newPassword, callbacks) {
            var userId = this.get('__id');
            if (!userId || !_type.isString(userId) || userId.length === 0) throw new Error("Please specify valid userid");
            if (!oldPassword || !_type.isString(oldPassword) || oldPassword.length === 0) throw new Error("Please specify valid oldPassword");
            if (!newPassword || !_type.isString(newPassword) || newPassword.length === 0) throw new Error("Please specify valid newPassword");

            var updatedPasswordOptions = { oldpassword : oldPassword, newpassword: newPassword };
            
            var request = new global.Appacitive._Request({
                method: 'POST',
                type: 'user',
                op: 'getUpdatePasswordUrl',
                args: [userId],
                callbacks: callbacks,
                data: updatedPasswordOptions,
                entity: this,
                onSuccess: function(data) {
                    request.promise.fulfill(that);
                }
            });
            return request.send();
        };

        var _link = function(link, callbacks) {
            var userId = this.get('__id');

            if (!this.get('__id')) {
                this.set('__link', link);
                return global.Appacitive.Promise.buildPromise(callbacks).fulfill(this);
            }

            var that = this;

            var request = new global.Appacitive._Request({
                method: 'POST',
                type: 'user',
                op: 'getLinkAccountUrl',
                args: [userId],
                callbacks: callbacks,
                data: link,
                entity: this,
                onSuccess: function(data) {
                    var links = that.get('__link');
                    if (!_type.isArray(links)) {
                        links = (links) ? [links] : [];
                    }
                    links.push(link);
                    that.copy({__link: links }, true);
                    request.promise.fulfill(that);
                }
            });
            return request.send();
        };

        this.setCurrentUser = function(user, token, expiry) {
            if (!user) throw new Error('Cannot set null object as user');
            var userObject = user;
            
            if (!(userObject instanceof global.Appacitive.User)) userObject = new global.Appacitive.User(user, true); 
            else if (!userObject.get('__id') || userObject.get('__id').length === 0) throw new Error('Specify user __id');
            else user = userObject.toJSON(); 

            global.Appacitive.localStorage.set('Appacitive-User', user);

            if (!expiry) expiry = 3600;
            _authenticatedUser = userObject;

            if (token) global.Appacitive.Session.setUserAuthHeader(token, expiry);

            _authenticatedUser.logout = function(callback) { return global.Appacitive.Users.logout(callback); };

            _authenticatedUser.updatePassword = function(oldPassword, newPassword, callbacks) {
                return _updatePassword.apply(this, [oldPassword, newPassword, callbacks]);
            };

            _authenticatedUser.logout = function(callback) { return global.Appacitive.Users.logout(callback); };

            global.Appacitive.eventManager.clearAndSubscribe('type.user.' + userObject.get('__id') + '.updated', function(sender, args) {
                global.Appacitive.localStorage.set('Appacitive-User', args.object.getObject());
            });

            return _authenticatedUser;
        };
        
        var User = function(options, setSnapshot) {
            options = options || {};
            options.__type = 'user';
            global.Appacitive.Object.call(this, options, setSnapshot);
            return this;
        };

        //getter to get linkedaccounts
        User.prototype.linkedAccounts = function() {
            
            var accounts = this.get('__link');
            
            if (!accounts) accounts = [];
            else if (!_type.isArray(accounts)) accounts = [accounts];
            
            return accounts;
        };

        //method for getting all linked accounts
        User.prototype.getAllLinkedAccounts = function(callbacks) {
            var userId = this.get('__id');
            
            if (!userId || !_type.isString(userId) || userId.length === 0) {
                return global.Appacitive.Promise.buildPromise(callbacks).fulfill(this.linkedAccounts(), this);
            }

            var that = this;

            var request = new global.Appacitive._Request({
                method: 'GET',
                type: 'user',
                op: 'getGetAllLinkedAccountsUrl',
                args: [userId],
                callbacks: callbacks,
                entity: this,
                onSuccess: function() {
                    var accounts = a.identities || []; 
                    if (accounts.length > 0) that.set('__link', accounts);
                    else that.set('__link', null);
                    
                    request.promise.fulfill(accounts, that);
                }
            });
            return request.send();
        };

        User.prototype.checkin = function(coords, callbacks) {
            var userId = this.get('__id');
            if (!userId || !_type.isString(userId) || userId.length === 0) {
                if (onSuccess && _type.isFunction(onSuccess)) onSuccess();
            }
            if (!coords || !(coords instanceof global.Appacitive.GeoCoord)) throw new Error("Invalid coordinates provided");

            var that = this;

            var request = new global.Appacitive._Request({
                method: 'POST',
                type: 'user',
                op: 'getCheckinUrl',
                args: [userId, coords.lat, coords.lngerId],
                callbacks: callbacks,
                entity: this,
                onSuccess: function() {
                    request.promise.fulfill(that);
                }
            });
            return request.send();
        };

        //method for linking facebook account to a user
        User.prototype.linkFacebook = function(accessToken, callbacks) {
            
            if (!accessToken || !_type.isString(accessToken)) throw new Error("Please provide accessToken");

            var payload = {
                "authtype": "facebook",
                "accesstoken": accessToken,
                "name": "facebook"
            };

            return _link.apply(this, [payload, callbacks]);
        };

        //method for linking twitter account to a user
        User.prototype.linkTwitter = function(twitterObj, callbacks) {
            
            if (!_type.isObject(twitterObj) || !twitterObj.oAuthToken  || !twitterObj.oAuthTokenSecret) throw new Error("Twitter Token and Token Secret required for linking");
            
            var payload = {
                "authtype": "twitter",
                "oauthtoken": twitterObj.oAuthToken ,
                "oauthtokensecret": twitterObj.oAuthTokenSecret
            };

            if (twitterObj.consumerKey && twitterObj.consumerSecret) {
                payload.consumersecret = twitterObj.consumerSecret;
                payload.consumerkey = twitterObj.consumerKey;
            }

            return _link.apply(this, [payload, callbacks]);
        };

        //method to unlink an oauth account
        User.prototype.unlink = function(name, callbacks) {
            
            if (!_.isString(name)) throw new Error("Specify aouth account type for unlinking");

            var userId = this.get('__id');

            if (!this.get('__id')) {
                this.set('__link', null);
                promise.fulfill(this);
                return promise;
            }

            var that = this;

            var request = new global.Appacitive._Request({
                method: 'POST',
                type: 'user',
                op: 'getDelinkAccountUrl',
                args: [userId, name],
                callbacks: callbacks,
                entity: this,
                onSuccess: function(a) {
                    var accounts = that.get('__link');
            
                    if (!accounts) accounts = [];
                    else if (!_type.isArray(accounts)) accounts = [accounts];

                    if (accounts.length >= 0) {
                        var ind = null;
                        accounts.forEach(function(a, i) {
                            if (a.name == name.toLowerCase()) {
                                ind = i;
                                return;
                            }
                        });
                        if (ind != null) accounts.splice(ind, 1);
                        that.copy({ __link: accounts }, true);
                    } else {
                        that.copy({ __link: [] }, true);
                    }

                    request.promise.fulfill(that);
                }
            });
            return request.send();
        };

        User.prototype.clone = function() {
            return new global.Appacitive.User(this.getObject());
        };

        global.Appacitive.User = global.Appacitive.Object.extend('user', User.prototype);

        //Remove article static properties
        delete global.Appacitive.User._create;
        delete global.Appacitive.User._parseResult;
        delete global.Appacitive.User.multiDelete;

        this.deleteUser = function(userId, callbacks) {
            if (!userId) throw new Error('Specify userid for user delete');
            return new global.Appacitive.Object({ __type: 'user', __id: userId }).del(true, callbacks);
        };

        this.deleteCurrentUser = function(callbacks) {
            
            var promise = global.Appacitive.Promise.buildPromise(callbacks);

            var _callback = function() {
                global.Appacitive.Session.removeUserAuthHeader();
                promise.fulfill();
            };

            if (_authenticatedUser === null) { 
                _callback();
                return promise;
            }

            var currentUserId = _authenticatedUser.get('__id');
            
            this.deleteUser(currentUserId).then(function() { 
                _authenticatedUser = null;
                _callback();
            }, function() { 
                promise.reject(arguments);
            });

            return promise;
        };

        this.createNewUser = function(user, callbacks) {
            user = user || {};
            user.__type = 'user';
            if (!user.username || !user.password || !user.firstname || user.username.length === 0 || user.password.length === 0 || user.firstname.length === 0) 
                throw new Error('username, password and firstname are mandatory');

            return new global.Appacitive.User(user).save(callbacks);
        };

        this.createUser = this.createNewUser;

        //method to allow user to signup and then login 
        this.signup = function(user, callbacks) {
            var that = this;
            var promise = global.Appacitive.Promise.buildPromise(callbacks);

            this.createUser(user).then(function() {
                that.login(user.username, user.password).then(function() {
                    promise.fulfill.apply(promise, arguments);
                }, function(staus) {
                    promise.reject.apply(promise, arguments);
                });
            }, function() {
                promise.reject(arguments);
            });

            return promise;
        };

        //authenticate user with authrequest that contains username , password and expiry
        this.authenticateUser = function(authRequest, callbacks, provider) {

            if (!authRequest.expiry) authRequest.expiry = 86400000;
            var that = this;

            var request = new global.Appacitive._Request({
                method: 'POST',
                type: 'user',
                op: 'getAuthenticateUserUrl',
                callbacks: callbacks,
                data: authRequest,
                onSuccess: function(data) {
                    if (data && data.user) {
                        if (provider) data.user.__authType = provider;
                        that.setCurrentUser(data.user, data.token, authRequest.expiry);
                        request.promise.fulfill({ user : _authenticatedUser, token: data.token });
                    } else {
                        request.promise.reject(data.status);
                    }
                }
            });
            return request.send();
        };

        //An overrride for user login with username and password directly
        this.login = function(username, password, callbacks) {

            if (!username || !password || username.length ==0 || password.length == 0) throw new Error('Please specify username and password');

            var authRequest = {
                username : username,
                password: password,
                expiry: 86400000
            };

            return this.authenticateUser(authRequest, callbacks, 'BASIC');
        };

        this.loginWithFacebook = function(accessToken, callbacks) {
            
            if (!accessToken || !_type.isString(accessToken)) throw new Error("Please provide accessToken");

            var authRequest = {
                "accesstoken": accessToken,
                "type": "facebook",
                "expiry": 86400000,
                "createnew": true
            };

            return this.authenticateUser(authRequest, callbacks, 'FB');
        };

        this.loginWithTwitter = function(twitterObj, callbacks) {
            
            if (!_type.isObject(twitterObj) || !twitterObj.oAuthToken  || !twitterObj.oAuthTokenSecret) throw new Error("Twitter Token and Token Secret required for linking");
            
            var authRequest = {
                "type": "twitter",
                "oauthtoken": twitterObj.oAuthToken ,
                "oauthtokensecret": twitterObj.oAuthTokenSecret,
                "expiry": 86400000,
                "createnew": true
            };

            if (twitterObj.consumerKey && twitterObj.consumerSecret) {
                authRequest.consumersecret = twitterObj.consumerSecret;
                authRequest.consumerkey = twitterObj.consumerKey;
            }

            return this.authenticateUser(authRequest, callbacks, 'TWITTER');
        };

        this.validateCurrentUser = function(avoidApiCall, callback) {

            var promise = global.Appacitive.Promise.buildPromise({ success: callback });

            if (callback && _type.isBoolean(callback)) {
                avoidApiCall = callback;
                callback = function() {}; 
            }

            var token = global.Appacitive.localStorage.get('Appacitive-UserToken');

            if (!token) {
                promise.fulfill(false);
                return promise;
            }

            if (!avoidApiCall) {
                try {
                    var that = this;
                    this.getUserByToken(token).then(function(user) {
                        that.setCurrentUser(user, token);
                        promise.fulfill(true);
                    }, function() {
                        promise.fulfill(false);
                    });
                } catch (e) { 
                    promise.fulfill(false);
                }
            } else {
                promise.fulfill(true);
            }

            return promise;
        };

        var _getUserByIdType = function(op, args, callbacks) {
            var request = new global.Appacitive._Request({
                method: 'GET',
                type: 'user',
                op: op,
                callbacks: callbacks,
                args: args,
                onSuccess: function(data) {
                    if (data && data.user) request.promise.fulfill(new global.Appacitive.User(data.user));
                    else request.promise.reject(data.status);
                }
            });
            return request.send();
        };

        this.getUserByToken = function(token, callbacks) {
            if (!token || !_type.isString(token) || token.length === 0) throw new Error("Please specify valid token");
            global.Appacitive.Session.setUserAuthHeader(token, 0, true);
            return _getUserByIdType("getUserByTokenUrl", [token], callbacks);
        };

        this.getUserByUsername = function(username, callbacks) {
            if (!username || !_type.isString(username) || username.length === 0) throw new Error("Please specify valid username");
            return _getUserByIdType("getUserByUsernameUrl", [username], callbacks);
        };

        this.logout = function(makeApiCall) {
            _authenticatedUser = null;
            return global.Appacitive.Session.removeUserAuthHeader(makeApiCall);
        };

        this.sendResetPasswordEmail = function(username, subject, callbacks) {

            if (!username || !_type.isString(username)  || username.length === 0) throw new Error("Please specify valid username");
            if (!subject || !_type.isString(subject) || subject.length === 0) throw new Error('Plase specify subject for email');

            var passwordResetOptions = { username: username, subject: subject };

            var request = new global.Appacitive._Request({
                method: 'POST',
                type: 'user',
                op: 'getSendResetPasswordEmailUrl',
                callbacks: callbacks,
                data: passwordResetOptions,
                onSuccess: function() {
                    request.promise.fulfill();
                }
            });
            return request.send();
        };

        this.resetPassword = function(token, newPassword, callbacks) {

            if (!token) throw new Error("Please specify token");
            if (!newPassword || newPassword.length === 0) throw new Error("Please specify password");

            var request = new global.Appacitive._Request({
                method: 'POST',
                type: 'user',
                op: 'getResetPasswordUrl',
                callbacks: callbacks,
                data: { newpassword: newPassword },
                args: [token],
                onSuccess: function() {
                    request.promise.fulfill();
                }
            });
            return request.send();
        };

        this.validateResetPasswordToken = function(token, callbacks) {
            
            if (!token) throw new Error("Please specify token");

            var request = new global.Appacitive._Request({
                method: 'POST',
                type: 'user',
                op: 'getValidateResetPasswordUrl',
                callbacks: callbacks,
                data: {},
                args: [token],
                onSuccess: function(a) {
                    request.promise.fulfill(a.user);
                }
            });
            return request.send();
        };
    };

    global.Appacitive.Users = new UserManager();

})(global);
  (function(global) {

  global.Appacitive.Collection = function(models, options) {
    options || (options = {});
    if (options.model) this.model = options.model;
    if (!this.model) throw new Error("Please specify model for collection");
    if (options.comparator !== void 0) this.comparator = options.comparator;
    if (options.query) this.query(options.query);
    else this.query(new Appacitive.Query(this.model));
    this._reset();
    this.initialize.apply(this, arguments);
    if (models) this.reset(models, { silent: true });
  };

  global.Appacitive.Events.mixin(global.Appacitive.Collection.prototype);

  // Define the Collection's inheritable methods.
  _extend(global.Appacitive.Collection.prototype, {
    
    models: [],

    /**
     * Initialize is an empty function by default. Override it with your own
     * initialization logic.
     */
    initialize: function(){},

    _query: null,

    /**
     * The JSON representation of a Collection is an array of the
     * models' attributes.
     */
    toJSON: function(options) {
      return this.model.map(function(model) { return model.toJSON(options); });
    },

    add: function(models, options) {
      options = options || {};
      var i, index, length, model, cid, id, cids = {}, ids = {}, at = options.at, merge = options.merge, toAdd = [], sort = options.sort, existing;
      models = _type.isArray(models) ? models.slice() : [models];

      for (i = 0, length = models.length; i < length; i++) {
        models[i] = this._prepareModel(models[i]);
        model = models[i];
        if (!model) throw new Error("Can't add an invalid model to a collection");

        cid = model.cid;
        if (cids[cid] || this._byCid[cid])  throw new Error("Duplicate cid: can't add the same model to a collection twice");
        
        id = model.id();
        if (id && ((existing = ids[id]) || (existing = this._byId[id]))) {
          existing.copy(model.toJSON(), options.setSnapShot);
          existing.children = model.children;
        } else {
          ids[id] = model;
          cids[cid] = model;

          toAdd.push(model);
          
          this._addReference(model, options);
        }
      }

      // Insert models into the collection, re-sorting if needed, and triggering
      // `add` events unless silenced.
      
      index = (options.at != null) ? options.at : this.models.length;
      this.models.splice.apply(this.models, [index, 0].concat(toAdd));
      if (sort && this.comparator) this.sort({silent: true});
      this.length = this.models.length;

      if (options.silent) return this;
      
      for (i = 0, length = toAdd.length; i < length; i++) {
        model = toAdd[i];
        options.index = i;
        model.trigger('add', model, this, options);
      }

      return this;
    },


    /**
     * Remove a model, or a list of models from the set. Pass silent to avoid
     * firing the <code>remove</code> event for every model removed.
     *
     * @param {Array} models The model or list of models to remove from the
     *   collection.
     * @param {Object} options An optional object with Backbone-style options.
     * Valid options are: <ul>
     *   <li>silent: Set to true to avoid firing the `remove` event.
     * </ul>
     */
    remove: function(models, options) {
      var i, l, index, model;
      options = options || {};
      models = _type.isArray(models) ? models.slice() : [models];
      for (i = 0, l = models.length; i < l; i++) {
        model = this.getByCid(models[i]) || this.get(models[i]);
        if (!model) continue; 
        delete this._byId[model.id()];
        delete this._byCid[model.cid];
        index = this.models.indexOf(model);
        this.models.splice(index, 1);
        this.length--;
        if (!options.silent) {
          options.index = index;
          model.trigger('remove', model, this, options);
        }
        this._removeReference(model);
      }
      return this;
    },

    // Add a model to the end of the collection.
    push: function(model, options) {
      return this.add(model, _extend({ at: this.length}, options));
    },

    // Remove a model from the end of the collection.
    pop: function(options) {
      var model = this.at(this.length - 1);
      this.remove(model, options);
      return model;
    },

    // Add a model to the beginning of the collection.
    unshift: function(model, options) {
      return this.add(model, _extend({ at: 0 }, options));
    },

    // Remove a model from the beginning of the collection.
    shift: function(options) {
      var model = this.at(0);
      this.remove(model, options);
      return model;
    },

    // Slice out a sub-array of models from the collection.
    slice: function() {
      return Array.prototype.slice.apply(this.models, arguments);
    },

    /**
     * Gets a model from the set by id.
     * @param {String} id The Appacitive objectId identifying the Appacitive.Object to
     * fetch from this collection.
     */
    get: function(id) {
      return id && this._byId[(id instanceof global.Appacitive.BaseObject) ? id.id() : id];
    },

    query: function(query) {
      if ((query instanceof global.Appacitive.Query) 
        || (query instanceof global.Appacitive.Queries.GraphProjectQuery)) { 
        this._query = query;
        return this;
      }
      else return this._query;
    },

    /**
     * Gets a model from the set by client id.
     * @param {} cid The Backbone collection id identifying the Appacitive.Object to
     * fetch from this collection.
     */
    getByCid: function(cid) {
      return cid && this._byCid[cid.cid || cid];
    },

    /**
     * Gets the model at the given index.
     *
     * @param {Number} index The index of the model to return.
     */
    at: function(index) {
      return this.models[index];
    },

    // Return models with matching attributes. Useful for simple cases of
    // `filter`.
    where: function(attrs, first) {
      if (Object.isEmpty(attrs)) return first ? void 0 : [];
      return this.models[first ? 'find' : 'filter'](function(model) {
        for (var key in attrs) {
          if (attrs[key] !== model.get(key)) return false;
        }
        return true;
      });
    },

    // Return the first model with matching attributes. Useful for simple cases
    // of `find`.
    findWhere: function(attrs) {
      return this.where(attrs, true);
    },

    /**
     * Forces the collection to re-sort itself. You don't need to call this
     * under normal circumstances, as the set will maintain sort order as each
     * item is added.
     * @param {Object} options An optional object with Backbone-style options.
     * Valid options are: <ul>
     *   <li>silent: Set to true to avoid firing the `reset` event.
     * </ul>
     */
    sort: function(options) {
      options = options || {};
      if (!this.comparator) throw new Error('Cannot sort a set without a comparator');
      //if (!_type.isFunction()) throw new Error('Comparator needs to be a function');
      
      if (this.comparator.length === 1) {
        this.models = this.models.sortBy(this.comparator);
      } else {
        this.models.sort(this.comparator.bind(this.models));
      }
      if (!options.silent) this.trigger('reset', this, options);
      
      return this;
    },

    /**
     * Plucks an attribute from each model in the collection.
     * @param {String} attr The attribute to return from each model in the
     * collection.
     */
    pluck: function(attr) {
      return this.models.map(function(model) { return model.get(attr); });
    },

    /**
     * Returns the first model in this collection
     */
    first: function() {
      return (this.length > 0) ? this.models[0] : null;
    },

    /**
     * Returns the last model in this collection
     */
    last: function() {
      return (this.length > 0) ? this.models[this.length - 1] : null;
    },

    /**
     * When you have more items than you want to add or remove individually,
     * you can reset the entire set with a new list of models, without firing
     * any `add` or `remove` events. Fires `reset` when finished.
     *
     * @param {Array} models The model or list of models to remove from the
     *   collection.
     * @param {Object} options An optional object with Backbone-style options.
     * Valid options are: <ul>
     *   <li>silent: Set to true to avoid firing the `reset` event.
     * </ul>
     */
    reset: function(models, options) {
      options || (options = {});
      for (var i = 0, length = this.models.length; i < length; i++) {
        this._removeReference(this.models[i], options);
      }
      this._reset();
      this.add(models, _extend({ silent: true }, options));
      if (!options.silent) this.trigger('reset', this, options);
      return this;
    },

    /**
     * Fetches the default set of models for this collection, resetting the
     * collection when they arrive. If `add: true` is passed, appends the
     * models to the collection instead of resetting.
     *
     * @param {Object} options An optional object with Backbone-style options.
     * Valid options are:<ul>
     *   <li>silent: Set to true to avoid firing `add` or `reset` events for
     *   models fetched by this fetch.
     *   <li>success: A Backbone-style success callback.
     *   <li>error: An Backbone-style error callback.
     *   <li>useMasterKey: In Cloud Code and Node only, uses the Master Key for
     *       this request.
     * </ul>
     */
    fetch: function(options) {
      options = _clone(options) || {};
      
      var collection = this;
      var query = this.query() || new global.Appacitive.Query(this.model);
      
      var promise = global.Appacitive.Promise.buildPromise(options);

      query.fetch(options).then(function(results) {
        if (options.add) collection.add(results, _extend({ setSnapShot: true }, options));
        else collection.reset(results, options);
        promise.fulfill(collection);
      }, function() {
        promise.reject.apply(promise, arguments);
      });

      return promise;
    },


    /**
     * Mutiget a set of models for this collection, resetting the
     * collection when they arrive. If `add: true` is passed, appends the
     * models to the collection instead of resetting.
     *
     * @param {Object} options An optional object with Backbone-style options.
     * Valid options are:<ul>
     *   <li>silent: Set to true to avoid firing `add` or `reset` events for
     *   models fetched by this fetch.
     *   <li>success: A Backbone-style success callback.
     *   <li>error: An Backbone-style error callback.
     * </ul>
     */
    mutiGet: function(options) {
      options = _clone(options) || {};
      
      var collection = this;
      
      var promise = global.Appacitive.Promise.buildPromise(options);

      var ids = options.ids || [];

      if (ids.length == 0) return promise.fulfill(collection);

      var args = { ids: ids, fields : options.fields };

      args[this.model.type || this.model.relation] = this.model.className;

      global.Appacitive.Object.multiGet(args).then(function(results) {
        if (options.add) collection.add(results, options);
        else collection.reset(results, options);
        promise.fulfill(collection);
      }, function() {
        promise.reject.apply(promise, arguments);
      });

      return promise;
    },

    /**
     * Creates a new instance of a model in this collection. Add the model to
     * the collection immediately, unless `wait: true` is passed, in which case
     * we wait for the server to agree.
     *
     * @param {Appacitive.Object} model The new model to create and add to the
     *   collection.
     * @param {Object} options An optional object with Backbone-style options.
     * Valid options are:<ul>
     *   <li>wait: Set to true to wait for the server to confirm creation of the
     *       model before adding it to the collection.
     *   <li>silent: Set to true to avoid firing an `add` event.
     *   <li>success: A Backbone-style success callback.
     *   <li>error: An Backbone-style error callback.
     *   <li>useMasterKey: In Cloud Code and Node only, uses the Master Key for
     *       this request.
     * </ul>
     */
    create: function(model, options) {
      var collection = this;
      options = options ? _clone(options) : {};
      if (!(model = this._prepareModel(model, options))) return false;
      if (!options.wait) this.add(model, options);
      var success = options.success;
      options.success = function() {
        if (options.wait) collection.add(model, _extend({ setSnapShot: true }, options));
        if (success) success(model, collection);
      };
      model.save(options);
      return model;
    },

    /**
     * Reset all internal state. Called when the collection is reset.
     */
    _reset: function(options) {
      this.length = 0;
      this.models = [];
      this._byId  = {};
      this._byCid = {};
    },

    /**
     * Prepare a model or hash of attributes to be added to this collection.
     */
    _prepareModel: function(model) {
      if (!(model instanceof global.Appacitive.BaseObject)) {
        model = new this.model(model);
      }

      if (!model.collection) model.collection = this;

      return model;
    },


    // Internal method to create a model's ties to a collection.
    _addReference: function(model) {
      this._byId[model.cid] = model;
      if (model.id() != null) this._byId[model.id()] = model;
      this._byCid[model.cid] = model;
      model.on('all', this._onModelEvent, this);
    },

    /**
     * Internal method to remove a model's ties to a collection.
     */
    _removeReference: function(model) {
      if (this === model.collection) {
        delete model.collection;
      }
      model.off('all', this._onModelEvent, this);
    },

    /**
     * Internal method called every time a model in the set fires an event.
     * Sets need to update their indexes when models change ids. All other
     * events simply proxy through. "add" and "remove" events that originate
     * in other collections are ignored.
     */
    _onModelEvent: function(ev, model, collection, options) {
      if ((ev === 'add' || ev === 'remove') && collection !== this) return;
      if (ev === 'destroy') this.remove(model, options);
      if (model && ev === 'change:__id') {
        delete this._byId[model.previous("__id")];
        this._byId[model.id()] = model;
      }
      this.trigger.apply(this, arguments);
    }
  });

  /**
   * Creates a new subclass of <code>Appacitive.Collection</code>.  For example,<pre>
   *   var MyCollection = Appacitive.Collection.extend({
   *     // Instance properties
   *
   *     model: MyClass,
   *     query: MyQuery,
   *
   *     getFirst: function() {
   *       return this.at(0);
   *     }
   *   }, {
   *     // Class properties
   *
   *     makeOne: function() {
   *       return new MyCollection();
   *     }
   *   });
   *
   *   var collection = new MyCollection();
   * </pre>
   *
   * @function
   * @param {Object} instanceProps Instance properties for the collection.
   * @param {Object} classProps Class properies for the collection.
   * @return {Class} A new subclass of <code>Appacitive.Collection</code>.
   */
  global.Appacitive.Collection.extend = function(protoProps, classProps) {
    if (protoProps && protoProps.query) {
      protoProps._query = protoProps.query;
      delete protoProps.query;
    }
    var child = global.Appacitive._extend(this, protoProps, classProps);
    child.extend = this.extend;
    return child;
  };

  var methods = ['forEach', 'each', 'map' ,'find', 'filter', 'every', 'some', 'indexOf', 'lastIndexOf', 'isEmpty'];

  // Mix in each Underscore method as a proxy to `Collection#models`.
  methods.each(function(method) {
    global.Appacitive.Collection.prototype[method] = function() {
      var args = Array.prototype.slice.call(arguments);
      return Array.prototype[method].apply(this.models, args);
    };
  });

})(global);

(function (global) {

    "use strict";

    var _browserFacebook = function() {

        var _accessToken = null;

        var _initialized = true;

        var _app_id = null;

        this.initialize = function(options) {
          if (!FB) throw "Facebook SDK needs be loaded before calling initialize.";
          if (!options.appId) throw new Error("Please provide appid");
          _app_id = options.appId;
          FB.init(options);
          _initialized = true;
        };

        this.requestLogin = function(scope) {

            scope = scope || {};

            if (!_initialized) throw new Error("Either facebook sdk has not yet been initialized, or not yet loaded.");
            var promise = new Appacitive.Promise();
            FB.login(function(response) {
                if (response && response.status === 'connected' && response.authResponse) {
                    _accessToken = response.authResponse.accessToken;
                    promise.fulfill(response.authResponse);
                } else {
                    promise.reject();
                }
            }, scope);

            return promise;
        };

        this.getCurrentUserInfo = function() {
            if (!_initialized) throw new Error("Either facebook sdk has not yet been initialized, or not yet loaded.");
            var promise = new Appacitive.Promise();
            
            FB.api('/me', function(response) {
                if (response && !response.error) {
                    _accessToken = FB.getAuthResponse().accessToken;
                    promise.fulfill(response);
                } else {
                    promise.reject();
                }
            });

            return promise;
        };

        this.accessToken = function() {
            if (arguments.length === 1) {
                _accessToken = arguments[0];
                return this;
            }
            return _accessToken;
        };

        this.getProfilePictureUrl = function(username) {
            return 'https://graph.facebook.com/' + username + '/picture';
        };

        this.logout = function() {
            _accessToken = null;
            var promise = new Appacitive.Promise();
            
            try {
                FB.logout(function() {
                    global.Appacitive.Users.logout();
                    promise.fulfill();
                });
            } catch(e) {
                promise.reject(e.message);
            }

            return promise;
        };
    };

    var _nodeFacebook = function() {

        var _accessToken = null;

        this.FB = null;

        var _app_id = null;

        var _app_secret = null;

        var _initialized = false;

        this.initialize = function (options) { 
            if (!Facebook) throw new Error("node-facebook SDK needs be loaded before calling initialize.");
            if (!options.appId) throw new Error("Please provide appid");
            if (!options.appSecret) throw new Error("Please provide app secret");

            _app_id = options.appId;
            _app_secret = options.appSecret;
            this.FB = new (require('facebook-node-sdk'))({ appId: _appId, secret: _app_secret });
            _initialized = true;
        };

        this.requestLogin = function(accessToken) {
            if (accessToken) _accessToken = accessToken;
            return new Appacitive.Promise().fulfill();
        };

        this.getCurrentUserInfo = function() {
            if (!_initialized) throw new Error("Either facebook sdk has not yet been initialized, or not yet loaded.");

            var promise = new Appacitive.Promise();

            if (this.FB && _accessToken) {
                this.FB.api('/me', function(err, response) {
                    if (response) {
                        promise.fulfill(response);
                    } else {
                        promise.reject("Access token is invalid");
                    }
                });
            } else {
                promise.reject("Either intialize facebook with your appid and appsecret or set accesstoken");
            }

            return promise;
        };

        this.accessToken = function() {
            if (arguments.length === 1) {
                _accessToken = arguments[0];
                return this;
            }
            return _accessToken;
        };

        this.getProfilePictureUrl = function(username) {
            return 'https://graph.facebook.com/' + username + '/picture';
        };

        this.logout = function() {
            global.Appacitive.Facebook.accessToken = "";
            return new Appacitive.Promise().fulfill();
        };
    };

    global.Appacitive.Facebook = global.Appacitive.runtime.isBrowser ? new _browserFacebook() : new _nodeFacebook();

})(global);
(function (global) {

    "use strict";

    var _emailManager = function() {

        var config = {
            smtp: {
                username: null,
                password: null,
                host: "smtp.gmail.com",
                port: 465,
                enablessl: true
            },
            from: null,
            replyto: null
        };

        this.getConfig = function() {
            var _copy = config;
            return _copy;
        };

        var _sendEmail = function (email, callbacks) {
            
            var request = new global.Appacitive._Request({
                method: 'POST',
                type: 'email',
                op: 'getSendEmailUrl',
                callbacks: callbacks,
                data: email,
                entity: email,
                onSuccess: function(d) {
                    request.promise.fulfill(d.email);
                }
            });
            return request.send();
        };

        this.setupEmail = function(options) {
            options = options || {};
            config.smtp.username = options.username || config.smtp.username;
            config.from = options.from || config.from;
            config.smtp.password = options.password || config.smtp.password;
            config.smtp.host = options.smtp.host || config.smtp.host;
            config.smtp.port = options.smtp.port || config.smtp.port;
            config.smtp.enablessl = options.enableSSL || config.smtp.enablessl;
            config.replyto = options.replyTo || config.replyto;
        };


        this.sendTemplatedEmail = function(options, callbacks) {
            
            if (!options || !options.to || !options.to.length || options.to.length === 0) {
                throw new Error('Atleast one receipient is mandatory to send an email');
            }
            if (!options.subject || options.subject.trim().length === 0) {
                throw new Error('Subject is mandatory to send an email');
            }

            if(!options.from && config.from) {
                throw new Error('from is mandatory to send an email. Set it in config or send it in options on the portal');
            } 

            if (!options.templateName) {
                throw new Error('template name is mandatory to send an email');
            }

            var email = {
                to: options.to || [],
                cc: options.cc || [],
                bcc: options.bcc || [],
                subject: options.subject,
                from: options.from,
                body: {
                    templatename: options.templateName || '',
                    data : options.data || {},
                    ishtml: (options.isHtml === false) ? false : true
                }
            };

            if (options.useConfig) {
                email.smtp = config.smtp;
                if(!options.from && !config.from) {
                    throw new Error('from is mandatory to send an email. Set it in config or send it in options');
                }
                email.from = options.from || config.from;
                email.replyto = options.replyTo || config.replyto;
            }

            return _sendEmail(email, callbacks);
        };

        this.sendRawEmail = function(options, callbacks) {

            if (!options || !options.to || !options.to.length || options.to.length === 0) {
                throw new Error('Atleast one receipient is mandatory to send an email');
            }
            if (!options.subject || options.subject.trim().length === 0) {
                throw new Error('Subject is mandatory to send an email');
            }

            if(!options.from && config.from) {
                throw new Error('from is mandatory to send an email. Set it in config or send it in options on the portal');
            } 

            if (!options.body) {
                throw new Error('body is mandatory to send an email');
            } 

            var email = {
                to: options.to || [],
                cc: options.cc || [],
                bcc: options.bcc || [],
                subject: options.subject,
                from: options.from,
                body: {
                    content: options.body || '',
                    ishtml: (options.isHtml === false) ? false : true
                }
            };

            if (options.useConfig) {
                email.smtp = config.smtp;
                if(!options.from && !config.from) {
                    throw new Error('from is mandatory to send an email. Set it in config or send it in options');
                }
                email.from = options.from || config.from;
                email.replyto = options.replyTo || config.replyto;
            }

            return _sendEmail(email, callbacks);
        };

    };

    global.Appacitive.Email = new _emailManager();

})(global);
(function (global) {

    "use strict";

    var _pushManager = function() {

        this.send = function(options, callbacks) {
            
            if (!options) throw new Error("Please specify push options");

            var request = new global.Appacitive._Request({
                method: 'POST',
                type: 'push',
                op: 'getPushUrl',
                callbacks: callbacks,
                data: options,
                entity: options,
                onSuccess: function(d) {
                    request.promise.fulfill(d.id);
                }
            });
            return request.send();
        };

        this.getNotification = function(notificationId, callbacks) {

            if (!notificationId) throw new Error("Please specify notification id");

            var request = new global.Appacitive._Request({
                method: 'GET',
                type: 'push',
                op: 'getGetNotificationUrl',
                args: [notificationId],
                callbacks: callbacks,
                onSuccess: function(d) {
                    request.promise.fulfill(d.pushnotification);
                }
            });
            return request.send();
        };

        this.getAllNotifications = function(pagingInfo, callbacks) {
            
            if (!pagingInfo)
                pagingInfo = { pnum: 1, psize: 20 };
            else {
                pagingInfo.pnum = pagingInfo.pnum || 1;
                pagingInfo.psize = pagingInfo.psize || 20;
            }

            var request = new global.Appacitive._Request({
                method: 'GET',
                type: 'push',
                op: 'getGetAllNotificationsUrl',
                args: [pagingInfo],
                callbacks: callbacks,
                onSuccess: function(d) {
                    request.promise.fulfill(d.pushnotifications, d.paginginfo);
                }
            });
            return request.send();
        };

    };

    global.Appacitive.Push = new _pushManager();

})(global);
(function (global) {

  "use strict";

  var _file = function(options) {
      
      options = options || {}; 
      this.fileId = options.fileId;
      this.contentType = options.contentType;
      this.fileData = options.fileData;
      var that = this;

      var _getUrls = function(url, onSuccess, promise, description) {
          var request = new global.Appacitive.HttpRequest();
          request.url = url;
          request.method = 'GET';
          request.description = description;
          request.onSuccess = onSuccess;
          request.promise = promise;
          request.entity = that;
          global.Appacitive.http.send(request); 
      };

      var _upload = function(url, file, type, onSuccess, promise) {
          var fd = new FormData();
          fd.append("fileToUpload", file);
          var request = new global.Appacitive.HttpRequest();
          request.url = url;
          request.method = 'PUT';
          request.log = false;
          request.description = 'Upload file';
          request.data = file;
          request.headers.push({ key:'content-type', value: type });
          request.send().then(onSuccess, function() {
            promise.reject(d, that);
          });
      };

      this.save = function(callbacks) {
        if (this.fileId && _type.isString(this.fileId) && this.fileId.length > 0)
          return _update(callbacks);
        else
          return _create(callbacks);
      };

      var _create = function(callbacks) {
          if (!that.fileData) throw new Error('Please specify filedata');
          if(!that.contentType) {
            try { that.contentType = that.fileData.type; } catch(e) {}
          }
          if (!that.contentType || !_type.isString(that.contentType) || that.contentType.length === 0) that.contentType = 'text/plain';
          
          var promise = global.Appacitive.Promise.buildPromise(callbacks);

          var url = global.Appacitive.config.apiBaseUrl + global.Appacitive.storage.urlFactory.file.getUploadUrl(that.contentType, that.fileId ? that.fileId : '');
         
          _getUrls(url, function(response) {
                _upload(response.url, that.fileData, that.contentType, function() {
                    that.fileId = response.id;
                    
                    that.getDownloadUrl().then(function(res) {
                      return promise.fulfill(res, that);
                    }, function(e) {
                      return promise.reject(e);
                    });

                }, promise);
          }, promise, ' Get upload url for file ');

          return promise;
      };

      var _update = function(callbacks) {
          if (!that.fileData) throw new Error('Please specify filedata');
          if(!that.contentType) {
            try { that.contentType = that.fileData.type; } catch(e) {}
          }
          if (!that.contentType || !_type.isString(that.contentType) || that.contentType.length === 0) that.contentType = 'text/plain';
          
          var promise = global.Appacitive.Promise.buildPromise(callbacks);

          var url = global.Appacitive.config.apiBaseUrl + global.Appacitive.storage.urlFactory.file.getUpdateUrl(that.fileId, that.contentType);
          
          _getUrls(url, function(response) {
              _upload(response.url, that.fileData, that.contentType, function() {
                  
                  that.getDownloadUrl().then(function(res) {
                    promise.fulfill(res, that);
                  }, function(e) {
                    promise.reject(e);
                  });

              }, promise);
          }, promise, ' Get update url for file ' + that.fileId);

          return promise;
      };

      this.deleteFile = function(callbacks) {
          if (!this.fileId) throw new Error('Please specify fileId to delete');

          var promise = global.Appacitive.Promise.buildPromise(callbacks);

          var request = new global.Appacitive.HttpRequest();
          request.url = global.Appacitive.config.apiBaseUrl + global.Appacitive.storage.urlFactory.file.getDeleteUrl(this.fileId);
          request.method = 'DELETE';
          request.description = 'Delete file with id ' + this.fileId;
          request.onSuccess = function(response) {
              promise.fulfill();
          };
          request.promise = promise;
          request.entity = that;
          return global.Appacitive.http.send(request); 
      };

      this.getDownloadUrl = function(expiry, callbacks) {
          if (!this.fileId) throw new Error('Please specify fileId to download');

          if (typeof expiry !== 'number') {
            callbacks = expiry;
            expiry = -1;
          }
          
          var promise = global.Appacitive.Promise.buildPromise(callbacks);

          var url = global.Appacitive.config.apiBaseUrl + global.Appacitive.storage.urlFactory.file.getDownloadUrl(this.fileId, expiry);
 
          _getUrls(url, function(response) {
              that.url = response.uri;
              promise.fulfill(response.uri);
          }, promise,  ' Get download url for file ' + this.fileId);

          return promise;
      };

      this.getUploadUrl = function(callbacks) {
          if (!that.contentType || !_type.isString(that.contentType) || that.contentType.length === 0) that.contentType = 'text/plain';

          var promise = global.Appacitive.Promise.buildPromise(callbacks);

          var url = global.Appacitive.config.apiBaseUrl + global.Appacitive.storage.urlFactory.file.getUploadUrl(this.contentType, this.fileId ? this.fileId : '');

          _getUrls(url, function(response) {
              that.url = response.url;
              promise.fulfill(response.url, that);
          }, promise, ' Get upload url for file ' + this.fileId);

          return promise;
      };
  };

  global.Appacitive.File = _file;

}(global));
(function (global) {
  
  "use strict";

  global.Appacitive.Date = {};

  var pad = function (n) {
      if (n < 10) return '0' + n;
      return n;
  };

  global.Appacitive.Date.parseISODate = function (str) {
    try {
        var regexp = new RegExp("^([0-9]{1,4})-([0-9]{1,2})-([0-9]{1,2})" + "T" + "([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2})" + "(.([0-9]+))?" + "Z?$");

        if (!regexp.exec(str)) return new Date(str);
          
        var parts = str.split('T'),
          dateParts = parts[0].split('-'),
          timeParts = parts[1].split('Z'),
          timeSubParts = timeParts[0].split(':'),
          timeSecParts = timeSubParts[2].split('.'),
          timeHours = Number(timeSubParts[0]),
          date = new Date();

        date.setUTCFullYear(Number(dateParts[0]));
        date.setUTCMonth(Number(dateParts[1])-1);
        date.setUTCDate(Number(dateParts[2]));
        
        date.setUTCHours(Number(timeHours));
        date.setUTCMinutes(Number(timeSubParts[1]));
        date.setUTCSeconds(Number(timeSecParts[0]));
        if (timeSecParts[1]) date.setUTCMilliseconds(Number(timeSecParts[1].substring(0, 3)));

        return date;
    } catch(e) {return null;}
  };

  global.Appacitive.Date.toISOString = function (date) {
    try {
      date = date.toISOString();
      date = date.replace('Z','0000Z');
      return date;
    } catch(e) { return null;}
  };

  global.Appacitive.Date.toISODate = function(date) {
    if (date instanceof Date) return String.format("{0}-{1}-{2}", date.getFullYear(), pad((date.getMonth() + 1)), pad(date.getDate()));
    throw new Error("Invalid date provided Appacitive.Date.toISODate method");
  };

  global.Appacitive.Date.toISOTime = function(date) {
    var padMilliseconds = function (n) {
                if (n < 10) return n + '000000';
           else if (n < 100) return n + '00000';
           else if (n < 1000) return n + '0000';
           else if (n < 10000) return n + '000';
           else if (n < 100000) return n + '00';
           else if (n < 1000000) return n + '0';
           return n;
    };
    if (date instanceof Date) return String.format("{0}:{1}:{2}.{3}", pad(date.getHours()), pad(date.getMinutes()), pad(date.getSeconds()), padMilliseconds(date.getMilliseconds()));
    throw new Error("Invalid date provided Appacitive.Date.toISOTime method");
  };

  global.Appacitive.Date.parseISOTime = function(str) {
    try {
      var date = new Date();
    
      var parts = str.split('T');
      if (parts.length === 1) parts.push(parts[0]);
      
      var regexp = new RegExp("^([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2})" + "(.([0-9]+))?" + "Z?$");
      if (!regexp.exec(parts[1])) {
         return null;
      }

      var timeParts = parts[1].split('Z'),
      timeSubParts = timeParts[0].split(':'),
      timeSecParts = timeSubParts[2].split('.'),
      timeHours = Number(timeSubParts[0]);
      
      if (parts.length > 1) {
        date.setUTCHours(Number(timeHours));
        date.setUTCMinutes(Number(timeSubParts[1]));
        date.setUTCSeconds(Number(timeSecParts[0]));
        if (timeSecParts[1]) date.setUTCMilliseconds(Number(timeSecParts[1].substring(0, 3)));
      } else {
        date.setHours(Number(timeHours));
        date.setMinutes(Number(timeSubParts[1]));
        date.setSeconds(Number(timeSecParts[0]));
        if (timeSecParts[1]) date.setMilliseconds(Number(timeSecParts[1].substring(0, 3)));
      }

      return date;
    } catch(e) {return null;}
  };

})(global);
(function (global) {

    "use strict";

    if (global.Appacitive.runtime.isBrowser) {

        var A_LocalStorage = function() {

            var _localStorage = (global.Appacitive.runtime.isBrowser) ? window.localStorage : { getItem: function() { return null; } };

            this.set = function(key, value) {
                value = value || '';
                if (!key) return false;

                if (_type.isObject(value) || _type.isArray(value)) {
                    try {
                      value = JSON.stringify(value);
                    } catch(e){}
                }
                key = global.Appacitive.getAppPrefix(key);

                _localStorage[key] = value;
                return this;
            };

            this.get = function(key) {
                if (!key) return null;

                key = global.Appacitive.getAppPrefix(key);

                var value = _localStorage.getItem(key);
                if (!value) { return null; }

                // assume it is an object that has been stringified
                if (value[0] === "{") {
                    try {
                      value = JSON.parse(value);
                    } catch(e){}
                }

                return value;
            };
            
            this.remove = function(key) {
                if (!key) return;
                key = global.Appacitive.getAppPrefix(key);
                try { delete _localStorage[key]; } catch(e){}
            };
        };
        global.Appacitive.localStorage = new A_LocalStorage();

    } else {
        var A_LocalStorage = function() {
            
            var _localStorage = [];

            this.set = function(key, value) {
                value = value || '';
                if (!key || _type.isString(key)) return false;

                key = global.Appacitive.getAppPrefix(key);

                _localStorage[key] = value;
                return this;
            };

            this.get = function(key) {
                if (!key || _type.isString(key)) return null;

                key = global.Appacitive.getAppPrefix(key);

                var value = _localStorage[key];
                if (!value) { return null; }

                return value;
            };
            
            this.remove = function(key) {
                if (!key || _type.isString(key)) return;
                key = global.Appacitive.getAppPrefix(key);
                try { delete _localStorage[key]; } catch(e){}
            };
        };

        global.Appacitive.localStorage = new A_LocalStorage();
    }
})(global);
(function (global) {

"use strict";

if (global.Appacitive.runtime.isBrowser) {

    var _cookieManager = function () {

        this.setCookie = function (name, value, minutes, erase) {
            name = global.Appacitive.getAppPrefix(name);
            var expires = '';
            if (minutes) {
                var date = new Date();
                date.setTime(date.getTime() + (minutes*60*1000));
                expires = "; expires=" + date.toGMTString();
            }

            if (!erase) {
                //for now lets make this a session cookie if it is not an erase
                if (!global.Appacitive.Session.persistUserToken) expires = '';
                else expires = "; expires=" +  new Date("2020-12-31").toGMTString();
            } else {
                expires = '; expires=Thu, 01-Jan-1970 00:00:01 GMT';
            }
            var domain = 'domain=' + window.location.hostname;
            if (window.location.hostname == 'localhost') domain = '';
            
            document.cookie = name + "=" + value + expires + "; path=/;" + domain;
        };

        this.readCookie = function (name) {
            name = global.Appacitive.getAppPrefix(name);
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for (var i=0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
            }
            return null;
        };

        this.eraseCookie = function (name) {
            this.setCookie(name, "" ,-1, true);
        };

    };

    global.Appacitive.Cookie = new _cookieManager();

} else {
    var _cookieManager = function () {

            this.setCookie = function (name, value) {
                    global.Appacitive.localStorage.set( 'cookie/' + name, value);
            };

            this.readCookie = function (name) {
                    return global.Appacitive.localStorage.get( 'cookie/' + name);
            };

            this.eraseCookie = function (name) {
                    global.Appacitive.localStorage.remove( 'cookie/' + name);
            };

    };
    global.Appacitive.Cookie = new _cookieManager();
}

})(global);

if (typeof module !== 'undefined' && !global.Appacitive.runtime.isBrowser) module.exports =  global.Appacitive;
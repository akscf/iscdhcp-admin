/**
 * based on qooxdoo rpc class
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("org.cforge.qooxdoo.Rpc", {
    extend: qx.core.Object,
    //
    construct: function (url, serviceName, timeout) {
        this.base(arguments);

        if (url !== undefined) {
            this.setUrl(url);
        }

        if (serviceName != null) {
            this.setServiceName(serviceName);
        }

        if (timeout != null && timeout !== 'undefined') {
            this.setTimeout(timeout);
        }
        // encoding fixes
        var ver = parseInt(qx.core.Environment.get("browser.version"));
        this.__hfixL1Enable = (qx.core.Environment.get("browser.name") == "firefox" && ver < 44); // for ff < 44,
    },
    //==============================================================================================================================================================================================
    // STATIC
    //==============================================================================================================================================================================================
    statics: {
        origin: {server: 1, application: 2, transport: 3, local: 4},
        localError: {timeout: 1, abort: 2},
        CONVERT_DATES: true, // enable custom format (by aks@cfspec.net)
        RESPONSE_JSON: null
    },
    //==============================================================================================================================================================================================
    // EVENTS
    //==============================================================================================================================================================================================
    events: {
        "completed": "qx.event.type.Event",
        "aborted": "qx.event.type.Event",
        "failed": "qx.event.type.Event",
        "timeout": "qx.event.type.Event"
    },
    //==============================================================================================================================================================================================
    // PROPERTIES
    //==============================================================================================================================================================================================
    properties: {
        timeout: {
            check: "Integer",
            nullable: true
        },
        crossDomain: {
            check: "Boolean",
            init: false
        },
        url: {
            check: "String",
            nullable: true
        },
        serviceName: {
            check: "String",
            nullable: true
        },
        serverData: {
            check: "Object",
            nullable: true
        },
        username: {
            check: "String",
            nullable: true
        },
        password: {
            check: "String",
            nullable: true
        },
        useBasicHttpAuth: {
            check: "Boolean",
            nullable: true
        },
        protocol: {
            init: "qx1",
            check: function (val) {
                return val == "qx1" || val == "2.0";
            }
        }
    },
    //==============================================================================================================================================================================================
    // MEMBERS
    //==============================================================================================================================================================================================
    members: {
        __DATE_FORMAT: new qx.util.format.DateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        __sessionId: null,
        __previousServerSuffix: null,
        __currentServerSuffix: null,
        __hfixL1Enable: false,
        setSessionId: function (id) {
            this.__sessionId = id;
        },
        createRequest: function () {
            return new qx.io.remote.Request(this.getUrl(), "POST", "application/json");
        },
        createRpcData: function (id, method, parameters, serverData) {
            var requestObject;
            var service;

            // Create a protocol-dependent request object
            if (this.getProtocol() == "qx1") {
                requestObject = {
                    "id": id,
                    "service": method == "refreshSession" ? null : this.getServiceName(),
                    "method": method,
                    "params": parameters
                };
                if (serverData) {
                    requestObject.server_data = serverData;
                }
            } else {
                // If there's a service name, we'll prepend it to the method name
                service = this.getServiceName();
                if (service && service != "") {
                    service += ".";
                } else {
                    service = "";
                }

                // Create a standard version 2.0 rpc data object
                requestObject = {
                    "id": id,
                    "jsonrpc": "2.0",
                    "method": service + method,
                    "params": parameters
                };
            }
            //
            return requestObject;
        },
        // call request
        _callInternal: function (args, callType, refreshSession) {
            var self = this;
            var offset = (callType == 0 ? 0 : 1);
            var whichMethod = (refreshSession ? "refreshSession" : args[offset]);
            var handler = args[0];
            var argsArray = [];
            var eventTarget = this;
            var protocol = this.getProtocol();

            for (var i = offset + 1; i < args.length; ++i) {
                argsArray.push(args[i]);
            }

            var req = this.createRequest();

            // Get any additional out-of-band data to be sent to the server
            var serverData = this.getServerData();

            // Create the request object
            var rpcData = this.createRpcData(req.getSequenceNumber(), whichMethod, argsArray, serverData);
            req.setCrossDomain(this.getCrossDomain());

            if (this.getUsername()) {
                req.setUseBasicHttpAuth(this.getUseBasicHttpAuth());
                req.setUsername(this.getUsername());
                req.setPassword(this.getPassword());
            }

            req.setTimeout(this.getTimeout());
            var ex = null;
            var id = null;
            var result = null;
            var response = null;

            var handleRequestFinished = function (eventType, eventTarget) {
                switch (callType) {
                    case 0:         // sync
                        break;
                    case 1:         // async with handler function
                        handler(result, ex, id);
                        break;
                    case 2:         // async with event listeners, Dispatch the event to our listeners.
                        if (!ex) {
                            eventTarget.fireDataEvent(eventType, response);
                        } else {
                            // Add the id to the exception
                            ex.id = id;
                            if (args[0]) {      // coalesce
                                // They requested that we coalesce all failure types to
                                // "failed"
                                eventTarget.fireDataEvent("failed", ex);
                            } else {
                                // No coalese so use original event type
                                eventTarget.fireDataEvent(eventType, ex);
                            }
                        }
                }
            };

            var addToStringToObject = function (obj) {
                if (protocol == "qx1") {
                    obj.toString = function () {
                        switch (obj.origin) {
                            case org.cforge.qooxdoo.Rpc.origin.server:
                                return "Server error " + obj.code + ": " + obj.message;
                            case org.cforge.qooxdoo.Rpc.origin.application:
                                return "Application error " + obj.code + ": " + obj.message;
                            case org.cforge.qooxdoo.Rpc.origin.transport:
                                return "Transport error " + obj.code + ": " + obj.message;
                            case org.cforge.qooxdoo.Rpc.origin.local:
                                return "Local error " + obj.code + ": " + obj.message;
                            default:
                                return ("UNEXPECTED origin " + obj.origin + " error " + obj.code + ": " + obj.message);
                        }
                    };
                } else { // protocol == "2.0"
                    obj.toString = function () {
                        var ret = "Error " + obj.code + ": " + obj.message;
                        if (obj.data) {
                            ret += " (" + obj.data + ")";
                        }
                        return ret;
                    };
                }
            };

            var makeException = function (origin, code, message) {
                var ex = new Object();

                if (protocol == "qx1") {
                    ex.origin = origin;
                }
                ex.code = code;
                ex.message = message;
                addToStringToObject(ex);

                return ex;
            };

            req.addListener("failed", function (evt) {
                var code = evt.getStatusCode();
                ex = makeException(org.cforge.qooxdoo.Rpc.origin.transport, code, qx.io.remote.Exchange.statusCodeToString(code));
                id = this.getSequenceNumber();
                handleRequestFinished("failed", eventTarget);
            });

            req.addListener("timeout", function (evt) {
                this.debug("TIMEOUT OCCURRED");
                ex = makeException(org.cforge.qooxdoo.Rpc.origin.local, org.cforge.qooxdoo.Rpc.localError.timeout, "Local time-out expired for " + whichMethod);
                id = this.getSequenceNumber();
                handleRequestFinished("timeout", eventTarget);
            });

            req.addListener("aborted", function (evt) {
                ex = makeException(org.cforge.qooxdoo.Rpc.origin.local, org.cforge.qooxdoo.Rpc.localError.abort, "Aborted " + whichMethod);
                id = this.getSequenceNumber();
                handleRequestFinished("aborted", eventTarget);
            });

            req.addListener("completed", function (evt) {
                response = evt.getContent();
                //
                if (!qx.lang.Type.isObject(response)) {
                    if (self._isConvertDates()) {
                        if (self._isResponseJson()) {
                            response = qx.lang.Json.parse(response, function (key, value) {
                                if (value && typeof value === "string") { // custom format (by aks@cfspec.net)
                                    var m = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d+)Z$/);
                                    return (m) ? new Date(m[1], m[2], m[3], m[4], m[5], m[6], m[7]) : value;
                                }
                                return value;
                            });
                        } else { // used this faster method
                            response = response && response.length > 0 ? eval('(' + response + ')') : null;
                        }
                    } else {
                        response = qx.lang.Json.parse(response);
                    }
                }
                //
                id = response["id"];
                if (id != this.getSequenceNumber()) {
                    this.warn("Received id (" + id + ") does not match requested id (" + this.getSequenceNumber() + ")!");
                }
                // Determine if an error was returned. Assume no error, initially.
                var eventType = "completed";
                var exTest = response["error"];
                if (exTest != null) {
                    result = null;
                    addToStringToObject(exTest);
                    ex = exTest;
                    eventType = "failed";
                } else {
                    result = response["result"];
                    if (refreshSession) {
                        result = eval("(" + result + ")");
                        var newSuffix = '';
                        if (self.__currentServerSuffix != newSuffix) {
                            self.__previousServerSuffix = self.__currentServerSuffix;
                            self.__currentServerSuffix = newSuffix;
                        }
                        self.setUrl(self.fixUrl(self.getUrl()));
                    }
                }
                handleRequestFinished(eventType, eventTarget);
            });

            // Provide a replacer when convert dates always (by aks@cfspec.net)
            var replacer = function (key, value) {
                value = this[key];
                if (qx.lang.Type.isDate(value)) {
                    return self.__DATE_FORMAT.format(value);
                }
                return value;
            }
            //
            req.setData(qx.lang.Json.stringify(rpcData, replacer));
            req.setAsynchronous(callType > 0);
            // defined charset for trancoding fix (by aks@cfspec.net)
            if (req.getCrossDomain()) {
                req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded" + (this.__hfixL1Enable ? "" : "; charset=UTF-8"));
            } else {
                req.setRequestHeader("Content-Type", "application/json" + (this.__hfixL1Enable ? "" : "; charset=UTF-8"));
            }
            // CSFR protection
            req.setRequestHeader("X-SESSION-ID", (this.__sessionId ? this.__sessionId : ""));
            // Do not parse as JSON. Later done conditionally.
            req.setParseJson(false);
            req.send();
            //
            if (callType == 0) {
                if (ex != null) {
                    var error = new Error(ex.toString());
                    error.rpcdetails = ex;
                    throw error;
                }
                return result;
            } else {
                return req;
            }
        },
        fixUrl: function (url) {
            if (this.__previousServerSuffix == null || this.__currentServerSuffix == null || this.__previousServerSuffix == "" || this.__previousServerSuffix == this.__currentServerSuffix) {
                return url;
            }
            var index = url.indexOf(this.__previousServerSuffix);
            if (index == -1) {
                return url;
            }
            //
            return (url.substring(0, index) + this.__currentServerSuffix + url.substring(index + this.__previousServerSuffix.length));
        },
        callSync: function (methodName) {
            return this._callInternal(arguments, 0);
        },
        callAsync: function (handler, methodName) {
            return this._callInternal(arguments, 1);
        },
        callAsyncListeners: function (coalesce, methodName) {
            return this._callInternal(arguments, 2);
        },
        refreshSession: function (handler) {
            handler(false); // no refresh possible, but would be necessary
        },
        _isConvertDates: function () {
            return !!(org.cforge.qooxdoo.Rpc.CONVERT_DATES);
        },
        _isResponseJson: function () {
            return !!(org.cforge.qooxdoo.Rpc.RESPONSE_JSON);
        },
        abort: function (opaqueCallRef) {
            opaqueCallRef.abort();
        }
    }
});

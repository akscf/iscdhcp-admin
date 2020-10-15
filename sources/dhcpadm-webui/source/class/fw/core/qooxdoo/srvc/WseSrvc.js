/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.srvc.WseSrvc", {
    extend: qx.core.Object,
    include: [qx.locale.MTranslation],

    construct: function () {
        this.base(arguments);
        //
        var wsen = qx.core.Environment.get("webapp.env.ws_enabled");
        if(!wsen || wsen == 'false') {
            return;
        }
        var wspath = qx.core.Environment.get("webapp.env.ws_url");
        var wsurl = location.protocol + "//" + location.host + "/" + wspath;
        //
        if (wsurl.indexOf('http://') == 0) {
            this.__url = wsurl.replace('http://', 'ws://');
        } else if (wsurl.indexOf('https://') == 0) {
            this.__url = wsurl.replace('https://', 'wss://');
        }
        //
        this.__pingTimer = new qx.event.Timer(this.__PING_INTERVAL);
        this.__pingTimer.addListener("interval", this.__hPingTimer, this, null);
        //
        this.__conectionCheckTimer = new qx.event.Timer(this.__CON_CHECK_INTERVAL);
        this.__conectionCheckTimer.addListener("interval", this.__hConnectionCheckTimer, this, null);
        //
        qx.event.message.Bus.subscribe('msg-wsc-start', function (dataEvent) {
            this.__mgmtManager(true);
        }, this);
        qx.event.message.Bus.subscribe('msg-wsc-stop', function (dataEvent) {
            this.__mgmtManager(false);
        }, this);
        qx.event.message.Bus.subscribe('msg-wsc-send', function (dataEvent) {
            var data = dataEvent.getData();
            if(data) {
                try {
                    this.__sendMessage(data);
                } catch (exc) {
                }
            }
        }, this);
    },

    members: {
        __DATE_FORMAT:new qx.util.format.DateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        __CON_CHECK_INTERVAL: 10000,    // 10s
        __PING_INTERVAL     : 108000,   // 30m
        __url               : null,
        __flagConnected     : false,
        __flagHdskCompleted : false,
        __flagPingConfirmed : false,
        __flagManagerRun    : true,
        __flagSetSid        : false,
        __cspin             : 0,
        __websocket         : null,

        __isReady: function () {
            return (this.__flagConnected && this.__flagManagerRun && this.__flagHdskCompleted);
        },

        __sendMessage: function(data) {
            if (!this.__isReady()) {
                return false;
            }
            this.__websocket.send(JSON.stringify(data));
            return true;
        },

        __mgmtManager : function (val) {
            if(this.__xxx_mfmtx) return;
            this.__xxx_mfmtx = true;
            //
            if(!this.__pingTimer) {
                this.__pingTimer = new qx.event.Timer(this.__PING_INTERVAL);
                this.__pingTimer.addListener("interval", this.__hPingTimer, this, null);
            }
            if(!this.__conectionCheckTimer) {
                this.__conectionCheckTimer = new qx.event.Timer(this.__CON_CHECK_INTERVAL);
                this.__conectionCheckTimer.addListener("interval", this.__hConnectionCheckTimer, this, null);
            }
            if(val) {
                this.__pingTimer.start();
                this.__conectionCheckTimer.start();
                this.__hConnectionCheckTimer();
            } else {
                this.__pingTimer.stop();
                this.__conectionCheckTimer.stop();
            }
            //
            this.__flagManagerRun = val;
            this.__xxx_mfmtx = false;
        },

        __hPingTimer:function () {
            if(!this.__flagManagerRun) return;
            //
            this.__pingTimer.stop();
            if (this.__flagConnected && this.__flagHdskCompleted) {
                //console.log("==> ws ping send");
                try {
                    this.__flagPingConfirmed = false;
                    this.__websocket.send('__ping__');
                } catch (exc) {
                }
            }
            this.__pingTimer.start();
        },

        __hConnectionCheckTimer:function () {
            if(!this.__flagManagerRun) return;
            //
            this.__conectionCheckTimer.stop();
            if (!this.__flagConnected) {
                if (this.__cspin == 0) {
                    this.__flagPingConfirmed = false;
                    this.__cspin++;
                    try {
                        var self = this;
                        this.__websocket = new WebSocket(this.__url);
                        this.__websocket.onopen = function (e) {
                            self.__onWSConnect();
                        };
                        this.__websocket.onclose = function (e) {
                            self.__onWSDisconnect(e);
                        }
                        this.__websocket.onmessage = function (e) {
                            self.__onWSMessage(e);
                        }
                    } catch (exc) {
                    }
                }
            }
            this.__conectionCheckTimer.start();
        },

        __onWSConnect:function () {
            this.__flagConnected = true;
            if (this.__cspin > 0) {
                this.__cspin--;
            }
            try {
                //console.log("==> ws connected, send auth");
                this.__websocket.send('__auth__');
                //this.__flagHdskCompleted = true;
            } catch (exc) {
            }
        },

        __onWSDisconnect:function (event) {
            if (this.__websocket) {
                this.__websocket.close();
            }
            this.__flagConnected = false;
            this.__flagHdskCompleted = false;
            if (this.__cspin > 0) {
                this.__cspin--;
            }
            if (event.code > 1001) { // ignore: 1000,1001
                console.log("WSC: disconnected with code: " + event.code);
            }
        },

        __onWSMessage:function (event) {
            var message = event.data;
            try {
                if(message == '__auth_ok__') {
                    this.__flagHdskCompleted = true;
                    //console.log("==> ws auth recv - success");

                } else if(message == '__auth_err__') {
                    //console.log("==> ws auth recv - error");

                } else if(message == '__pong__') {
                    //console.log("==> ws ping recv - OK");
                    this.__flagPingConfirmed = true;

                } else {
                    //console.log("==> ws msg recv: " + message);

                    var obj = JSON.parse(message, function(k, v) {
                        if (v && typeof v === "string") {
                            var m = v.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d+)Z$/);
                            return (m) ? new Date(m[1], m[2], m[3], m[4], m[5], m[6], m[7]) : v;
                        }
                        return v;
                    });
                    qx.event.message.Bus.dispatch(new qx.event.message.Message('msg-wsc-incoming', obj));
                }
            } catch (exc) {
                console.log("WSC: parser error (" + exc + ")");
            }
        }
    }
});


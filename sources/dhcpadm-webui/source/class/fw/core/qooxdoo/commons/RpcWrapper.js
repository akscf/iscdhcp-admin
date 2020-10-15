/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.commons.RpcWrapper", {
    type : "singleton",
    extend: qx.core.Object,
    include: [qx.locale.MTranslation],

    construct: function () {
        this.base(arguments);
        this.__baseUrl = qx.core.Environment.get("webapp.env.rpc_url");
        this.__initComponents();
    },

    members: {
        __url: null,
        __services: {},
        __imessages: [],
        __icount: 0,

        //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        // public
        //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        doCall: function (descriptor) {
            var serviceName = descriptor['service'];
            var methodName = descriptor['method'];
            var callback = descriptor['callback'];
            var margs = descriptor['args'];
            var catchException = descriptor['catchException'];
            var showIndicator = (descriptor['message'] && descriptor['showMessage'] ? true : false);
            //
            var rpc = this.__services[serviceName];
            if (!rpc) {
                rpc = new fw.core.qooxdoo.net.Rpc(this.__baseUrl, serviceName, 90000);
                this.__services[serviceName] = rpc;
            }
            // current session id
            rpc.setSessionId(
                fw.core.qooxdoo.commons.SessionManager.getInstance().getSessionId()
            );
            //
            var self = this;
            var wrapperfn = function (result, exception) {
                if (catchException && exception != null) {
                    if (showIndicator) self.__indicatorHide();
                    fw.core.qooxdoo.dialogs.MessageBox.getInstance().showExceptionDialog(serviceName, methodName, exception);
                    try {
                        if (callback) { callback(null, exception); }
                    } catch (thr) {
                        fw.core.qooxdoo.dialogs.MessageBox.getInstance().showExceptionDialog(self.classname, serviceName + '::' + methodName, thr);
                    }
                } else {
                    try {
                        if (callback) {
                            callback(result, exception);
                        }
                    } catch (thr) {
                        fw.core.qooxdoo.dialogs.MessageBox.getInstance().showExceptionDialog(self.classname, serviceName + '::' + methodName, thr);
                    } finally {
                        if (showIndicator) self.__indicatorHide();
                    }
                }
            };
            //
            var callargs = [];
            callargs.push(wrapperfn);
            callargs.push(methodName);
            if (margs) {
                for (var i = 0; i < margs.length; ++i) {
                    callargs.push(margs[i]);
                }
            }
            //
            if (showIndicator) this.__indicatorShow(descriptor.message);
            rpc.callAsync.apply(rpc, callargs);
        },

        //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        // private
        //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        __initComponents: function () {
            this.__indicator = new fw.core.qooxdoo.dialogs.BusyIndicator();
            this.__icount = 0;
        },

        __indicatorShow: function (text) {
            if (this.__icount > 0) {
                this.__imessages.push(text);
            } else {
                this.__indicator.open(text);
            }
            this.__icount++;
        },

        __indicatorHide: function () {
            this.__icount--;
            if (this.__icount <= 0) {
                this.__indicator.close();
            } else {
                this.__indicator.setMessage(this.__imessages.pop());
            }
        }
    }
});

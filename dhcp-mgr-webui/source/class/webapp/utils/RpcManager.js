/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("webapp.utils.RpcManager", {
    extend: qx.core.Object,
    include: [qx.locale.MTranslation],
    construct: function (baseUrl) {
        this.base(arguments);
        //
        this.__baseUrl = baseUrl;
        this.__initComponents();
    },
    members: {
        __url: null,
        __services: {}, // name => descriptor
        __imessages: [],
        __icount: 0,
        //=======================================================================================================================================
        // init
        //=======================================================================================================================================
        __initComponents: function () {
            this.__indicator = new webapp.dialogs.BusyIndicator();
            this.__icount = 0;
        },
        //=======================================================================================================================================
        // api
        //=======================================================================================================================================
        registerCall: function (descriptor) {
            var serviceName = descriptor['service'];
            var methodName = descriptor['method'];
            var callback = descriptor['callback'];
            var margs = descriptor['args'];
            var catchException = descriptor['catchException'];
            var showIndicator = (descriptor['message'] ? true : false);
            //
            var rpc = this.__services[serviceName];
            if (!rpc) {
                rpc = new org.cforge.qooxdoo.Rpc(this.__baseUrl, serviceName, 90000);
                this.__services[serviceName] = rpc;
            }
            // session id
            rpc.setSessionId(qx.core.Init.getApplication().getSessionId()); // set session-id
            //
            var self = this;
            var wrapperfn = function (result, exception) {
                var sessionExpire = false;
                if (exception) {
                    if (exception.hasOwnProperty('rpcdetails')) {
                        var rpcfault = exception.rpcdetails;
                        sessionExpire = (rpcfault.origin == 2 && rpcfault.code == 2001);
                    } else if (exception.hasOwnProperty('origin') && exception.hasOwnProperty('code')) {
                        sessionExpire = (exception.origin == 2 && exception.code == 2001);
                    }
                }
                if (sessionExpire) {
                    if (showIndicator)
                        self._indicatorHide();
                    self.__sessionExpireDialog(self.tr("Authorization failed"), self.tr("Session is outdated!"));
                    return;
                }
                if (catchException && exception != null) {
                    if (showIndicator)
                        self._indicatorHide();
                    qx.core.Init.getApplication().stdDialogs().exception(serviceName, methodName, exception);
                    return;
                }
                // descriptor callback
                try {
                    if (callback) {
                        callback(result, exception);
                    }
                } catch (thr) {
                    qx.core.Init.getApplication().stdDialogs().exception(self.classname, serviceName + '::' + methodName, thr);
                } finally {
                    if (showIndicator)
                        self._indicatorHide();
                }
            };
            // make args
            var callargs = [];
            callargs.push(wrapperfn);
            callargs.push(methodName);
            if (margs) {
                for (var i = 0; i < margs.length; ++i) {
                    callargs.push(margs[i]);
                }
            }
            // call
            if (showIndicator)
                this._indicatorShow(descriptor.message);
            rpc.callAsync.apply(rpc, callargs);
        },
        //=======================================================================================================================================
        // private
        //=======================================================================================================================================
        _indicatorShow: function (text) {
            if (this.__icount > 0) {
                this.__imessages.push(text);
            } else {
                this.__indicator.open(text);
            }
            this.__icount++;
        },
        _indicatorHide: function () {
            this.__icount--;
            if (this.__icount <= 0) {
                this.__indicator.close();
            } else {
                this.__indicator.setMessage(this.__imessages.pop());
            }
        },
        __sessionExpireDialog: function (caption, text) {
            if (!this.__errorDialog) {
                this.__errorDialog = new webapp.dialogs.ErrorDialog();
                this.__errorDialog.addListener('closeApprove', function (e) {
                    window.top.location.reload();
                }, this);
            }
            this.__errorDialog.open(caption, text);
        }
    }
});


/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("webapp.utils.SessionManager", {
    extend: qx.core.Object,
    include: [qx.locale.MTranslation],
    construct: function (rpcUrl, keepAliveSession) {
        this.base(arguments);
        //
        this.__rpcUrl = rpcUrl;
        this.__keepAliveSession = keepAliveSession;
        //
        this.__initComponents();
    },
    members: {
        __SKEY_NAME: 'credentials',
        __authService: null,
        __sha1Helper: null,
        __currentSession: null,
        __failCount: 0,
        __focusIsSet: false,
        __loginDialog: null,
        //=========================================================================================================================================================================================
        // API
        //=========================================================================================================================================================================================
        getSession: function () {
            return this.__currentSession;
        },
        logout: function () {
            if (this.__keepAliveTimer) {
                this.__keepAliveTimer.stop();
            }
            this.__authService.callAsync(function (r, e) {
                window.top.location.reload();
            }, "logout");
        },
        login: function () {
            if (!this.__loginDialog) {
                this.__createLoginDialog();
            }
            if (!this.__credentialsLoaded) {
                this.__credentialsLoaded = true;
                this.__loadCredentials();
            }
            //
            this.__failCount = 0;
            qx.event.message.Bus.dispatch(new qx.event.message.Message('wc-lock-workplace'));
            this.__loginDialog.open();
        },
        //=========================================================================================================================================================================================
        // private methods
        //=========================================================================================================================================================================================
        __initComponents: function () {
            this.__sha1Helper = new org.cforge.wsp.toolkit.SHA1();
            this.__authService = new org.cforge.qooxdoo.Rpc(this.__rpcUrl, 'AuthenticationService', 60000);
            // set-up listener
            qx.event.message.Bus.subscribe('wc-login', function (dataEvent) {
                this.login();
            }, this);
            qx.event.message.Bus.subscribe('wc-logout', function (dataEvent) {
                this.logout();
            }, this);
            // session keepalive
            if (this.__keepAliveSession) {
                this.__keepAliveTimer = new qx.event.Timer(1800000); // 30min interval
                this.__keepAliveTimer.addListener("interval", this.__sessionKeepalivePing, this, false);
            }
        },
        __loadCredentials: function () {
            try {
                var storage = qx.core.Init.getApplication().storageManager();
                var data = storage.readSData(this.__SKEY_NAME);
                var credentials = (data ? JSON.parse(data) : null);
                //
                this.__fieldUserid.setValue((credentials ? credentials.userid : null));
                this.__fieldPassword.setValue((credentials ? credentials.password : null));
                this.__fieldRememberPassword.setValue((credentials && credentials.password ? true : false));
            } catch (exc) {
                this.error("SessionManager: " + exc);
            }
        },
        __storeCredentials: function () {
            try {
                var storage = qx.core.Init.getApplication().storageManager();
                var rememberPasswd = this.__fieldRememberPassword.getValue();
                var credentials = {
                    userid: this.__fieldUserid.getValue(),
                    password: (rememberPasswd ? this.__fieldPassword.getValue() : null)
                };
                //
                storage.writeSData(this.__SKEY_NAME, JSON.stringify(credentials));
            } catch (exc) {
                this.error("SessionManager: " + exc);
            }
        },
        __doLogin: function () {
            try {
                this.__loginDialog.validateForm();
            } catch (exc) {
                return;
            }
            var userid = this.__fieldUserid.getValue();
            var passwd = this.__sha1Helper.sha1Hex(this.__fieldPassword.getValue());
            this.__storeCredentials();
            //
            if (this.__keepAliveTimer)
                this.__keepAliveTimer.stop();
            //
            this.__loginDialog.hide(); // hide login prompt
            this.__showBusyIndicator(true, this.tr('Login, please wait...'));
            //
            var self = this;
            this.__authService.callAsync(function (result, exception) {
                if (exception) {
                    self.__focusIsSet = false;
                    self.__showBusyIndicator(false, null);
                    self.__showErrorDialog(self.tr("Unexpected exception"), exception);
                    return;
                }
                if (!result) {
                    self.__fieldPassword.setValue("");
                    self.__failCount++;
                    self.__focusIsSet = false;
                    self.__showBusyIndicator(false, null);
                    self.__showErrorDialog(self.tr("Authentication failed"), self.tr("Incorrect userid or password."));
                    return;
                }
                if (!result.sessionId) {
                    self.__focusIsSet = false;
                    self.__showBusyIndicator(false, null);
                    self.__showErrorDialog(null, "Malformed session entity: " + JSON.stringify(result));
                    return;
                }
                // login clomplete
                self.__currentSession = result;
                self.__showBusyIndicator(false, null);
                //
                self.__authService.setSessionId(result.sessionId);
                qx.core.Init.getApplication().setSessionId(result.sessionId);
                //
                var workplace = (result.properties && result.properties['workplace']);
                //
                qx.event.message.Bus.dispatch(new qx.event.message.Message('wc-unlock-workplace'));
                qx.event.message.Bus.dispatch(new qx.event.message.Message('wc-change-workplace', workplace));
                //
                if (self.__keepAliveTimer)
                    self.__keepAliveTimer.start();
            }, "login", userid, passwd);
        },
        __sessionKeepalivePing: function () {
            if (this.__pingActive || !this.__currentSession)
                return;
            this.__pingActive = true;
            //
            var self = this;
            this.__authService.callAsync(function (result, exception) {
                self.__pingActive = false;
            }, "ping");
        },
        //=========================================================================================================================================================================================
        // helper
        //=========================================================================================================================================================================================
        __createLoginDialog: function () {
            this.__loginDialog = new org.cforge.qooxdoo.ui.dialog.FormDialog(this.tr("Authentication"), 'webapp/16x16/loginDialog.png');
            this.__loginDialog.set({width: 450});
            //
            this.__fieldUserid = new qx.ui.form.TextField().set({required: true, placeholder: this.tr("userid")}, null);
            this.__fieldPassword = new qx.ui.form.PasswordField().set({required: true, placeholder: this.tr("password")}, null);
            this.__fieldRememberPassword = new qx.ui.form.CheckBox(this.tr("Remember password"));
            //
            this.__fieldUserid.addListener("keyup", function (e) {
                if (e.getKeyIdentifier() == 'Enter')
                    this.__fieldPassword.focus();
            }, this);
            this.__fieldPassword.addListener("keyup", function (e) {
                if (e.getKeyIdentifier() == 'Enter')
                    this.__loginButton.fireEvent('execute');
            }, this);
            //
            this.__loginDialog.addField("", this.__fieldUserid);
            this.__loginDialog.addField("", this.__fieldPassword);
            this.__loginDialog.addField("", this.__fieldRememberPassword);
            //
            this.__loginButton = this.__loginDialog.addButton(new org.cforge.qooxdoo.ui.FormButton(this.tr('Login'), 'webapp/16x16/check2.png', this, this.__doLogin));
            this.__loginDialog.addListener("appear", function () {
                if (!this.__fieldUserid.getValue())
                    this.__fieldUserid.focus();
                else if (!this.__fieldPassword.getValue())
                    this.__fieldPassword.focus();
                else
                    this.__loginButton.focus();
                this.__focusIsSet = true;
            }, this);
        },
        __showBusyIndicator: function (flag, text) {
            if (!this.__busyIndicator) {
                this.__busyIndicator = new webapp.dialogs.BusyIndicator();
            }
            if (flag)
                this.__busyIndicator.open(text);
            else
                this.__busyIndicator.close();
        },
        __showErrorDialog: function (caption, text) {
            if (!this.__errorDialog) {
                this.__errorDialog = new webapp.dialogs.ErrorDialog();
                this.__errorDialog.addListener('closeApprove', function (e) {
                    if (this.__failCount > 3) {
                        window.top.location.reload();
                    } else
                        this.__loginDialog.show();
                }, this, false);
            }
            this.__errorDialog.open(caption, text);
        }
    }
});



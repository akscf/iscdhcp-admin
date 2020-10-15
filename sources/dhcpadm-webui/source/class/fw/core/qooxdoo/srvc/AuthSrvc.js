/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.srvc.AuthSrvc", {
    extend: qx.core.Object,
    include: [qx.locale.MTranslation],

    construct: function () {
        this.base(arguments);
        this.__rpcUrl = qx.core.Environment.get("webapp.env.rpc_url");
        this.__keepAliveEnable = true;
        this.__initComponents();
    },

    members: {
        __KEEPALIVE_TM: 1800000, // 30min
        __SEED_LENGTH: 16,
        __ENTRY_NAME: 'cred',
        __authService: null,
        __sha1Helper: null,
        __currentSession: null,
        __failCount: 0,
        __flPwChanged: false,
        __loginDialog: null,

        //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        // private
        //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        __initComponents: function () {
            this.__sha1Helper = new fw.core.qooxdoo.commons.DigestSha1();
            this.__authService = new fw.core.qooxdoo.net.Rpc(this.__rpcUrl, 'AuthenticationService', 60000);
            //
            qx.event.message.Bus.subscribe('msg-do-login', function (dataEvent) {
                this.__login();
            }, this);
            qx.event.message.Bus.subscribe('msg-do-logout', function (dataEvent) {
                this.__logout();
            }, this);
            //
            if (this.__keepAliveEnable) {
                this.__keepAliveTimer = new qx.event.Timer(this.__KEEPALIVE_TM);
                this.__keepAliveTimer.addListener("interval", this.__sessionKeepalivePing, this, false);
            }
        },

        __logout: function () {
            if (this.__keepAliveTimer) {
                this.__keepAliveTimer.stop();
            }
            this.__authService.callAsync(function (r, e) {
                qx.event.message.Bus.dispatch(new qx.event.message.Message('msg-wsc-stop'));
                window.top.location.reload();
            }, "logout");
        },

        __login: function () {
            if (!this.__loginDialog) {
                this.__createLoginDialog();
            }
            if (!this.__credentialsLoaded) {
                this.__credentialsLoaded = true;
                this.__loadCredentials();
            }
            //
            this.__failCount = 0;
            qx.event.message.Bus.dispatch(new qx.event.message.Message('msg-workplace-lock'));
            this.__loginDialog.open();
        },

        __loadCredentials: function () {
            try {
                var stmgr = fw.core.qooxdoo.commons.LocalStorage.getInstance();
                var data = stmgr.readData(this.__ENTRY_NAME);
                var credentials = (data ? JSON.parse(data) : null);
                //
                this.__fieldUserid.setValue((credentials ? credentials.userid : null));
                this.__fieldPassword.setValue((credentials ? credentials.password : null));
                this.__fieldRememberPassword.setValue((credentials && credentials.password ? true : false));
                this.__flPwChanged = false;
            } catch (exc) {
                console.log("ERROR: SessionManager: " + exc);
            }
        },

        __saveCredentials: function () {
            try {
                var stmgr = fw.core.qooxdoo.commons.LocalStorage.getInstance();
                var rememberPasswd = this.__fieldRememberPassword.getValue();
                var pwhash = (this.__flPwChanged ? this.__sha1Helper.sha1Hex(this.__fieldPassword.getValue()) : this.__fieldPassword.getValue());
                var credentials = {
                    userid: this.__fieldUserid.getValue(),
                    password: (rememberPasswd ? pwhash : null)
                };
                stmgr.writeData(this.__ENTRY_NAME, JSON.stringify(credentials));
            } catch (exc) {
                console.log("ERROR: SessionManager: " + exc);
            }
        },

        __doLogin: function () {
            try {
                this.__loginDialog.validateForm();
            } catch (exc) {
                return;
            }
            var seed = fw.core.qooxdoo.commons.PasswordGenerator.genPassword(this.__SEED_LENGTH);
            var userid = this.__fieldUserid.getValue();
            var pwhash = (this.__flPwChanged ? this.__sha1Helper.sha1Hex(this.__fieldPassword.getValue()) : this.__fieldPassword.getValue());
            var digest = ('DIGEST2 ' + seed + ':' + this.__sha1Helper.sha1Hex(seed + pwhash));
            this.__saveCredentials();
            //
            if (this.__keepAliveTimer) this.__keepAliveTimer.stop();
            //
            this.__loginDialog.hide();
            this.__showBusyIndicator(true, this.tr('Login, please wait...'));
            //
            var self = this;
            this.__authService.callAsync(function (result, exception) {
                if (exception) {
                    self.__showBusyIndicator(false, null);
                    self.__showErrorDialog(self.tr("Unexpected exception"), exception);
                    return;
                }
                if (!result) {
                    self.__failCount++;
                    self.__fieldPassword.setValue(null);
                    self.__showBusyIndicator(false, null);
                    self.__showErrorDialog(self.tr("Authentication failed"), self.tr("Incorrect username or password"));
                    return;
                }
                if (!result['sessionId']) {
                    self.__showBusyIndicator(false, null);
                    self.__showErrorDialog(null, "Malformed session entity: " + JSON.stringify(result));
                    return;
                }
                //self.__fieldPassword.setValue(null);
                self.__currentSession = result;
                self.__showBusyIndicator(false, null);
                self.__authService.setSessionId(result['sessionId']);
                //
                var sessionManager = fw.core.qooxdoo.commons.SessionManager.getInstance();
                sessionManager.updateSession(result);
                //
                var wps = sessionManager.getSessionProperty('workplace', 'DEFAULT');
                qx.event.message.Bus.dispatch(new qx.event.message.Message('msg-wp-set', wps));
                qx.event.message.Bus.dispatch(new qx.event.message.Message('msg-wsc-start'));
                //
                if (self.__keepAliveTimer) self.__keepAliveTimer.start();
            }, "login", userid, digest, null);
        },

        __sessionKeepalivePing: function () {
            if (this.__pingActive || !this.__currentSession) return;
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
            var caption = qx.core.Environment.get('webapp.env.login_dlg_caption');
            this.__loginDialog = new fw.core.qooxdoo.dialogs.LoginDialog(caption);
            //
            this.__fieldUserid = new qx.ui.form.TextField().set({required: true, placeholder: this.tr("enter your username")}, null);
            this.__fieldPassword = new qx.ui.form.PasswordField().set({required: true, placeholder: this.tr("enter your password")}, null);
            this.__fieldRememberPassword = new qx.ui.form.CheckBox(this.tr("Remember password"));
            //
            this.__fieldUserid.addListener("keyup", function (e) {
                if (e.getKeyIdentifier() == 'Enter') this.__fieldPassword.focus();
            }, this);
            this.__fieldPassword.addListener("keyup", function (e) {
                if (e.getKeyIdentifier() == 'Enter') this.__loginButton.fireEvent('execute');
                this.__flPwChanged = true;
            }, this);
            //
            this.__loginDialog.addField("", this.__fieldUserid);
            this.__loginDialog.addField("", this.__fieldPassword);
            this.__loginDialog.addField("", this.__fieldRememberPassword);
            //
            this.__loginButton = this.__loginDialog.addButton(new fw.core.qooxdoo.widgets.FormSubmitButton(this.tr('Login'), null, this, this.__doLogin));
            this.__loginDialog.addListener("appear", function () {
                if (!this.__fieldUserid.getValue()) this.__fieldUserid.focus();
                else if (!this.__fieldPassword.getValue()) this.__fieldPassword.focus();
                else this.__loginButton.focus();
            }, this);

        },

        __showBusyIndicator: function (flag, text) {
            if (!this.__busyIndicator) {
                this.__busyIndicator = new fw.core.qooxdoo.dialogs.BusyIndicator();
            }
            if (flag) this.__busyIndicator.open(text);
            else this.__busyIndicator.close();
        },

        __showErrorDialog: function (caption, text) {
            if (!this.__errorDialog) {
                this.__errorDialog = new fw.core.qooxdoo.dialogs.ErrorDialog();
                this.__errorDialog.addListener('approved', function (e) {
                    if (this.__failCount > 3) { window.top.location.reload();
                    } else this.__loginDialog.show();
                }, this, false);
            }
            this.__errorDialog.open(caption, text);
        }
    }
});

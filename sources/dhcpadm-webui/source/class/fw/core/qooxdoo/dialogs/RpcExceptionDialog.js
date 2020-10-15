/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.dialogs.RpcExceptionDialog", {
    extend: fw.core.qooxdoo.dialogs.FormBoxDialog,
    construct: function () {
        this.base(arguments, this.tr('Service exception'), fw.core.qooxdoo.res.IconSet.ICON('stdErrorDialog'));
        this.setWidth(580);
        this.setResizable(false);
        this.setEnableEscapeDefaultAction();
        //
        var cap = this.getChildControl("captionbar", false);
        if(cap) { cap.setBackgroundColor('#A23232');}
        //
        this.__initComponents();
    },
    members: {
        __flagExceptionNotAuthorized: false,

        open: function (service, method, exception) {
            this.__flagExceptionNotAuthorized = false;
            //
            var err = this.__parseException(exception);
            if(err.knownErr) {
                this.__fieldExcceptionDetails.setValue(err.msg);
            } else {
                var msg = (service ?  service : '?') + '->' + (method ? method : '?') + "\n-----------------------------------------------------\n" + err.msg;
                this.__fieldExcceptionDetails.setValue(msg);
            }
            //
            this.base(arguments);
        },

        __initComponents: function () {
            this.__fieldExcceptionDetails = new fw.core.qooxdoo.widgets.TextArea().set({minimalLineHeight: 10, readOnly: true, wrap: false}, null);
            this.addField("", this.__fieldExcceptionDetails);
            //
            var buttonClose = this.addButton(new fw.core.qooxdoo.widgets.FormSubmitButton(this.tr('Close'), fw.core.qooxdoo.res.IconSet.ICON('stdCheck'), this, this.__closeWrapper));
            //
            this.setDefaultFocusWidget(buttonClose);
            this.setDialogCloseButton(buttonClose);
        },

        __closeWrapper: function (e) {
            if(this.__flagExceptionNotAuthorized) {
                this.close();
                qx.event.message.Bus.dispatch(new qx.event.message.Message('msg-wp-lock'));
                qx.event.message.Bus.dispatch(new qx.event.message.Message('msg-do-login'));
            } else {
                this.close();
            }
        },

        __parseException: function (exception) {
            var rpcfault = null;
            if (exception.hasOwnProperty("rpcdetails")) {
                rpcfault = exception['rpcdetails'];
            } else if (exception.hasOwnProperty('origin') && exception.hasOwnProperty('code')) {
                rpcfault = exception;
            }
            //
            var msg;
            var knownErr = false;
            if (rpcfault != null) {
                if (rpcfault['origin'] == 2) {
                    switch (parseInt(rpcfault['code'])) {
                        case 1000 :
                            msg = this.tr("Server internal error (see. logs)") + "\n" + rpcfault.message;
                            knownErr = true;
                            break;
                        case 1001 :
                            msg = this.tr("Invalid argument: %1", rpcfault.message);
                            knownErr = true;
                            break;
                        case 1002:
                            msg = this.tr("Already exists: %1", rpcfault.message);
                            knownErr = true;
                            break;
                        case 1003 :
                            msg = this.tr("Not found: %1", rpcfault.message);
                            knownErr = true;
                            break;
                        case 1004:
                            msg = this.tr("Out of date: %1", rpcfault.message);
                            knownErr = true;
                            break;
                        case 1005:
                            knownErr = true;
                            if (rpcfault.message)
                                msg = rpcfault.message;
                            else
                                msg = this.tr("Permission denied");
                            break;
                        case 1006:
                            knownErr = true;
                            this.__flagExceptionNotAuthorized = true;
                            msg = this.tr("Seems your session has been expired (error: #1006).\nIf you want to continue working, please, enter your credentials after closing this dialog.");
                            break;
                        default :
                            msg = "Application error: #" + rpcfault['code'] + " / " + rpcfault['message'];
                    }
                } else if (rpcfault['origin'] == 1) {
                    switch (parseInt(rpcfault['code'])) {
                        case 1:
                            msg = this.tr("Invalid service name: %1", rpcfault.message);
                            knownErr = true;
                            break;
                        case 2:
                            msg = this.tr("Service not found: %1", rpcfault.message);
                            knownErr = true;
                            break;
                        case 3:
                            msg = this.tr("Class not found: %1", rpcfault.message);
                            knownErr = true;
                            break;
                        case 4:
                            msg = this.tr("Method not found: %1", rpcfault.message);
                            knownErr = true;
                            break;
                        case 5:
                            msg = this.tr("Invalid parameter: %1", rpcfault.message);
                            knownErr = true;
                            break;
                        case 6:
                            msg = this.tr("Permission denied (RPC)");
                            knownErr = true;
                            break;
                        default :
                            msg = "Service error: #" + rpcfault['code'] + " / " + rpcfault.message;
                    }
                } else {
                    msg = "Unexpected exception: " +  exception;
                }
            } else {
                msg = "Unexpected exception: " +  exception;
            }
            return {msg: msg, knownErr: knownErr};
        }
    }
});

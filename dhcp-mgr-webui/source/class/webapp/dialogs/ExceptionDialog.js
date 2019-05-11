/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("webapp.dialogs.ExceptionDialog", {
    extend: org.cforge.qooxdoo.ui.dialog.FormDialog,
    construct: function () {
        this.base(arguments, this.tr('Exception'), 'webapp/16x16/errorDialog.png');
        this.setWidth(750);
        //
        this.__initComponents();
    },
    members: {
        //===========================================================================================================================================================
        // Public
        //===========================================================================================================================================================
        open: function (originator, method, exception) {
            this.__fieldClassName.setValue((!originator) ? this.tr("undefined") : originator);
            this.__fieldMethodName.setValue((!method) ? this.tr("undefined") : method);
            this.__fieldErrorMessage.setValue(this.__parseException(exception));
            //
            this.base(arguments);
        },
        //===========================================================================================================================================================
        // Private
        //===========================================================================================================================================================
        __initComponents: function () {
            this.__fieldClassName = new qx.ui.form.TextField().set({required: false, readOnly: true, toolTipText: this.tr("Class or service name")}, null);
            this.__fieldMethodName = new qx.ui.form.TextField().set({required: true, readOnly: true, toolTipText: this.tr("Method name")}, null);
            this.__fieldErrorMessage = new qx.ui.form.TextArea().set({minimalLineHeight: 8, readOnly: true, wrap: false}, null);
            //
            this.addField("", this.__fieldClassName);
            this.addField("", this.__fieldMethodName);
            this.addField("", this.__fieldErrorMessage);
            //
            var buttonClose = this.addButton(new org.cforge.qooxdoo.ui.FormButton(this.tr('Close'), null, this, this.close));
            //
            this.setDefaultFocusWidget(buttonClose);
            this.setDialogCloseButton(buttonClose);
        },
        __parseException: function (exception) {
            var rpcfault = null;
            if (exception.hasOwnProperty("rpcdetails")) {
                rpcfault = exception['rpcdetails'];
            } else if (exception.hasOwnProperty('origin') && exception.hasOwnProperty('code')) {
                rpcfault = exception;
            }
            //
            var msg = "";
            if (rpcfault != null) {
                if (rpcfault['origin'] == 2) {
                    switch (rpcfault['code']) {
                        // wsp 1.x and wspsrv 1.x
                        case 1000 :
                            msg += this.tr("Internal server error (see. logs)") + "\n" + rpcfault.message;
                            break;
                        case 1001 :
                            msg += this.tr("Invalid argument: %1", rpcfault.message);
                            break;
                        case 1002 :
                            msg += this.tr("Invalid property: %1", rpcfault.message);
                            break;
                        case 1003:
                            msg += this.tr("Already exists: %1", rpcfault.message);
                            break;
                        case 1004 :
                            msg += this.tr("Not found: %1", rpcfault.message);
                            break;
                        case 1005:
                            msg += this.tr("Out of date: %1", rpcfault.message);
                            break;
                        case 1006:
                            if (rpcfault.message)
                                msg += rpcfault.message;
                            else
                                msg += this.tr("Permission denied");
                            break;
                        case 1007:
                            if (rpcfault.message)
                                msg += rpcfault.message;
                            else
                                msg += this.tr("Unauthorized access");
                            break;
                            //---------------------------------------------------------
                            // custom application codes
                            //---------------------------------------------------------
                        default :
                            msg += "Rpc fault #2\ncode: " + rpcfault['code'] + "\n" + rpcfault['message'];
                    }
                } else if (rpcfault['origin'] == 1) {
                    msg += "RPC fault #1\n";
                    switch (rpcfault['code']) {
                        case 1:
                            msg += this.tr("Invalid service name: %1", rpcfault.message);
                            break;
                        case 2:
                            msg += this.tr("Service not found: %1", rpcfault.message);
                            break;
                        case 3:
                            msg += this.tr("Class not found: %1", rpcfault.message);
                            break;
                        case 4:
                            msg += this.tr("Method not found: %1", rpcfault.message);
                            break;
                        case 5:
                            msg += this.tr("Invalid parameter: %1", rpcfault.message);
                            break;
                        case 6:
                            msg += this.tr("Permission denied");
                            break;
                        default :
                            msg += "\ncode: " + rpcfault['code'] + "\n" + rpcfault.message;
                    }
                } else if (rpcfault['origin'] == 4) {
                    msg += "Rpc fault #4\ncode: " + rpcfault['code'] + "\n" + rpcfault.message;
                } else {
                    msg += exception;
                }
            } else {
                msg += exception;
            }
            return msg;
        }
    }
});



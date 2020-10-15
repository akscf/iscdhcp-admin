/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.dialogs.MessageBox", {
    type: "singleton",
    extend: qx.core.Object,
    include: [qx.locale.MTranslation],

    members : {
        __questionDlg   : null,
        __exceptionDlg  : null,
        __errorDlg      : null,
        __infoDlg       : null,

        showQuestionDialog: function (titleText, messageText, buttons, handler) {
            if(!this.__questionDlg) {
                this.__questionDlg = new fw.core.qooxdoo.dialogs.QuestionDialog();
                this.__questionDlg.addListener("approved", function (evt) {
                    var callback = evt.getData().userData;
                    if (callback) callback(evt.getData().button);
                }, this, false);
            }
            if(!this.__questionDlg.isVisible()) {
                this.__questionDlg.open(titleText, messageText, buttons, handler);
            } else {
                var d = new fw.core.qooxdoo.dialogs.QuestionDialog();
                d.addListener("approved", function (evt) {
                    var callback = evt.getData().userData;
                    if (callback) callback(evt.getData().button);
                }, this, false);
                d.open(titleText, messageText, buttons, handler);
            }
        },

        showQuestionDialog2: function (titleText, messageText, buttons, handler) {
            if(!this.__questionDlg) {
                this.__questionDlg = new fw.core.qooxdoo.dialogs.QuestionDialog2();
                this.__questionDlg.addListener("approved", function (evt) {
                    var callback = evt.getData().userData;
                    var flag = evt.getData().askFlag;
                    if (callback) callback(evt.getData().button, flag);
                }, this, false);
            }
            if(!this.__questionDlg.isVisible()) {
                this.__questionDlg.open(titleText, messageText, buttons, handler);
            } else {
                var d = new fw.core.qooxdoo.dialogs.QuestionDialog();
                d.addListener("approved", function (evt) {
                    var callback = evt.getData().userData;
                    var flag = evt.getData().askFlag;
                    if (callback) callback(evt.getData().button, flag);
                }, this, false);
                d.open(titleText, messageText, buttons, handler);
            }
        },

        showExceptionDialog: function (service, method, exception) {
            if (!exception) {
                return;
            }
            if(!this.__exceptionDlg) {
                this.__exceptionDlg = new fw.core.qooxdoo.dialogs.RpcExceptionDialog();
            }
            if(!this.__exceptionDlg.isVisible()) {
                this.__exceptionDlg.open(service, method, exception);
            } else {
                new fw.core.qooxdoo.dialogs.RpcExceptionDialog().open(service, method, exception);
            }
        },

        showErrorDialog: function (text) {
            if(!this.__errorDlg) {
                this.__errorDlg = new fw.core.qooxdoo.dialogs.ErrorDialog();
            }
            if(!this.__errorDlg.isVisible()) {
                this.__errorDlg.open(this.tr("Error"), text);
            } else {
                new fw.core.qooxdoo.dialogs.ErrorDialog().open(this.tr("Error"), text);
            }
        },

        showInformationDialog: function (text) {
            if(!this.__infoDlg) {
                this.__infoDlg = new fw.core.qooxdoo.dialogs.InformationDialog();
            }
            if(!this.__infoDlg.isVisible()) {
                this.__infoDlg.open(this.tr("Notice"), text);
            } else {
                new fw.core.qooxdoo.dialogs.InformationDialog().open(this.tr("Notice"), text);
            }
        }
    }
});


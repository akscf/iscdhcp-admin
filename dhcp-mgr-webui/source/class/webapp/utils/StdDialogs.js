/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("webapp.utils.StdDialogs", {
    extend: qx.core.Object,
    construct: function () {
        this.base(arguments);
        this.__initComponents();
    },
    members: {
        //===========================================================================================================================================================================================
        // Public
        //===========================================================================================================================================================================================
        question: function (titleText, messageText, buttons, handler) {
            var dlg = this.__questionDialog;
            if (dlg.isVisible()) {
                dlg = new webapp.dialogs.QuestionDialog(true);
                dlg.addListener("closeApprove", function (evt) {
                    var callback = evt.getData().userData;
                    if (callback)
                        callback(evt.getData().button);
                }, this, false);
            }
            dlg.open(titleText, messageText, buttons, handler);
        },
        exception: function (originator, method, exception) {
            if (exception == null)
                return;
            //
            var dlg = this.__exceptionDialog;
            if (dlg.isVisible()) {
                dlg = new webapp.dialogs.ExceptionDialog();
            }
            dlg.open(originator, method, exception);
        },
        error: function (text) {
            var dlg = this.__errorDialog;
            if (dlg.isVisible()) {
                dlg = new webapp.dialogs.ErrorDialog();
            }
            dlg.open(null, text);
        },
        information: function (text) {
            var dlg = this.__infoDialog;
            if (dlg.isVisible()) {
                dlg = new webapp.dialogs.InformationDialog();
            }
            dlg.open(text);
        },
        //===========================================================================================================================================================================================
        // Private
        //===========================================================================================================================================================================================
        __initComponents: function () {
            this.__infoDialog = new webapp.dialogs.InformationDialog();
            this.__errorDialog = new webapp.dialogs.ErrorDialog();
            this.__exceptionDialog = new webapp.dialogs.ExceptionDialog();
            //
            this.__questionDialog = new webapp.dialogs.QuestionDialog();
            this.__questionDialog.addListener("closeApprove", function (evt) {
                var callback = evt.getData().userData;
                if (callback)
                    callback(evt.getData().button);
            }, this, false);

        }
    }
});


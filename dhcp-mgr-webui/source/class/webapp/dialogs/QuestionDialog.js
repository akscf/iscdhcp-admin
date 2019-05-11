/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("webapp.dialogs.QuestionDialog", {
    extend: org.cforge.qooxdoo.ui.dialog.FormDialog,
    construct: function () {
        this.base(arguments, this.tr("Alert"), "webapp/16x16/questionDialog.png");
        this.setHeight(200);
        //
        this.__initComponents();
    },
    members: {
        __fieldMessage: null,
        __userData: null,
        //===========================================================================================================================================================
        // Public
        //===========================================================================================================================================================
        open: function (captionText, messageText, buttons, userData) {
            this.__userData = userData;
            //
            this.setCaption(captionText ? captionText : this.tr("Alert"));
            this.__fieldMessage.setLabel(messageText);
            //
            this.getButtonContainer().removeAll();
            //
            var lastButton = null;
            if (buttons == null) {
                lastButton = this.addButton(new org.cforge.qooxdoo.ui.FormButton(this.tr('Close'), null, this, this.__onQuestionButtonClick));
                lastButton.button_qd_id = -1;
            } else {
                for (var i = 0; i < buttons.length; i++) {
                    lastButton = this.addButton(new org.cforge.qooxdoo.ui.FormButton(buttons[i], null, this, this.__onQuestionButtonClick));
                    lastButton.button_qd_id = i + 1;
                }
            }
            this.setDefaultFocusWidget(lastButton);
            //
            this.base(arguments);
        },
        //===========================================================================================================================================================
        // Private
        //===========================================================================================================================================================
        __initComponents: function () {
            this.__fieldMessage = new qx.ui.basic.Atom().set({label: "", center: true, rich: true, font: "bold"}, null);
            this.addField(null, this.__fieldMessage);
            //
            this.setDialogCloseButton(null);
        },
        //===========================================================================================================================================================
        // Handlers
        //===========================================================================================================================================================
        __onQuestionButtonClick: function (e) {
            var button = e.getTarget();
            this.closeApprove({button: button.button_qd_id, userData: this.__userData});
        }

    }
});


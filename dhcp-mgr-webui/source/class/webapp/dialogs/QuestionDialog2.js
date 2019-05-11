/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("webapp.dialogs.QuestionDialog2", {
    extend: org.cforge.qooxdoo.ui.dialog.FormDialog,
    statics: {
        createDialog: function (caption, message, buttons, callback) {
            var dlg = new webapp.dialogs.QuestionDialog2();
            dlg.addListener("closeApprove", function (evt) {
                var btid = evt.getData().button;
                var ackf = evt.getData().ackflag;
                if (callback)
                    callback(btid, ackf);
            }, this, false);
            return dlg;
        }
    },
    construct: function (caption, message, buttons) {
        this.base(arguments, (caption ? caption : this.tr("Alert")), "webapp/16x16/questionDialog.png");
        this.setHeight(200);
        //
        this.__fieldMessage = new qx.ui.basic.Atom().set({label: message, center: true, rich: true, font: "bold"}, null);
        this.addField(null, this.__fieldMessage);
        //
        this.getButtonContainer().removeAll();
        this.__fieldNoAck = new qx.ui.form.CheckBox(this.tr("Don't ask again"));
        this.getButtonContainer().add(this.__fieldNoAck);
        this.getButtonContainer().add(new qx.ui.core.Spacer(), {flex: 1});
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
        //
        this.setDialogCloseButton(null);
        this.setDefaultFocusWidget(lastButton);

    },
    events: {
        'noAckFlagChanged': "qx.event.type.Data"
    },
    members: {
        __fieldMessage: null,
        __onQuestionButtonClick: function (e) {
            var button = e.getTarget();
            this.closeApprove({button: button.button_qd_id, ackflag: this.__fieldNoAck.getValue()});
        }
    }
});


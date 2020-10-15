/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.dialogs.ErrorDialog", {
    extend: fw.core.qooxdoo.dialogs.FormBoxDialog,
    construct: function () {
        this.base(arguments, this.tr('Error'), fw.core.qooxdoo.res.IconSet.ICON('stdErrorDialog'));
        this.setHeight(150);
        //this.setResizable(false);
        this.setEnableEscapeDefaultAction();
        //
        var cap = this.getChildControl("captionbar", false);
        if(cap) { cap.setBackgroundColor('#A23232');}
        //
        this.__initComponents();
    },
    members: {

        open: function (title, text) {
            if (title) this.setCaption(title);
            this.__fieldMessage.setLabel('<br>' + text);
            //
            this.base(arguments);
        },

        __initComponents: function () {
            this.__fieldMessage = new qx.ui.basic.Atom().set({center: true, rich: true}, null); // font: 'bold'
            this.addField(null, this.__fieldMessage);
            //
            var buttonClose = this.addButton(new fw.core.qooxdoo.widgets.FormSubmitButton(this.tr('Close'), fw.core.qooxdoo.res.IconSet.ICON('stdCheck'), this, this.closeApprove));
            //
            this.setDefaultFocusWidget(buttonClose);
            this.setDialogCloseButton(buttonClose);
        }
    }
});

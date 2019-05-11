/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("webapp.dialogs.ErrorDialog", {
    extend: org.cforge.qooxdoo.ui.dialog.FormDialog,
    construct: function () {
        this.base(arguments, this.tr('Error'), 'webapp/16x16/errorDialog.png');
        this.setHeight(200);
        //
        this.__initComponents();
    },
    members: {
        //===========================================================================================================================================================
        // Public
        //===========================================================================================================================================================
        open: function (title, text) {
            if (title)
                this.setCaption(title);
            this.__fieldErrorMessage.setLabel(text);
            //
            this.base(arguments);
        },
        //===========================================================================================================================================================
        // Private
        //===========================================================================================================================================================
        __initComponents: function () {
            this.__fieldErrorMessage = new qx.ui.basic.Atom().set({center: true, rich: true, font: 'bold'}, null);
            this.addField(null, this.__fieldErrorMessage);
            //
            var buttonClose = this.addButton(new org.cforge.qooxdoo.ui.FormButton(this.tr('Close'), null, this, this.closeApprove));
            //
            this.setDefaultFocusWidget(buttonClose);
            this.setDialogCloseButton(buttonClose);
        }
    }
});



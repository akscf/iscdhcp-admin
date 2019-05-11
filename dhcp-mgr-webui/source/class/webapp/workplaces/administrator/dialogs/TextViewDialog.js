/**
 *
 * @author: AlexandirK <aks@cforge.org>
 */
qx.Class.define("webapp.workplaces.administrator.dialogs.TextViewDialog", {
    extend: org.cforge.qooxdoo.ui.dialog.StandardDialog,
    construct: function () {
        this.base(arguments);
        this.getContentContainer().setDecorator(null);
        this.setWidth(650);
        this.setHeight(450);
        //
        this.__initComponents();
    },
    members: {
        //===========================================================================================================================================================================================
        // Public
        //===========================================================================================================================================================================================
        open: function (caption, text) {
            this.setCaption(caption);
            this.__fieldTextArea.setValue(text);
            //
            this.base(arguments);
        },
        //===========================================================================================================================================================================================
        // Private
        //===========================================================================================================================================================================================
        __initComponents: function () {
            this.__fieldTextArea = new qx.ui.form.TextArea().set({minimalLineHeight: 12, autoSize: true, wrap: false, readOnly: true, font: 'monospace'}, null);
            this.__fieldTextArea.setNativeContextMenu(true);
            this.addContent(this.__fieldTextArea, {flex: 1});
            //
            var buttonClose = this.addButton(new org.cforge.qooxdoo.ui.FormButton(this.tr('Close'), null, this, this.close));
            //
            this.setDefaultFocusWidget(buttonClose);
            this.setDialogCloseButton(buttonClose);
        }
    }
});

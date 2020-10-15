/**
 *
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("dhcpadm.workplaces.admin.dialogs.JournalRecordViewerDialog", {
        extend:fw.core.qooxdoo.dialogs.SimpleDialog,
        construct:function () {
            this.base(arguments, null);
            this.getContentContainer().setDecorator(null);
            this.setWidth(650);
            this.setHeight(450);
            this.__initComponents();
        },

        members:{
            open: function (caption, text) {
                this.setCaption(caption);
                this.__fieldTextArea.setValue(text);

                this.base(arguments);
            },

            __initComponents:function () {
                this.__fieldTextArea = new fw.core.qooxdoo.widgets.TextArea().set({minimalLineHeight: 12, autoSize: true, wrap: true, readOnly: true, font: 'monospace'}, null);
                this.addContent(this.__fieldTextArea, {flex: 1});
                //
                var buttonClose = this.addButton(new fw.core.qooxdoo.widgets.FormSubmitButton(this.tr('Close'), null, this, this.close));
                //
                this.setDefaultFocusWidget(buttonClose);
                this.setDialogCloseButton(buttonClose);
            }
        }
    }
);

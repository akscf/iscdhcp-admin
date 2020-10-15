/**
 *
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("dhcpadm.workplaces.admin.dialogs.LeaseDetailsDialog", {
        extend:fw.core.qooxdoo.dialogs.SimpleDialog,
        construct:function () {
            this.base(arguments, null);
            this.getContentContainer().setDecorator(null);
            this.setWidth(650);
            this.setHeight(450);
            this.__initComponents();
        },

        members:{
            open: function (selection) {
                var entity = selection.entity;
                this.setCaption(entity.mac);
                //
                var txt = "IP...........: " + entity.ip + "\n"
                    + "Type.........: " + entity.type + "\n"
                    + "MAC..........: " + entity.mac + "\n"
                    + "Name.........: " + (entity.name ? entity.name : "") + "\n"
                    + "State........: " + (entity.state ? entity.state : "")+ "\n"
                    + "Start date...: " + (entity.startTime ? entity.startTime : "") + "\n"
                    + "End date.....: " + (entity.endTime ? entity.endTime : "") + "\n";
                this.__fieldTextArea.setValue(txt);
                //
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


/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("dhcpadm.workplaces.admin.dialogs.LeaseEditDialog", {
        extend:fw.core.qooxdoo.dialogs.FormGridDialog,

        construct:function () {
            this.base(arguments, null);
            this.setWidth(400);
            this.__initComponents();
        },

        members:{
            __row:null,
            __entity:null,

            open:function (selection) {
                this.__row = selection.row;
                this.__entity = fw.core.qooxdoo.commons.EntityHelper.toQooxdoo(selection.entity);
                this.setCaption(this.__entity.getMac());
                //
                this.base(arguments);
                this.clearValidationErros();
                //
                this.__fieldName.setValue(this.__entity.getName());
                this.__fieldIp.setValue(this.__entity.getIp());
                this.__fieldMac.setValue(this.__entity.getMac());
            },

            //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            // private
            //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            __initComponents:function () {
                this.__fieldMac = new qx.ui.form.TextField().set({required:false, readOnly: true}, null);
                this.__fieldIp = new qx.ui.form.TextField().set({required:true}, null);
                this.__fieldName = new qx.ui.form.TextField().set({required:true}, null);
                //
                this.addField(this.tr("MAC address"), this.__fieldMac);
                this.addField(this.tr("IP address"), this.__fieldIp);
                this.addField(this.tr("Host name"), this.__fieldName);
                //
                var buttonSubmit = this.addButton(new fw.core.qooxdoo.widgets.FormSubmitButton(this.tr('Apply'), fw.core.qooxdoo.res.IconSet.ICON('check'), this, this.__doSubmit));
                var buttonCancel = this.addButton(new fw.core.qooxdoo.widgets.FormSubmitButton(this.tr('Cancel'), null, this, this.close));
                //
                this.setDefaultFocusWidget(this.__fieldIp);
                this.setDialogCloseButton(buttonCancel);
            },

            __doSubmit:function (e) {
                try {
                    this.validateForm();
                } catch (exc) {
                    return;
                }
                //
                this.__entity.setName(this.__fieldName.getValue());
                this.__entity.setIp(this.__fieldIp.getValue());
                //
                var self = this;
                dhcpadm.sdk.services.LeasesManagementService.update(this.__entity, function (result, exception) {
                    if (exception) return;
                    self.closeApprove({callback: self.getUserCallback(), data: {row:self.__row, entity:result}});
                });
            }
        }
    }
);

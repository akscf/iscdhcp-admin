/**
 *
 * author: AlexandirK <aks@cforge.org>
 */
qx.Class.define("webapp.workplaces.administrator.dialogs.LeaseEditDialog", {
        extend: org.cforge.qooxdoo.ui.dialog.FormDialog,
        construct:function () {
            this.base(arguments);
            this.__initComponents();
        },

        members:{
            __row:null,
            __entity:null,

            //===========================================================================================================================================================================================
            // Public
            //===========================================================================================================================================================================================
            open:function (selection) {
                this.__row = selection.row;
                this.__entity = org.cforge.wsp.toolkit.EntityConverter.toQooxdoo(selection.entity);
                //
                this.setCaption(this.tr("Editing entry: %1", this.__entity.getMac()));
                this.clearValidation();
                //
                this.__fieldName.setValue(this.__entity.getName());
                this.__fieldIp.setValue(this.__entity.getIp());
                this.__fieldMac.setValue(this.__entity.getMac());
                //
                this.base(arguments);
            },

            //===========================================================================================================================================================================================
            // Private
            //===========================================================================================================================================================================================
            __initComponents:function () {
                this.__fieldName = new qx.ui.form.TextField().set({required:true}, null);
                this.__fieldIp = new qx.ui.form.TextField().set({required:true}, null);
                this.__fieldMac = new qx.ui.form.TextField().set({required:false, readOnly: true}, null);
                //
                this.addField(this.tr("Host name"), this.__fieldName);
                this.addField(this.tr("IP address"), this.__fieldIp);
                this.addField(this.tr("HW address"), this.__fieldMac);
                //
                var buttonUpdate = this.addButton(new org.cforge.qooxdoo.ui.FormButton(this.tr('Apply'), 'webapp/16x16/check2.png', this, this.__doApply));
                var buttonCancel = this.addButton(new org.cforge.qooxdoo.ui.FormButton(this.tr('Cancel'), null, this, this.close));
                //
                this.setDefaultFocusWidget(this.__fieldName);
                this.setDialogCloseButton(buttonCancel);
            },

            //===========================================================================================================================================================================================
            // Commands
            //===========================================================================================================================================================================================
            __doApply:function (e) {
                try {
                    this.validateForm();
                } catch (exc) {
                    return;
                }
                //
                this.__entity.setName(this.__fieldName.getValue());
                this.__entity.setIp(this.__fieldIp.getValue());
                //this.__entity.setMac(this.__fieldMac.getValue());
                //
                var self = this;
                org.cforge.dhcpmgr.services.LeasesManagementService.update(this.__entity, function (result, exception) {
                    self.closeApprove({row:self.__row, entity:result});
                });
            }
        }
    }
);

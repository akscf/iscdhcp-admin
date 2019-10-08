/**
 *
 * @author: AlexandirK <aks@cforge.org>
 */
qx.Class.define("webapp.workplaces.administrator.dialogs.LeaseAddDialog", {
    extend: org.cforge.qooxdoo.ui.dialog.FormDialog,

    construct:function () {
        this.base(arguments, this.tr("Adding a new entry"));
        this.__initComponents();
    },

    members: {
        //===========================================================================================================================================================================================
        // Public
        //===========================================================================================================================================================================================
        open: function () {
            this.__entity = new org.cforge.dhcpmgr.models.LeaseEntry();
            this.__entity.setType('host');
            //
            this.clearValidation();
            //
            this.__fieldName.setValue(null);
            this.__fieldIp.setValue(null);
            this.__fieldMac.setValue(null);
            //
            this.base(arguments);
        },
        //===========================================================================================================================================================================================
        // Private
        //===========================================================================================================================================================================================
        __initComponents: function () {
            this.__fieldName = new qx.ui.form.TextField().set({required:true}, null);
            this.__fieldIp = new qx.ui.form.TextField().set({required:true}, null);
            this.__fieldMac = new qx.ui.form.TextField().set({required:true}, null);
            //
            this.addField(this.tr("Host name"), this.__fieldName);
            this.addField(this.tr("IP address"), this.__fieldIp);
            this.addField(this.tr("HW address"), this.__fieldMac);
            //
            var buttonAdd = this.addButton(new org.cforge.qooxdoo.ui.FormButton(this.tr('Add'), 'webapp/16x16/check2.png', this, this.__doAdd));
            var buttonCancel = this.addButton(new org.cforge.qooxdoo.ui.FormButton(this.tr('Cancel'), null, this, this.close));
            //
            this.setDefaultFocusWidget(this.__fieldName);
            this.setDialogCloseButton(buttonCancel);
        },

        //===========================================================================================================================================================================================
        // Commands
        //===========================================================================================================================================================================================
        __doAdd:function (e) {
            try {
                this.validateForm();
            } catch (exc) {
                return;
            }
            //
            this.__entity.setName(this.__fieldName.getValue());
            this.__entity.setIp(this.__fieldIp.getValue());
            this.__entity.setMac(this.__fieldMac.getValue());
            //
            var self = this;
            org.cforge.dhcpmgr.services.LeasesManagementService.add(this.__entity, function (result, exception) {
                self.closeApprove({row:0, entity:result});
            });
        }
    }
});


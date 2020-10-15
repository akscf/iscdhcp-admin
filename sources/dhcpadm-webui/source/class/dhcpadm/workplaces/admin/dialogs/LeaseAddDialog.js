/**
* Copyright (C) AlexandrinKS
* https://akscf.me/
*/
qx.Class.define("dhcpadm.workplaces.admin.dialogs.LeaseAddDialog", {
        extend:fw.core.qooxdoo.dialogs.FormGridDialog,

        construct:function () {
            this.base(arguments, this.tr("Adding a new (host) lease"));
            this.setWidth(400);
            this.__initComponents();
        },

        members:{
            __entity:null,

            open:function () {
                this.__entity = new dhcpadm.sdk.models.LeaseEntry();
                this.__entity.setType('host');
                //
                this.base(arguments);
                this.clearValidationErros();
                //
                this.__fieldName.setValue(null);
                this.__fieldIp.setValue(null);
                this.__fieldMac.setValue(null);
            },

            //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            // private
            //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            __initComponents:function () {
                this.__fieldMac = new qx.ui.form.TextField().set({required:true, liveUpdate: true,  maxLength: 17}, null);
                this.__fieldIp = new qx.ui.form.TextField().set({required:true}, null);
                this.__fieldName = new qx.ui.form.TextField().set({required:true}, null);
                //
                this.__fieldMac.addListener("input", function (e) {
                    var txt = e.getData();
                    if (!txt) return;
                    this.__fieldMac.setLiveUpdate(false);
                    var len = txt.length;
                    if (len == 2 || len == 5 || len == 8 || len == 11 || len == 14)  {
                        if(txt.charAt(len - 1) != ':') this.__fieldMac.setValue(txt + ":");
                    }
                    this.__fieldMac.setLiveUpdate(true);
                }, this, false);
                //
                this.addField(this.tr("MAC address"), this.__fieldMac);
                this.addField(this.tr("IP address"), this.__fieldIp);
                this.addField(this.tr("Host name"), this.__fieldName);
                //
                var buttonSubmit = this.addButton(new fw.core.qooxdoo.widgets.FormSubmitButton(this.tr('Add'), fw.core.qooxdoo.res.IconSet.ICON('check'), this, this.__doSubmit));
                var buttonCancel = this.addButton(new fw.core.qooxdoo.widgets.FormSubmitButton(this.tr('Cancel'), null, this, this.close));
                //
                this.setDefaultFocusWidget(this.__fieldMac);
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
                this.__entity.setMac(this.__fieldMac.getValue());
                //
                var self = this;
                dhcpadm.sdk.services.LeasesManagementService.add(this.__entity, function (result, exception) {
                    if (exception) return;
                    self.closeApprove({callback: self.getUserCallback(), data: {row:0, entity:result}});
                });
            }
        }
    }
);


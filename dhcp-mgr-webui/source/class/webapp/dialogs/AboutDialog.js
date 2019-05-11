/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("webapp.dialogs.AboutDialog", {
    extend: org.cforge.qooxdoo.ui.dialog.StandardDialog,
    construct: function () {
        this.base(arguments, this.tr("About"));
        this.__initComponents();
    },
    members: {
        //===========================================================================================================================================================================================
        // Public
        //===========================================================================================================================================================================================
        open: function () {
            this.base(arguments);
            this.__doLoad();
        },
        //===========================================================================================================================================================================================
        // Private
        //===========================================================================================================================================================================================
        __initComponents: function () {
            var hbox = new qx.ui.container.Composite(new qx.ui.layout.HBox(4, 'center'));
            hbox.setPadding(4);
            var panelFields = new qx.ui.container.Composite(new qx.ui.layout.VBox(2, 'middle'));
            var panelImage = new qx.ui.container.Composite(new qx.ui.layout.VBox(2, 'middle'));
            hbox.add(panelFields, {flex: 1});
            hbox.add(panelImage, {flex: 1});
            this.getContentContainer().add(hbox, {flex: 1});
            //
            this.__fieldInstanceName = new qx.ui.basic.Label();
            this.__fieldRuntime = new qx.ui.basic.Label().set({rich: true}, null);
            this.__fieldServerVersion = new qx.ui.basic.Label();
            this.__fieldClientVersion = new qx.ui.basic.Label();
            this.__fieldUrl = new qx.ui.basic.Label().set({rich: true, textAlign: 'center'}, null);
            this.__fieldCopyright = new qx.ui.basic.Label().set({rich: true, textAlign: 'center'}, null);
            //
            panelFields.add(this.__fieldInstanceName, null);
            panelFields.add(this.__fieldRuntime, null);
            this.__addSeparator(panelFields);
            panelFields.add(this.__fieldServerVersion, null);
            panelFields.add(this.__fieldClientVersion, null);
            this.__addSeparator(panelFields);
            panelFields.add(this.__centerLabel(this.__fieldCopyright), null);
            panelFields.add(this.__centerLabel(this.__fieldUrl), null);
            //-----------------------------------------
            //panelImage.setBackgroundColor("light-background");
            panelImage.add(new qx.ui.basic.Image("webapp/256x256/about1.png"), {flex: 1});
            //
            var buttonClose = this.addButton(new org.cforge.qooxdoo.ui.FormButton(this.tr('Close'), null, this, this.close));
            // defaults
            this.setDefaultFocusWidget(buttonClose);
            this.setDialogCloseButton(buttonClose);
        },
        //===========================================================================================================================================================================================
        // Commands
        //===========================================================================================================================================================================================
        __doLoad: function () {
            var self = this;
            org.cforge.dhcpmgr.services.SystemInformationService.systemStatus(function (result, exception) {
                if (!result)
                    return;
                //
                var uptm = (result.uptime > 86400 ? ((result.uptime / 86400) | 0) + "d" : result.uptime > 3600 ? ((result.uptime / 3600) | 0) + "h" : result.uptime > 60 ? ((result.uptime / 60) | 0) + "m" : result.uptime + "s");
                //var uptm = result.uptime;
                self.__fieldInstanceName.setValue(result.instanceName + "  (" + uptm + " uptime)" );
                self.__fieldRuntime.setValue('Running on: ' + result.osInfo + ' (' + result.vmInfo + ")");
                //
                self.__fieldServerVersion.setValue(self.tr("Server version: %1", result.productVersion));
                self.__fieldClientVersion.setValue(self.tr("Client version: %1", qx.core.Environment.get("org.cforge.env.app_version")));
                //
                self.__fieldCopyright.setValue(qx.core.Environment.get("org.cforge.env.about_str1"));
                self.__fieldUrl.setValue('<br><br><br><br><br><a href="http://akscf.me/" target="_blank">' + self.tr("Click here for more information about me.") + '</a>');
            });
        },
        //===========================================================================================================================================================================================
        // Commands
        //===========================================================================================================================================================================================
        __centerLabel: function (label) {
            var hbox = new qx.ui.container.Composite(new qx.ui.layout.HBox(1, 'center'));
            hbox.add(label, {flex: 1});
            return hbox;
        },
        __addSeparator: function (widget) {
            var box1 = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({spacing: 1, alignX: 'center'}, null));
            box1.set({decorator: null, height: 6}, null);
            var box2 = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({spacing: 1, alignX: 'center'}, null));
            box2.set({decorator: 'separator-vertical', height: 6}, null);
            //
            widget.add(box1, null);
            widget.add(box2, null);
        }
    }
});


/**
 *
 * author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("webapp.workplaces.administrator.pages.ConfigPage", {
    extend:org.cforge.qooxdoo.ui.TabViewPagev,

    construct:function () {
        this.base(arguments, this.tr('Server'));
        this.__initComponents();
    },

    members:{
        //===========================================================================================================================================================================================
        // Public
        //===========================================================================================================================================================================================
        doSelect:function () {
            this.__doGetServerStatus(null);
            this.__cfgEditor.xdoLoadBuffer();
        },

        //===========================================================================================================================================================================================
        // Private
        //===========================================================================================================================================================================================
        __initComponents:function () {
            var page1 = new qx.ui.container.Composite(new qx.ui.layout.VBox().set({spacing:1, alignX:'center'}, null));
            var toolbar = new org.cforge.qooxdoo.ui.Toolbar();
            this.__buttonStart = toolbar.add(new org.cforge.qooxdoo.ui.ToolbarButton(null, this.tr('Start server'), 'webapp/16x16/media_play.png', this, this.__doServerStart));
            this.__buttonStop = toolbar.add(new org.cforge.qooxdoo.ui.ToolbarButton(null, this.tr('Stop server'), 'webapp/16x16/media_stop_red.png', this, this.__doServerStop));
            this.__buttonReload = toolbar.add(new org.cforge.qooxdoo.ui.ToolbarButton(null, this.tr('Apply a new configuration'), 'webapp/16x16/replace2.png', this, this.__doReloadConfig));
            toolbar.addSeparator();
            this.__buttonRefresh = toolbar.add(new org.cforge.qooxdoo.ui.ToolbarButton(null, this.tr('Refresh state'), 'webapp/16x16/refresh.png', this, this.__doGetServerStatus));
            page1.add(toolbar, {});
            //
            var buttonEditInterfaces = new org.cforge.qooxdoo.ui.FormActionButton(this.tr("Edit interfaces"), 'webapp/16x16/edit.png', this, this.__doShowInterfaceEditDialog);
            buttonEditInterfaces.setEnabled(false);
            //
            var infoPanel = new org.cforge.qooxdoo.ui.form.FormContainer2();
            this.__fieldInterfaces = new qx.ui.form.TextField().set({readOnly:true}, null);
            this.__fieldVersion = new qx.ui.form.TextField().set({readOnly:true}, null);
            this.__fieldPid = new qx.ui.form.TextField().set({readOnly:true}, null);
            this.__fieldState = new qx.ui.form.TextField().set({readOnly:true}, null);
            infoPanel.addField(this.tr("Interfaces"), this.__fieldInterfaces, buttonEditInterfaces);
            infoPanel.addField(this.tr("Version"), this.__fieldVersion);
            infoPanel.addField(this.tr("State"), this.__fieldState);
            infoPanel.addField(this.tr("PID"), this.__fieldPid);
            page1.add(infoPanel, {flex: 1});
            //---------------------------------------------------------------------------------------------------------------------------------
            this.__cfgEditor = new webapp.workplaces.administrator.commons.ConfigEditorWidget();
            //---------------------------------------------------------------------------------------------------------------------------------
            var splitpane = new qx.ui.splitpane.Pane().set({orientation:"vertical", decorator:"main", offset:0}, null);
            splitpane.add(page1, 0);
            splitpane.add(this.__cfgEditor, 1);
            this.add(splitpane, {flex:1});
        },

        //=================================================================================================================================================================================================================
        // Commands
        //=================================================================================================================================================================================================================
        __doShowInterfaceEditDialog:function (e) {
            // todo
        },

        __doGetServerStatus:function (e) {
            var self = this;
            org.cforge.dhcpmgr.services.DhcpServerManagementService.serverGetStatus(function (result, exception) {
                if(!result) {
                    self.__fieldPid.setValue(0);
                    self.__fieldVersion.setValue('unknown');
                    self.__fieldState.setValue('unknown');
                } else {
                    self.__fieldPid.setValue(result.pid);
                    self.__fieldVersion.setValue(result.version);
                    self.__fieldState.setValue(result.state);
                }
            });
            this.__doGetInterfaces(null);
        },

        __doGetInterfaces:function (e) {
            var self = this;
            org.cforge.dhcpmgr.services.DhcpServerManagementService.listenInterfacesGet(function (result, exception) {
                if(!result) {
                    self.__fieldInterfaces.setValue('');
                } else {
                    self.__fieldInterfaces.setValue(result);
                }
            });
        },

        __doServerStart:function (e, confirmed) {
            var self = this;
            if (confirmed) {
                org.cforge.dhcpmgr.services.DhcpServerManagementService.serverStart(function (result, exception) {
                });
            } else {
                qx.core.Init.getApplication().stdDialogs().question(this.tr("Start server"), this.tr("Do you want to continue?"), [this.tr("Yes"), this.tr("No")], function (bid) {
                    if (bid == 1) self.__doServerStart(null, true);
                });
            }
        },

        __doServerStop:function (e, confirmed) {
            var self = this;
            if (confirmed) {
                org.cforge.dhcpmgr.services.DhcpServerManagementService.serverStop(function (result, exception) {
                });
            } else {
                qx.core.Init.getApplication().stdDialogs().question(this.tr("Stop server"), this.tr("Do you want to continue?"), [this.tr("Yes"), this.tr("No")], function (bid) {
                    if (bid == 1) self.__doServerStop(null, true);
                });
            }
        },

        __doReloadConfig:function (e, confirmed) {
            var self = this;
            if (confirmed) {
                org.cforge.dhcpmgr.services.DhcpServerManagementService.serverReload(function (result, exception) {
                });
            } else {
                qx.core.Init.getApplication().stdDialogs().question(this.tr("Reload config"), this.tr("Do you want to continue?"), [this.tr("Yes"), this.tr("No")], function (bid) {
                    if (bid == 1) self.__doReloadConfig(null, true);
                });
            }
        }
    }
});


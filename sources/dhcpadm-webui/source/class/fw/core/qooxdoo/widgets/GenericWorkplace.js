/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.widgets.GenericWorkplace", {
        extend:qx.ui.container.Composite,
        construct:function (wpName) {
            this.base(arguments);
            this.setLayout(new qx.ui.layout.VBox().set({alignX:'center'}, null));
            //
            this.__wlocker = new qx.ui.core.Blocker(this);
            this.__wlocker.setColor("#D5D5D5");
            this.__wlocker.setOpacity(0.5);
            //
            var toolbar = new qx.ui.toolbar.ToolBar().set({spacing:7}, null);
            toolbar.set({maxHeight: 27, minHeight: 27, height: 27});
            this.__tbp0 = new qx.ui.toolbar.Part();
            this.__tbp1 = new qx.ui.toolbar.Part();
            toolbar.add(this.__tbp0);
            toolbar.addSpacer();
            toolbar.add(this.__tbp1);
            this.add(toolbar, null);
            //
            var appMenu = new qx.ui.menu.Menu();
            var appMenuButton = new qx.ui.toolbar.MenuButton(null, fw.core.qooxdoo.res.IconSet.ICON('stdAppMenu'), appMenu);
            appMenuButton.set({maxHeight: 20, minHeight: 20, height: 20, showArrow: false, toolTipText: this.tr('Settings')}, null);
            appMenuButton.addListener("execute", function (e) { appMenuButton.open(); }, this, false);
            this.__tbp1.add(appMenuButton, null);
            //
            var aboutMenuButton = new qx.ui.menu.Button(this.tr('About'), null);
            aboutMenuButton.addListener("execute", function (e) {
                qx.event.message.Bus.dispatch(new qx.event.message.Message('msg-dlg-about-show', null));
            }, this, false);
            appMenu.add(aboutMenuButton, null);
            appMenu.addSeparator();
            //
            var logoutMenuButton = new qx.ui.menu.Button(this.tr('Logout'), null);
            logoutMenuButton.addListener("execute", function (e) {
                qx.event.message.Bus.dispatch(new qx.event.message.Message('msg-do-logout'));
            }, this, false);
            appMenu.addSeparator();
            appMenu.add(logoutMenuButton, null);
        },

        members:{
            __wlocker:null,

            wpLock:function (v) {
                if (v) {
                    if (!this.__wlocker.isBlocked()) this.__wlocker.block();
                } else {
                    if (this.__wlocker.isBlocked()) this.__wlocker.unblock();
                }
            },

            clean:function () {
            },

            setup:function () {
            },

            toolbarAdd: function(e, opt) {
                this.__tbp0.add(e, opt);
            },

            toolbarAddSeparator: function() {
                this.__tbp0.addSeparator();
            }
        }
    }
);

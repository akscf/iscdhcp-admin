/**
 *
 * author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("org.cforge.qooxdoo.ui.workplace.GenericWorkplace",
    {
        extend:qx.ui.container.Composite,

        construct:function (wpid) {
            this.base(arguments);
            this.setLayout(new qx.ui.layout.VBox().set({spacing:1, alignX:'center'}, null));
            // blocker
            this.__blocker = new qx.ui.core.Blocker(this);
            this.__blocker.setColor("#D5D5D5");
            this.__blocker.setOpacity(0.5);
            //------------------------------------------------------------------------------------
            // toolbar
            var toolbar = new qx.ui.toolbar.ToolBar().set({spacing:7}, null);
            toolbar.set({maxHeight: 27, minHeight: 27, height: 27});
            this.add(toolbar, null);
            //------------------------------------------------------------------------------------
            // userinfo
            this.__userInfo = new qx.ui.basic.Atom("", null).set({font:'bold'}, null);
            toolbar.addSpacer();
            toolbar.add(this.__userInfo);
            toolbar.addSpacer();

            //------------------------------------------------------------------------------------
            var appMenu = new qx.ui.menu.Menu();
            var appMenuButton = new qx.ui.toolbar.MenuButton("", 'webapp/16x16/numpad.png', appMenu);
            appMenuButton.set({maxHeight: 17, minHeight: 17, height: 17, toolTipText: this.tr('Application settings')}, null);
            appMenuButton.addListener("execute", function (e) {
                appMenuButton.open();
            }, this, false);
            toolbar.add(appMenuButton);
            //------------------------------------------------------------------------------------
            var workplaceMenu = qx.core.Init.getApplication().workplaceManager().fillMenu(new qx.ui.menu.Menu(), wpid);
            this.__workplaceSelectMenuButton = new qx.ui.menu.Button(this.tr('Workplace'), 'webapp/16x16/workplaceDialog.png', null, workplaceMenu);
            appMenu.add(this.__workplaceSelectMenuButton, null);

            //------------------------------------------------------------------------------------
            var lanuageMenu = qx.core.Init.getApplication().languageManager().fillMenu(new qx.ui.menu.Menu());
            this.__languageSelectMenuButton = new qx.ui.menu.Button(this.tr('Language'), 'webapp/16x16/languageDialog.png', null, lanuageMenu);
            appMenu.add(this.__languageSelectMenuButton, null);

            //------------------------------------------------------------------------------------
            var themeMenu = qx.core.Init.getApplication().themeManager().fillMenu(new qx.ui.menu.Menu());
            this.__themeSelectMenuButton = new qx.ui.menu.Button(this.tr('Theme'), 'webapp/16x16/themeDialog.png', null, themeMenu);
            appMenu.add(this.__themeSelectMenuButton, null);

            //------------------------------------------------------------------------------------
            appMenu.addSeparator();
            var aboutMenuButton = new qx.ui.menu.Button(this.tr('About'), 'webapp/16x16/about.png');
            aboutMenuButton.addListener("execute", function (e) {
                if (!this.__aboutDialog) {
                    this.__aboutDialog = new webapp.dialogs.AboutDialog();
                }
                this.__aboutDialog.open();
            }, this, false);
            appMenu.add(aboutMenuButton, null);

            //------------------------------------------------------------------------------------
            var logoutMenuButton = new qx.ui.menu.Button(this.tr('Logout'), 'webapp/16x16/logout.png');
            logoutMenuButton.addListener("execute", function (e) {
                qx.event.message.Bus.dispatch(new qx.event.message.Message('wc-logout'));
            }, this, false);
            appMenu.addSeparator();
            appMenu.add(logoutMenuButton, null);
        },

        members:{
            __blocker:null,

            //===========================================================================================================================================================================================
            // API
            //===========================================================================================================================================================================================
            clenup:function () {
            },

            // called from wpmanager after create widget
            setup:function () {
                var session = qx.core.Init.getApplication().sessionManager().getSession();
                if (!session) return;
                //
                var allowChangwWP = (session.properties && session.properties['allow_change_wp'] == true);
                //
                this.__userInfo.setLabel(session.properties['title'] ? session.properties['title'] : "notitle");
                this.__workplaceSelectMenuButton.setEnabled(allowChangwWP);
                this.__languageSelectMenuButton.setEnabled(true);
                this.__themeSelectMenuButton.setEnabled(true);
            },

            lockWorkplace:function (flag) {
                if (flag) {
                    if (!this.__blocker.isBlocked()) this.__blocker.block();
                } else {
                    if (this.__blocker.isBlocked()) this.__blocker.unblock();
                }
            }
        }
    }
);


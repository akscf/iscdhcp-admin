/**
 *
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("dhcpadm.workplaces.admin.pages.DhcpManagementPage", {
        extend:qx.ui.container.Composite,
        construct:function () {
            this.base(arguments);
            this.setLayout(new qx.ui.layout.VBox().set({spacing:1, alignX:'center'}, null));
            this.__initComponents();
        },

        members:{

            doSelect:function () {
                this.__leases.performDefaultAction();
            },

            //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            // private
            //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            __initComponents:function () {
                var tv = new fw.core.qooxdoo.widgets.TabView('top', false, true);
                tv.add(this.__leasesPage());
                tv.add(this.__configPage());
                tv.add(this.__jornalPage());
                this.add(tv, {flex: 1});
            },

            __leasesPage: function() {
                this.__leases = new dhcpadm.workplaces.admin.commons.LeasesMgmtWidget();
                var page = new fw.core.qooxdoo.widgets.TabviewPage(this.tr("Leases"), function(d){
                    this.__leases.performDefaultAction();
                });
                page.setLayout(new qx.ui.layout.VBox().set({spacing:1, alignX:'center'}, null));
                page.add(this.__leases, {flex:1});
                //
                return page;
            },

            __configPage: function() {
                var config = new dhcpadm.workplaces.admin.commons.ConfigEditorWidget();
                var page = new fw.core.qooxdoo.widgets.TabviewPage(this.tr("Config"), function(d){
                    config.performDefaultAction();
                });
                page.setLayout(new qx.ui.layout.VBox().set({spacing:1, alignX:'center'}, null));
                page.add(config, {flex:1});
                return page;
            },

            __jornalPage: function() {
                var log = new dhcpadm.workplaces.admin.commons.JournalViewerWidget(1000);
                var page = new fw.core.qooxdoo.widgets.TabviewPage(this.tr("Journal"), function(d){
                    log.performDefaultAction();
                });
                page.setLayout(new qx.ui.layout.VBox().set({spacing:1, alignX:'center'}, null));
                page.add(log, {flex:1});
                return page;
            }
        }
    }
);

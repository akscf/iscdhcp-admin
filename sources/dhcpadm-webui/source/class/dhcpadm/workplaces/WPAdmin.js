/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("dhcpadm.workplaces.WPAdmin", {
    extend: qx.ui.container.Composite,
    construct: function () {
        this.base(arguments);
        this.setLayout(new qx.ui.layout.VBox().set({alignX:'center'}, null));
        this.__wlocker = new qx.ui.core.Blocker(this);
        this.__wlocker.setColor("#D5D5D5");
        this.__wlocker.setOpacity(0.5);
        //
        this.__initComponents();
    },
    members: {
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
        doSelect: function () {
        },

        // --------------------------------------------------------------------------------------------------------------------------------------------------------
        // private
        // --------------------------------------------------------------------------------------------------------------------------------------------------------
        __initComponents: function () {
            var lpanel = new fw.core.qooxdoo.widgets.VToolPanelB();
            lpanel.addPage("DHCP", fw.core.qooxdoo.res.IconSet.ICON('server48'),
                new dhcpadm.workplaces.admin.pages.DhcpManagementPage()
            );
            lpanel.addLatest(this.tr("Logout"), fw.core.qooxdoo.res.IconSet.ICON('logout48'), this, function (e) {
                this.__wlocker.block();
                qx.event.message.Bus.dispatch(new qx.event.message.Message('msg-do-logout'));
            });
            this.add(lpanel, {flex: 1});
        }
    }
});

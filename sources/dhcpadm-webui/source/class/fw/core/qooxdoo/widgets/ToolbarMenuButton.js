/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.widgets.ToolbarMenuButton", {
        extend:qx.ui.toolbar.MenuButton,

        construct:function (tooltipText, icon, menu) {
            this.base(arguments, null, icon);
            this.setShowArrow(false);
            if(tooltipText)
                this.setToolTipText(tooltipText);

            if(menu) {
                this.setMenu(menu);
                this.addListener("execute", function (e) { menu.open(); }, this, false);
            }
        },

        members:{

        }
    }
);


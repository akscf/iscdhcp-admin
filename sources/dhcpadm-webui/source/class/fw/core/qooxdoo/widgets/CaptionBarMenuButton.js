/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.widgets.CaptionBarMenuButton", {
        extend:qx.ui.toolbar.MenuButton,

        construct:function (toolTipText, icon, menu) {
            this.base(arguments, null, icon);
            this.setToolTipText((toolTipText ? toolTipText : null));
            if(menu) {
                this.setMenu(menu);
                this.addListener("execute", function (e) { menu.open(); }, this, false);
            }
        },

        properties:{
            appearance:{
                refine: true,
                init: "window-captionbar-menubutton"
            }
        },
        members:{

        }
    }
);


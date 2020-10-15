/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.widgets.ToolbarButton", {
        extend:qx.ui.toolbar.Button,

        construct:function (text, icon, context, handler) {
            this.base(arguments, null, icon);
            if(text) {
                this.setToolTipText(text);
            }
            if(handler) {
                this.addListener("execute", handler, context, false);
            }
        },

        members:{

        }
    }
);

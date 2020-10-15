/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.widgets.MenuButton",
    {
        extend:qx.ui.menu.Button,

        construct:function (label, icon, context, handler) {
            this.base(arguments, label, icon);
            if(handler) {
                this.addListener("execute", handler, context, false);
            }
        },
        members:{

        }
    }
);


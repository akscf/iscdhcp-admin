/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.widgets.HBox",
    {
        extend:qx.ui.container.Composite,

        construct:function () {
            this.base(arguments, new qx.ui.layout.HBox().set({spacing:0, alignY:'middle'}, null));
        },

        members:{

        }
    }
);


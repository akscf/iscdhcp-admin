/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.widgets.VBox",
    {
        extend:qx.ui.container.Composite,

        construct:function () {
            this.base(arguments, new qx.ui.layout.VBox().set({spacing:0, alignX:'center'}, null));
        },

        members:{

        }
    }
);


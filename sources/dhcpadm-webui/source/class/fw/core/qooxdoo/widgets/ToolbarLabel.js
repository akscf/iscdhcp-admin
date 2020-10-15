/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.widgets.ToolbarLabel", {
        extend:qx.ui.basic.Label,

        construct:function (value) {
            this.base(arguments, value);
            this.setAlignY('middle');
            this.setMaxHeight(20);
            this.setHeight(20);
        },

        members:{

        }
    }
);



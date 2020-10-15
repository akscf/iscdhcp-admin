/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.widgets.TextField", {
        extend:qx.ui.form.TextField,

        construct:function (value) {
            this.base(arguments, value);
            this.setNativeContextMenu(true);
        },

        members:{

        }
    }
);


/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.widgets.TextArea", {
        extend:qx.ui.form.TextArea,

        construct:function (value) {
            this.base(arguments, value);
            this.setNativeContextMenu(true);
        },

        members:{

        }
    }
);


/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.widgets.ToolbarTextField", {
        extend:qx.ui.form.TextField,

        construct:function (placeholder, context, handler) {
            this.base(arguments);
            this.setAlignY('middle');
            this.setNativeContextMenu(true);
            this.setMaxHeight(20);
            this.setHeight(20);

            if (placeholder) {
                this.setPlaceholder(placeholder);
            }

            if (handler) {
                this.addListener("keyup", function (e) {
                    if (e.getKeyIdentifier() == 'Enter') handler.call(context);
                }, context, false);
            }
        },

        members:{

        }
    }
);


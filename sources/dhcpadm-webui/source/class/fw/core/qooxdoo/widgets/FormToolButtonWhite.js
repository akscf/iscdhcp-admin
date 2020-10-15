/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.widgets.FormToolButtonWhite", {
        extend:fw.core.qooxdoo.widgets.TableStatusBarButton,
        construct:function (tooltip, icon, context, handler) {
            this.base(arguments, null, icon);
            this.setMaxWidth(32);
            this.setMaxHeight(32);
            //
            if(tooltip) {
                this.setToolTipText(tooltip);
            }
            if(handler) {
                this.addListener("execute", handler, context, false);
            }
        },

        members:{

        }
    }
);


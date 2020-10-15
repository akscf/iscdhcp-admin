/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.widgets.FormSubmitButton",
    {
        extend:qx.ui.form.Button,

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

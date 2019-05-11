/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("org.cforge.qooxdoo.ui.FormButton",
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

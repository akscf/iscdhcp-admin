/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("org.cforge.qooxdoo.ui.FormActionButton",
    {
        extend:qx.ui.form.Button,

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


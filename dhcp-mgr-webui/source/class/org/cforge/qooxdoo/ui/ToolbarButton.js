/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("org.cforge.qooxdoo.ui.ToolbarButton",
    {
        extend:qx.ui.toolbar.Button,

        construct:function (label, tooltip, icon, context, handler) {
            this.base(arguments, label, icon);
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


/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("org.cforge.qooxdoo.ui.MenuButton",
    {
        extend:qx.ui.menu.Button,

        construct:function (label, icon, context, handler) {
            this.base(arguments, label, icon);
            //
            if(handler) {
                this.addListener("execute", handler, context, false);
            }
        },
        members:{

        }
    }
);


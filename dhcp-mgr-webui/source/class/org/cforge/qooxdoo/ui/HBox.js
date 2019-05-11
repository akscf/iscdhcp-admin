/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("org.cforge.qooxdoo.ui.HBox",
    {
        extend:qx.ui.container.Composite,

        construct:function () {
            this.base(arguments, new qx.ui.layout.HBox().set({spacing:1, alignY:'middle'}, null));
        },

        members:{

        }
    }
);


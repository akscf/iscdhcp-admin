/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("org.cforge.qooxdoo.ui.VBox",
    {
        extend:qx.ui.container.Composite,

        construct:function () {
            this.base(arguments, new qx.ui.layout.VBox().set({spacing:1, alignX:'center'}, null));
        },

        members:{

        }
    }
);


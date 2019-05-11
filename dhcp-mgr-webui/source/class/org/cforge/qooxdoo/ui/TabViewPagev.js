/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("org.cforge.qooxdoo.ui.TabViewPagev",
    {
        extend:qx.ui.tabview.Page,

        construct:function (name) {
            this.base(arguments, name);
            this.setLayout(new qx.ui.layout.VBox().set({spacing:1, alignX:'center'}, null));
        },

        members:{

        }
    }
);


/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("org.cforge.qooxdoo.ui.TabViewPageh",
    {
        extend:qx.ui.tabview.Page,

        construct:function (name) {
            this.base(arguments, name);
            this.setLayout(new qx.ui.layout.HBox().set({spacing:1, alignY:'middle'}, null));
        },

        members:{

        }
    }
);


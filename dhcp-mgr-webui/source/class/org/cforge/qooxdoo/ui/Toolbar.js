/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("org.cforge.qooxdoo.ui.Toolbar",
    {
        extend:qx.ui.toolbar.ToolBar,

        construct:function () {
            this.base(arguments);
            //
            this.setSpacing(7);
            this.setShow('icon');
        },

        members:{

            addFlex:function (widget) {
                this._add(widget, {flex:1});
                return widget;
            },

            add:function (widget, opts) {
                this._add(widget, opts);
                return widget;
            }

        }
    }
);


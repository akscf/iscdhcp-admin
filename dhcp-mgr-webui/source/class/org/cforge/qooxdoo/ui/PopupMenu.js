/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("org.cforge.qooxdoo.ui.PopupMenu",
    {
        extend: qx.ui.menu.Menu,

        construct:function () {
            this.base(arguments);
            //
            this.setMinWidth(150);
        },

        members:{

            add:function (widget, opts) {
                this._add(widget, opts);
                return widget;
            }

        }
    }
);



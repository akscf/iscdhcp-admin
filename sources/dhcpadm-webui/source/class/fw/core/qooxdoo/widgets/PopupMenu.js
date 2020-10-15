/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.widgets.PopupMenu", {
        extend: qx.ui.menu.Menu,
        construct:function () {
            this.base(arguments);
            this.setMinWidth(150);
        },
        members:{
            add:function (widget, opts) {
                this._add(widget, opts);
                return widget;
            },

            addButton: function(text, icon, self, handler) {
                var button = new fw.core.qooxdoo.widgets.MenuButton(text, icon, self, handler);
                this._add(button, null);
                return button;
            }

        }
    }
);

/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.widgets.Menu", {
        extend:qx.ui.menu.Menu,

        construct:function () {
            this.base(arguments);
        },

        members:{

            addButton: function(text, icon, self, handler) {
                var button = new fw.core.qooxdoo.widgets.MenuButton(text, icon, self, handler);
                this.add(button, null);
                return button;
            }
        }
    }
);


/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.widgets.Toolbar", {
        extend:fw.core.qooxdoo.widgets.XToolbar,

        construct:function (orientation, gradient) {
            this.base(arguments, orientation);
            this.setSpacing(7);
            this.setShow('icon');

            if(gradient) {
                if(gradient == 'l2r') {
                    this.setDecorator('gradient-toolbar-l2r');
                } else {
                    this.setDecorator('gradient-toolbar-r2l');
                }
            }
        },

        members:{
            addFlex:function (widget) {
                this._add(widget, {flex:1});
                return widget;
            },

            add:function (widget, opts) {
                this._add(widget, opts);
                return widget;
            },

            addButton: function(tooltipText, icon, self, handler) {
               var button = new fw.core.qooxdoo.widgets.ToolbarButton(tooltipText, icon, self, handler);
                this._add(button);
                return button;
            },

            addMenu: function(tooltipText, icon) {
                var menu = new fw.core.qooxdoo.widgets.Menu();
                var button = new fw.core.qooxdoo.widgets.ToolbarMenuButton(tooltipText, icon, menu);
                this._add(button);
                return button;
            }
        }
    }
);

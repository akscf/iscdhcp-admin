/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.widgets.WindowStatusBarSplitButton", {
        extend:fw.core.qooxdoo.widgets.ToolbarSplitButton,

        construct:function (tooltipText, icon, context, handler) {
            this.base(arguments, null, icon);
            this._getLayout().setSpacing(0);

            if(tooltipText)
                this.setToolTipText(tooltipText);

            if(handler) {
                this.addListener("execute", handler, context, false);
            }
            this.__menu = new qx.ui.menu.Menu();
            this.setMenu(this.__menu);
        },

        properties :
        {
            appearance : {
                refine : true,
                init : "window-statusbar-splitbutton"
            }
        },

        members:{
            __menu: null,

            getMenu: function(item, args) {
                return this.__menu;
            },

            menuAdd: function(item, args) {
                this.__menu.add(item, args);
            },

            menuAddSeparator: function() {
                this.__menu.addSeparator();
            }
        }
    }
);

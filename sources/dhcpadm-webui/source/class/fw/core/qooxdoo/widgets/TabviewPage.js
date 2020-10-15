/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.widgets.TabviewPage", {
        extend:qx.ui.tabview.Page,

        construct:function (label, onFirstSelectedCallback) {
            this.base(arguments, label);
            this.__firstSelectedCallback = onFirstSelectedCallback;
        },

        members:{
            __neverSelected: 1,
            __firstSelectedCallback: null,

            doSelect: function(userData) {
                if(this.__firstSelectedCallback) {
                    this.__firstSelectedCallback(userData);
                }
            }
        }
    }
);


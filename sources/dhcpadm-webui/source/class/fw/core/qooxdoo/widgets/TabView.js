/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.widgets.TabView", {
        extend:qx.ui.tabview.TabView,

        construct:function (barPosition, flexiblyBorder, enableOnFirstSelectedCallback) {
            this.base(arguments, barPosition);
            this.__ffb = flexiblyBorder;
            //
            if(enableOnFirstSelectedCallback) {
                this.addListener('changeSelection', function (e) {
                    var sel = e.getData();
                    var page = sel ? sel[0] : null;
                    if (page && page.__neverSelected == 1)  {
                        page.__neverSelected = 0;
                        try { page.doSelect(); }
                        catch (exc) { }
                    }
                }, this, false);
            }
            this.addListenerOnce("appear", function () {
                if(this.__ffb) {
                    var pane = this.getChildControl("pane", false);
                    if(pane) {
                        this.__pdold = pane.getDecorator();
                        pane.setDecorator(null);
                    } else {
                        this. __ffb = false;
                    }
                }
            }, this, null);
        },

        members:{
            __ffb: false,
            __pdold: null, // tabview-pane
            __pcount: 0,

            add : function(page) {
                if(this.__ffb) {
                    if(this.__pcount == 0) {
                        var pane = this.getChildControl("pane", false);
                        pane.setDecorator(this.__pdold);
                    }
                    this.__pcount++;
                }
                arguments.callee.base.apply(this, arguments);
            },

            addAt : function(page, index) {
                if(this.__ffb) {
                    if(this.__pcount == 0) {
                        var pane = this.getChildControl("pane", false);
                        pane.setDecorator(this.__pdold);
                    }
                    this.__pcount++;
                }
                arguments.callee.base.apply(this, arguments);
            },

            remove : function(page) {
                if(this.__ffb) {
                    this.__pcount--;
                    if(this.__pcount <= 0) {
                        var pane = this.getChildControl("pane", false);
                        pane.setDecorator(null);
                        this.__pcount = 0;
                    }
                }
                arguments.callee.base.apply(this, arguments);
            }
        }
    }
);


/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.widgets.VToolPanelB", {
        extend:qx.ui.container.Composite,
        construct:function () {
            this.base(arguments);
            this.setLayout(new qx.ui.layout.Grow());
            //
            this.__emptyPage = new qx.ui.container.Composite(new qx.ui.layout.VBox().set({alignX:'center'}, null));
            var container2 = new qx.ui.container.Composite(new qx.ui.layout.HBox());
            container2.setDecorator('separator-horizontal-right');
            //
            this.__toolbar = new fw.core.qooxdoo.widgets.Toolbar('vertical').set({spacing:7, show: 'icon'}, null);
            container2.add(this.__toolbar, null);
            //
            this.__contentArea = new qx.ui.container.Stack();
            this.__contentArea.set({decorator:null});
            this.__contentArea.add(this.__emptyPage);
            container2.add(this.__contentArea,{flex: 1});
            //
            this.add(container2, {flex:1});
        },

        members:{
            __hasSpacer: false,
            __selectedItem:null,
            __emptyPage: null,
            __contentArea:null,
            __oldBg: null,

            doSelect:function () {
                if (this.__selectedItem) {
                    var page = this.__selectedItem.__xx_wg;
                    this.__doSelect(page);
                }
            },

            addPage:function (text, icon, widget) {
                var tb = new fw.core.qooxdoo.widgets.ToolbarButton(text, icon, this,  this.__onButtonClick);
                tb.__xx_wg = widget;
                this.__toolbar.add(tb);
                if (widget) {
                    this.__contentArea.add(widget);
                }
                if(!this.__selectedItem) {
                    tb.execute();
                }
                return widget;
            },

            addLatest: function (text, icon, self, handler) {
                if(!this.__hasSpacer) {
                    this.__toolbar.addSpacer();
                    this.__hasSpacer = true;
                }
                var but = new fw.core.qooxdoo.widgets.ToolbarButton(text, icon, self, handler);
                this.__toolbar.add(but)
                return but;
            },

            addSpacer: function () {
                this.__toolbar.addSpacer();
            },

            addSeparator: function () {
                this.__toolbar.addSeparator();
            },

            getSelectedItem:function () {
                return this.__selectedItem;
            },

            //===========================================================================================================================================================================================
            __onButtonClick:function (e) {
                var t = e.getTarget();
                if(this.__selectedItem) {
                    this.__selectedItem.setBackgroundColor(this.__oldBg);
                }
                this.__selectedItem = t;
                this.__oldBg = this.__selectedItem.getBackgroundColor();
                this.__selectedItem.setBackgroundColor('#8fbbff'); // #56abe4
                var page = this.__selectedItem.__xx_wg;
                //
                if (page) {
                    this.__contentArea.setSelection([page]);
                    this.__doSelect(page);
                } else {
                    this.__contentArea.setSelection([this.__emptyPage]);
                }
            },

            __doSelect:function (page) {
                if (page && !page.xxx_fsel) {
                    try {
                        page.xxx_fsel = true;
                        page.doSelect()
                    } catch (exc) {
                    }
                }
            }
        }
    }
);

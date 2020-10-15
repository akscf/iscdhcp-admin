/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.widgets.VToolPanelA", {
        extend:qx.ui.container.Composite,
        construct:function (limitHWMax) {
            this.base(arguments);
            this.setLayout(new qx.ui.layout.Grow());
            //
            this.__emptyPage = new qx.ui.container.Composite(new qx.ui.layout.VBox().set({alignX:'center'}, null));
            //
            this.__itemListWG = new qx.ui.form.List();
            this.__itemListWG.setBackgroundColor('background-light');
            this.__itemListWG.set({width:this.__ICONAREA_SIZE, selectionMode:"single", decorator:null});
            this.__itemListWG.addListener("changeSelection", this.__onSelectionChange, this);
            this.__itemListWG.__size = this.__ICONAREA_SIZE;
            this.__iconPanel = new qx.ui.container.Composite(new qx.ui.layout.VBox().set({alignX:'center'}, null));
            this.__iconPanel.add(this.__itemListWG, {flex:1});
            //
            if(limitHWMax) {
                this.__itemListWG.setMaxWidth(this.__ICONAREA_SIZE);
                this.__iconPanel.setMaxWidth(this.__ICONAREA_SIZE);
            }
            //
            this.__contentArea = new qx.ui.container.Stack();
            this.__contentArea.set({decorator:null});
            this.__contentArea.add(this.__emptyPage);
            var _page2 = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({alignX:'center'}, null));
            _page2.add(this.__contentArea, {flex:1});
            //
            var workareaPanel = new qx.ui.container.Composite(new qx.ui.layout.VBox().set({alignX:'center'}, null));
            workareaPanel.add(_page2, {flex:1});
            //
            var splitpane = new qx.ui.splitpane.Pane().set({orientation:"horizontal", decorator:null, offset:0}, null);
            splitpane.getBlocker().addListener("dbltap", function (e) {
                var size = this.__iconPanel.getWidth();
                if(size == null) size = this.__itemListWG.getWidth();
                if(size != 0) this.__itemListWG.__size = size;
                this.__iconPanel.setWidth((size > 0 ? 0 : this.__itemListWG.__size));
                this.__itemListWG.setWidth(this.__iconPanel.getWidth());
            }, this, false);
            //
            splitpane.add(this.__iconPanel, 0);
            splitpane.add(workareaPanel, 1);
            //
            this.add(splitpane, {flex:1});
        },

        members:{
            __ICONAREA_SIZE : 75,
            __iconPanel     : null,
            __emptyPage     : null,
            __selectedItem  : null,
            __itemListWG    : null,
            __contentArea   : null,

            doSelect:function () {
                if (this.__selectedItem) {
                    var page = this.__selectedItem.getModel();
                    this.__doSelect(page);
                }
            },

            addPage:function (label, icon, widget) {
                var item = new qx.ui.form.ListItem().set({gap:3, center:true, icon: icon, toolTipText: label, iconPosition:"top", model: widget}, null);
                this.__itemListWG.add(item);
                if (widget) this.__contentArea.add(widget);
                //
                if (!this.__selectedItem) {
                    this.__itemListWG.setSelection([item])
                }
                return widget;
            },

            addLatest: function (text, icon, self, handler) {
                var but = new fw.core.qooxdoo.widgets.FormSubmitButton(null, icon, self, handler);
                if(text) but.setToolTipText(text);
                this.__iconPanel.add(but)
                return but;
            },

            addSpacer: function () {
            },

            addSeparator: function () {
            },

            getSelectedItem:function () {
                return this.__selectedItem;
            },

            //===========================================================================================================================================================================================
            __onSelectionChange:function (e) {
                var selections = e.getData();
                if (!selections || !selections.length) return;
                //
                this.__selectedItem = selections[0];
                var page = this.__selectedItem.getModel();
                //
                if (page) {
                    this.__contentArea.setSelection([page]);
                    var model = this.__selectedItem.getModel();
                    this.__doSelect(model);
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

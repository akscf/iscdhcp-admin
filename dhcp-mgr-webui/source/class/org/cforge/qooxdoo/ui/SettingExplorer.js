/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("org.cforge.qooxdoo.ui.SettingExplorer",
    {
        extend:qx.ui.container.Composite,

        construct:function (position) {
            this.base(arguments);
            this.setLayout(new qx.ui.layout.Grow());
            //
            this.__position = (position ? position : 1);
            //
            this.__initComponents();
        },

        members:{
            __ICONAREA_SIZE:160,
            __position:1,
            __selectedItem:null,
            __emptyPage:null,
            __settingTitle:null,
            __settingList:null,
            __contentArea:null,

            //===========================================================================================================================================================================================
            // Public
            //===========================================================================================================================================================================================
            doSelect:function () {
                if (this.__selectedItem) {
                    var model = this.__selectedItem.getModel();
                    this._doModelFirstTimeSelection(model);
                }
            },

            addPage:function (label, icon, widget) {
                var item = new qx.ui.form.ListItem(label, icon).set({gap:3, center:true, iconPosition:"top"}, null);
                item.setModel(widget);
                // add to stack and list
                this.__settingList.add(item);
                if (widget) this.__contentArea.add(widget);
                //
                if (this.__selectedItem == null) {
                    this.__settingList.setSelection([item])
                }
                return item;
            },

            getSelecteItem:function () {
                return this.__selectedItem;
            },

            //===========================================================================================================================================================================================
            // Private
            //===========================================================================================================================================================================================
            __initComponents:function () {
                this.__emptyPage = new qx.ui.container.Composite(new qx.ui.layout.VBox().set({spacing:1, alignX:'center'}, null));
                // settings list
                this.__settingList = new qx.ui.form.List();
                this.__settingList.set({width:this.__ICONAREA_SIZE, selectionMode:"single", decorator:null});
                this.__settingList.addListener("changeSelection", this._onSettingListSelectionChange, this);
                this.__settingList.__size = this.__ICONAREA_SIZE;
                var settingPanel = new qx.ui.container.Composite(new qx.ui.layout.VBox().set({spacing:1, alignX:'center'}, null));
                settingPanel.add(this.__settingList, {flex:1});
                //----------------------------------------------------------------------------------------------------
                // workarea
                this.__contentArea = new qx.ui.container.Stack();
                this.__contentArea.set({decorator:null});
                this.__contentArea.add(this.__emptyPage); // add empty page
                var _page2 = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({spacing:1, alignX:'center'}, null));
                _page2.add(this.__contentArea, {flex:1});
                //
                var workareaPanel = new qx.ui.container.Composite(new qx.ui.layout.VBox().set({spacing:1, alignX:'center'}, null));
                workareaPanel.add(_page2, {flex:1});
                //----------------------------------------------------------------------------------------------------
                //split pane
                var splitpane = new qx.ui.splitpane.Pane().set({orientation:"horizontal", decorator:"main", offset:0}, null);
                splitpane.getBlocker().addListener("dbltap", function (e) {
                    var size = settingPanel.getWidth();
                    if(size == null) size = this.__settingList.getWidth();
                    if(size != 0) this.__settingList.__size = size;
                    //
                    settingPanel.setWidth((size > 0 ? 0 : this.__settingList.__size));
                    this.__settingList.setWidth(settingPanel.getWidth());
                }, this, false);
                //
                if (this.__position == 2) {
                    splitpane.add(workareaPanel, 1);
                    splitpane.add(settingPanel, 0);
                } else {
                    splitpane.add(settingPanel, 0);
                    splitpane.add(workareaPanel, 1);
                }
                this.add(splitpane, {flex:1});
            },

            //===========================================================================================================================================================================================
            // Events
            //===========================================================================================================================================================================================
            _onSettingListSelectionChange:function (e) {
                var selections = e.getData();
                if (!selections || !selections.length) return;
                //
                this.__selectedItem = selections[0];
                var page = this.__selectedItem.getModel();
                // select stack page
                if (page) {
                    this.__contentArea.setSelection([page]);
                    var model = this.__selectedItem.getModel();
                    this._doModelFirstTimeSelection(model);
                } else {
                    this.__contentArea.setSelection([this.__emptyPage]);
                }
            },

            //===========================================================================================================================================================================================
            // Helper
            //===========================================================================================================================================================================================
            _doModelFirstTimeSelection:function (model) {
                if (model && !model.xxx_cuf_fts) {
                    try {
                        model.xxx_cuf_fts = true;
                        model.doSelect()
                    } catch (exc) {
                    }
                }
            }
        }
    }
);



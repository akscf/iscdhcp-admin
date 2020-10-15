/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("dhcpadm.workplaces.admin.commons.LeasesMgmtWidget", {
        extend:qx.ui.container.Composite,
        construct:function () {
            this.base(arguments);
            this.setLayout(new qx.ui.layout.VBox().set({spacing:0, alignX:'center'}, null));
            this.__initComponents();
        },

        members:{
            __flagSyncDontAks: false,
            __filter: new fw.core.qooxdoo.models.SearchFilter(0, 250),
            __dialogsManager: fw.core.qooxdoo.commons.DialogsManager.getInstance(),

            //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            // public
            //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            performDefaultAction:function () {
                this.__table.resetSelection();
                this.__table.getTableModel().setFilterText(this.__searchWidget.getFilterText());
                this.__table.getTableModel().reloadData();
            },

            //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            // private
            //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            __initComponents:function () {
                var toolbar = new fw.core.qooxdoo.widgets.Toolbar();
                this.__buttonAdd = toolbar.addButton(this.tr('Add lease'), fw.core.qooxdoo.res.IconSet.ICON('add'), this, this.__doShowLeaseAddDialog);
                //--------------
                var contextMenu = new fw.core.qooxdoo.widgets.PopupMenu();
                contextMenu.addButton(this.tr('Refresh item'), fw.core.qooxdoo.res.IconSet.ICON('refresh'), this, this.__doRefreshSelected);
                contextMenu.addSeparator();
                contextMenu.addButton(this.tr('Show details'), fw.core.qooxdoo.res.IconSet.ICON('open'), this, this.__doShowLeaseDetails);
                contextMenu.addButton(this.tr('Edit'), fw.core.qooxdoo.res.IconSet.ICON('edit'), this, this.__doShowLeaseEditDialog);
                contextMenu.addSeparator();
                contextMenu.addButton(this.tr('Delete'), fw.core.qooxdoo.res.IconSet.ICON('delete'), this, this.__doDelete);
                //
                this.__table = new fw.core.qooxdoo.widgets.Table(new dhcpadm.workplaces.admin.commons.LeasesTableModelRemote());
                this.__table.setStatusBarVisible(true);
                this.__table.setUserConextMenu(contextMenu);
                this.__table.getSelectionModel().addListener('changeSelection', this.__onTableChangeSelection, this, false);
                this.__table.addListener('cellDbltap', this.__onTableCellDblTap, this, false);
                this.__table.addListener('contextmenu', function (evt) {
                    this.__table.showUserContextMenu(evt);
                }, this, false);
                this.__searchWidget = this.__table.statusBarAddFlex(new fw.core.qooxdoo.widgets.TableStatusBarSearchWidget(this, function(filterText){
                    this.__table.getTableModel().setFilterText(filterText);
                    this.__table.getTableModel().reloadData();
                    this.__table.resetSelection();
                }));
                this.__table.statusBarAddSeparator();
                this.__table.statusBarAdd(new fw.core.qooxdoo.widgets.TableStatusBarButton(this.tr("reload data"), fw.core.qooxdoo.res.IconSet.ICON('refresh'), this, function(e){
                    this.__table.resetSelection();
                    this.__table.getTableModel().setFilterText(this.__searchWidget.getFilterText());
                    this.__table.getTableModel().reloadData();
                }));
                //
                var tcm = this.__table.getTableColumnModel();
                tcm.setDataCellRenderer(1, new qx.ui.table.cellrenderer.Image(16, 16));
                tcm.getBehavior().setWidth(1, 36);      // state
                tcm.getBehavior().setWidth(2, 100);     // type
                tcm.getBehavior().setMinWidth(3, 350);  // mac
                tcm.getBehavior().setMinWidth(4, 150);  // ip
                tcm.getBehavior().setMinWidth(5, 150);  // period
                tcm.getBehavior().setMinWidth(6, 150);  // name
                //
                this.add(toolbar, null);
                this.add(this.__table, {flex:1});
            },

            __doShowLeaseDetails:function (e, selection) {
                if(!selection) {
                    selection = this.__table.getSelection();
                    if (!selection.entity) return;
                }
                this.__dialogsManager.openDialog(dhcpadm.workplaces.admin.dialogs.LeaseDetailsDialog, null, selection);
            },

            __doShowLeaseAddDialog:function (e) {
                var self = this;
                this.__dialogsManager.openDialog(dhcpadm.workplaces.admin.dialogs.LeaseAddDialog, function(data){
                    self.__doAction('new', data);
                });
            },

            __doShowLeaseEditDialog:function (e, selection) {
                if(!selection) {
                    selection = this.__table.getSelection();
                    if (!selection.entity) return;
                }
                var self = this;
                this.__dialogsManager.openDialog(dhcpadm.workplaces.admin.dialogs.LeaseEditDialog, function(data) {
                    self.__doAction('upd', data);
                }, selection);
            },

            __doDelete:function (e, selection, confirmed) {
                if (!selection) {
                    selection = this.__table.getSelection();
                    if (!selection.entity) return;
                }
                var self = this;
                if (confirmed) {
                    dhcpadm.sdk.services.LeasesManagementService.remove(selection.entity.mac, function (result, exception) {
                        if (exception) return;
                        self.__doAction('del', selection);
                    });
                } else {
                    fw.core.qooxdoo.dialogs.MessageBox.getInstance().showQuestionDialog(this.tr("Deleting"),
                        this.tr("Selected objects will be deleted!<br>If you want to continue, click the '<b>Delete</b>' button."),[this.tr("Delete"), this.tr("Cancel")], function (bid) {
                            if (bid == 1) self.__doDelete(null, selection, true);
                        });
                }
            },

            __doRefreshSelected:function (e, selection) {
                if (!selection) {
                    selection = this.__table.getSelection();
                    if (!selection.entity) return;
                }
                var self = this;
                dhcpadm.sdk.services.LeasesManagementService.fetch(selection.entity.mac, function (result, exception) {
                    if (exception) return;
                    if (result) {
                        self.__doAction('upd', {row:selection.row, entity:result});
                    } else {
                        self.__doAction('del', selection);
                    }
                });
            },

            //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            // events
            //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            __onTableChangeSelection:function (e) {
                var selection = this.__table.getSelection();
            },

            __onTableCellDblTap:function (cellEvent) {
                var row = cellEvent.getRow();
                var entity = this.__table.getColumnValue(row, 0);
                //
                this.__doShowLeaseDetails(null, {row:row, entity:entity});
            },

            //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            // helper
            //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            __doAction:function (action, selection) {
                var row = selection.row;
                var entity = selection.entity;
                var cdata = this.__table.getTableModel().getColumnsByEntity(entity);
                //
                if (action == 'del') {
                    this.__table.deleteRow(row);
                    this.fireDataEvent('entityDeleted', entity, null, false);
                    return
                }
                if (action == 'upd') {
                    this.__table.updateRow(row, cdata);
                    this.fireDataEvent('entityChanged', entity, null, false);
                    return selection;
                }
                if (action == 'new') {
                    //this.__table.addRow(cdata,  true);
                    this.__table.insertRow(cdata,  0, true);
                    return
                }
                if (action == 'add') {
                    this.__table.addRow(cdata,  false);
                    return
                }
            }
        }
    }
);


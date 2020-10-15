/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("dhcpadm.workplaces.admin.commons.JournalViewerWidget", {
        extend:qx.ui.container.Composite,
        construct:function (maxResults) {
            this.base(arguments);
            this.setLayout(new qx.ui.layout.VBox().set({spacing:0, alignX:'center'}, null));

            this.__maxResults = (maxResults ? maxResults : 250);
            this.__initComponents();
        },

        members:{
            __maxResults: 0,
            __filter: new fw.core.qooxdoo.models.SearchFilter(0, 0),
            __dialogsManager: fw.core.qooxdoo.commons.DialogsManager.getInstance(),

            //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            // public
            //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            performDefaultAction:function () {
                this.__doLoadJournal(null);
            },

            //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            // private
            //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            __initComponents:function () {
                this.__filter.setResultsLimit(this.__maxResults);
                //
                this.__table = fw.core.qooxdoo.commons.WidgetHelper.createTableModelSimple([this.tr("Messages")]);
                this.__table.setStatusBarVisible(true);
                this.__table.addListener('cellDbltap', this.__onTableCellDblTap, this, false);
                //
                this.__searchWidget = this.__table.statusBarAddFlex(new fw.core.qooxdoo.widgets.TableStatusBarSearchWidget(this, this.__doLoadJournal));
                this.__table.statusBarAddSeparator();
                this.__table.statusBarAdd(new fw.core.qooxdoo.widgets.TableStatusBarButton(this.tr("reload journal"), fw.core.qooxdoo.res.IconSet.ICON('refresh'), this, this.__doLoadJournal));
                //
                var tcm = this.__table.getTableColumnModel();
                tcm.setDataCellRenderer(1, new qx.ui.table.cellrenderer.String());
                tcm.getBehavior().setMinWidth(1, 150);
                //---------------------------------------------------------------------------------------------------------------------------------
                this.add(this.__table, {flex:1});
            },

            __doShowRecordDetailsDialog:function (e, selection) {
                if (!selection) {
                    selection = this.__table.getSelection();
                    if (!selection.entity) return;
                }
                this.__dialogsManager.openDialog(dhcpadm.workplaces.admin.dialogs.JournalRecordViewerDialog, null, this.tr("Record details"), selection.entity);
            },

            __doLoadJournal:function (e) {
                this.__table.clearModel();
                this.__filter.setText(this.__searchWidget.getFilterText());
                //
                var self = this;
                dhcpadm.sdk.services.DhcpServerManagementService.logRead(this.__filter, function (result, exception) {
                    if (!result) return;
                    for (var i = 0; i < result.length; i++) {
                        self.__renderEntity('add', {row:0, entity:result[i]})
                    }
                });
            },

            //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            // events
            //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            __onTableCellDblTap:function (cellEvent) {
                var column = cellEvent.getColumn();
                var row = cellEvent.getRow();
                var entity = this.__table.getColumnValue(row, 1);
                this.__doShowRecordDetailsDialog(null, {row:row, entity:entity});
            },
            //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            // helper
            //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            __renderEntity:function (action, selection) {
                var row = selection.row;
                var entity = selection.entity;
                //
                var cdata = [null, entity];
                //
                if ('add' == action) {
                    return this.__table.addRow(cdata, false);
                }
            }
        }
    }
);


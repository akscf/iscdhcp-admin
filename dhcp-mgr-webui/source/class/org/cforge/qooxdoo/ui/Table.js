/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("org.cforge.qooxdoo.ui.Table",
    {
        extend:qx.ui.table.Table,

        construct:function (columnNames) {
            var dataModel = new qx.ui.table.model.Simple();
            dataModel.setColumns(columnNames, null);
            dataModel.setData([], false);
            var columnModel = {
                tableColumnModel:function (obj) {
                    return new qx.ui.table.columnmodel.Resize(obj);
                }
            };
            // super
            this.base(arguments, dataModel, columnModel);
            //
            this.setShowCellFocusIndicator(false);
            this.setStatusBarVisible(false);
            this.setColumnVisibilityButtonVisible(false);
            this.setKeepFirstVisibleRowComplete(true);
            this.getSelectionModel().setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
            this.setPadding(0, 0, 0, 0);
            this.setDecorator(null);
            // hide first column
            var tcm = this.getTableColumnModel();
            tcm.setColumnVisible(0, false);
            tcm.getBehavior().setWidth(0, 0);
        },

        members:{
            __userContextMenu:null,

            clearModel:function () {
                this.getSelectionModel().resetSelection();
                this.getTableModel().setData([]);
            },

            getColumnValue:function (row, column) {
                return this.getTableModel().getValue(column, row);
            },

            getSelection:function () {
                var sm = this.getSelectionModel();
                if (!sm.isSelectionEmpty()) {
                    var row = sm.getAnchorSelectionIndex();
                    var obj = (row < 0 ? null : this.getTableModel().getValue(0, row));
                    return {row:row, entity:obj}
                } else {
                    return {row:-1, entity:null}
                }
            },

            addRow:function (rowColumns, selectRow) {
                if (!rowColumns) return;
                //
                var selrow = this.getTableModel().getRowCount();
                this.getTableModel().addRows([rowColumns], null, false);
                if (selectRow) {
                    this.getSelectionModel().setSelectionInterval(selrow, selrow);
                }
                return selrow;
            },

            insertRow:function (rowColumns, idx, selectRow) {
                if (!rowColumns) return;
                //
                var selrow = this.getTableModel().getRowCount();
                this.getTableModel().addRows([rowColumns], idx, false);
                if (selectRow) {
                    this.getSelectionModel().setSelectionInterval(idx, idx);
                }
                return selrow;
            },

            updateRow:function (rowIdx, columnsData) {
                if (!columnsData || rowIdx < 0) return;
                var dataModel = this.getTableModel();
                for (var i = 0; i < columnsData.length; i++) {
                    dataModel.setValue(i, rowIdx, columnsData[i]);
                }
            },

            deleteRow:function (rowIdx) {
                if (rowIdx < 0) return;
                var dataModel = this.getTableModel();
                dataModel.removeRows(rowIdx, 1, false);
            },

            setUserConextMenu:function (contextMenu) {
                this.__userContextMenu = contextMenu;
            },

            showUserContextMenu:function (mouseEvent) {
                if (!this.__userContextMenu || !mouseEvent) return;
                if (this.__userContextMenu.isSeeable()) {
                    this.__userContextMenu.hide();
                }
                if (this.getSelectionModel().getSelectedCount() > 0) {
                    this.__userContextMenu.moveTo(mouseEvent.getDocumentLeft(), mouseEvent.getDocumentTop());
                    this.__userContextMenu.show();
                }
            }
        }
    }
);


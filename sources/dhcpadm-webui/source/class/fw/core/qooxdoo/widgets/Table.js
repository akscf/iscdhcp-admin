/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.widgets.Table", {
        extend:fw.core.qooxdoo.widgets.XTable,

        construct:function (dataModel) {
            var columnModel = {
                tableColumnModel:function (obj) {
                    return new qx.ui.table.columnmodel.Resize(obj);
                }
            };
            //
            this.base(arguments, dataModel, columnModel);
            //
            this.setShowCellFocusIndicator(false);
            this.setStatusBarVisible(false);
            this.setColumnVisibilityButtonVisible(false);
            this.setKeepFirstVisibleRowComplete(true);
            this.getSelectionModel().setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
            this.setEnableSorting(false);
            this.setPadding(0, 0, 0, 0);
            this.setDecorator(null);
            // entity column
            var tcm = this.getTableColumnModel();
            tcm.setColumnVisible(0, false);
            tcm.getBehavior().setWidth(0, 0);
        },

        members:{
            __userContextMenu:null,

            hasContent:function () {
                var tm = this.getTableModel();
                return (tm.getRowCount() > 0);
            },

            clearModel:function () {
                this.getSelectionModel().resetSelection();
                this.getTableModel().clearData();
            },

            resetSelection:function () {
                this.getSelectionModel().resetSelection();
            },

            setEnableSorting: function(val) {
                var tm = this.getTableModel();
                for (var i = 0; i < tm.getColumnCount(); i++) {
                    tm.setColumnSortable(i, val);
                }
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

            // at tail
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

            // by index
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


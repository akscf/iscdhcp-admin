/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.widgets.table.TableDataModelRemote", {
    extend:qx.ui.table.model.Abstract,
    construct:function () {
        this.base(arguments);

        this._sortColumnIndex = -1;
        this._sortAscending = true;

        this._rowCount = 0;
        this._partLastRow = -1;
        this._rowArr = [];

        this._editableColArr = null;

        this._loadRowCountRequestRunning = false,
        this._ignoreCurrentRequest = false;
        this._flagLoaderActive = false;
        this._flagNoMoreData = false;
        this._flagNoData = false
    },

    properties:{

        blockSize: {
            check:"Integer",
            init:250
        },

        caseSensitiveSorting: {
            check:"Boolean",
            init:true
        },

        /* sorting data locally instead of clear data and reload */
        useLocalSortring: {
            check:"Boolean",
            init:false
        }
    },

    members:{
        _rowCount:null,
        _partLastRow: null,
        _rowArr: null,

        _sortColumnIndex:null,
        _sortAscending:null,

        _editableColArr:null,
        _sortableColArr:null,

        _loadRowCountRequestRunning: null,
        _ignoreCurrentRequest:null,
        _flagLoaderActive:false,
        _flagNoMoreData: false,

        _cancelCurrentRequest:function () {
            return false;
        },

        _getIgnoreCurrentRequest:function () {
            return this._ignoreCurrentRequest;
        },

        clearData: function(clearSorting) {
            this._rowArr = [];
            this._rowCount = 0;
            this._partLastRow = -1;
            this._flagNoMoreData = false;
            //
            if (this.hasListener("dataChanged")) {
                var data = {
                    firstRow    : 0,
                    lastRow     : this._rowArr.length - 1,
                    firstColumn : 0,
                    lastColumn  : this.getColumnCount() - 1
                };
                this.fireDataEvent("dataChanged", data);
            }
            if (clearSorting !== false) {
                this.clearSorting();
            }
        },

        setData: function(rowArr, clearSorting) {
            if(rowArr == null || !rowArr.length) {
                this.clearData(clearSorting);
            } else {
                this._rowArr = rowArr;
                this._rowCount = rowArr.length;
                this._partLastRow = (this._rowCount - 1);
                this._flagNoMoreData = false;
            }
            if (clearSorting !== false) {
                this.clearSorting();
            }
        },

        getData: function() {
            return this._rowArr;
        },

        // overridden
        getRowCount:function () {
            return this._rowCount;
        },

        _onRowCountLoaded:function (rowCount) {
        },

        reloadData:function () {
            this.clearData(false);
            this.prefetchRows(0, this.getBlockSize() - 1);
        },

        // overridden
        prefetchRows:function (firstRowIndex, lastRowIndex) {
            //console.log("--> prefetchRow: firstRowIndex="+firstRowIndex+", lastRowIndex="+lastRowIndex+", partLastRow="+this._partLastRow+", rowCount=" + this._rowCount + ", flagLoaderActive=" + this._flagLoaderActive + ", ignoreCurrentRequest=" + this._ignoreCurrentRequest);
            if(this._ignoreCurrentRequest) {
                this._ignoreCurrentRequest = false;
                return;
            }
            if(this._flagLoaderActive || this._flagNoMoreData) {
                return;
            }
            if(this._partLastRow == -1 || lastRowIndex > this._partLastRow || (firstRowIndex > 0 && lastRowIndex >= this._partLastRow)) {
                this._flagLoaderActive = true;
                var startRow = this._rowCount;
                var endRow = (startRow + this.getBlockSize()) - 1;
                this._loadRowData(startRow, endRow);
            }
        },

        _loadRowData:function (firstRow, lastRow) {
            throw new Error("_loadRowData is abstract");
        },

        _onRowDataLoaded:function (rowDataArr) {
            if(this._ignoreCurrentRequest) {
                this._ignoreCurrentRequest = false;
                return;
            }
            if(rowDataArr == null || rowDataArr.length == 0) {
                this._loadRowCountRequestRunning = false;
                this._flagLoaderActive = false;
                this._flagNoMoreData = true;
            } else {
                var lastRow = (this._rowCount > 0 ? (this._rowCount - 1) : 0);
                var partSize = rowDataArr.length;
                this._rowArr = this._rowArr.concat(rowDataArr);
                this._rowCount += partSize;
                this._partLastRow = (this._rowCount - 1);
                //
                var data = {
                    firstRow    : lastRow,
                    lastRow     : this._rowCount - 1,
                    firstColumn : 0,
                    lastColumn  : this.getColumnCount() - 1
                };
                this.fireDataEvent("dataChanged", data);
                //
                this._flagLoaderActive = false;
                this._flagNoMoreData = false;
                this._loadRowCountRequestRunning = false;
            }
        },

        // to local buffer
        addRows : function(rowArr, startIndex, clearSorting) {
            if (startIndex == null) {
                startIndex = this._rowCount;
            }
            rowArr.splice(0, 0, startIndex, 0);
            Array.prototype.splice.apply(this._rowArr, rowArr);
            this._rowCount = this._rowArr.length;
            this._ignoreCurrentRequest = true;

            var data = {
                firstRow    : startIndex,
                lastRow     : this._rowArr.length - 1,
                firstColumn : 0,
                lastColumn  : this.getColumnCount() - 1
            };
            this.fireDataEvent("dataChanged", data);

            if (clearSorting !== false) {
                this.clearSorting();
            }
        },

        // to local buffer
        removeRows : function(startIndex, howMany, clearSorting) {

            this._rowArr.splice(startIndex, howMany);
            this._rowCount = this._rowArr.length;
            this._ignoreCurrentRequest = true;

            var data = {
                firstRow    : startIndex,
                lastRow     : this._rowCount - 1,
                firstColumn : 0,
                lastColumn  : this.getColumnCount() - 1,
                removeStart : startIndex,
                removeCount : howMany
            };
            this.fireDataEvent("dataChanged", data);

            if (clearSorting !== false) {
                this.clearSorting();
            }
        },

        // overridden
        getRowData:function (rowIndex) {
            if (rowIndex < 0 || rowIndex >= this._rowCount) {
                return null;
            }
            return this._rowArr[rowIndex];
        },

        // overridden
        getValue:function (columnIndex, rowIndex) {
            var rowData = this.getRowData(rowIndex);
            if (rowData != null) {
                return rowData[columnIndex];
            }
            return null;
        },

        // overridden
        setValue:function (columnIndex, rowIndex, value) {
            if (rowIndex < 0 || rowIndex >= this._rowCount) {
                throw new Error("rowIndex is out of bounds: " + rowIndex + " (0.." + this._rowCount + ")");
            }
            if (this._rowArr[rowIndex][columnIndex] != value) {
                this._rowArr[rowIndex][columnIndex] = value;

                if (this.hasListener("dataChanged")) {
                    var data = {
                        firstRow    : rowIndex,
                        lastRow     : rowIndex,
                        firstColumn : columnIndex,
                        lastColumn  : columnIndex
                    };
                    this.fireDataEvent("dataChanged", data);
                }
            }
        },

        setEditable:function (editable) {
            this._editableColArr = [];
            for (var col = 0; col < this.getColumnCount(); col++) {
                this._editableColArr[col] = editable;
            }
            this.fireEvent("metaDataChanged");
        },

        setColumnEditable:function (columnIndex, editable) {
            if (editable != this.isColumnEditable(columnIndex)) {
                if (this._editableColArr == null) {
                    this._editableColArr = [];
                }
                this._editableColArr[columnIndex] = editable;

                this.fireEvent("metaDataChanged");
            }
        },

        // overridden
        isColumnEditable:function (columnIndex) {
            return (this._editableColArr ? (this._editableColArr[columnIndex] == true) : false);
        },

        setColumnSortable:function (columnIndex, sortable) {
            if (sortable != this.isColumnSortable(columnIndex)) {
                if (this._sortableColArr == null) {
                    this._sortableColArr = [];
                }
                this._sortableColArr[columnIndex] = sortable;
                this.fireEvent("metaDataChanged");
            }
        },

        // overridden
        isColumnSortable:function (columnIndex) {
            return ( this._sortableColArr ? (this._sortableColArr[columnIndex] !== false) : true );
        },

        clearSorting:function () {
            if (this._sortColumnIndex != -1) {
                this._sortColumnIndex = -1;
                this._sortAscending = true;
                this.fireEvent("metaDataChanged");
            }
        },

        sortByColumn: function (columnIndex, ascending) {
            if(this.getUseLocalSortring()) {
                this.sortByColumnLocal(columnIndex, ascending);
            } else {
                this.sortByColumnRemote(columnIndex, ascending);
            }
        },

        sortByColumnLocal: function (columnIndex, ascending) {
            var comparator;

            if (this.getCaseSensitiveSorting()) {
                comparator = (
                        ascending
                        ? fw.core.qooxdoo.widgets.table.TableDataModelSimple._defaultSortComparatorAscending
                        : fw.core.qooxdoo.widgets.table.TableDataModelSimple._defaultSortComparatorDescending);
            }
            else {
                comparator = (
                        ascending
                        ? fw.core.qooxdoo.widgets.table.TableDataModelSimple._defaultSortComparatorInsensitiveAscending
                        : fw.core.qooxdoo.widgets.table.TableDataModelSimple._defaultSortComparatorInsensitiveDescending);
            }

            comparator.columnIndex = columnIndex;
            this._rowArr.sort(comparator);

            this._sortColumnIndex = columnIndex;
            this._sortAscending = ascending;

            var data =  {
                columnIndex:columnIndex,
                ascending:ascending
            };

            this.fireDataEvent("sorted", data);
            this.fireEvent("metaDataChanged");
        },

        sortByColumnRemote : function(columnIndex, ascending) {
            if (this._sortColumnIndex != columnIndex || this._sortAscending != ascending) {
                this._sortColumnIndex = columnIndex;
                this._sortAscending = ascending;

                this.clearData(false);

                this.fireEvent("metaDataChanged");
            }
        },

        // overridden
        getSortColumnIndex:function () {
            return this._sortColumnIndex;
        },

        // overridden
        isSortAscending:function () {
            return this._sortAscending;
        },

        setSortColumnIndexWithoutSortingData:function (sortColumnIndex) {
            this._sortColumnIndex = sortColumnIndex;
        },

        setSortAscendingWithoutSortingData:function (sortAscending) {
            this._sortAscending = sortAscending;
        }

    },

    destruct:function () {
        this._sortableColArr = this._editableColArr = this._rowArr = null;
    }
});

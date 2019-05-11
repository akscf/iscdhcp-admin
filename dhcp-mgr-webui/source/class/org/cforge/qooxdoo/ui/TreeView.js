/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("org.cforge.qooxdoo.ui.TreeView",
    {
        extend:qx.ui.treevirtual.TreeVirtual,

        construct:function (columnNames) {
            var columnModel = { tableColumnModel:function (obj) {
                return new qx.ui.table.columnmodel.Resize(obj);
            }};
            // super
            this.base(arguments, columnNames, columnModel);
            //
            this.setAlwaysShowOpenCloseSymbol(true);
            this.setShowCellFocusIndicator(false);
            this.setColumnVisibilityButtonVisible(false);
            this.setStatusBarVisible(false);
            this.setOpenCloseClickSelectsRow(true);
            this.setKeepFirstVisibleRowComplete(true);
            this.getSelectionModel().setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
            this.setRowHeight(18);
            this.setPadding(0, 0, 0, 0);
            this.setDecorator(null);
            // clear datamodel
            this.getDataModel().setData();
        },

        members:{
            __userContextMenu:null,

            clearModel:function () {
                this.getSelectionModel().resetSelection();
                var tdm = this.getDataModel();
                tdm.clearData();
                tdm.setData();
            },

            selectNodeById:function (nodeId) {
                var srow = this.getDataModel().getRowFromNodeId(nodeId);
                if (srow >= 0) {
                    this.getSelectionModel().addSelectionInterval(srow, srow);
                }
            },

            getSelection:function () {
                var selnodes = this.getSelectedNodes();
                if (!selnodes || !selnodes.length) {
                    return {node:null, entity:null};
                }
                var node = selnodes[0];
                var entity = node.columnData[0];
                return {node:node, entity:entity};
            },

            getFocused:function () {
                var row = this.getFocusedRow();
                if (row >= 0) {
                    var node = this.getDataModel().getNode(row);
                    var entity = node.columnData[0];
                    return {node:node, row:row, entity:entity};
                }
                return {node:null, row:null, entity:null};
            },

            addBranch:function (parentNodeId, label, icon, columnsData) {
                var tdm = this.getDataModel();
                var nodeid = tdm.addBranch(parentNodeId, label, false, false, icon, icon);
                if (columnsData) {
                    for (var i = 0; i < columnsData.length; i++) {
                        tdm.setColumnData(nodeid, i, columnsData[i]);
                    }
                }
                tdm.setData();
                return nodeid;
            },

            addLeaf:function (parentNodeId, label, icon, columnsData) {
                var tdm = this.getDataModel();
                var nodeid = tdm.addLeaf(parentNodeId, label, icon, icon);
                if (columnsData) {
                    for (var i = 0; i < columnsData.length; i++) {
                        tdm.setColumnData(nodeid, i, columnsData[i]);
                    }
                }
                tdm.setData();
                return nodeid;
            },

            updateNode:function (node, label, icon, columnsData) {
                if (!node) return;
                var tdm = this.getDataModel();
                node.label = label;
                node.icon = icon;
                node.iconSelected = icon;
                if (columnsData) {
                    for (var i = 0; i < columnsData.length; i++) {
                        tdm.setColumnData(node.nodeId, i, columnsData[i]);
                    }
                }
                tdm.setData();
            },

            deleteNode:function (node) {
                if (!node) return;
                if (node.bSelected) {
                    this.getSelectionModel().resetSelection();
                }
                var tdm = this.getDataModel();
                tdm.prune(node, true);
                tdm.setData();
            },

            clearNode:function (node) {
                if (!node) return;
                var tdm = this.getDataModel();
                tdm.prune(node, false);
                tdm.setData();
            },

            setBOpenedFlag:function (nodeId, flag) {
                if (nodeId == null) return;
                var tdm = this.getDataModel();
                var row = tdm.getRowFromNodeId(nodeId);
                if (row >= 0) {
                    var node = tdm.getNodeFromRow(row);
                    if (node) {
                        tdm.setState(node, {bOpened:flag});
                    }
                }
            },

            setBOpenedFlagForAll:function (flag) {
                var tdm = this.getDataModel();
                var treemap = tdm.getData();
                for (var i = 0; i < treemap.length; i++) {
                    var node = treemap[i];
                    if (!node || node.parentNodeId) continue
                    tdm.setState(node, {bOpened:flag});
                }
            },

            setUserConextMenu:function (contextMenu) {
                this.__userContextMenu = contextMenu;
            },

            showUserContextMenu:function (mouseEvent) {
                if (!this.__userContextMenu || !mouseEvent) return;
                if (this.__userContextMenu.isSeeable()) {
                    this.__userContextMenu.hide();
                }
                var selnodes = this.getSelectedNodes();
                if (selnodes && selnodes.length > 0) {
                    this.__userContextMenu.moveTo(mouseEvent.getDocumentLeft(), mouseEvent.getDocumentTop());
                    this.__userContextMenu.show();
                }
            }
        }
    }
);


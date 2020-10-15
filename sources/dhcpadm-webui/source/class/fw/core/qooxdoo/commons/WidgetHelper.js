/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.commons.WidgetHelper", {
    type : "static",
    statics: {
        setEnabled: function (state, widgets) {
            if (!widgets) return;
            for (var i = 0; i < widgets.length; i++) {
                widgets[i].setEnabled(state);
            }
        },

        createTableModelSimple: function (columnNames) {
            var arr=['@']; // entity
            var dataModel = new fw.core.qooxdoo.widgets.table.TableDataModelSimple();
            dataModel.setColumns(arr.concat(columnNames), null);
            dataModel.setData([], true);
            return new fw.core.qooxdoo.widgets.Table(dataModel);
        },

        createTableModelRemote: function (columnNames, columnIds, dataLoaderCallback) {
            throw new Error("Makes it manually");
        }

    }
});


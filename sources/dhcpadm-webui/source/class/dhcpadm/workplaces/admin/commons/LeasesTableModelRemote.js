/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("dhcpadm.workplaces.admin.commons.LeasesTableModelRemote", {
        extend : fw.core.qooxdoo.widgets.table.TableDataModelRemote,
        include: [qx.locale.MTranslation],
        construct:function () {
            this.base(arguments);
            this.setColumns(
                ["@", "", this.tr("Type"), this.tr("MAC"), this.tr("IP"), this.tr("Period"), this.tr("Name")],
                ["@", "state", "type", "mac", "ip", "period", "name"]
            );
        },

        members:{
            __iconActive  : fw.core.qooxdoo.res.IconSet.ICON('stdEnable'),
            __iconInactive : fw.core.qooxdoo.res.IconSet.ICON('stdDisable'),
            __filter    : new fw.core.qooxdoo.models.SearchFilter(0, 250),

            getFilter: function () {
                return this.__filter;
            },

            setFilterText: function (text) {
                this.__filter.setText(text);
            },

            getColumnsByEntity: function (entity) {
                var img = (entity.state == 'active' ? this.__iconActive : this.__iconInactive);
                var leasePeriod = (entity.type == 'lease' ? (entity.startTime + " - " + entity.endTime) : "");
                var cdata = [entity, img, entity.type, entity.mac, entity.ip, leasePeriod, entity.name];
                return cdata;
            },

            _loadRowData : function(firstRow, lastRow) {
                var sortColumnIndex = this.getSortColumnIndex();
                //
                this.__filter.setSortCondition(null);
                this.__filter.setResultsStart(firstRow);
                this.__filter.setResultsLimit((lastRow - firstRow));
                this.__filter.setSortCaseSensitive(this.getCaseSensitiveSorting() ? 1 : 0)
                this.__filter.setSortDirection(this.isSortAscending() ? 1 : 0);
                this.__filter.setSortColumn((sortColumnIndex > 0  ? this.getColumnId(sortColumnIndex) : null));
                //
                var self = this;
                dhcpadm.sdk.services.LeasesManagementService.explore(this.__filter, function (result, exception) {
                    if (!result)  {
                        self._onRowDataLoaded(null);
                        return;
                    }
                    var data = [];
                    for (var i = 0; i < result.length; i++) {
                        var entity = result[i];
                        if(!entity) continue;
                        data.push( self.getColumnsByEntity(entity) );
                    }
                    self._onRowDataLoaded(data);
                });
            }
        }
    }
);


/**
 *
 * author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("webapp.workplaces.administrator.pages.LeasesPage", {
    extend:org.cforge.qooxdoo.ui.TabViewPagev,

    construct:function () {
        this.base(arguments, this.tr('Leases'));
        this.__initComponents();
    },

    members:{
        __IMG_ACTIVE:'webapp/16x16/bullet_ball_green.png',
        __IMG_INACTIVE:'webapp/16x16/bullet_ball_greay.png',
        __filterSettings:new org.cforge.wsp.models.FilterSettings(),
        //===========================================================================================================================================================================================
        // Public
        //===========================================================================================================================================================================================
        doSelect:function () {
            this.__doSearch(null, false);
        },

        //===========================================================================================================================================================================================
        // Private
        //===========================================================================================================================================================================================
        __initComponents:function () {
            var toolbar = new org.cforge.qooxdoo.ui.Toolbar();
            toolbar.add(new org.cforge.qooxdoo.ui.ToolbarButton(null, this.tr('Refresh'), 'webapp/16x16/refresh.png', this, this.__doSearch));
            toolbar.addSeparator();
            this.__fieldSearchText = toolbar.addFlex(new org.cforge.qooxdoo.ui.ToolbarTextField(this.tr('enter the text for search'), this, this.__doSearch));
            //-------------------------------------------------------------------------------------------------------------------
            var contextMenu = new org.cforge.qooxdoo.ui.PopupMenu();
            contextMenu.add(new org.cforge.qooxdoo.ui.MenuButton(this.tr('Refresh'), 'webapp/16x16/refresh.png', this, this.__doRefresh));
            contextMenu.addSeparator();
            contextMenu.add(new org.cforge.qooxdoo.ui.MenuButton(this.tr('View details'), 'webapp/16x16/view.png', this, this.__doView));
            //
            this.__table = new org.cforge.qooxdoo.ui.Table(["", "", this.tr("HW address"), this.tr("IP Address"), this.tr("Lease period"), this.tr("Name")]);
            this.__table.setUserConextMenu(contextMenu);
            this.__table.getSelectionModel().addListener('changeSelection', this.__onTableChangeSelection, this, false);
            this.__table.addListener('cellDbltap', this.__onTableCellDblTap, this, false);
            this.__table.addListener('contextmenu', function (evt) {
                this.__table.showUserContextMenu(evt);
            }, this, false);
            /*this.__table.getPaneScroller(0).addListener('changeScrollY', function (e) {
                if (org.cforge.qooxdoo.ui.helper.Scroll.isNeedLoadNextPage(this.__table, e.getData()))
                    this.__doSearch(null, true);
            }, this, false);*/
            //
            var tcm = this.__table.getTableColumnModel();
            tcm.setDataCellRenderer(1, new qx.ui.table.cellrenderer.Image(16, 16));
            tcm.getBehavior().setWidth(1, 36);      // state
            tcm.getBehavior().setMinWidth(2, 350);  // mac
            tcm.getBehavior().setMinWidth(3, 150);  // ip
            tcm.getBehavior().setMinWidth(4, 150);  // period
            tcm.getBehavior().setMinWidth(5, 150);  // name
            //---------------------------------------------------------------------------------------------------------------------------------
            this.add(toolbar, null);
            this.add(this.__table, {flex:1});
        },

        //=================================================================================================================================================================================================================
        // Commands
        //=================================================================================================================================================================================================================
        __doView:function (e, selection) {
            if (!selection) {
                selection = this.__table.getSelection();
                if (!selection.entity) return;
            }
            if (!this.__eventDetailsDialog) {
                this.__eventDetailsDialog = new webapp.workplaces.administrator.dialogs.TextViewDialog();
            }
            var txt = "IP...........: " + selection.entity.ip + "\n" +
                      "MAC..........: " + selection.entity.mac + "\n" +
                      "Name.........: " + (selection.entity.name ? selection.entity.name : "") + "\n" +
                      "State........: " + (selection.entity.state ? selection.entity.state : "")+ "\n" +
                      "Start date...: " + selection.entity.startTime + "\n" +
                      "End date.....: " + selection.entity.endTime + "\n";
            this.__eventDetailsDialog.open(this.tr("Lease details"), txt);
        },

        __doSearch:function (e, continueSearch) {
            if (!continueSearch) {
                this.__table.clearModel();
                this.__filterSettings.setOffset(0);
                this.__filterSettings.setCount(org.cforge.dhcpmgr.definitions.Definition.PAGE_SIZE);
            }
            //
            var self = this;
            org.cforge.dhcpmgr.services.LeasesManagementService.search(this.__fieldSearchText.getValue(), this.__filterSettings, function (result, exception) {
                if (!result) return;
                //
                var entity = null;
                for (var i = 0; i < result.length; i++) {
                    entity = result[i];
                    self.__renderEntity('fill', {row:0, entity:entity});
                }
                //org.cforge.qooxdoo.ui.helper.Scroll.updatePaginationSettings(self.__filterSettings, entity);
            });
        },

        // todo: use OMAPI for it
        __doRefresh:function (e, selection) {
            if (!selection) {
                selection = this.__table.getSelection();
                if (!selection.entity) return;
            }
            var self = this;
            /*org.cforge.dhcpmgr.services.DhcpServerManagementService.fetch(selection.entity.id, function (result, exception) {
                if (exception) return;
                if (result) self.__renderEntity('upd', {row:selection.row, entity:result});
                else self.__renderEntity('del', selection);
            });*/
        },

        //=================================================================================================================================================================================================================
        // Events
        //=================================================================================================================================================================================================================
        __onTableChangeSelection:function (e) {
            var t = !(this.__table.getSelectionModel().isSelectionEmpty());
        },

        __onTableCellDblTap:function (cellEvent) {
            var column = cellEvent.getColumn();
            var row = cellEvent.getRow();
            var entity = this.__table.getColumnValue(row, 0);
            this.__doView(null, {row:row, entity:entity});
        },

        //=================================================================================================================================================================================================================
        // helper
        //=================================================================================================================================================================================================================
        __renderEntity:function (action, selection) {
            var row = selection.row;
            var entity = selection.entity;
            //
            if ('del' == action) {
                this.__table.deleteRow(row);
                return
            }
            var img = (entity.state == 'active' ? this.__IMG_ACTIVE : this.__IMG_INACTIVE);
            var leasePeriod = entity.startTime + " - " + entity.endTime;
            var cdata = [entity, img, entity.mac, entity.ip, leasePeriod, entity.name];
            //
            if ('add' == action) {
                return this.__table.insertRow(cdata, 0, true);
            }
            if ('upd' == action) {
                this.__table.updateRow(row, cdata);
                return selection;
            }
            if ('fill' == action) {
                return this.__table.addRow(cdata, false);
            }
        }
    }
});


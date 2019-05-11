/**
 *
 * author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("webapp.workplaces.administrator.pages.LogsPage", {
    extend:org.cforge.qooxdoo.ui.TabViewPagev,

    construct:function () {
        this.base(arguments, this.tr('Logs'));
        this.__initComponents();
    },

    members:{
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
            this.__fieldSearchText.setEnabled(false);
            this.__fieldLineCount = toolbar.addFlex(new qx.ui.form.Spinner().set({minimum:1, maximum:99000, value:250, alignY:"middle", maxHeight:26, maxWidth:100, toolTipText:this.tr('line count for view')}, null));
            //-------------------------------------------------------------------------------------------------------------------
            this.__table = new org.cforge.qooxdoo.ui.Table(["", this.tr("Message")]);
            this.__table.setStatusBarVisible(true);
            //this.__table.setDataRowRenderer(new webapp.workplaces.administrator.commons.SimpleLogCellRenderer());
            this.__table.addListener('cellDbltap', this.__onTableCellDblTap, this, false);
            /*this.__table.getPaneScroller(0).addListener('changeScrollY', function (e) {
                if (org.cforge.qooxdoo.ui.helper.Scroll.isNeedLoadNextPage(this.__table, e.getData())) this.__doSearch(null, true);
            }, this, false);*/
            //
            var tcm = this.__table.getTableColumnModel();
            tcm.setDataCellRenderer(1, new qx.ui.table.cellrenderer.String());
            tcm.getBehavior().setMinWidth(1, 150);      // message
            //---------------------------------------------------------------------------------------------------------------------------------
            // add elements
            this.add(toolbar, null);
            this.add(this.__table, {flex:1});
        },

        //=================================================================================================================================================================================================================
        // Commands
        //=================================================================================================================================================================================================================
        __doShowEventDetailsDialog:function (e, selection) {
            if (!selection) {
                selection = this.__table.getSelection();
                if (!selection.entity) return;
            }
            if (!this.__eventDetailsDialog) {
                this.__eventDetailsDialog = new webapp.workplaces.administrator.dialogs.TextViewDialog();
            }
            this.__eventDetailsDialog.open(this.tr("Record details"), selection.entity);
        },

        __doSearch:function (e, continueSearch) {
            if (!continueSearch) {
                this.__table.clearModel();
                this.__filterSettings.setOffset(0);
            }
            this.__filterSettings.setCount(this.__fieldLineCount.getValue());
            //
            var self = this;
            org.cforge.dhcpmgr.services.DhcpServerManagementService.logRead(this.__fieldSearchText.getValue(), this.__filterSettings, function (result, exception) {
                if (!result) return;
                //
                var entity = null;
                for (var i = 0; i < result.length; i++) {
                    entity = result[i];
                    self.__renderEntity('fill', {row:0, entity:entity})
                }
                //self.__filterSettings.setOffset(self.__filterSettings.getOffset() + result.length);
            });
        },
        //=================================================================================================================================================================================================================
        // Events
        //=================================================================================================================================================================================================================
        __onTableCellDblTap:function (cellEvent) {
            var column = cellEvent.getColumn();
            var row = cellEvent.getRow();
            var entity = this.__table.getColumnValue(row, 0);
            this.__doShowEventDetailsDialog(null, {row:row, entity:entity});
        },

        //=================================================================================================================================================================================================================
        // helper
        //=================================================================================================================================================================================================================
        __renderEntity:function (action, selection) {
            var row = selection.row;
            var entity = selection.entity;
            //
            var cdata = [entity, entity];
            //
            if ('fill' == action) {
                return this.__table.addRow(cdata, false);
            }
        }
    }
});


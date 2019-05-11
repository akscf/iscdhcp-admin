/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("org.cforge.qooxdoo.ui.helper.Scroll", {
    extend: qx.core.Object,
    statics: {
        calcMaxYPosition: function (table) {
            if (!table) return 0;
            var paneScroller = table.getPaneScroller(0);
            if (!paneScroller) return 0;
            //
            var paneSize = paneScroller.getPaneClipper().getInnerSize();
            var rowcount = table.getTableModel().getRowCount();
            if (table.getKeepFirstVisibleRowComplete()) rowcount += 1;
            //
            return Math.max(0, (rowcount * table.getRowHeight()) - paneSize.height);
        },
        isNeedLoadNextPage: function (table, offset) {
            if (!table || !offset)
                return 0;
            var max = org.cforge.qooxdoo.ui.helper.Scroll.calcMaxYPosition(table);
            return ((offset > 0 && offset >= max))
        },
        updatePaginationSettings: function (paginationSettings, lastEntity) {
            if (!paginationSettings || !lastEntity)
                return;
            paginationSettings.setOffset(lastEntity['id']);
        }
    }
});


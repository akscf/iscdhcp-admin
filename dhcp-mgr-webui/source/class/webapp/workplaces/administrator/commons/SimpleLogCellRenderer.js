/**
 *
 * author: AlexandirK <aks@cforge.org>
 */
qx.Class.define("webapp.workplaces.administrator.commons.SimpleLogCellRenderer",
    {
        extend:qx.ui.table.rowrenderer.Default,

        members:{
            updateDataRowElement:function (rowInfo, rowElem) {
                this.base(arguments, rowInfo, rowElem);
                //
                var style = rowElem.style;
                style.color = (rowInfo.selected ? this._colors.colNormal : '#828282');
            },

            createRowStyle:function (rowInfo) {
                var rowStyle = [ ];
                rowStyle.push(this.base(arguments, rowInfo));
                //
                rowStyle.push(";");
                rowStyle.push("color:#828282");
                //
                return rowStyle.join("");
            }
        }
    }
);

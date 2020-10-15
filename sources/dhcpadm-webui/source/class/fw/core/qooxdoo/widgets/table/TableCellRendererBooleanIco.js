/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.widgets.table.TableCellRendererBooleanIco", {
        extend:qx.ui.table.cellrenderer.AbstractImage,

        construct:function (width, height, trueIcon, falseIcon) {
            this.base(arguments);

            if (width) {
                this.__imageWidth = width;
            }
            if (height) {
                this.__imageHeight = height;
            }

            this.__iconTrue = (trueIcon ? trueIcon : fw.core.qooxdoo.res.IconSet.ICON('stdEnable'));
            this.__iconFalse = (falseIcon ? falseIcon : fw.core.qooxdoo.res.IconSet.ICON('stdDisable'));
        },

        members:{
            __imageHeight : 16,
            __imageWidth : 16,
            __iconFalse: null,
            __iconTrue : null,

            _identifyImage : function(cellInfo) {
                var imageHints = {
                    imageWidth  : this.__imageWidth,
                    imageHeight : this.__imageHeight
                };

                if(!cellInfo.value || cellInfo.value == 0 || cellInfo.value == 'false') {
                    imageHints.url = this.__iconFalse;
                } else {
                    imageHints.url = this.__iconTrue;
                }
                imageHints.tooltip = cellInfo.tooltip;
                return imageHints;
            }
        }
    }
);


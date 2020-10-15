/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.widgets.ToolbarAtom", {
        extend:qx.ui.basic.Atom,

        construct:function (label, icon) {
            this.base(arguments, label, icon);
            this.setAlignY('middle');
            this.setIconPosition('left');
            this.setMaxHeight(20);
            this.setHeight(20);
        },

        members:{

        }
    }
);


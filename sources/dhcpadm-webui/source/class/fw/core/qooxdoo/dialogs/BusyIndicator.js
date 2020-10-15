/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.dialogs.BusyIndicator", {
    extend: fw.core.qooxdoo.widgets.XWindow,
    construct: function () {
        this.base(arguments);
        this.getChildControl("captionbar").setVisibility("excluded");
        this.setDecorator('busy-box');
        //
        this.setModal(true);
        this.setShowClose(false);
        this.setShowMinimize(false);
        this.setShowMaximize(false);
        this.setResizable(false, true, false, true);
        this.setAllowMaximize(false);
        this.setAllowMinimize(false);
        this.setWidth(300);
        this.setHeight(60);
        this.setLayout(new qx.ui.layout.VBox().set({spacing: 3, alignX: 'center'}, null));
        //
        this.addListener("ppear", this.center, this, false);
        this.addListener("resize", this.center, this, false);
        //
        this.__fieldMessage = new qx.ui.basic.Atom("idicator").set({center: true }, null); /*, font: 'bold' */
        this.add(this.__fieldMessage, {row: 0, column: 0});
        this.__imgIndicator = new qx.ui.basic.Image(fw.core.qooxdoo.res.IconSet.ICON('stdAxajIndicator'));
        this.add(this.__imgIndicator, {row: 1, column: 0});
    },
    members: {
        __fieldMessage: null,
        __imgIndicator: null,

        open: function (message) {
            this.__fieldMessage.setLabel((message ? message : this.tr("Processing...")));
            this.base(arguments);
        },

        getMessage: function () {
            return this.__fieldMessage.getLabel();
        },

        setMessage: function (text) {
            this.__fieldMessage.setLabel(text);
        }
    }
});

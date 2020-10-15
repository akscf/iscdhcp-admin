/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.srvc.WorkplacesSrvc", {
    extend: qx.core.Object,
    include: [qx.locale.MTranslation],

    construct: function (workplaces) {
        this.base(arguments);
        this.__workplaces = workplaces;
        this.__initComponents();
    },

    members: {
        __workplaces: {},
        __wscontainer: null,
        __currentWPName: null,
        __currentWPObj: null,

        //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        // private
        //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        __initComponents: function () {
            this.__wscontainer = new qx.ui.container.Composite(new qx.ui.layout.Grow());
            qx.core.Init.getApplication().getRoot().add(this.__wscontainer, {edge: 0});
            //
            qx.event.message.Bus.subscribe('msg-wp-set', function (dataEvent) {
                var id = dataEvent.getData();
                if (id) this.__setWorkspace(id);
            }, this);
            qx.event.message.Bus.subscribe('msg-wp-lock', function (dataEvent) {
                if (this.__currentWPObj) this.__currentWPObj.wpLock(true);
            }, this);
            qx.event.message.Bus.subscribe('msg-wp-unlock', function (dataEvent) {
                if (this.__currentWPObj) this.__currentWPObj.wpLock(false);
            }, this);
        },

        __setWorkspace: function (id) {
            if (!id || (this.__currentWPName && this.__currentWPName == id)) {
                if (this.__currentWPObj) this.__currentWPObj.wpLock(false);
                return;
            }
            var wp = this.__workplaces[id];
            if (!wp) {
                fw.core.qooxdoo.dialogs.MessageBox.getInstance().showErrorDialog(this.tr("No suitable workplace!"));
                return;
            }
            if (this.__currentWPObj) {
                try {
                    this.__wscontainer.remove(this.__currentWPObj);
                    this.__currentWPObj.clean();
                } catch (exc) {
                    console.log("ERROR: WorkplaceManager: " + exc);
                }
            }
            var wpclass = this.__workplaces[id].clazz;
            if(!wpclass) {
                fw.core.qooxdoo.dialogs.MessageBox.getInstance().showErrorDialog(this.tr("No suitable workplace (clazz == null)!"));
                return;
            }
            try {
                this.__currentWPName = id;
                this.__currentWPObj = new wpclass(id);
                this.__currentWPObj.setup();
                this.__wscontainer.add(this.__currentWPObj, {flex: 1});
            } catch (exc) {
                console.log("ERROR: WorkplaceManager: " + exc);
            }
        }
    }
});

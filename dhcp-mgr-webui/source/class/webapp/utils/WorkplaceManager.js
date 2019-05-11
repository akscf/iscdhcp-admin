/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("webapp.utils.WorkplaceManager", {
    extend: qx.core.Object,
    include: [qx.locale.MTranslation],
    construct: function (roleList, workplaceList) {
        this.base(arguments);
        this.__workplaceList = workplaceList;
        // exclude role without workplace
        for (var i = 0, len = roleList.length; i < len; i++) {
            if (roleList[i].enableWorkplace)
                this.__roleList.push(roleList[i]);
        }
        //
        this.__initComponents();
    },
    members: {
        __roleList: [],
        __workplaceList: null,
        __currentWPID: null, // id
        __currentWPWidget: null, // wp instance
        __wscontainer: null, // root container
        __workplaceSelectDialog: null,
        //=========================================================================================================================================================================================
        // API
        //=========================================================================================================================================================================================
        getCurrentWorkspace: function () {
            return this.__currentWPID;
        },
        getCurrentWorkspaceWidget: function () {
            return this.__currentWPWidget;
        },
        fillMenu: function (menu, selectedId) {
            if (!menu)
                return;
            if (!selectedId)
                selectedId = this.__currentWPID;
            //
            var rgroup = new qx.ui.form.RadioGroup();
            var selitem = null;
            //
            for (var i = 0, len = this.__roleList.length; i < len; i++) {
                var role = this.__roleList[i];
                var item = new qx.ui.menu.RadioButton(role.description);
                item.__wpid = role.id;
                if (!selitem && role.id == selectedId)
                    selitem = item;
                menu.add(item);
                rgroup.add(item);
            }
            if (selitem)
                rgroup.setSelection([selitem]);
            rgroup.addListener('changeSelection', function (e) {
                var id = e.getData()[0].__wpid;
                qx.event.message.Bus.dispatch(new qx.event.message.Message('wc-change-workplace', id));
            }, this, false);
            return menu;
        },
        //=========================================================================================================================================================================================
        // private methods
        //=========================================================================================================================================================================================
        __initComponents: function () {
            this.__wscontainer = new qx.ui.container.Composite(new qx.ui.layout.Grow());
            qx.core.Init.getApplication().getRoot().add(this.__wscontainer, {edge: 0});
            // set-up listener
            qx.event.message.Bus.subscribe('wc-change-workplace', function (dataEvent) {
                var id = dataEvent.getData();
                if (id)
                    this.__setWorkspace(id);
            }, this);
            qx.event.message.Bus.subscribe('wc-lock-workplace', function (dataEvent) {
                if (this.__currentWPWidget)
                    this.__currentWPWidget.lockWorkplace(true);
            }, this);
            qx.event.message.Bus.subscribe('wc-unlock-workplace', function (dataEvent) {
                if (this.__currentWPWidget)
                    this.__currentWPWidget.lockWorkplace(false);
            }, this);
        },
        __setWorkspace: function (id) {
            if (!id || (this.__currentWPID && this.__currentWPID == id))
                return;
            //
            var wp = this.__workplaceList[id];
            if (!wp) {
                qx.core.Init.getApplication().stdDialogs().error(this.tr("No suitable workspace!"));
                return;
            }
            this.__currentWPID = id;
            this.__applyCurrentWorkplace();
        },
        __applyCurrentWorkplace: function () {
            if (this.__currentWPWidget) {
                try {
                    this.__wscontainer.remove(this.__currentWPWidget);
                    this.__currentWPWidget.clenup();                                // --> wp api method
                } catch (exc) {
                    this.error("WorkplaceManager: " + exc);
                }
            }
            var wpid = this.__currentWPID;
            var wpclass = this.__workplaceList[wpid].clazz;
            try {
                this.__currentWPWidget = new wpclass(wpid);
                this.__currentWPWidget.setup();                                     // --> wp api method
                this.__wscontainer.add(this.__currentWPWidget, {flex: 1});
            } catch (exc) {
                this.error("WorkplaceManager: " + exc);
            }
        }
    }
});


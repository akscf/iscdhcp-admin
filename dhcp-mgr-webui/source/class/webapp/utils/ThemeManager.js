/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("webapp.utils.ThemeManager", {
    extend: qx.core.Object,
    include: [qx.locale.MTranslation],
    construct: function () {
        this.base(arguments);
        this.__initComponents();
    },
    members: {
        __THEMES: [
            {description: "Default", id: 'CF_DESKTOP'},
            {description: "Modern", id: 'QX_MODERN'},
            {description: "Classic", id: 'QX_CLASSIC'},
            {description: "Simple", id: 'QX_SIMPLE'}
        ],
        __SKEY_NAME: 'ui.theme',
        __currentTheme: 'CF_DESKTOP', // theme id
        __themeSelectDialog: null,
        //=========================================================================================================================================================================================
        // API
        //=========================================================================================================================================================================================
        getCurrenTheme: function () {
            return this.__currentTheme;
        },
        getAvailableThemes: function () {
            return this.__THEMES;
        },
        fillMenu: function (menu, selectedId) {
            if (!menu)
                return;
            if (!selectedId)
                selectedId = this.__currentLanguage;
            var selitem = null;
            var rgroup = new qx.ui.form.RadioGroup();
            for (var i = 0, len = this.__THEMES.length; i < len; i++) {
                var th = this.__THEMES[i];
                var item = new qx.ui.menu.RadioButton(th.description);
                item.__thmid = th.id;
                if (!selitem && th.id == selectedId)
                    selitem = item;
                menu.add(item);
                rgroup.add(item);
            }
            if (selitem)
                rgroup.setSelection([selitem]);
            rgroup.addListener('changeSelection', function (e) {
                var id = e.getData()[0].__thmid;
                qx.event.message.Bus.dispatch(new qx.event.message.Message('wc-change-theme', id));
            }, this, false);
            return menu;
        },
        //=========================================================================================================================================================================================
        // private methods
        //=========================================================================================================================================================================================
        __initComponents: function () {
            var id = this.__loadPreferredTheme();
            if (id == null)
                id = this.__currentTheme;
            this.__setPreferredTheme(id);
            // set-up listener
            qx.event.message.Bus.subscribe('wc-change-theme', function (dataEvent) {
                var id = dataEvent.getData();
                if (id)
                    this.__setPreferredTheme(id);
            }, this);
        },
        __setPreferredTheme: function (id) {
            if (!id || id == this.__currentTheme)
                return;
            this.__currentTheme = id;
            this.__applyCurrentTheme();
            this.__storePreferredTheme(id);
        },
        __storePreferredTheme: function (id) {
            try {
                var storage = qx.core.Init.getApplication().storageManager();
                storage.writeData(this.__SKEY_NAME, id);
            } catch (exc) {
                this.error("ThemeManager: " + exc);
            }
        },
        __loadPreferredTheme: function () {
            var id = null;
            try {
                var storage = qx.core.Init.getApplication().storageManager();
                id = storage.readData(this.__SKEY_NAME);
            } catch (exc) {
                this.error("ThemeManager: " + exc);
            }
            return id;
        },
        __applyCurrentTheme: function () {
            if ('CF_DESKTOP' == this.__currentTheme) {
                qx.theme.manager.Meta.getInstance().setTheme(webapp.theme.CFDesktop);
            } else if ('QX_MODERN' == this.__currentTheme) {
                qx.theme.manager.Meta.getInstance().setTheme(qx.theme.Modern);
            } else if ('QX_CLASSIC' == this.__currentTheme) {
                qx.theme.manager.Meta.getInstance().setTheme(qx.theme.Classic);
            } else if ('QX_SIMPLE' == this.__currentTheme) {
                qx.theme.manager.Meta.getInstance().setTheme(qx.theme.Simple);
            } else {
                this.error("unknwon theme: " + this.__currentTheme);
            }
        }
    }
});


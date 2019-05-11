/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("webapp.utils.LanguageManager", {
    extend: qx.core.Object,
    include: [qx.locale.MTranslation],
    construct: function () {
        this.base(arguments);
        this.__initComponents();
    },
    members: {
        __LANGUAGES: [
            {description: "Русский (RU)", id: 'RU'},
            {description: "English (EN)", id: 'EN'},
            {description: "Deutsch (DE)", id: 'DE'},
            {description: "Français (FR)", id: 'FR'}
        ],
        __SKEY_NAME: 'ui.language',
        __availableLanguages: null,
        __currentLanguage: null, // language id
        __languageSelectDialog: null,
        //=========================================================================================================================================================================================
        // API
        //=========================================================================================================================================================================================
        getCurrentLanguage: function () {
            return this.__currentLanguage;
        },
        getAvailableLanguages: function () {
            return this.__LANGUAGES;
        },
        fillMenu: function (menu, selectedId) {
            if (!menu)
                return;
            if (!selectedId)
                selectedId = this.__currentLanguage;
            var selitem = null;
            var rgroup = new qx.ui.form.RadioGroup();
            for (var i = 0, len = this.__LANGUAGES.length; i < len; i++) {
                var ln = this.__LANGUAGES[i];
                var item = new qx.ui.menu.RadioButton(ln.description);
                item.xx_lngid = ln.id;
                if (!selitem && ln.id == selectedId)
                    selitem = item;
                menu.add(item);
                rgroup.add(item);
            }
            if (selitem)
                rgroup.setSelection([selitem]);
            rgroup.addListener('changeSelection', function (e) {
                var id = e.getData()[0].xx_lngid;
                qx.event.message.Bus.dispatch(new qx.event.message.Message('wc-change-language', id));
            }, this, false);
            //
            return menu;
        },
        //=========================================================================================================================================================================================
        // private methods
        //=========================================================================================================================================================================================
        __initComponents: function () {
            var id = this.__loadPreferredLanguage();
            if (!id)
                id = (qx.core.Environment.get("org.cforge.env.preferred_lang") ? qx.core.Environment.get("org.cforge.env.preferred_lang") : 'EN');
            this.__setPreferredLanguage(id);
            // set-up listener
            qx.event.message.Bus.subscribe('wc-change-language', function (dataEvent) {
                var id = dataEvent.getData();
                if (id)
                    this.__setPreferredLanguage(id);
            }, this);
        },
        __setPreferredLanguage: function (id) {
            if (!id)
                return;
            this.__currentLanguage = id;
            this.__storePreferredLanguage(id);
            this.__applyCurrentLanguage();
        },
        __storePreferredLanguage: function (id) {
            try {
                var storage = qx.core.Init.getApplication().storageManager();
                storage.writeData(this.__SKEY_NAME, id);
            } catch (exc) {
                this.error("LanguageManager: " + exc);
            }
        },
        __loadPreferredLanguage: function () {
            var id = null;
            try {
                var storage = qx.core.Init.getApplication().storageManager();
                id = storage.readData(this.__SKEY_NAME);
            } catch (exc) {
                this.error("LanguageManager: " + exc);
            }
            return id;
        },
        __applyCurrentLanguage: function () {
            qx.locale.Manager.getInstance().setLocale(this.__currentLanguage.toLowerCase());
        }
    }
});


/**
 * @asset(webapp/*)
 * @asset(ace/*)
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("webapp.Application", {
    extend: qx.application.Standalone,
    members: {
        __stdDialog: null,
        __rpcManager: null,
        __sessionId: null,
        __storageManager: null,
        __languageManager: null,
        __themeManager: null,
        __workplaceManager: null,
        __clipboard: {},
        __resources: {},
        //================================================================================================================================================================================================
        // MAIN
        //================================================================================================================================================================================================
        main: function () {
            this.base(arguments);
            //------------------------------------------------------------------------
            if (qx.core.Environment.get("qx.debug")) qx.log.appender.Native;
            //------------------------------------------------------------------------
            var xorKey = qx.core.Environment.get("org.cforge.env.xor_key");
            var stName = qx.core.Environment.get("org.cforge.env.storage_name");
            var stVers = qx.core.Environment.get("org.cforge.env.storage_version");
            var rpcUrl = qx.core.Environment.get("org.cforge.env.rpc_url");
            //
            this.__stdDialog = new webapp.utils.StdDialogs();
            this.__storageManager = new webapp.utils.StorageManager(xorKey, stName, stVers);
            this.__rpcManager = new webapp.utils.RpcManager(rpcUrl);
            this.__taskManager = new webapp.utils.TaskManager();
            this.__languageManager = new webapp.utils.LanguageManager();
            this.__themeManager = new webapp.utils.ThemeManager();
            this.__workplaceManager = new webapp.utils.WorkplaceManager(org.cforge.dhcpmgr.definitions.Definition.SYSTEM_ROLES(), org.cforge.dhcpmgr.definitions.Definition.WORKPLACE_LIST);
            this.__sessionManager = new webapp.utils.SessionManager(rpcUrl, true);
            //
            qx.event.message.Bus.dispatch(new qx.event.message.Message('wc-login'));
        },
        //================================================================================================================================================================================================
        // Public API
        //================================================================================================================================================================================================
        clipboardPut: function (key, data) {
            this.__clipboard[key] = data;
        },
        clipboardGet: function (key) {
            return this.__clipboard[key];
        },
        resourceGet: function (key) {
            return this.__resources[key];
        },
        resourceSet: function (key, data) {
            this.__resources[key] = data;
            return data;
        },
        //
        setSessionId: function (id) {
            this.__sessionId = id;
        },
        getSessionId: function () {
            return this.__sessionId;
        },
        //================================================================================================================================================================================================
        stdDialogs: function () {
            return this.__stdDialog;
        },
        languageManager: function () {
            return this.__languageManager;
        },
        themeManager: function () {
            return this.__themeManager;
        },
        workplaceManager: function () {
            return this.__workplaceManager;
        },
        sessionManager: function () {
            return this.__sessionManager;
        },
        storageManager: function () {
            return this.__storageManager;
        },
        taskManager: function () {
            return this.__taskManager;
        },
        rpcManager: function () {
            return this.__rpcManager;
        }
    }
});

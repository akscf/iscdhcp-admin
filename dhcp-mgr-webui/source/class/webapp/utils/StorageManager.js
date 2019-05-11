/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("webapp.utils.StorageManager", {
    extend: qx.core.Object,
    include: [qx.locale.MTranslation],
    construct: function (xorkey, name, version) {
        this.base(arguments);
        this.__name = name;
        this.__version = version;
        this.__xor = new org.cforge.wsp.toolkit.XOR(xorkey);
        //
        this.__initComponents();
    },
    members: {
        __xor: null,
        __name: null,
        __version: null,
        //=======================================================================================================================================
        // init
        //=======================================================================================================================================
        __initComponents: function () {
            try {
                this.__store = qx.bom.Storage.getLocal();
                //
                var ver = this.readData('version');
                if (!ver || parseInt(ver) < this.__version) {
                    this.__store.clear();
                    this.writeData("version", this.__version);
                }
            } catch (exc) {
                this.error("storage error: " + exc);
                this.__store = null;
            }
        },
        //=======================================================================================================================================
        // api
        //=======================================================================================================================================
        readData: function (key) {
            if (!key || !this.__store)
                return;
            //
            var kn = this.__name + '.' + key;
            return this.__store.getItem(kn);
        },
        writeData: function (key, value) {
            if (!key || !this.__store)
                return;
            //
            var kn = this.__name + '.' + key;
            this.__store.setItem(kn, value);
        },
        readSData: function (key) {
            if (!key || !this.__store)
                return;
            //
            var x = this.__store.getItem(this.__name + '.' + key);
            if (x != null)
                return this.__xor.xorData(x);
            return x;
        },
        writeSData: function (key, value) {
            if (!key || !this.__store)
                return;
            //
            var x = value;
            if (value != null)
                x = this.__xor.xorData(value);
            this.__store.setItem(this.__name + '.' + key, x);
        },
        deleteData: function (key) {
            if (!key || !this.__store)
                return;
            //
            this.__store.removeItem(this.__name + '.' + key);
        },
        forEachStorage: function (callback) {
            if (!callback || !this.__store)
                return;
            //
            this.__store.forEach(callback);
        }
    }
});


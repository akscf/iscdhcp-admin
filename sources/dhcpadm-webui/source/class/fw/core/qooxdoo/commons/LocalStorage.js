/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.commons.LocalStorage", {
    type    : "singleton",
    extend  : qx.core.Object,
    include : [qx.locale.MTranslation],

    construct: function () {
        this.base(arguments);
        this.__version = qx.core.Environment.get("webapp.env.cfg_version");
        this.__prefix = qx.core.Environment.get("webapp.env.app_prefix");
        this.__xkey = qx.core.Environment.get("webapp.env.xor_key");
        this.__xkeyLen = this.__xkey.length;
        this.__initComponents();
    },
    members: {
        __xkey: null,
        __xkeyLen: 0,
        __prefix: null,
        __version: null,

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
                console.log("ERROR: " + exc);
                this.__store = null;
            }
        },

        readData: function (key) {
            if (!key || !this.__store) return;
            //
            var x = this.__store.getItem(this.__prefix + '.' + key);
            if (x != null) return this.__xor(x);
            return x;
        },

        writeData: function (key, value) {
            if (!key || !this.__store) return;
            //
            var x = value;
            if (value != null) x = this.__xor(value);
            this.__store.setItem(this.__prefix + '.' + key, x);
        },

        deleteData: function (key) {
            if (!key || !this.__store) return;
            this.__store.removeItem(this.__prefix + '.' + key);
        },

        forEachStorage: function (callback) {
            if (!callback || !this.__store) return;
            //
            this.__store.forEach(callback);
        },

        __xor: function(data) {
            if (!data || !this.__xkeyLen) return data;
            var result = '';
            var dlen = data.length;
            var key = this.__xkey;
            for (var i = 0, j = 0; i < dlen; i++, j++) {
                if (j > this.__xkeyLen) j = 0;
                result += String.fromCharCode(key.charCodeAt(j) ^ data.charCodeAt(i));
            }
            return result;
        }
    }
});

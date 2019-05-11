/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("org.cforge.wsp.toolkit.XOR", {
    extend: qx.core.Object,
    construct: function (key) {
        this.base(arguments);
        //
        this.__key = key;
        this.__keylen = (key ? key.length : 0);
    },
    members: {
        __key: null,
        __keylen: 0,
        xorData: function (data) {
            if (!data || !this.__keylen)
                return data;
            var result = '';
            var dlen = data.length;
            var key = this.__key;
            for (var i = 0, j = 0; i < dlen; i++, j++) {
                if (j > this.__keylen)
                    j = 0;
                result += String.fromCharCode(key.charCodeAt(j) ^ data.charCodeAt(i));
            }
            return result;
        }
    }
});


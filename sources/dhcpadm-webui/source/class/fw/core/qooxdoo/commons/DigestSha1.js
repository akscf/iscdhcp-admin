/**
 * based on public domain implementation
 *
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.commons.DigestSha1", {
    extend: qx.core.Object,
    construct: function (hexCase) {
        this.base(arguments);
        this.__hexcase = (typeof hexCase == 'undefined' ? 0 : hexCase);
    },
    members: {
        __hexcase: 0,
        __b64pad: "",

        sha1Hex: function (data) {
            return this._rstr2hex(this._rstr_sha1(this._str2rstr_utf8(data)));
        },
        sha1Base64: function (data) {
            return this._rstr2b64(this._rstr_sha1(this._str2rstr_utf8(data)));
        },

        //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        // private
        //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        _rstr_sha1: function (str) {
            return this._binb2rstr(this._binb_sha1(this._rstr2binb(str), str.length * 8));
        },
        _rstr_hmac_sha1: function (key, data) {
            var bkey = this._rstr2binb(key);
            if (bkey.length > 16)
                bkey = this._binb_sha1(bkey, key.length * 8);

            var ipad = Array(16), opad = Array(16);
            for (var i = 0; i < 16; i++) {
                ipad[i] = bkey[i] ^ 0x36363636;
                opad[i] = bkey[i] ^ 0x5C5C5C5C;
            }

            var hash = this._binb_sha1(ipad.concat(this._rstr2binb(data)), 512 + data.length * 8);
            return this._binb2rstr(this._binb_sha1(opad.concat(hash), 512 + 160));
        },
        _rstr2hex: function (input) {
            var hex_tab = this.__hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
            var output = "";
            var x;
            for (var i = 0; i < input.length; i++) {
                x = input.charCodeAt(i);
                output += hex_tab.charAt((x >>> 4) & 0x0F) + hex_tab.charAt(x & 0x0F);
            }
            return output;
        },
        _rstr2b64: function (input) {
            this.__b64pad = '';
            var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var output = "";
            var len = input.length;
            for (var i = 0; i < len; i += 3) {
                var triplet = (input.charCodeAt(i) << 16) | (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0) | (i + 2 < len ? input.charCodeAt(i + 2) : 0);
                for (var j = 0; j < 4; j++) {
                    if (i * 8 + j * 6 > input.length * 8) {
                        output += this.__b64pad;
                    } else {
                        output += tab.charAt((triplet >>> 6 * (3 - j)) & 0x3F);
                    }
                }
            }
            return output;
        },
        _rstr2any: function (input, encoding) {
            var divisor = encoding.length;
            var remainders = Array();
            var i, qq, x, quotient;

            var dividend = Array(Math.ceil(input.length / 2));
            for (i = 0; i < dividend.length; i++) {
                dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
            }

            while (dividend.length > 0) {
                quotient = Array();
                x = 0;
                for (i = 0; i < dividend.length; i++) {
                    x = (x << 16) + dividend[i];
                    qq = Math.floor(x / divisor);
                    x -= qq * divisor;
                    if (quotient.length > 0 || qq > 0)
                        quotient[quotient.length] = qq;
                }
                remainders[remainders.length] = x;
                dividend = quotient;
            }

            var output = "";
            for (i = remainders.length - 1; i >= 0; i--) {
                output += encoding.charAt(remainders[i]);
            }

            var full_length = Math.ceil(input.length * 8 / (Math.log(encoding.length) / Math.log(2)))
            for (i = output.length; i < full_length; i++) {
                output = encoding[0] + output;
            }
            return output;
        },
        _str2rstr_utf8: function (input) {
            var output = "";
            var i = -1;
            var x, y;

            while (++i < input.length) {
                x = input.charCodeAt(i);
                y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
                if (0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
                    x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
                    i++;
                }

                if (x <= 0x7F)
                    output += String.fromCharCode(x);
                else if (x <= 0x7FF)
                    output += String.fromCharCode(0xC0 | ((x >>> 6) & 0x1F), 0x80 | (x & 0x3F));
                else if (x <= 0xFFFF)
                    output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F));
                else if (x <= 0x1FFFFF)
                    output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07), 0x80 | ((x >>> 12) & 0x3F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F));
            }
            return output;
        },
        _str2rstr_utf16le: function (input) {
            var output = "";
            for (var i = 0; i < input.length; i++) {
                output += String.fromCharCode(input.charCodeAt(i) & 0xFF, (input.charCodeAt(i) >>> 8) & 0xFF);
            }
            return output;
        },
        _str2rstr_utf16be: function (input) {
            var output = "";
            for (var i = 0; i < input.length; i++) {
                output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF, input.charCodeAt(i) & 0xFF);
            }
            return output;
        },
        _rstr2binb: function (input) {
            var output = Array(input.length >> 2);
            for (var i = 0; i < output.length; i++) {
                output[i] = 0;
            }
            for (var i = 0; i < input.length * 8; i += 8) {
                output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (24 - i % 32);
            }
            return output;
        },
        _binb2rstr: function (input) {
            var output = "";
            for (var i = 0; i < input.length * 32; i += 8) {
                output += String.fromCharCode((input[i >> 5] >>> (24 - i % 32)) & 0xFF);
            }
            return output;
        },
        _binb_sha1: function (x, len) {
            x[len >> 5] |= 0x80 << (24 - len % 32);
            x[((len + 64 >> 9) << 4) + 15] = len;

            var w = Array(80);
            var a = 1732584193;
            var b = -271733879;
            var c = -1732584194;
            var d = 271733878;
            var e = -1009589776;

            for (var i = 0; i < x.length; i += 16) {
                var olda = a;
                var oldb = b;
                var oldc = c;
                var oldd = d;
                var olde = e;

                for (var j = 0; j < 80; j++) {
                    if (j < 16) w[j] = x[i + j];
                    else w[j] = this._bit_rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
                    var t = this._safe_add(this._safe_add(this._bit_rol(a, 5), this._sha1_ft(j, b, c, d)), this._safe_add(this._safe_add(e, w[j]), this._sha1_kt(j)));
                    e = d;
                    d = c;
                    c = this._bit_rol(b, 30);
                    b = a;
                    a = t;
                }

                a = this._safe_add(a, olda);
                b = this._safe_add(b, oldb);
                c = this._safe_add(c, oldc);
                d = this._safe_add(d, oldd);
                e = this._safe_add(e, olde);
            }
            return Array(a, b, c, d, e);

        },
        _sha1_ft: function (t, b, c, d) {
            if (t < 20)
                return (b & c) | ((~b) & d);
            if (t < 40)
                return b ^ c ^ d;
            if (t < 60)
                return (b & c) | (b & d) | (c & d);
            return b ^ c ^ d;
        },
        _sha1_kt: function (t) {
            return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514;
        },
        _safe_add: function (x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        },
        _bit_rol: function (num, cnt) {
            return (num << cnt) | (num >>> (32 - cnt));
        }
    }
});


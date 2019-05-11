/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("webapp.utils.PasswordGenerator", {
    extend: qx.core.Object,
    statics: {
        generatePassword: function (length) {
            var _a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var result = '';
            for (var i = 0; i < length; i++) {
                result += _a.charAt(Math.floor(Math.random() * _a.length));
            }
            return result;
        },
        generatePincode: function (length) {
            var _a = "0123456789";
            var result = '';
            for (var i = 0; i < length; i++) {
                result += _a.charAt(Math.floor(Math.random() * _a.length));
            }
            return result;
        }
    }
});


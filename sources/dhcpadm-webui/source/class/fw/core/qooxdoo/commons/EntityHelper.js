/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.commons.EntityHelper", {
    type : "static",
    statics: {
        toQooxdoo: function (jsObj, className) {
            if (!jsObj) {
                return null;
            }
            if (!className) {
                className = jsObj['class'];
            }
            var obj = qx.data.marshal.Json.createModel(jsObj);
            if(className) obj.setClass(className);
            return obj;
        },

        toNative: function (qxobj) {
            return qx.util.Serializer.toNativeObject(qxobj);
        },

        getObjType: function (object) {
            if (!object) return null;
            var className = object['class'];
            if (!className) {
                className = (qx.lang.Type.isObject(object) ? object.classname : qx.lang.Type.getClass(object))
            }
            return className;
        },

        isTypeof: function (object, className) {
            if (!object || !className) return false;
            var _className = object['class'];
            if (!_className) {
                _className = (qx.lang.Type.isObject(object) ? object.classname : qx.lang.Type.getClass(object));
            }
            //
            return (className == _className);
        },

        isValidObject: function (object) {
            return (object && object['class']);
        }
    }
});

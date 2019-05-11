/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("org.cforge.wsp.toolkit.EntityConverter", {
    extend: qx.core.Object,
    statics: {
        /**
         *
         */
        toQooxdoo: function (jsonObject, className) {
            if (jsonObject == null || typeof jsonObject == 'undefined') {
                return null;
            }
            if (className == null || typeof className == 'undefined') {
                className = jsonObject['class'];
                if (className == null || typeof className == 'undefined') {
                    throw "EntityHelper: undefined class name!";
                }
            }
            var obj = qx.data.marshal.Json.createModel(jsonObject);
            obj.setClass(className);
            return obj;
        },
        /**
         *
         */
        toNative: function (qooxdooObject) {
            return qx.util.Serializer.toNativeObject(qooxdooObject);
        },
        /**
         *
         */
        extractClassname: function (object) {
            if (object == null)
                return null;
            var className = object['class'];     // my native objects
            if (!className) {                     // qooxdoo objects
                className = (qx.lang.Type.isObject(object) ? object.classname : qx.lang.Type.getClass(object))
            }
            return className;
        },
        /**
         *
         */
        equalClass: function (object, className) {
            if (!object || !className)
                return false;
            var _className = object['class'];
            if (!_className)
                _className = (qx.lang.Type.isObject(object) ? object.classname : qx.lang.Type.getClass(object));
            //
            return (className == _className);
        }
    }
});

/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.widgets.FormContainerBox", {
    extend: qx.ui.container.Composite,

    construct: function () {
        this.base(arguments);
        this.setLayout(new qx.ui.layout.VBox().set({spacing: 1, alignX: 'left'}, null));
        //
        this.__fields = [];
    },
    members: {
        __RERUIRED_COLOR: '#1975ff',
        __OPTIONAL_COLOR: 'text',
        __fields: null,

        getFields: function () {
            return this.__fields;
        },

        clearValidation: function () {
            this.__clearValidation();
        },

        validateForm: function () {
            this.__validateForm();
        },

        addField: function (labelText, field, buttons) {
            if (!field) return;
            return this.__addField(labelText, field, buttons);
        },

        addMultipleField: function (labelText, fields) {
            if (!fields)
                return;
            return this.__addMultipleField(labelText, fields);
        },

        addSeparator: function () {
            this.__addSeparator();
        },

        //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        // private
        //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        __clearValidation: function () {
            for (var i = 0; i < this.__fields.length; i++) {
                var field = this.__fields[i];
                if (field.getRequired()) {
                    field.setValid(true);
                }
            }
        },

        __validateForm: function () {
            this.__clearValidation();
            for (var i = 0; i < this.__fields.length; i++) {
                var field = this.__fields[i];
                if (!field.getRequired())
                    continue;
                var val = field.getValue();
                if (val == null || val == "") {
                    field.set({value: null, valid: false, invalidMessage: this.tr("This is a required field!")});
                    field.focus();
                    throw "invalid";
                }
            }
        },

        __addField: function (labelText, field, buttons) {
            var storeField = (field.classname.indexOf('qx.ui.form') == 0 || field.classname.indexOf('fw.core.qooxdoo.ui') == 0);
            var required = (storeField && field.getRequired());
            if (this.__fields.length) {
                var box = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({alignX: 'left'}, null));
                box.set({decorator: null, height: 3}, null);
                this.add(box, null);
            }
            //
            if (labelText) {
                var box1 = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({alignX: 'left'}, null));
                //box1.add(new qx.ui.basic.Label().set({value: labelText, textColor: (required ? this.__RERUIRED_COLOR : this.__OPTIONAL_COLOR)}, null), {flex: 1});
                box1.add(new qx.ui.basic.Label().set({value: labelText, font: (required ? 'bold' : 'default')}, null), {flex: 1});
                this.add(box1, null);
            }
            // field + buttons
            var box2 = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({spacing: 2, alignX: 'left'}, null));
            box2.add(field, {flex: 1});
            if (buttons) {
                if (buttons instanceof Array) {
                    for (var i = 0; i < buttons.length; i++) {
                        box2.add(buttons[i], null);
                    }
                } else {
                    box2.add(buttons, null);
                }
            }
            this.add(box2, null);
            //
            if (storeField)
                this.__pushField(field);
            return field;
        },

        __addMultipleField: function (labelText, fields) {
            if (!fields)
                return;
            if (labelText) {
                var box1 = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({alignX: 'left'}, null));
                box1.add(new qx.ui.basic.Label().set({value: labelText}, null), {flex: 1});
                this.add(box1, null);
            }
            var box2 = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({spacing: 2, alignX: 'left'}, null));
            if (fields instanceof Array) {
                for (var i = 0; i < fields.length; i++) {
                    var field = fields[i];
                    box2.add(field, null);
                    if (field.classname.indexOf('qx.ui.form'))
                        this.__fields.push(field);
                }
            } else {
                box2.add(fields, null);
            }
            this.add(box2, null);
        },

        __addSeparator: function () {
            var box1 = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({alignX: 'center'}, null));
            box1.set({decorator: null, height: 6}, null);
            var box2 = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({alignX: 'center'}, null));
            box2.set({decorator: 'separator-vertical', height: 6}, null);
            //
            this.add(box1, null);
            this.add(box2, null);
        },

        __pushField: function (field) {
            this.__fields.push(field);
        }
    }
});

/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("org.cforge.qooxdoo.ui.form.FormContainer1", {
    extend: qx.ui.container.Composite,
    construct: function () {
        this.base(arguments);
        this.setLayout(new qx.ui.layout.VBox().set({spacing: 1, alignX: 'left'}, null));
        //
        this.__fields = [];
    },
    members: {
        __RERUIRE_COLOR: '#FF0000',
        __OPTIONAL_COLOR: '#000000',
        __fields: null,
        //===========================================================================================================================================================================================
        // Public
        //===========================================================================================================================================================================================
        getFields: function () {
            return this.xgetFields();
        },
        xgetFields: function () {
            return this.__fields;
        },
        clearValidation: function () {
            this._clearValidation();
        },
        _clearValidation: function () {
            for (var i = 0; i < this.__fields.length; i++) {
                var field = this.__fields[i];
                if (field.getRequired()) {
                    field.setValid(true);
                }
            }
        },
        validateForm: function () {
            this._validateForm();
        },
        _validateForm: function () {
            this._clearValidation();
            for (var i = 0; i < this.__fields.length; i++) {
                var field = this.__fields[i];
                if (!field.getRequired())
                    continue;
                var val = field.getValue();
                if (val == null || val == "") {
                    field.set({value: null, valid: false, invalidMessage: this.tr("Require field!")});
                    field.focus();
                    throw "invalid";
                }
            }
        },
        // vbox: label\nfiled->buttons
        addField: function (labelText, field, buttons) {
            if (!field)
                return;
            return this._addField(labelText, field, buttons);
        },
        _addField: function (labelText, field, buttons) {
            var storeField = (field.classname.indexOf('qx.ui.form') == 0 || field.classname.indexOf('org.cforge.qooxdoo.ui') == 0);
            var required = (storeField && field.getRequired());
            //--------------------------------------------------------------------
            if (this.__fields.length) {
                var box = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({spacing: 1, alignX: 'left'}, null));
                box.set({decorator: null, height: 3}, null);
                this.add(box, null);
            }
            //
            if (labelText) {
                var box1 = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({spacing: 1, alignX: 'left'}, null));
                box1.add(new qx.ui.basic.Label().set({value: labelText + ':', textColor: (required ? this.__RERUIRE_COLOR : this.__OPTIONAL_COLOR)}, null), {flex: 1});
                this.add(box1, null);
            }
            // field + buttons
            var box2 = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({spacing: 3, alignX: 'left'}, null));
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
        addMultipleField: function (labelText, fields) {
            if (!fields)
                return;
            return this._addMultipleField(labelText, fields);
        },
        _addMultipleField: function (labelText, fields) {
            if (!fields)
                return;
            if (labelText) {
                var box1 = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({spacing: 1, alignX: 'left'}, null));
                box1.add(new qx.ui.basic.Label().set({value: labelText + ':', textColor: '#000000'}, null), {flex: 1});
                this.add(box1, null);
            }
            var box2 = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({spacing: 5, alignX: 'left'}, null));
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
        addSeparator: function () {
            this._addSeparator();
        },
        _addSeparator: function () {
            var box1 = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({spacing: 1, alignX: 'center'}, null));
            box1.set({decorator: null, height: 6}, null);
            var box2 = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({spacing: 1, alignX: 'center'}, null));
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

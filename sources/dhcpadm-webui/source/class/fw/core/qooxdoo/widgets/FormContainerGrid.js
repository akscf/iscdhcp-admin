/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.widgets.FormContainerGrid", {
    extend: qx.ui.container.Composite,
    construct: function () {
        this.base(arguments);
        //
        var layout = new qx.ui.layout.Grid(2, 2);
        layout.setColumnAlign(0, 'right', 'middle'); // label
        layout.setColumnAlign(1, 'left', 'middle');  // field
        layout.setColumnAlign(2, 'left', 'middle');  // buttons
        layout.setColumnFlex(1, 1);
        this.setLayout(layout);
    },
    members: {
        __RERUIRED_COLOR: '#1975ff',
        __OPTIONAL_COLOR: 'text',
        __currentRow    : 0,

        getFields: function () {
            var layout = this.getLayout();
            var rows = layout.getRowCount();
            var fields = [];
            for (var i = 0; i < rows; i++) {
                var field = layout.getCellWidget(i, 1);
                if (field && field.__xformF1) {
                    fields.push(field);
                }
            }
            return fields;
        },

        clearValidation: function () {
            var layout = this.getLayout();
            var rows = layout.getRowCount();
            for (var i = 0; i < rows; i++) {
                var field = layout.getCellWidget(i, 1);
                if (field && field.__xformF1 && field.getRequired()) {
                    field.setValid(true);
                }
            }
        },

        validateForm: function () {
            var layout = this.getLayout();
            var rows = layout.getRowCount();
            for (var i = 0; i < rows; i++) {
                var field = layout.getCellWidget(i, 1);
                if (field && field.__xformF1 && field.getRequired()) {
                    var val = field.getValue();
                    if (val == null || val == "") {
                        field.set({value: null, valid: false, invalidMessage: this.tr("This is a required field!")}, null);
                        field.focus();
                        throw "invalid";
                    }
                }
            }
        },

        addField: function (labelText, field, buttons) {
            if (!field) return;
            field.__xformF1 = (qx.lang.String.contains(field.classname, 'qx.ui.form') || qx.lang.String.contains(field.classname, 'fw.core.qooxdoo.widgets'));
            var required = (field.__xformF1 && field.getRequired());
            //
            if (labelText) {
                //this.add(new qx.ui.basic.Label().set({value: labelText, textColor: (required ? this.__RERUIRED_COLOR : this.__OPTIONAL_COLOR)}, null), {row: this.__currentRow, column: 0});
                this.add(new qx.ui.basic.Label().set({value: labelText, font: (required ? 'bold' : 'default')}, null), {row: this.__currentRow, column: 0});
            }
            //
            if (!buttons) {
                this.add(field, {row: this.__currentRow, column: 1, colSpan: 2});
            } else {
                this.add(field, {row: this.__currentRow, column: 1});
                if (buttons instanceof Array) {
                    var box = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({spacing: 2, alignX: 'left'}, null));
                    for (var i = 0; i < buttons.length; i++) {
                        box.add(buttons[i], null);
                    }
                    this.add(box, {row: this.__currentRow, column: 2});
                } else {
                    this.add(buttons, {row: this.__currentRow, column: 2});
                }
            }
            //
            this.__currentRow++;
            return field;
        },

        addMultipleField: function (labelText, fields) {
            if (!fields) return;
            //
            if (labelText) {
                this.add(new qx.ui.basic.Label().set({value: labelText}, null), {row: this.__currentRow, column: 0});
            }
            var box2 = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({spacing: 2, alignX: 'left'}, null));
            if (fields instanceof Array) {
                for (var i = 0; i < fields.length; i++) {
                    var field = fields[i];
                    field.__xformF1 = qx.lang.String.contains(field.classname, 'qx.ui.form');
                    box2.add(fields[i], null);
                }
                this.add(box2, {row: this.__currentRow, column: 1});
            } else {
                this.add(fields, {row: this.__currentRow, column: 1});
            }
            this.__currentRow++;
            this.add(box2, null);
        },

        addSeparator: function () {
            var box1 = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({alignX: 'center'}, null));
            box1.set({decorator: null, height: 8}, null);
            var box2 = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({alignX: 'center'}, null));
            box2.set({decorator: 'separator-vertical', height: 8}, null);
            //
            this.add(box1, {row: this.__currentRow, column: 0, colSpan: 3});
            this.__currentRow++;
            this.add(box2, {row: this.__currentRow, column: 0, colSpan: 3});
            this.__currentRow++;
        }
    }
});

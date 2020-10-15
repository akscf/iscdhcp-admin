/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.widgets.TableStatusBarSearchWidget", {
        extend:qx.ui.container.Composite,

        construct:function (self, handler) {
            this.base(arguments);
            this.setLayout(new qx.ui.layout.HBox().set({spacing: 1, alignX: 'left'}, null));
            this.setDecorator("background-box");
            this.setMaxHeight(22);
            this.setPadding(0);
            this.setMargin(0);
            //
            var ico = new qx.ui.basic.Atom(null, fw.core.qooxdoo.res.IconSet.ICON('stdFilter'));
            ico.setEnabled(false);
            //
            this.__textField = new qx.ui.form.TextField();
            this.__textField.set({
                nativeContextMenu: true,
                decorator: null,
                placeholder: this.tr("text for search")
            });
            //
            this.__textField.addListener("focusin", function (e) {
                this.setDecorator('focused-inset');
            }, this, false);
            this.__textField.addListener("focusout", function (e) {
                this.setDecorator("background-box");
            }, this, false);
            this.__textField.addListener("keyup", function (e) {
                if (e.getKeyIdentifier() == 'Enter') {
                    handler.call(self, this.__textField.getValue());
                }
            }, this, false);
            //
            this.add(ico, null);
            this.add(this.__textField, {flex: 1});
        },

        members:{
            __textField: null,

            getFilterText: function() {
                return this.__textField.getValue();
            },

            setFilterText: function(v) {
                this.__textField.setValue(v);
            }

        }
    }
);


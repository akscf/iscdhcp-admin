/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.dialogs.FormBoxDialog", {
        extend:fw.core.qooxdoo.dialogs.GenericDialog,

        construct:function (captionText, captionIcon) {
            this.base(arguments, captionText, captionIcon);
            this.setLayout(new qx.ui.layout.VBox().set({spacing:5, alignX:'center'}, null));
            this.setWidth(450);
            //
            this.__fieldsContainer = new fw.core.qooxdoo.widgets.FormContainerBox();
            //this.__fieldsContainer.set({padding:4});
            //
            this.__buttonsContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({spacing:5, alignX:'right'}, null));
            this.__buttonsContainer.set({decorator: 'separator-vertical', paddingTop: 5, paddingLeft: 4, paddingRight: 0, paddingBottom: 1}, null);
            //
            this.add(this.__fieldsContainer, {flex:1});
            //this.add(new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({height: 1}, null), null);
            this.add(this.__buttonsContainer, null);
        },

        members:{
            __fieldsContainer:null,
            __buttonsContainer:null,

            getButtonsContainer:function () {
                return this.__buttonsContainer;
            },

            getFieldsContainer:function () {
                return this.__fieldsContainer;
            },

            clearValidationErros:function () {
                this.__fieldsContainer.clearValidation();
            },

            validateForm:function () {
                this.__fieldsContainer.validateForm();
            },

            addButton:function (button) {
                if (button) {
                    button.setMinWidth(100);
                    this.__buttonsContainer.add(button);
                }
                return button;
            },

            addField:function (labelText, field, buttons) {
                return this.__fieldsContainer.addField(labelText, field, buttons);
            },

            addMultipleField:function (labelText, fields) {
                return this.__fieldsContainer.addMultipleField(labelText, fields);
            },

            addSeparator:function () {
                return this.__fieldsContainer.addSeparator();
            }

        }
    }
);


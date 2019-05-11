/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("org.cforge.qooxdoo.ui.dialog.FormDialog",
    {
        extend:org.cforge.qooxdoo.ui.dialog.GenericDialog,
        /**
         * formMode variants: form1=hbox, form2=vbox
         */
        construct:function (captionText, captionIcon, formMode) {
            this.base(arguments, captionText, captionIcon);
            this.setLayout(new qx.ui.layout.VBox().set({spacing:5, alignX:'center'}, null));
            this.setWidth(520);
            //
            if (!formMode || formMode == 'form2') { // hbox
                this.__fieldContainer = new org.cforge.qooxdoo.ui.form.FormContainer2();
                //
                this.__buttonContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({spacing:5, alignX:'right'}, null));
                this.__buttonContainer.set({decorator: 'separator-vertical', paddingTop: 5})
                //
                this.add(this.__fieldContainer, {flex:1});
                this.add(new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({height: 5}));
                this.add(this.__buttonContainer, null);
            } else {
                this.__fieldContainer = new org.cforge.qooxdoo.ui.form.FormContainer1();
                this.__fieldContainer.set({decorator:'main', padding:4});
                //
                this.__buttonContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({spacing:5, alignX:'right'}, null));
                //
                this.add(this.__fieldContainer, {flex:1});
                this.add(this.__buttonContainer, null);
            }
        },

        members:{
            __formMode:null,
            __fieldContainer:null,
            __buttonContainer:null,

            //===========================================================================================================================================================================================
            // Public
            //===========================================================================================================================================================================================
            getButtonContainer:function () {
                return this.__buttonContainer;
            },

            getFieldContainer:function () {
                return this.__fieldContainer;
            },

            //------------------------------------------------------------------------------------------------------
            clearValidation:function () {
                this.__fieldContainer.clearValidation();
            },

            validateForm:function () {
                this.__fieldContainer.validateForm();
            },

            addButton:function (button) {
                if (button) {
                    button.setMinWidth(100);
                    this.__buttonContainer.add(button);
                }
                return button;
            },

            addField:function (labelText, field, buttons) {
                return this.__fieldContainer.addField(labelText, field, buttons);
            },

            addMultipleField:function (labelText, fields) {
                return this.__fieldContainer.addMultipleField(labelText, fields);
            },

            addSeparator:function () {
                return this.__fieldContainer.addSeparator();
            }

        }
    }
);


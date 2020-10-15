/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.dialogs.SimpleDialog", {
        extend:fw.core.qooxdoo.dialogs.GenericDialog,

        construct:function (captionText, captionIcon) {
            this.base(arguments, captionText, captionIcon);
            this.setLayout(new qx.ui.layout.VBox().set({spacing:5, alignX:'center'}, null));
            this.setMinWidth(100);
            this.setMinHeight(100);
            //this.setEnableEscapeDefaultAction();
            //
            this.__contentContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox().set({spacing:1, alignX:'center'}, null));
            //
            this.__buttonsContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({spacing:5, alignX:'right'}, null));
            this.__buttonsContainer.set({decorator: 'separator-vertical', paddingTop: 5, paddingLeft: 4, paddingRight: 0, paddingBottom: 1}, null);
            //
            this.add(this.__contentContainer, {flex:1});
            this.add(this.__buttonsContainer, null);
        },

        members:{
            __contentContainer:null,
            __buttonsContainer:null,

            getButtonsContainer:function () {
                return this.__buttonsContainer;
            },

            getContentContainer:function () {
                return this.__contentContainer;
            },

            addButton:function (button) {
                if (button) {
                    button.setMinWidth(100);
                    this.__buttonsContainer.add(button);
                }
                return button;
            },

            addContent:function (widget, param) {
                if (widget) this.__contentContainer.add(widget, param);
                return widget;
            }

        }
    }
);


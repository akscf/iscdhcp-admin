/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("org.cforge.qooxdoo.ui.dialog.StandardDialog",
    {
        extend:org.cforge.qooxdoo.ui.dialog.GenericDialog,

        construct:function (captionText, captionIcon) {
            this.base(arguments, captionText, captionIcon);
            // dialog layout
            this.setLayout(new qx.ui.layout.VBox().set({spacing:5, alignX:'center'}, null));
            // content container
            this.__contentContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox().set({spacing:1, alignX:'center'}, null));
            this.__contentContainer.set({decorator:'main', padding:0})
            // button container
            this.__buttonContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({spacing:5, alignX:'right'}, null));
            //
            this.add(this.__contentContainer, {flex:1});
            this.add(this.__buttonContainer, null);
        },

        members:{
            __contentContainer:null,
            __buttonContainer:null,

            //===========================================================================================================================================================================================
            // Public
            //===========================================================================================================================================================================================
            getButtonContainer:function () {
                return this.__buttonContainer;
            },

            getContentContainer:function () {
                return this.__contentContainer;
            },

            setContentLayout:function (layout) {
                this.__contentContainer.setLayout(layout);
            },

            /**
             * dialog button add and return
             */
            addButton:function (button) {
                if (button) {
                    button.setMinWidth(100);
                    this.__buttonContainer.add(button);
                }
                return button;
            },

            /**
             * dialog button add and return
             */
            addContent:function (widget, param) {
                if (widget) this.__contentContainer.add(widget, param);
                return widget;
            }
        }
    }
);

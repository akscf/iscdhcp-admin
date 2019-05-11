/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("org.cforge.qooxdoo.ui.dialog.GenericDialog",
    {
        extend:qx.ui.window.Window,

        construct:function (captionText, captionIcon) {
            this.base(arguments, captionText, captionIcon);
            //
            this.setModal(true);
            this.setShowClose(false);
            this.setShowMinimize(false);
            this.setShowMaximize(false);
            this.setAllowMaximize(false);
            this.setAllowMinimize(false);
            // esc listener
            this.addListener("keypress", function (keyEvent) {
                if (this.__dialogCloseButton != null && keyEvent.getKeyIdentifier() === "Escape") {
                    this.__dialogCloseButton.execute();
                }
            }, this, false);
            // focus and center
            this.addListener("appear", function () {
                this.center();
                // focus
                if (this.__defaultFocusWidget != null) {
                    this.__defaultFocusWidget.focus();
                }
            }, this, false);
        },

        events:{
            'closeApprove':"qx.event.type.Data"
        },

        members:{
            __dialogCloseButton:null,
            __defaultFocusWidget:null,

            //===========================================================================================================================================================================================
            // Public
            //===========================================================================================================================================================================================
            setDialogCloseButton:function (button) {
                this.__dialogCloseButton = button;
            },

            getDialogCloseButton:function () {
                return this.__dialogCloseButton;
            },

            setDefaultFocusWidget:function (widget) {
                this.__defaultFocusWidget = widget;
            },

            getDefaultFocusWidget:function () {
                return this.__defaultFocusWidget;
            },

            setAllowResizable:function (flag) {
                this.setResizable(flag, flag, flag, flag);
            },

            setDimension:function (width, height) {
                this.setWidth(width);
                this.setHeight(height);
            },

            setDimensionMin:function (width, height) {
                this.setMinWidth(width);
                this.setMinHeight(height);
            },

            setDimensionMax:function (width, height) {
                this.setMaxWidth(width);
                this.setMaxHeight(height);
            },

            closeApprove:function (data) {
                this.fireDataEvent('closeApprove', data);
                this.close();
            }
        }
    }
);

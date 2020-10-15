/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.dialogs.GenericDialog", {
        extend:fw.core.qooxdoo.widgets.XWindow,

        construct:function (captionText, captionIcon) {
            this.base(arguments, captionText, captionIcon);
            //
            this.setModal(true);
            this.setShowClose(false);
            this.setShowMinimize(false);
            this.setShowMaximize(false);
            this.setAllowMaximize(false);
            this.setAllowMinimize(false);
            //
            this.addListener("appear", function () {
                this.center();
                if (this.__defaultFocusWidget) {
                    this.__defaultFocusWidget.focus();
                }
            }, this, false);
        },

        events:{
            'approved'  : "qx.event.type.Data"
            //'canceled'  : "qx.event.type.Event"
        },

        members:{
            _callback: null,
            __fsetEscHandler : false,
            __dialogCloseButton:null,
            __defaultFocusWidget:null,

            setEnableEscapeDefaultAction: function() {
                if(!this.__fsetEscHandler) {
                    this.__fsetEscHandler = true;
                    this.addListener("keyup", function (keyEvent) {
                        if (this.__dialogCloseButton && keyEvent.getKeyIdentifier() === "Escape") {
                            this.__dialogCloseButton.execute();
                        }
                    }, this, false)
                }
            },

            setUserCallback: function (callback) {
                this._callback = callback;
            },

            getUserCallback: function () {
                return this._callback;
            },

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
                this.fireDataEvent('approved', data, null, false);
                this.close();
            }
        }
    }
);

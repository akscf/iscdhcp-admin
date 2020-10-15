/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.dialogs.LoginDialog", {
        extend:fw.core.qooxdoo.dialogs.GenericDialog,

        construct:function (captionText) {
            this.base(arguments, captionText, fw.core.qooxdoo.res.IconSet.ICON('stdLoginDialog'));
            this.setLayout(new qx.ui.layout.VBox().set({spacing:5, alignX:'center'}, null));
            this.setWidth(400);
            this.setMovable(false);
            this.setResizable(false);
            //
            var localeGroup = new qx.ui.form.RadioGroup();
            var localeMenu = new qx.ui.menu.Menu();
            var localeButton = new fw.core.qooxdoo.widgets.CaptionBarMenuButton(this.tr('change locale'), fw.core.qooxdoo.res.IconSet.ICON('stdLoginLocale'), localeMenu);
            localeButton.setPaddingLeft(2);
            this.getChildControl("captionbar").add(localeButton, {row: 0, column:6});
            //
            var selItem = null;
            var curLng = qx.locale.Manager.getInstance().getLocale();
            if(curLng && curLng.length >= 2) { curLng = curLng.substr(0,2).toUpperCase(); }
            for (var i = 0, len = this.__LANGUAGES.length; i < len; i++) {
                var ln = this.__LANGUAGES[i];
                var item = new qx.ui.menu.RadioButton(ln.description);
                item.__lcid = ln.id;
                if (!selItem && ln.id == curLng) selItem = item;
                localeMenu.add(item, null);
                localeGroup.add(item);
            }
            if (selItem) localeGroup.setSelection([selItem]);
            localeGroup.addListener('changeSelection', function (e) {
                qx.event.message.Bus.dispatch(new qx.event.message.Message('msg-locale-set', e.getData()[0].__lcid));
            }, this, false);
            //
            this.__fieldsContainer = new fw.core.qooxdoo.widgets.FormContainerBox();
            this.__fieldsContainer.getLayout().setSpacing(0);
            this.__buttonsContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({spacing:5, alignX:'right'}, null));
            this.__buttonsContainer.set({paddingTop: 4, paddingLeft: 4, paddingRight: 0, paddingBottom: 1}, null);
            //
            this.add(this.__fieldsContainer, {flex:1});
            this.add(this.__buttonsContainer, null);
        },

        members:{
            __LANGUAGES: [
                {description: "English (EN)", id: 'EN'},
                {description: "Русский (RU)", id: 'RU'}
            ],
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


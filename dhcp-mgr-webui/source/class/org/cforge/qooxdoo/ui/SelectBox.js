/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("org.cforge.qooxdoo.ui.SelectBox",
    {
        extend:qx.ui.form.SelectBox,

        construct:function (displayAttribute, list) {
            this.base(arguments);
            //
            var model = qx.data.marshal.Json.createModel(list);
            this.__listController = new qx.data.controller.List(model, this, (!displayAttribute ? 'description' : displayAttribute));
        },

        members:{
            __listController:null,

            setSelectedItem:function (item) {
                this.setModelSelection([item]);
            },

            setSelectedId:function (id) {
                if (id == null) return;
                var dmodel = this.__listController.getModel();
                var len = dmodel.getLength();
                if (len > 0) {
                    for (var i = 0; i < len; i++) {
                        var item = dmodel.getItem(i);
                        if (item.getId() == id) {
                            this.setModelSelection([item]);
                            break;
                        }
                    }
                }
            },

            getListController:function () {
                return this.__listController;
            },

            getItemByIndex:function (idx) {
                return this.__listController.getModel().getItem(idx);
            },

            getSelectedItem:function () {
                return this.__listController.getSelection().getItem(0);
            }
        }
    }
);


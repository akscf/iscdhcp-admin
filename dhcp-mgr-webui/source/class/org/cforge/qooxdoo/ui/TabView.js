/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("org.cforge.qooxdoo.ui.TabView",
    {
        extend:qx.ui.tabview.TabView,

        construct:function (withFirstSelectEvent) {
            this.base(arguments);
            this.setContentPadding(0, 0, 0, 0);
            //
            if (withFirstSelectEvent) {
                this.addListener('changeSelection', function (e) {
                    var sel = e.getData();
                    var page = sel ? sel[0] : null;
                    if (!page || page.xxx_cuf_fts) return;
                    page.xxx_cuf_fts = true;
                    try {
                        page.doSelect();
                    } catch (exc) {
                    }
                }, this, false);
            }
        },

        members:{

        }
    }
);


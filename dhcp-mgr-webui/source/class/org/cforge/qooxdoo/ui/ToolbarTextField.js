/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("org.cforge.qooxdoo.ui.ToolbarTextField",
    {
        extend:qx.ui.form.TextField,

        construct:function (placeholder, context, handler) {
            this.base(arguments);
            this.setAlignY('middle');
            if (placeholder) {
                this.setPlaceholder(placeholder);
            }
            if (handler) {
                this.addListener("keyup", function (e) {
                    if (e.getKeyIdentifier() == 'Enter') handler.call(context);
                }, context, false);
            }
        },

        members:{

        }
    }
);


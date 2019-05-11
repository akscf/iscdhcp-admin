/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("webapp.utils.WidgetHelper", {
    extend: qx.core.Object,
    statics: {
        widgetEnable: function (value, widgets) {
            if (!widgets)
                return;
            for (var i = 0; i < widgets.length; i++) {
                widgets[i].setEnabled(value);
            }
        }
    }
});


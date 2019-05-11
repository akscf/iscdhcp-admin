/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("webapp.utils.TaskManager", {
    extend: qx.core.Object,
    include: [qx.locale.MTranslation],
    construct: function () {
        this.base(arguments);
    },
    members: {
        fork: function (ctx, showIndicator, callabck) {
            if (showIndicator) {
                this.__showBusyIndicator(true, this.tr("Please wait, it may take some time..."));
            }
            //
            var self = this;
            var xtimer = setTimeout(function () {
                try {
                    callabck.call(ctx);
                } catch (exc) {
                    self.error("worker: " + exc);
                } finally {
                    if (showIndicator) {
                        self.__showBusyIndicator(false, null);
                    }
                }
            }, 100);
        },
        __showBusyIndicator: function (flag, text) {
            if (!this.__busyIndicator) {
                this.__busyIndicator = new webapp.dialogs.BusyIndicator();
            }
            if (flag)
                this.__busyIndicator.open(text);
            else
                this.__busyIndicator.close();
        }
    }
});


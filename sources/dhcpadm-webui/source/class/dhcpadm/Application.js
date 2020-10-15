/**
 * @asset(stdicons/*)
 * @asset(dhcpadm/*)
 * @asset(ace/*)
 *
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 **/
qx.Class.define("dhcpadm.Application", {
    extend : qx.application.Standalone,
    members : {
        main : function() {
            this.base(arguments);
            //
            if (qx.core.Environment.get("qx.debug")) {
                qx.log.appender.Native;
            }
            //
            new fw.core.qooxdoo.srvc.LocaleSrvc();
            new fw.core.qooxdoo.srvc.AuthSrvc();
            new fw.core.qooxdoo.srvc.WseSrvc();
            //
            new fw.core.qooxdoo.srvc.WorkplacesSrvc({
                'ADMIN' : {clazz: dhcpadm.workplaces.WPAdmin, description: ''}
            });
            //
            qx.event.message.Bus.dispatch(new qx.event.message.Message('msg-do-login'));
        }
    }
});

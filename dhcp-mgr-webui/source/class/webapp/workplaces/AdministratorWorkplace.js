/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("webapp.workplaces.AdministratorWorkplace", {
    extend: org.cforge.qooxdoo.ui.workplace.GenericWorkplace,
    construct: function () {
        this.base(arguments);
        this.__initComponents();
    },
    members: {

        //===========================================================================================================================================================================================
        // Public
        //===========================================================================================================================================================================================
        doSelect: function () {
        },

        //===========================================================================================================================================================================================
        // Private
        //===========================================================================================================================================================================================
        __initComponents: function () {
            this.__configPage = new webapp.workplaces.administrator.pages.ConfigPage();
            this.__leasesPage = new webapp.workplaces.administrator.pages.LeasesPage();
            this.__logsPage = new webapp.workplaces.administrator.pages.LogsPage();
            //
            var tview = new org.cforge.qooxdoo.ui.TabView(true);
            //tview.setContentPadding(0, 0, 0, 0);
            tview.add(this.__configPage);
            tview.add(this.__leasesPage);
            tview.add(this.__logsPage);
            this.add(tview, {flex: 1});
            //
            this.__configPage.doSelect();
        }
    }
});



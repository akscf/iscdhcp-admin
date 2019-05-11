/**
 *
 * @author: AlexandirK <aks@cforge.org>
 */
qx.Class.define("webapp.workplaces.administrator.commons.ConfigEditorWidget", {
    extend: qx.ui.container.Composite,
    construct: function () {
        this.base(arguments);
        this.setLayout(new qx.ui.layout.VBox().set({spacing: 1, alignX: 'center'}, null));
        this.__initComponents();
    },

    members: {
        __editor: null,
        __searchTextCur: null,
        __searchTextOld: null,

        //=================================================================================================================================================================================================================
        // api
        //=================================================================================================================================================================================================================
        xdoLoadBuffer: function () {
            this.__doLoadBuffer(null);
        },

        //=================================================================================================================================================================================================================
        // Private
        //=================================================================================================================================================================================================================
        __initComponents: function () {
            var toolbar = new org.cforge.qooxdoo.ui.Toolbar();
            toolbar.add(new org.cforge.qooxdoo.ui.ToolbarButton(null, this.tr('Reload config'), 'webapp/16x16/refresh.png', this, this.__doLoadBuffer));
            toolbar.add(new org.cforge.qooxdoo.ui.ToolbarButton(null, this.tr('Save changes'), 'webapp/16x16/disk_blue.png', this, this.__doSaveBuffer));
            toolbar.addSeparator();
            toolbar.add(new org.cforge.qooxdoo.ui.ToolbarButton(null, this.tr('Undo'), 'webapp/16x16/undo.png', this, this.__doUndo));
            toolbar.addSeparator();
            this.__fieldSearch = toolbar.addFlex(new qx.ui.form.TextField().set({alignY: "middle", liveUpdate: true, placeholder: this.tr("enter text for search")}, null));
            this.__fieldSearch.addListener('changeValue', function (e) {
                this.__searchTextCur = e.getData();
            }, this);
            this.__fieldSearch.addListener("keyup", function (e) {
                if (e.getKeyIdentifier() == 'Enter') this.__doFind(null);
            }, this);
            toolbar.add(new org.cforge.qooxdoo.ui.ToolbarButton(null, this.tr('Find'), 'webapp/16x16/find.png', this, this.__doFind));
            //
            this.__editor = new webapp.workplaces.administrator.commons.AceEditorWidget('text');
            //
            this.add(toolbar, null);
            this.add(this.__editor, {flex: 1});
        },
        //===========================================================================================================================================================================================
        // commands
        //===========================================================================================================================================================================================
        __doUndo:function (e) {
            var ace = this.__editor.getEditorInstance();
            ace.undo();
        },

        __doFind: function (e) {
            if (this.__searchTextCur == null) {
                return;
            }
            if (this.__searchTextOld == null || this.__searchTextOld != this.__searchTextCur) {
                this.__searchTextOld = this.__searchTextCur;
                this.__editor.getEditorInstance().find(this.__searchTextCur, {backwards: false, wrap: false, caseSensitive: false, wholeWord: false, regExp: false});
                var s = this.__editor.getEditorInstance().getSelection();
                if (s) this.__searchLastRange = s.getRange();
            } else {
                this.__editor.getEditorInstance().findNext();
                var s = this.__editor.getEditorInstance().getSelection();
                if (s) {
                    var cr = s.getRange();
                    var or = this.__searchLastRange;
                    if (or && or.start.row == cr.start.row && or.start.column == cr.start.column) {
                        this.__searchTextOld = null;
                        this.__editor.getEditorInstance().getSelection().moveCursorTo(0, 0, true);
                        this.__doFind(null);
                        return;
                    }
                    this.__searchLastRange = cr;
                }
            }
        },
        __doLoadBuffer: function (e) {
            var self = this;
            org.cforge.dhcpmgr.services.DhcpServerManagementService.configRead(function (result, exception) {
                if (exception) return;
                self.__editor.setTextBuffer(result);
            });
        },
        __doSaveBuffer: function (e) {
            var txt = this.__editor.getTextBuffer();
            var self = this;
            org.cforge.dhcpmgr.services.DhcpServerManagementService.configWrite(txt, function (result, exception) {
            });
        }
    }
});

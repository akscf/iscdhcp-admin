/**
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("dhcpadm.workplaces.admin.commons.ConfigEditorWidget", {
    extend: qx.ui.container.Composite,
    construct: function () {
        this.base(arguments);
        this.setLayout(new qx.ui.layout.VBox().set({spacing: 0, alignX: 'center'}, null));
        this.__initComponents();
    },

    members: {
        __flagDontAks: false,
        __editor: null,
        __searchTextCur: null,
        __searchTextOld: null,

        //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        // public
        //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        performDefaultAction: function () {
            this.__doUpdateServerInfo(null);
            this.__doLoadBuffer(null);
        },

        //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        // private
        //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        __initComponents: function () {
            var toolbar = new fw.core.qooxdoo.widgets.Toolbar();
            toolbar.setPaddingLeft(48);
            toolbar.addButton(this.tr('Save changes'), fw.core.qooxdoo.res.IconSet.ICON('save'), this, this.__doSaveBuffer);
            toolbar.addButton(this.tr('Reload config'), fw.core.qooxdoo.res.IconSet.ICON('refresh'), this, this.__doLoadBuffer);
            toolbar.addSeparator();
            toolbar.addButton(this.tr('Undo'), fw.core.qooxdoo.res.IconSet.ICON('undo'), this, this.__doUndo);
            toolbar.addSeparator();
            toolbar.addButton(this.tr('Start server'), fw.core.qooxdoo.res.IconSet.ICON('mediaPlay'), this, this.__doStartServer);
            toolbar.addButton(this.tr('Stop server'), fw.core.qooxdoo.res.IconSet.ICON('mediaStop'), this, this.__doStopServer);
            toolbar.addButton(this.tr('Reload configuration'), fw.core.qooxdoo.res.IconSet.ICON('mediaRepeat'), this, this.__doReloadServer);
            this.__fieldServerStatus = toolbar.addFlex(new qx.ui.form.TextField().set({alignY: "middle", readOnly: true, toolTipText: this.tr('server stats')}, null));
            toolbar.addButton(this.tr('Update status'), fw.core.qooxdoo.res.IconSet.ICON('restart'), this, this.__doUpdateServerInfo);
            //
            var toolbar2 = new fw.core.qooxdoo.widgets.Toolbar();
            toolbar2.setPaddingLeft(48);
            this.__fieldSearch = toolbar2.addFlex(new qx.ui.form.TextField().set({alignY: "middle", liveUpdate: true, placeholder: this.tr("text for search")}, null));
            toolbar2.addButton(this.tr('Find'), fw.core.qooxdoo.res.IconSet.ICON('search'), this, this.__doFind);
            this.__fieldSearch.addListener('changeValue', function (e) {
                this.__searchTextCur = e.getData();
            }, this);
            this.__fieldSearch.addListener("keyup", function (e) {
                if (e.getKeyIdentifier() == 'Enter') this.__doFind(null);
            }, this);
            //
            this.__editor = new dhcpadm.workplaces.admin.commons.AceEditorWidget('text');
            //
            this.add(toolbar, null);
            this.add(this.__editor, {flex: 1});
            this.add(toolbar2, null);
        },

        __doStartServer: function(e, confirmed) {
            var self = this;
            if(this.__flagDontAks || confirmed) {
                dhcpadm.sdk.services.DhcpServerManagementService.serverStart(function (result, exception) {
                    self.__doUpdateServerInfo(null);
                });
            } else {
                fw.core.qooxdoo.dialogs.MessageBox.getInstance().showQuestionDialog2(this.tr("Strarting server"), this.tr("Do you really want to continue?"), [this.tr("Yes"), this.tr("No")], function (bid, askFlag) {
                    self.__flagDontAks = askFlag;
                    if (bid == 1) { self.__doStartServer(null, true); }
                });
            }
        },

        __doStopServer: function(e, confirmed) {
            var self = this;
            if(this.__flagDontAks || confirmed) {
                dhcpadm.sdk.services.DhcpServerManagementService.serverStop(function (result, exception) {
                    self.__doUpdateServerInfo(null);
                });
            } else {
                fw.core.qooxdoo.dialogs.MessageBox.getInstance().showQuestionDialog2(this.tr("Stopping server"), this.tr("Do you really want to continue?"), [this.tr("Yes"), this.tr("No")], function (bid, askFlag) {
                    self.__flagDontAks = askFlag;
                    if (bid == 1) { self.__doStopServer(null, true); }
                });
            }
        },

        __doReloadServer: function(e, confirmed) {
            var self = this;
            dhcpadm.sdk.services.DhcpServerManagementService.serverReload(function (result, exception) {
                self.__doUpdateServerInfo(null);
            });
        },

        __doUpdateServerInfo: function(e) {
            this.__fieldServerStatus.setValue(this.tr('pending...'));
            var self = this;
            dhcpadm.sdk.services.DhcpServerManagementService.serverGetStatus(function (result, exception) {
                if(!result) {
                    self.__fieldServerStatus.setValue(self.tr('unknown'));
                } else {
                    self.__fieldServerStatus.setValue(result.state + " [pid: " + result.pid + "]");
                }
            });
        },

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
            dhcpadm.sdk.services.DhcpServerManagementService.configRead(function (result, exception) {
                if (exception) return;
                self.__editor.setTextBuffer(result);
            });
        },

        __doSaveBuffer: function (e) {
            var txt = this.__editor.getTextBuffer();
            var self = this;
            dhcpadm.sdk.services.DhcpServerManagementService.configWrite(txt, function (result, exception) {
            });
        }
    }
});

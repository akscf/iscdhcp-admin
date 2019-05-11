/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("webapp.dialogs.template.UploadDialog", {
    extend: org.cforge.qooxdoo.ui.dialog.StandardDialog,
    construct: function () {
        this.base(arguments, this.tr("Upload manager"));
        this.__initComponents();
    },
    members: {
        __entity: null,
        __uploadForm: null,
        __URL_BASE: '/upload',
        //===========================================================================================================================================================================================
        // Public
        //===========================================================================================================================================================================================
        open: function (mode) {
            this.__uploadButton.setEnabled(true);
            //
            this.__uploadForm.setUrl(this.__URL_BASE + "/?mode=" + mode + "&x-session-id=" + qx.core.Init.getApplication().getSessionId());
            //
            this.base(arguments);
        },
        //===========================================================================================================================================================================================
        // Private
        //===========================================================================================================================================================================================
        __initComponents: function () {
            this.__uploadForm = new org.cforge.qooxdoo.ui.upload.UploadForm('uploadFrm', this.__URL_BASE);
            this.__uploadForm.setPadding(2);
            this.__uploadForm.setLayout(new qx.ui.layout.VBox(10));
            this.addContent(this.__uploadForm, {flex: 1});
            //
            var file1 = new org.cforge.qooxdoo.ui.upload.UploadField('uploadfile', null, 'webapp/16x16/view.png').set({width: 350, toolTipText: this.tr("Select file to upload")}, null);
            this.__uploadForm.add(file1, {flex: 1});
            //
            this.__uploadForm.addListener('sending', this.__uploadStart, this);
            this.__uploadForm.addListener('completed', this.__uploadComplete, this);
            //-------------------------------------------------------------
            //
            this.__uploadButton = this.addButton(new org.cforge.qooxdoo.ui.FormButton(this.tr('Upload', 'webapp/16x16/check2.png', this, this.__doUpload)));
            this.__buttonClose = this.addButton(new org.cforge.qooxdoo.ui.FormButton(this.tr('Close', null, this, this.__doClose)));
            //
            this.setDialogCloseButton(this.__buttonClose);
        },
        //===========================================================================================================================================================================================
        // Commands
        //===========================================================================================================================================================================================
        __doUpload: function (e) {
            this.__uploadButton.setEnabled(false);
            this.__buttonClose.setEnabled(false);
            //
            this.__uploadForm.send();
        },
        __doClose: function (e) {
            this.close();
        },
        //===========================================================================================================================================================================================
        // events
        //===========================================================================================================================================================================================
        __uploadStart: function (e) {
            this.__showBusyIndicator(true, this.tr("Uploading..."));
        },
        __uploadComplete: function (e) {
            this.__showBusyIndicator(false);
            this.__uploadButton.setEnabled(true);
            this.__buttonClose.setEnabled(true);
            //
            var response = this.__uploadForm.getIframeTextContent();
            try {
                response = (response && response.length > 0 ? eval('(' + response + ')') : null);
            } catch (exc) {
                qx.core.Init.getApplication().stdDialogs().exception(this.classname, '__uploadComplete', exc);
                return;
            }
            //
            if (!response) {
                qx.core.Init.getApplication().stdDialogs().error(this.tr("Response is null"));
                return;
            }
            //
            if (response['error']) {
                var error = response['error'];
                if ((error['origin'] == 2 && error['code'] == 2001)) {
                    this.__sessionExpireDialog(this.tr("Upload failed"), this.tr("Session is outdated!"));
                } else {
                    qx.core.Init.getApplication().stdDialogs().exception(this.classname, '__uploadComplete', error);
                }
                return
            }
            //
            var result = response['result'];
            this.closeApprove({row: 0, entity: result});
        },
        //===========================================================================================================================================================================================
        // helper
        //===========================================================================================================================================================================================
        __showBusyIndicator: function (flag, text) {
            if (!this.__busyIndicator) {
                this.__busyIndicator = new webapp.dialogs.BusyIndicator();
            }
            if (flag)
                this.__busyIndicator.open(text);
            else
                this.__busyIndicator.close();
        },
        __sessionExpireDialog: function (caption, text) {
            if (!this.__errorDialog) {
                this.__errorDialog = new webapp.dialogs.ErrorDialog();
                this.__errorDialog.addListener('closeApprove', function (e) {
                    window.top.location.reload();
                }, this, false);
            }
            this.__errorDialog.open(caption, text);
        }
    }
});


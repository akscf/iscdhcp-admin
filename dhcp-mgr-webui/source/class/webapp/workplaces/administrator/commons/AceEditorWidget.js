/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Class.define("webapp.workplaces.administrator.commons.AceEditorWidget", {
    extend: qx.ui.container.Composite,
    construct: function (mode) {
        this.__curMode = mode ? mode : 'text';
        this.base(arguments);
        this.setBackgroundColor("white");
        this.setLayout(new qx.ui.layout.VBox());
        this.setDecorator(null);
        //
        this.init();
    },
    members: {
        __editor: null,
        __ace: null,
        __errorLabel: null,
        __curMode: null,
        init: function () {
            var dec = new qx.ui.decoration.Decorator().set({widthBottom: 1, colorBottom: "border-separator"}, null);
            var caption = new qx.ui.container.Composite().set({padding: 5, allowGrowX: true, allowGrowY: true, backgroundColor: "white", decorator: dec}, null);
            this.__editor = new qx.ui.core.Widget();
            this.add(this.__editor, {flex: 1});
            this.__editor.addListenerOnce("appear", function () {
                this.__onEditorAppear();
            }, this);
            //
            qx.bom.Stylesheet.createElement(".ace_editor {border: 0px solid #9F9F9F !important;}");
        },
        getTextBuffer: function () {
            return this.__ace.getSession().getValue();
        },
        setTextBuffer: function (text) {
            if (this.__ace) {
                this.__ace.focus();
                this.__ace.getSession().setValue(text);
                this.__ace.renderer.scrollToX(0);
                this.__ace.renderer.scrollToY(0);
                this.__ace.selection.moveCursorFileStart();
            } else {
                this.__text = text;
            }
        },
        setFocus: function () {
        },
        setError: function (ex) {
        },
        setWordCompleter: function (wordCompleter) {
            if (this.__ace) {
                this.__ace.completers = [wordCompleter];
            } else {
                this.__wordCompleter = wordCompleter;
            }
        },
        getEditorInstance: function () {
            return this.__ace;
        },
        //===========================================================================================================================================================================================
        // private
        //===========================================================================================================================================================================================
        __onEditorAppear: function () {
            ace.require("ace/ext/language_tools");
            //
            var container = this.__editor.getContentElement().getDomElement();
            this.__ace = ace.edit(container);
            //
            var modeName = 'ace/mode/' + this.__curMode;
            var ModeInst = require(modeName).Mode;
            this.__ace.getSession().setMode(new ModeInst());
            this.__ace.setOptions({fontFamily: "monospace", fontSize: "12px", showPrintMargin: false, enableBasicAutocompletion: true});
            //
            var session = this.__ace.getSession();
            session.setUseSoftTabs(true);
            session.setTabSize(2);
            session.setValue("");
            //
            var self = this;
            this.__editor.addListener("resize", function () {
                window.setTimeout(function () {
                    if (self.__ace)
                        self.__ace.resize();
                }, 0);
            });
            if (this.__wordCompleter) {
                this.__ace.completers = [this.__wordCompleter];
            }
            if (this.__text != null) {
                this.__ace.focus();
                this.__ace.getSession().setValue(this.__text, 1);
            }
        }
    },
    destruct: function () {
        this.__ace = null;
    }
});


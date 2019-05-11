/* ************************************************************************
 qooxdoo - the new era of web development
 http://qooxdoo.org
 Copyright:
 2007 Visionet GmbH, http://www.visionet.de
 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.
 Authors:
 * Dietrich Streifert (level420)
 Contributors:
 * Petr Kobalicek (e666e)
 * Tobi Oetiker (oetiker)
 ************************************************************************ */

/**
 *
 * FIXES:
 *  -  aks > URL is local variable, update form action attribute before sending
 *
 */
qx.Class.define("org.cforge.qooxdoo.ui.upload.UploadForm",
    {
        extend:qx.ui.container.Composite,

        // --------------------------------------------------------------------------
        // [Constructor]
        // --------------------------------------------------------------------------

        construct:function (name, url, encoding) {
            this.base(arguments);

            // Apply initial values
            if (name) {
                this.setName(name);
            }
            if (url) {
                this.setUrl(url);
            }

            //this.setHtmlProperty("encoding", encoding || "multipart/form-data");
            var el = this.getContentElement();
            el.setAttributes({enctype:encoding || "multipart/form-data", method:"POST"});
            if (qx.core.Environment.get('browser.name') == 'ie' && qx.core.Environment.get('browser.version') < 8) {
                el.setAttributes({encoding:encoding || "multipart/form-data"});
            }
            el.include();

            // create a hidden iframe which is used as form submission target
            this._createIFrameTarget();
        },

        // --------------------------------------------------------------------------
        // [Destructor]
        // --------------------------------------------------------------------------

        destruct:function () {
            if (this.__iframeNode) {
                try {
                    document.body.removeChild(this.__iframeNode);
                    this.__iframeNode.onreadystatechange = null;
                    this.__iframeNode.onload = null;
                    this.__iframeNode = null;
                }
                catch (exc) {
                    this.warn("can't remove iframe node from the DOM tree.");
                }
            }

            this.__parameters = null;
            for (var id in this.__hidden) {
                if (this.__hidden[id] && this.__hidden[id].parentNode) {
                    this.__hidden[id].parentNode.removeChild(this.__hidden[id]);
                }
            }

            this.__hidden = null;
        },

        // --------------------------------------------------------------------------
        // [Events]
        // --------------------------------------------------------------------------

        events:{
            "sending":"qx.event.type.Event",
            "completed":"qx.event.type.Event"
        },

        // --------------------------------------------------------------------------
        // [Properties]
        // --------------------------------------------------------------------------

        properties:{
            name:{
                check:"String",
                init:"",
                apply:"_applyName"
            },

            url:{
                check:"String",
                init:"",
                apply:"_applyUrl"
            },

            target:{
                check:"String",
                init:"",
                apply:"_applyTarget"
            }
        },

        // --------------------------------------------------------------------------
        // [Members]
        // --------------------------------------------------------------------------

        members:{
            __xurl: null,
            __formel: null,
            __iframeNode:null,
            __parameters:{},
            __hidden:{},
            __isSent:false,

            setParameter:function (id, value) {
                this.__parameters[id] = value;
                if (this.__hidden[id] && this.__hidden[id].name) {
                    this.__hidden[id].value = value;
                } else {
                    this.__hidden[id] = this._createHiddenFormField(id, value);
                }
            },

            removeParameter:function (id) {
                delete this.__parameters[id];
                if (this.__hidden[id] && this.__hidden[id].parentNode) {
                    this.__hidden[id].parentNode.removeChild(this.__hidden[id]);
                }
                delete this.__hidden[id];
            },

            getParameter:function (id) {
                return this.__parameters[id] || null;
            },

            getParameters:function () {
                return this.__parameters;
            },

            _addFormParameters:function () {
                var form = this.__formel;
                var dom = this.__formel.getDomElement();
                var firstChild = form.firstChild;

                for (var id in this.__parameters) {
                    var p = this.__hidden[id];
                    dom.insertBefore(p, firstChild);
                }
            },

            _applyName:function (value, old) {
                this.getContentElement().setAttribute("name", value);
            },

            _applyUrl:function (value, old) {
                this.__xurl = value;
                this.getContentElement().setAttribute("action", value);
            },

            _applyTarget:function (value, old) {
                this.getContentElement().setAttribute("target", value);
            },

            _createIFrameTarget:function () {
                var frameName = "frame_" + (new Date).valueOf();

                if (qx.core.Environment.get('browser.name') == 'ie' && qx.core.Environment.get('browser.version') < 8) {
                    this.__iframeNode = document.createElement('<iframe name="' + frameName + '"></iframe>');
                }
                else {
                    this.__iframeNode = document.createElement("iframe");
                }

                this.__iframeNode.id = (this.__iframeNode.name = frameName);
                this.__iframeNode.style.display = "none";
                this.setTarget(frameName);

                document.body.appendChild(this.__iframeNode);

                this.__iframeNode.onload = qx.lang.Function.bind(this._onLoad, this);
                this.__iframeNode.onreadystatechange = qx.lang.Function.bind(this._onReadyStateChange, this);
            },

            _createContentElement:function () {
                var el = new qx.html.Element("form", { overflow:'hidden' });
                this.__formel = el;
                return el;
            },

            _createHiddenFormField:function (name, value) {
                var hvalue = document.createElement("input");
                hvalue.type = "hidden";
                hvalue.name = name;
                hvalue.value = value;
                return hvalue;
            },


            /**
             * Send the form via the submit method. Target defaults to the
             * self created iframe.
             *
             */
            send:function () {
                var form =  this.__formel;
                var dom = this.__formel.getDomElement();
                if (form) {
                    this._addFormParameters();
                    this.__formel.getDomElement().setAttribute("action", this.__xurl);
                    this.__formel.getDomElement().submit();
                    this.__isSent = true;
                    this.fireEvent("sending");
                } else {
                    throw new Error("Form element not created! Unable to call form submit!");
                }
            },

            clear:function () {
                var form =  this.__formel;
                if (form) {
                    this.__formel.getDomElement().reset();
                } else {
                    throw new Error("Form element not created! Unable to call form reset!");
                }
            },


            // ------------------------------------------------------------------------
            // [Iframe]
            // ------------------------------------------------------------------------

            /**
             * Get the DOM window object of the target iframe.
             *
             */
            getIframeWindow:function () {
                return qx.bom.Iframe.getWindow(this.__iframeNode);
            },

            /**
             * Get the DOM document object of the target iframe.
             *
             */
            getIframeDocument:function () {
                return qx.bom.Iframe.getDocument(this.__iframeNode);
            },

            /**
             * Get the HTML body element of the target iframe.
             *
             */
            getIframeBody:function () {
                return qx.bom.Iframe.getBody(this.__iframeNode);
            },

            /**
             * Get the target iframe Element.
             *
             */
            getIframeNode:function () {
                return this.__iframeNode;
            },

            // ------------------------------------------------------------------------
            // [Response Data Support]
            // ------------------------------------------------------------------------

            /**
             * Get the text content of the target iframe.
             *
             */
            getIframeTextContent:function () {
                var vBody = this.getIframeBody();

                if (!vBody) {
                    return null;
                }

                // Mshtml returns the content inside a PRE
                // element if we use plain text
                if (vBody.firstChild && (vBody.firstChild.tagName == "PRE" || vBody.firstChild.tagName == "pre")) {
                    return vBody.firstChild.innerHTML;
                }
                else {
                    return vBody.innerHTML;
                }
            },


            /**
             * Get the HTML content of the target iframe.
             *
             */
            getIframeHtmlContent:function () {
                var vBody = this.getIframeBody();
                return vBody ? vBody.innerHTML : null;
            },


            /**
             * Get the XML content of the target iframe.
             *
             * This is a hack for now because I didn't find a way
             * to send XML via the iframe response.
             *
             * In the resulting text all occurences of the &lt;
             * and &gt; entities are replaces by < and > and
             * the Text is then parsed into a XML-Document instance.
             *
             */
            getIframeXmlContent:function () {
                var responsetext = this.getIframeTextContent();

                if (!responsetext || responsetext.length == 0) {
                    return null;
                }

                var xmlContent = null;
                var newText = responsetext.replace(/&lt;/g, "<");
                newText = newText.replace(/&gt;/g, ">");

                try {
                    xmlContent = qx.xml.Document.fromString(newText);
                }
                catch (ex) {
                }
                ;

                return xmlContent;
            },

            // ------------------------------------------------------------------------
            // [Event Handlers]
            // ------------------------------------------------------------------------

            /**
             * Catch the onreadystatechange event of the target iframe.
             *
             */
            _onReadyStateChange:function (e) {
                if (this.getIframeNode().readyState == "complete" && this.__isSent) {
                    this.fireEvent("completed");
                    delete this.__isSent;
                }
            },


            /**
             * Catch the onload event of the target iframe
             *
             */
            _onLoad:function (e) {
                if (this.__isSent) {
                    this.fireEvent("completed");
                    delete this.__isSent;
                }
            }
        }
    }
);


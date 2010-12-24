/// <reference path="jquery-vsdoc.js" />
/// <summary>
/// SmartClient 
/// </summary> 
(function($) {


    /***************************************************************************************************
    Extend jQuery
    ***************************************************************************************************/
    $.fn.extend({
        hasControl: function(bool) {
            if (bool) this[0].control = bool;

            return this[0].control != undefined;
        },
        attrUp: function(name) {
            if (this.length > 0) return this.attr(name) || this.parent().attrUp(name);
            return undefined;
        },
        outerHtml: function(html) {
            return html ? this.before(html).remove() : jQuery("<p>").append(this.eq(0).clone()).html();
        },
        getAddress: function() {

            var appPath = (window.applicationPath || "").replace(/(.*)\/$/, "$1"); // remove a trailing "/"

            // Prepare the url
            var url = this.attrUp("source") || this.attrUp("href") || "";
            url = url.replace(/(.*)\/$/, "$1") // remove a trailing "/"
                     .replace("~", appPath);

            if (this.attrUp("source") && this.attrUp("action")) {
                url += "/" + this.attrUp("action");
            }
            return url;
        },
        attachHtmlInTarget: function(html, t, mode) {
            // Get target tag
            var target = t || this;

            if ($(target).size() == 0) TargetMissingException(this);

            if (mode === "after") {
                $(target).after(html);
                $(target).parent().initializeControls();
            } else {
                $(target).hide().html(html).initializeControls().fadeIn('slow');
            }

        },
        render: function(data) {
            if (this.size() == 0) throw new Error("Zero element selected!");

            var template = this.html();

            // Convert the template into pure JavaScript
            var script = "var p=[], print=function(){ p.push.apply(p,arguments); }; " +
            "dataItem = dataItem || [];" +
            "with(dataItem){" +
            "   p.push('" + template // Introduce the data as local variables using with(){}
                    .split("&lt;").join("<")
                    .split("%3C").join("<")
                    .split("&gt;").join(">")
                    .split("%3E").join(">")
                    .split("&quot;").join('"')
                    .replace("<!--", " ")
                    .replace("-->", " ")
                    .replace(/'/g, "\\'")
                    .replace(/[\r\t\n]/g, " ")

                   .replace(/'(?=[^$]*$>)/g, "\t")

                   .split("\t").join("'")
                   .replace(/<\$=(.+?)\$>/g, "',$1,'")

                   .split("<$").join("');")
                   .split("$>").join("p.push('")

          + "');}return p.join('');";

            try {
                $.cache = $.cache || {};
                // Generate a reusable function that will serve as a template
                // generator (and which will be cached).
                //var fn = !/\W/.test(this.id) ? cache[this.id] = (cache[this.id] || $(this).template()) :
                var fn = $.cache[template] || ($.cache[template] = new Function("dataItem", script));

                var html = "";
                if ($.isArray(data)) {
                    for (var i = 0; i < data.length; i++) html += fn(data[i]);
                } else {
                    html += fn(data);
                }

            } catch (err) {
                $("<pre class='error' />").text("The template is mal-formed, because " + err + "\n\n" + script).appendTo("body");
            }


            // Provide some basic currying to the user
            //var html = fn(data);
            //this.html(html);
            return data ? html : fn;


        },
        ajaxIframe: function(url, ctrl, onsucess) {
            var iframe = $("#ajaxIFrame");

            if ($("#ajaxIFrame").size() == 0) {
                iframe = $(document.body).prepend("<IFRAME id=\"ajaxIFrame\">").find("#ajaxIFrame");
            }

            iframe.unbind("load").bind("load", function() {
                var html = $("body", iframe.contents()).html();
                ctrl.attachHtmlInTarget(html);
                if (onsucess) onsucess(html, "notmodified", null);
                iframe.unbind("load");
            });
            iframe.hide().attr("src", url);

        },
        warnCapsLockIsOn: function(callback) {
            this.each(function(i, elem) {

                var myKeyCode = e.keyCode || e.which;

                if (e.shiftKey) {
                    // Lower case letters are seen while depressing the Shift key, therefore Caps Lock is on
                    if ((myKeyCode >= 97 && myKeyCode <= 122)) callback();
                }
                else {
                    // Upper case letters are seen without depressing the Shift key, therefore Caps Lock is on
                    if ((myKeyCode >= 65 && myKeyCode <= 90)) callback();
                }

            });
        },
        dataBind: function(options) {
            for (var i = 0; i < this.length; i++)
                $(this[i])._dataBind(options);

            return this;
        },
        /* End DataBind*/

        _dataBind: function(opt) {
            var options = $.extend({}, opt);
            var $this = $(this[0]);

            if ($this.attr("onbinding")) eval($this.attr("onbinding"));
            if (options.onbinding) options.onbinding();

            var formData = {};

            options.data = options.data || {};
            if ($this.attrUp("options") && $this.attrUp("options") != "") {
                options.data = $.extend(eval("(" + $this.attrUp("options") + ")"), options.data);
            }

            var form = $this.closest("[asform]") || $this.closest("[action]") || $this.closest("FORM");

            // Get All html form controls
            var fields = form.find(":input, select, textarea, :password, [type=hidden]").serializeArray();
            $.each(fields, function(i, elem) {
                options.data[$(elem).attr("field") || elem.name || elem.id] = $(elem).val();
            });


            // Get target tag
            if (!options.target && $this.attrUp("target")) {
                options.target = $this.attrUp("target");
            }

            // Get template tag
            if (!options.template && $this.attrUp("template")) {
                options.template = $this.attrUp("template");
            }


            // Get mode
            //            if ($this.attrUp("mode")) {
            //                options.mode = $this.attrUp("mode");
            //            }


            // Makes the comparison "options.data || {}" because options.data can be filled, when trigger 
            // is fired otherwise prepares the data Request Payload
            //            if (!options.data)
            //                options.data = $.toJSON(options.data);
            // save the control that is fire dataBind, because closure "sucess" dont access
            //var ctrl = $this;
            options.type = $this.attrUp("method") || "POST";

            // Prepare the url
            options.url = $this.getAddress();

            // Allow fire DataBinding in controls that has TRIGGER atribute
            if ($this.attrUp("trigger")) {
                $this.closest("[trigger]").find("[options]").each(function() {
                    options.data[$this.attr("options")] = $this.val();
                });

                $($this.attrUp("trigger")).dataBind(options);
                return;
            }

            // Only fires ajax if there are url
            if (options.url) {
                $.ajax({
                    type: options.type,
                    url: options.url,
                    data: $.toJSON(options.data),
                    contentType: "application/json",
                    ifModified: true,
                    success: function(result, status, request) {


                        // If Not Modified then get cached content file by iframe
                        if (request.status == 304) {
                            $this.ajaxIframe(options.url, $this, options.onsucess);
                        } else {
                            // If Http Status 200 then OK, process JSON because data should be transform on html
                            var html = result;
                            var target = options.target || $this;

                            if (result && request.responseText != "") {
                                if (request.getResponseHeader("Content-type").indexOf("json") > -1) {

                                    if (result.Errors) {
                                        if ($.isArray(result.Errors)) {
                                            for (var item in result.Errors)
                                                alert(item);
                                        } else {
                                            alert(result.Errors);
                                        }
                                    }

                                    //
                                    // result.Data   = ClientResponse
                                    // result.d      = ASMX/WCF JSON return
                                    // result.d.Data = ASMX/WCF JSON return ClientResponse
                                    // 
                                    var data = result.Data || result.d || result.d.Data || result;

                                    if (data.length == 0 && $($this.attrUp("emptytemplate")).size() > 0) {
                                        result.isEmpty = true;
                                        html = $($this.attrUp("emptytemplate")).html();

                                    } else {
                                        // Get template tag
                                        tpl = $this;
                                        if ($(options.template).size() > 0) {
                                            tpl = $(options.template);
                                        }

                                        html = tpl.render(data);
                                    }
                                }
                            }

                            $this.attachHtmlInTarget(html, target);
                        }

                        if (options.onsucess)
                            options.onsucess(result, status, request);

                        if ($this.attr("onsucess"))
                            eval($this.attr("onsucess"));

                        if ($this.attrUp("once"))
                            $this.unbind($this.attr("command"));


                    },
                    error: function(result, status, event) {
                        eval($this.attrUp("onerror"));
                        if (result.status == "404") PageNotFoundException($this);
                    }
                });
            }
        },

        /***************************************************************************************************
        Live controls, this allow load html with plugins and load it dynamically
        ***************************************************************************************************/

        initializeControls: function() {


            this._initializeCommandControls();

            $("[plugin]", this).each(function(i, ctrl) {
                var it = $(ctrl);
                if (it.hasControl()) return;
                it.hasControl(true);

                var plugin = it.attr("plugin");
                var options = eval("(" + it.attr("options") + ")");

                it[plugin](options);
            });

            this._initializeThemeStyle();

            return this;


        },
        _initializeCommandControls: function() {

            // enable link fire dataBinding            
            $("[href]", this).attr("method", "GET");

            $("[command]", this).each(function(i, ctrl) {
                if (!$(ctrl).hasControl()) {
                    $(ctrl).hasControl(true);

                    var eventType = $(ctrl).attr("command") || "click";
                    if (eventType === "load") {
                        $(ctrl).dataBind();
                    } else {
                        $(ctrl).bind(eventType, function(event) {
                            $(ctrl).dataBind();
                            event.stopPropagation();
                            event.preventDefault();
                            return false;
                        });
                    }
                }
            });
        },





        _initializeThemeStyle: function() {
            top.$(":text", this).wrap("<span class='ui-theme-textbox cDat11' />");
            top.$(":text", this).focusin(function() {
                $(this).parent().addClass('cDat11_focus');
            }).focusout(function() {
                $(this).parent().removeClass().addClass('cDat11');
            }).mouseenter(function() {
                $(this).parent().addClass('cDat11_hover');
            }).mouseleave(function() {
                $(this).parent().removeClass('cDat11_hover');
            }).after("<span />");

            //
            // Botões
            //
            top.$(":submit, :button, :reset", this).each(function(i, ctrl) {
                $(ctrl).wrap("<span class='ui-theme-button " + $(ctrl).attr("class") + "' />").parent().hover(function() { $(this).addClass('hover'); }, function() { $(this).removeClass('hover'); });
            });

            top.$(":submit, :button, :reset", this).after("<span />");


            //
            // Grid
            //
            top.$("table[rules=all]", this)
               .addClass("ui-theme-table")
               .filter("tr")
               .hover(function() { $(this).addClass('hover'); },
                      function() { $(this).removeClass(); });

            top.$("table[rowselectable=true]", this).each(function(i, elem) {
                var $table = $(elem);

                $.each(this.rows, function(i, elem) {
                    $(this).has(".delete").click(function() {
                        __doPostBack(($table.attr("id") || "").replace(/\_/g, "$"), 'Select$' + (i - 1));
                    });
                });
            })

        }


    }); // End Initialize Controls


    /***************************************************************************************************
    DAteTime Extensions
    ***************************************************************************************************/

    String.prototype.JsonToDate = function() {
        if (this && this != "") {
            var result = new Date(parseFloat(this.replace(/(\/)|\)|Date\(/g, "")));
            return new Date(result.valueOf() + result.getTimezoneOffset() * 60000);
        }

        return null;
    }

    // Inicializa todos os controles da tela.
    $(document).initializeControls();

    // Se o globalization for declarado então começa com pt-BR para facilitar o desenvolvimento 
    if ($.preferCulture)
        $.preferCulture("pt-BR");

})(jQuery);


function Exception(msg) {
    msg = " SmartClient Error:  \n" + msg;
    alert(msg);
    throw ReferenceError(msg);
};

function PageNotFoundException(sender) {
    Exception(" A página '" + sender.getAddress() + "' não foi encontrada!");
}

function TargetMissingException(sender) {
    Exception(" Não foi encontrado o elemento html '" + sender.attrUp("target") + "'! \n\n Html Trace: " + sender.outerHtml());
}


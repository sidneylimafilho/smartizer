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
            return arguments.length ? this.data('control', bool) : this.data('control');
        },
        attrUp: function(name) {
            if (this.length > 0) return this.attr(name) || this.parent().attrUp(name);
            return undefined;
        },
        outerHtml: function(html) {
            return html ? this.before(html).remove() : jQuery("<p>").append(this.eq(0).clone()).html();
        },
        smart: function() {
            if (!this._smart) {
                this._smart = eval("(" + this.attr("smart") + ")");

                var events = 0;
                var errors = "";
                for (var event in this._smart) {
                    var obj = this._smart[event];
                    events++;

                    if (!!obj.show && $(obj.show).size() == 0)
                        errors += "The attribute SHOW (" + this._smart.show + ") don´t exists!\n";

                    if (!!obj.hide && $(obj.hide).size() == 0)
                        errors += "The attribute HIDE (" + this._smart.hide + ") don´t exists!\n";

                    if (!!obj.onbinding && typeof (obj.onbinding) !== "function")
                        errors += "The attribute onbinding don´t is a Function!\n";

                    if (!!obj.onrequest && typeof (obj.onrequest) !== "function")
                        errors += "The attribute onrequest don´t is a Function!\n";

                    if (!!obj.onresponse && typeof (obj.onresponse) !== "function")
                        errors += "The attribute onresponse don´t is a Function!\n";

                    if (!!obj.onsucess && typeof (obj.onsucess) !== "function")
                        errors += "The attribute onsucess don´t is a Function!\n";

                    if (!!obj.onerror && typeof (obj.onerror) !== "function")
                        errors += "The attribute onerror don´t is a Function!\n";

                    if (!!obj.onbounded && typeof (obj.onbounded) !== "function")
                        errors += "The attribute onbounded don´t is a Function!\n";

                    if (!!obj.once && typeof (obj.once) !== "boolean")
                        errors += "The attribute ONCE is not a valid boolean!\n";

                    if (!!obj.method && typeof (obj.method) !== "string")
                        errors += "The attribute METHOD is not a valid boolean!\n";

                    if (!!obj.target && ($(obj.target).size() == 0 || typeof (obj.target) !== "string"))
                        errors += "The attribute TARGET (" + this._smart.target + ") don´t exists!\n";

                    if (!!obj.template && ($(obj.template).size() == 0 || typeof (obj.template) !== "string"))
                        errors += "The attribute TEMPLATE (" + this._smart.template + ") don´t exists!\n";

                    if (!!obj.emptytemplate && ($(obj.emptytemplate).size() == 0 || typeof (obj.emptytemplate) !== "string"))
                        errors += "The attribute EMPTYTEMPLATE (" + this._smart.emptytemplate + ") don´t exists!\n";

                }

                if (events == 0) errors += "Don´t exists event configured!\n";
                if (errors != "") Exception(errors);

            }
            return this._smart;
        },

        render: function(data, options) {
            if (this.size() == 0) throw new Error("Zero element selected!");

            options = $.extend({}, options);
            var template = this.html();

            if ($(options.template).size() > 0) {
                template = $(options.template).html();
            }

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
                var fn = $.cache[template] || ($.cache[template] = new Function("index", "dataItem", script));

                var html = "";
                if ($.isArray(data)) {
                    for (var i = 0; i < data.length; i++) html += fn(i, data[i]);
                } else {
                    html += fn(0, data);
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
                //ctrl.attachHtmlInTarget(html);
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

        dataBind: function(options, event) {
            for (var i = 0; i < this.length; i++) {
                var $this = $(this[i]);
                if (!!event) {
                    $this._dataBind(options, event);
                } else {
                    for (var eventType in $this.smart()) {
                        $this._dataBind(options, jQuery.Event(eventType));
                    }
                }
            }

            return this;
        },
        /* End DataBind*/

        _dataBind: function(opt, event) {
            var options = $.extend({}, opt);
            var $this = this;
            var smart = $this.smart()[event.type];

            if (event.type.indexOf("key") >= 0 && !!event.keyCode && !!smart[event.keyCode])
                smart = smart[event.keyCode];

            if (smart.onbinding)
                smart.onbinding.apply($this);


            options.sourceparams = $.extend({}, options.sourceparams);
            if (!!smart.sourceparams) {
                options.sourceparams = $.extend(smart.sourceparams, options.sourceparams);
            }

            var form = $this.closest("[asform]") || $this.closest("[action]") || $this.closest("FORM");

            // Get All html form controls
            var fields = form.find(":input, select, textarea, :password, [type=hidden]").serializeArray();
            $.each(fields, function(i, elem) {
                options.sourceparams[$(elem).attr("field") || elem.name || elem.id] = $(elem).val();
            });



            // Get target tag
            if (!!smart.target) {
                options.target = smart.target;
            }

            // Get template tag
            if (!!smart.template) {
                options.template = smart.template;
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
            if (this[0].tagName == "A") smart.method = "GET";
            options.type = smart.method || "POST";

            // Prepare the url
            var trim = function(text) { return (text || "").replace(/(.*)\/$/, "$1"); }

            window.applicationPath = trim(window.applicationPath);

            options.url = trim($this.attrUp("href") || smart.source);
            options.url = options.url.replace("~", window.applicationPath);
            

            //Exists only for tests
            options.responseBody = smart.defaultResponseBody;

            // Only fires ajax if there are url
            if (options.url) {

                if (smart.onrequest)
                    smart.onrequest.call($this, options);

                options.sourceparams = $.toJSON(options.sourceparams);

                $.ajax({
                    type: options.type,
                    url: options.url,
                    data: options.sourceparams,
                    contentType: "application/json",
                    ifModified: true,
                    success: function(responseBody, status, request) {

                        if (smart.onresponse)
                            responseBody = smart.onresponse.call($this, responseBody, status, request, options);

                        // If Not Modified then get cached content file by iframe
                        //                        if (request.status == 304) {
                        //                            $this.ajaxIframe(options.url, $this, options.onsucess);
                        //                        } else {
                        // If Http Status 200 then OK, process JSON because data should be transform on html
                        options.responseBody = responseBody;

                        if (responseBody && request.responseText != "") {
                            if (request.getResponseHeader("Content-type").indexOf("json") > -1) {
                                handlerResultErrors(responseBody);
                            }
                        }
                        //}

                        if (smart.onsucess)
                            smart.onsucess.call($this, responseBody, status, request, options);

                    },
                    error: function(request, textStatus, errorThrown) {
                        if (smart.onerror)
                            smart.onerror.call($this, request, textStatus, errorThrown, options);

                        if (request.status == "404") PageNotFoundException(options.url);
                    },
                    complete: function() {
                        fireActions($this, smart);
                    }
                });
            } else {

                fireActions($this, smart);
            }



            function fireActions($this, smart, mode) {

                if (smart.template || smart.target) {
                    var html = options.responseBody || $(smart.template).html() || "";

                    if (html.length == 0 && $(smart.emptytemplate).size() > 0) {

                        html = $(smart.emptytemplate).html();

                    } else if (typeof (options.responseBody) == "object" || typeof (options.responseBody) == "array") {

                        html = $this.render(options.responseBody, options);
                    }

                    // Get target tag
                    smart.target = smart.target || $this;

                    if ($(smart.target).size() == 0) TargetMissingException(this);

                    if (mode === "after") {
                        $(smart.target).after(html);
                        $(smart.target).parent().initializeControls();
                    } else {
                        $(smart.target).hide().html(html).initializeControls().fadeIn('slow');
                    }
                }

                if (smart.once)
                    $this.unbind(event.type);

                if (smart.hide)
                    $(smart.hide).hide();

                if (smart.show)
                    $(smart.show).show();

                // Allow fire DataBinding in controls that has TRIGGER atribute
                if (smart.trigger) {
                    $(smart.trigger).dataBind(options);
                    return;
                }

                if (smart.onbounded)
                    smart.onbounded.call($this, options);
            }

            function handlerResultErrors(result) {
                if (result.Errors) {
                    if ($.isArray(result.Errors)) {
                        for (var item in result.Errors)
                            alert(item);
                    } else {
                        alert(result.Errors);
                    }
                }
            }


        },

        /***************************************************************************************************
        Live controls, this allow load html with plugins and load it dynamically
        ***************************************************************************************************/

        initializeControls: function() {

            $("[smart]", this).each(function(i, ctrl) {
                var $ctrl = $(ctrl);
                if (!$ctrl.hasControl()) {
                    $ctrl.hasControl(true);

                    for (var eventType in $ctrl.smart()) {
                        if (eventType == "load") {
                            $ctrl.dataBind({}, jQuery.Event("load"));
                        } else {
                            $ctrl.bind(eventType, function(event) {
                                $ctrl.dataBind({}, event);
                                event.stopPropagation();
                                event.preventDefault();
                                return false;
                            });
                        }
                    }
                }
            });


            $("[plugin]", this).each(function(i, ctrl) {
                var it = $(ctrl);
                if (it.hasControl()) return;
                it.hasControl(true);

                var plugin = it.attr("plugin");
                var options = eval("(" + it.attr("options") + ")");

                if (!it[plugin]) {
                    alert("The plugin \"" + plugin + "\" don´t loaded!");
                }

                it[plugin](options);
            });

            this._initializeThemeStyle();

            return this;


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

    String.prototype.JsonToDate = function(culture) {
        var date = null;

        if (this && this != "") {
            var result = new Date(parseFloat(this.replace(/(\/)|\)|Date\(/g, "")));
            date = new Date(result.valueOf() + result.getTimezoneOffset() * 60000);
        }

        if ($.preferCulture && !!date) {
            return $.format(date, "d", culture);
        }

        return date;
    }


    // Inicializa todos os controles da tela.
    $(function() {
        $(document).initializeControls();
    });

    // Se o globalization for declarado então começa com pt-BR para facilitar o desenvolvimento 
    if ($.preferCulture)
        $.preferCulture("pt-BR");

})(jQuery);


function Exception(msg) {
    msg = " SmartClient Error:  \n" + msg;
    //alert(msg);
    throw ReferenceError(msg);
};

function PageNotFoundException(url) {
    Exception(" A página '" + url  + "' não foi encontrada!");
}

function TargetMissingException(sender) {
    Exception(" Não foi encontrado o elemento html '" + sender.attrUp("target") + "'! \n\n Html Trace: " + sender.outerHtml());
}


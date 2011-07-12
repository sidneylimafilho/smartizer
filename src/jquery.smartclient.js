/*  <reference path="jquery-vsdoc.js" /> */
/*  <summary> */
/*  SmartClient  */
/*  </summary> */
(function($) {
    "use strict";

    /***************************************************************************************************
    Extend jQuery with SmarClient 
    ***************************************************************************************************/
    $.fn.extend({

        hasControl: function(bool) {
            return arguments.length ? this.data('control', bool) : this.data('control');
        },
        attrUp: function(name) {
            if (this.length > 0) {
                return this.attr(name) || this.parent().attrUp(name);
            }
        },
        outerHtml: function(html) {
            return html ? this.before(html).remove() : $("<p>").append(this.eq(0).clone()).html();
        },

        render: function(data, options) {
            if (this.size() === 0) { throw new Error("Zero element selected!"); }

            options = $.extend({}, options);

            /*  Introduce the data as local variables using with(){} */
            var html = "",
                script = "",
                fn,
                template = this.html();
            template = template.split("&lt;").join("<");
            template = template.split("%3C").join("<");
            template = template.split("&gt;").join(">");
            template = template.split("%3E").join(">");
            template = template.split("&quot;").join('"');
            template = template.replace("<!--", " ");
            template = template.replace("-->", " ");
            template = template.replace(/'/g, "\\'");

            /* template = template.replace(/'(?=[^$]*$>)/g, "\t"); */
            /* template = template.split("\t").join("'"); */

            template = template.replace(/<\$=(.+?)\$>/g, "',$1,'");

            template = template.split("<$").join("');");
            template = template.split("$>").join("p.push('");
            template = template.replace(/[\r\t\n]/g, " ");


            /*  Convert the template into pure JavaScript */
            script = "var p=[], dataItem = dataItem || []; with(dataItem){ p.push('" + template + "');} return p.join('');";

            try {
                $.cache = $.cache || {};
                /*  Generate a reusable function that will serve as a template */
                /*  generator (and which will be cached). */
                /* var fn = !/\W/.test(this.id) ? cache[this.id] = (cache[this.id] || $(this).template()) : */
                fn = $.cache[template];
                if (!fn) {
                    fn = $.cache[template] = new Function("index", "dataItem", script);
                }

                if (!$.isArray(data)) {
                    html += fn(0, data);
                } else {
                    for (var i = 0; i < data.length; i++) {
                        html += fn(i, data[i]);
                    }
                }

            } catch (err) {
                //#JSCOVERAGE_IF  false
                /* $("<pre class='error' />").text("The template is mal-formed, because " + err + "\n\n" + script).appendTo("body"); */
                Exception("The template is mal-formed, because " + err + "\n\n" + script);
                //#JSCOVERAGE_ENDIF  
            }


            /*  Provide some basic currying to the user */
            /* var html = fn(data); */
            /* this.html(html); */
            return data ? html : fn;
        },
        ajaxIframe: function(url, ctrl, onsucess) {
            var iframe = $("#ajaxIFrame");

            if ($("#ajaxIFrame").size() === 0) {
                iframe = $(document.body).prepend("<IFRAME id=\"ajaxIFrame\">").find("#ajaxIFrame");
            }

            iframe.unbind("load").bind("load", function() {
                var html = $("body", iframe.contents()).html();
                /* ctrl.attachHtmlInTarget(html); */
                if (onsucess)
                    onsucess(html, "notmodified", null);
                iframe.unbind("load");
            });
            iframe.hide().attr("src", url);

        },
        warnCapsLockIsOn: function(callback) {
            this.each(function(i, elem) {

                var myKeyCode = e.keyCode || e.which;

                if (e.shiftKey) {
                    /*  Lower case letters are seen while depressing the Shift key, therefore Caps Lock is on */
                    if ((myKeyCode >= 97 && myKeyCode <= 122)) { callback(); }
                }
                else {
                    /*  Upper case letters are seen without depressing the Shift key, therefore Caps Lock is on */
                    if ((myKeyCode >= 65 && myKeyCode <= 90)) { callback(); }
                }

            });
        },
        smart: function() {
            var $this = $(this[0]);
            if (!this._smart) {

                var smartJson = this.attr("smart");
            
                this._smart = $.fromJSON( smartJson );

                var events = 0;
                var errors = "";
                for (var event in this._smart) {
                    var obj = this._smart[event];
                    events++;

                    if (!!obj.show && $(obj.show).size() === 0)
                        errors += "The attribute SHOW (" + obj.show + ") don´t exists!\n";

                    if (!!obj.hide && $(obj.hide).size() === 0)
                        errors += "The attribute HIDE (" + obj.hide + ") don´t exists!\n";

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

                    if (!!obj.target && ($(obj.target).size() === 0 || typeof (obj.target) !== "string"))
                        errors += "The attribute TARGET (" + obj.target + ") don´t exists!\n";

                    if (!!obj.template && ($(obj.template).size() === 0 || typeof (obj.template) !== "string"))
                        errors += "The attribute TEMPLATE (" + obj.template + ") don´t exists!\n";

                    if (!!obj.emptytemplate && ($(obj.emptytemplate).size() === 0 || typeof (obj.emptytemplate) !== "string"))
                        errors += "The attribute EMPTYTEMPLATE (" + obj.emptytemplate + ") don´t exists!\n";
                        
                        obj.source = (obj.source || this.attrUp("href") || "").trimChars("", "\\/");
                        var candidate = obj.source.replace(/javascript(.*)/g, "");
                        if (!!obj.source && obj.source !== candidate){
                        obj.source = candidate;
                        }

                }

                if (events === 0) {
                    errors += "Don´t exists event configured!\n";
                }
                
                
                if (errors !== "") {
                    //#JSCOVERAGE_IF false
                    Exception(errors);
                    //#JSCOVERAGE_ENDIF 
                }
                 

            }
            return this._smart;
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

        _dataBind: function(options, event) {

            var $this = this;
            var smart = $this.smart();

            /*  Get configuration for event or first configuration possible */
            for (var key in smart) { smart = smart[key]; }

            smart = $this.smart()[event.type] || smart;

            /*  Check whether keyDown, keyPress, keyUp event fires in a specific key */
            if (event.type.indexOf("key") >= 0) {
                if (!!event.keyCode && !!smart[event.keyCode])
                    smart = smart[event.keyCode];
            }

            /*  Add a {} as first parameter because otherwise override smart variable */
            /*  The order are true, {}, options, smart to copy the properties of the smart to options */
            options = $.extend(true, {}, smart, options);

            if (options.onbinding)
                if (options.onbinding.apply($this) === false) /*  case undefined or true the code continues */
                return this;


            /* Exists only for tests */
            if (options.dataSource || options.responseBody || options.defaultResponseBody)
                options.dataSource = options.dataSource || options.responseBody || options.defaultResponseBody;
                        
            if (!!options.source) /*  Only fires ajax if there are url */
            {
                if (!!window.applicationPath) { window.applicationPath = window.applicationPath.trimChars("", "\\/"); }
                options.source = options.source.replace("~", window.applicationPath);


                options.method = this[0].tagName === "A" ? "GET" : (options.method || "POST");

                if (options.onrequest)
                    if (options.onrequest.call($this, options) === false) /*  case undefined or true the code continues */
                    return this;

                $.ajax({
                    type: options.method,
                    url: options.source,
                    data: (options.method !== "GET" ? $.toJSON(options.sourceparams || {}) : null),
                    contentType: "application/json",
                    ifModified: true,
                    success: function(dataSource, status, request) {

                        /*  If Not Modified then get cached content file by iframe */
                        if (!!request && (request.status === 304 || status === "notmodified")) {
                            $this.ajaxIframe(options.url, $this, this.success);
                        }

                        if (options.onresponse)
                            dataSource = options.onresponse.call($this, dataSource, status, request, options);

                        /*  If Http Status 200 then OK, process JSON because data should be transform on html */
                        options.dataSource = dataSource;

                        if (options.onsucess)
                            options.onsucess.call($this, dataSource, status, request, options);

                        fireActions($this, options, smart);

                    },
                    error: function(request, textStatus, errorThrown) {
                        if (options.onerror)
                            options.onerror.call($this, request, textStatus, errorThrown, options);

                        fireActions($this, options, smart);

                        if (request.status === "404") {
                            //#JSCOVERAGE_IF false
                            PageNotFoundException(options.url);
                            //#JSCOVERAGE_ENDIF  
                        }
                    },
                    complete: function() {
                        /*  Retirada a função fireActions deste evento pois o sucess é passado  */
                        /*  como argumento da função ajaxIframe */
                    }
                });
            } else {
                fireActions($this, options, smart);
            }


            function fireActions($this, options, smart, mode) {

                /*  Get target tag */
                options.target = options.target || $this;

                /*  options.template indicates um HTML to be transformed or a content  */
                if (!!options.template || !!options.source || !!options.dataSource) {

                    var html = options.dataSource || $(options.template).html() || "";

                    if (html.length === 0 && $(smart.emptytemplate).size() > 0) {

                        html = $(options.emptytemplate).html();

                    } else if (typeof (options.dataSource) === "object" || typeof (options.dataSource) === "array") {

                        var $template = $(options.template);
                        if (!!options.template && $template.size() > 0) {
                            html = $template.render(options.dataSource, options);
                        } else {
                            html = $this.render(options.dataSource, options);
                        }

                    }



                    if ($(options.target).size() === 0) {
                        //#JSCOVERAGE_IF false
                        TargetMissingException(this);
                        //#JSCOVERAGE_ENDIF  
                    }

                    if (mode === "after") {
                        $(options.target).after(html);
                        $(options.target).parent().initializeControls();
                    } else {
                        $(options.target).hide().html(html).initializeControls().fadeIn(options.speed || "slow");
                    }
                }

                if (options.once)
                    $this.unbind(event.type);

                if (options.hide) {
                    if (options.speed)
                        $(options.hide).hide(options.speed || "slow");
                    else
                        $(options.hide).hide();
                }

                if (options.show) {
                    if (options.speed)
                        $(options.show).show(options.speed || "slow");
                    else
                        $(options.show).show();
                }

                //
                /*  If exists options that are jQuery methods then executes them */
                //
                for (var key in options) if ($.fn[key] && !!options[key]) {
                    var $func = $.fn[key],
                        value = options[key];
                    if(typeof (value) === "string"){                        
                        $func.call($this, value);
                    } else if (typeof (options[key].shift) === "function"){          
                        $func.apply($(value.shift()), value);
                    }                    
                }

                if (options.onbounded)
                    options.onbounded.call($this, options);

                /*  Allow fire DataBinding in controls that has TRIGGER atribute */
                if (options.trigger) {
                    $(options.trigger).dataBind({ sourceparams: smart.sourceparams }, event);
                    return;
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
                        if (eventType === "load") {
                            $ctrl.dataBind({}, jQuery.Event("load"));
                        } else {
                            $ctrl.bind(eventType, function(event) {
                                $ctrl.dataBind({}, event);
                                if (ctrl.tagName === "A")
                                    event.preventDefault();
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



// The tests dont cover theming
//#JSCOVERAGE_IF false
        _initializeThemeStyle: function() {
            $(":text", this).wrap("<span class='ui-theme-textbox cDat11' />");
            $(":text", this).focusin(function() {
                $(this).parent().addClass('cDat11_focus');
            }).focusout(function() {
                $(this).parent().removeClass().addClass('cDat11');
            }).mouseenter(function() {
                $(this).parent().addClass('cDat11_hover');
            }).mouseleave(function() {
                $(this).parent().removeClass('cDat11_hover');
            }).after("<span />");

            //
            /*  Botões */
            //
            $(":submit, :button, :reset", this).each(function(i, ctrl) {
                $(ctrl).wrap("<span class='ui-theme-button " + $(ctrl).attr("class") + "' />").parent().hover(function() { $(this).addClass('hover'); }, function() { $(this).removeClass('hover'); });
            });

            $(":submit, :button, :reset", this).after("<span />");


            //
            /*  Grid */
            //
            $("table[rules=all]", this)
               .addClass("ui-theme-table")
               .filter("tr")
               .hover(function() { $(this).addClass('hover'); },
                      function() { $(this).removeClass(); });

            $("table[rowselectable=true]", this).each(function(i, elem) {
                var $table = $(elem);

                $.each(this.rows, function(i, elem) {
                    $(this).has(".delete").click(function() {
                        __doPostBack(($table.attr("id") || "").replace(/\_/g, "$"), 'Select$' + (i - 1));
                    });
                });
            })

        }
//#JSCOVERAGE_ENDIF           


    }); /*  End Initialize Controls */

// Dont cover errors code
//#JSCOVERAGE_IF false
    function Exception(msg) {
        msg = " SmartClient Error:  \n" + msg;
        /* alert(msg); */
        throw new ReferenceError(msg);
        /* console.log(msg); */
    };

    function PageNotFoundException(url) {
        Exception(" A página '" + url + "' não foi encontrada!");
    }

    function TargetMissingException(sender) {
        Exception(" Não foi encontrado o elemento html '" + sender.attrUp("target") + "'! \n\n Html Trace: " + sender.outerHtml());
    }
    
//#JSCOVERAGE_ENDIF    




    //
    /*  JSON Serializer based by json2.js */
    //

    /***************************************************************************************************
    DateTime Extensions
    ***************************************************************************************************/
    String.prototype.JsonToDate = function(culture) {
        var date = null;

        if (this && this !== "") {
            var result = new Date(parseFloat(this.replace(/(\/)|\)|Date\(/g, "")));
            date = new Date(result.valueOf() + result.getTimezoneOffset() * 60000);
        }

        if (!!culture && !!$.preferCulture && !!date) {
            return $.format(date, "d", culture);
        }

        return date;
    }


    String.prototype.trimChars = function(left, right) {
        left = left || "";
        right = right || left;

        /*         tmp = tmp.replace(new RegExp("^(" + boundaries + ")"), ""); */
        /*         tmp = tmp.replace(new RegExp("(" + boundaries + ")$"), ""); */
        return this.replace(new RegExp("^( *" + left + " *)(.*)( *" + right + " *)$", "g"), "$2");
    }

// Does not cover the JSON Serializer, it is external plugin
//#JSCOVERAGE_IF false
    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function(key) {

            var f = function(n) { return n < 10 ? '0' + n : n; }

            return isFinite(this.valueOf()) ?
                   this.getUTCFullYear() + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate()) + 'T' +
                 f(this.getUTCHours()) + ':' +
                 f(this.getUTCMinutes()) + ':' +
                 f(this.getUTCSeconds()) + 'Z' : null;
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function(key) {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        meta = {    /*  table of character substitutions */
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"': '\\"',
            '\\': '\\\\'
        },
        rep;


    /*  If the string contains no control characters, no quote characters, and no */
    /*  backslash characters, then we can safely slap some quotes around it. */
    /*  Otherwise we must also replace the offending characters with safe escape */
    /*  sequences. */
    function quote(string) { escapable.lastIndex = 0; return escapable.test(string) ?'"' + string.replace(escapable, function(a) {var c = meta[a];return typeof c === 'string' ? c :'\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);}) + '"' :'"' + string + '"';}


   

    $.toJSON = function(value, replacer) {

        /*  The stringify method takes a value and an optional replacer, and an optional space parameter, and returns a JSON text. The replacer can be a function *//*  that can replace values, or an array of strings that will select the keys. *//*  A default replacer method can be provided. Use of the space parameter can *//*  produce text that is more easily readable. */
        var i;   
       
        /*  If there is a replacer, it must be a function or an array. */
        /*  Otherwise, throw an error. */

        rep = replacer;
        if (replacer && typeof replacer !== 'function' &&(typeof replacer !== 'object' ||typeof replacer.length !== 'number')) {throw new Error('JSON.stringify');}

        /*  Make a fake root object containing our value under the key of ''. */
        /*  Return the result of stringifying the value. */
        var tmp = (function (key, holder) {

                /*  Produce a string from holder[key]. */

                var /*  The loop counter. */ i, /*  The member key. */ k, /*  The member value. */ v, length,partial,value = holder[key];

                /*  If the value has a toJSON method, call it to obtain a replacement value. */
                if (value && typeof value === 'object' && typeof value.toJSON === 'function') {value = value.toJSON(key);}

                /*  If we were called with a replacer function, then call the replacer to obtain a replacement value. */
                if (typeof rep === 'function') {value = rep.call(holder, key, value);}

                /*  What happens next depends on the value's type. */
                switch (typeof value) {
                    case 'string': return quote(value);
                    case 'number': /*  JSON numbers must be finite. Encode non-finite numbers as null. */
                        return isFinite(value) ? String(value) : 'null';
                    case 'boolean':
                    case 'null':
                        return String(value);
                    case 'object':

                        /*  Due to a specification blunder in ECMAScript, typeof null is 'object', so watch out for that case. */
                        if (!value) {return 'null';}

                        /*  Make an array to hold the partial results of stringifying this object value. */
                        partial = [];

                        /*  Is the value an array? */
                        if (Object.prototype.toString.apply(value) === '[object Array]') {

                            /*  The value is an array. Stringify every element. Use null as a placeholder for non-JSON values. */
                            length = value.length;
                            for (i = 0; i < length; i++) { partial[i] = arguments.callee(i, value) || 'null'; }

                            /*  Join all of the elements together, separated with commas, and wrap them in brackets. */
                            return  '[' + partial.join(',') + ']';                    
                        }

                        /*  If the replacer is an array, use it to select the members to be stringified. */
                        if (rep && typeof rep === 'object') {
                            length = rep.length;
                            for (i = 0; i < length; i += 1) {
                                k = rep[i];
                                if (typeof k === 'string') {
                                    v = arguments.callee(k, value);
                                    if (v) { partial.push(quote(k) + ':' + v); }
                                }
                            }
                        } else {

                            /*  Otherwise, iterate through all of the keys in the object. */
                            for (k in value) if (Object.hasOwnProperty.call(value, k)) {
                                v = arguments.callee(k, value);
                                if (v) { partial.push(quote(k) + ':' + v); }                        
                            }
                        }

                        /*  Join all of the member texts together, separated with commas, and wrap them in braces. */
                        v = '{' + partial.join(',') + '}';
          
                        return v;
                }
            })('', { '': value });

        //
        /*  Para corrigir o problema do JavascriptSerializer que não converte o valor */
        /*  /Date(123456789000)/ -> \/Date(123456789000)\/ */
        /*  .replace("\/Date", "\\/Date") */
        //
        return tmp.replace(/\/Date/g, "\\\/Date").replace(/\)(\/)/g, ")\\/");
    };


    $.fromJSON = function(text, reviver) {
        var str = text || "";
        str = str.replace(/([\n\r\t])|(\u[0-9a-fA-F]{4})/g, ""); /*  Remove invalid chars by JSON http://www.json.org/ */
                str = str.trimChars("\\{", "\\}"); /*  Remove braces if exists */
                return eval("({" + str + "})");                
    }
//#JSCOVERAGE_ENDIF  


    /*  Inicializa todos os controles da tela. */
    $(function() { $(document).initializeControls(); });

    /*  Se o globalization for declarado então começa com pt-BR para facilitar o desenvolvimento */
    $.preferCulture && $.preferCulture("pt-BR");

})(jQuery);
﻿
$(function() {
	/* Mock Ajax method */
	$.ajax = function(options){
		options.success({}, "sucess", {
			status:200,
			getResponseHeader:function(){}
		});
		options.error({}, "error", {});	
	}
	
    var sandbox = $("<div style='position:absolute; top:-1000px;'></div>").appendTo("Body");



    module("NOT MODIFIED")

    asyncTest("Ajax Iframe: Ajax deve ter a capacidade de buscar arquivos atraves de Iframe para casos 304, VAZIO", function() {
        sandbox.html("<P />")
               .ajaxIframe('blank.htm', sandbox, function(result, status, xhr) {
                   ok(result === "" || !result);
                   start();
               });
    });

  /*   asyncTest("Ajax Iframe: Ajax deve ter a capacidade de buscar arquivos atraves de Iframe para casos 304, FORMSAMPLE", function() {
        sandbox.html("<P />")
               .ajaxIframe('index.html?', sandbox, function(result, status, xhr) {
                   ok(result != "" && result != null, "OK, Pegou o conteudo: " + result);
                   start();
               });
    });
 */
    module("BASIC");

    test("AttrUp: Deve retornar o attributo desejado na própria tag ou ir buscando nas tag pai", function() {
        var html = "<div><p><a command=\"click\" href=\"index.html\"></a></P></div>";
        var comm = sandbox.html(html).find("A").attrUp("command");
        equal(comm, "click");
    });

    test("AttrUp: Deve retornar o attributo desejado na própria tag ou ir buscando nas tag pai", function() {
        var html = "<div command=\"click\" ><p><a href=\"index.html\"></a></P></div>";
        var comm = sandbox.html(html).find("A").attrUp("command");
        equal(comm, "click");
    });


    test("OuterHtml: Deve retornar o attributo desejado na própria tag ou ir buscando nas tag pai", function() {
        var html = "<p><a href=\"index.html\"></a></P>";
        var comm = sandbox.html(html).find("p").outerHtml();
        equal(comm, "<p><a href=\"index.html\"></a></p>");
    });


    module("SMART");

    test("O atributo SMART pode ser declarado como JSON", function() {

        var smart = sandbox.html("<p><div smart=\"{click:{once:true}}\" /></p>").find("DIV").smart();
        ok(smart.click, "");
    });

    test("O atributo SMART pode ser declarado com espaços ", function() {

        var smart = sandbox.html("<p><div smart=\" { click : { once:true } } \" /></p>").find("DIV").smart();
        ok(smart.click, "");
    });

    test("O atributo SMART pode ser declarado sem abrir e fechar chaves", function() {

        var smart = sandbox.html("<p><div smart=\"click:{ once:true }\" /></p>").find("DIV").smart();
        ok(smart.click, "");
    });

    test("Deve utilizar o atributo SMART para pegar as configurações", function() {
        var html = "<a id='teste' smart=\"{click:{source:'data.js/GetSampleData', " +
                                      "options:{companyId:1, itemId:null}, " +

                                      "onbinding:function(result){}, " +
                                      "onrequest:function(result){}, " +
                                      "onresponse:function(result){}, " +
                                      "onsucess:function(result){}, " +
                                      "onerror:function(result){}, " +
                                      "onbounded:function(result){}, " +

                                      "target:'#teste', " +
                                      "template:'#teste', " +
                                      "emptytemplate:'#teste', " +
                                      "method:'GET', " +

                                      "once:true, " +
                                      "show:'#teste', " +
                                      "hide:'#teste' " +

                                     "}" +
                              "}\" ></a>";

        var smart = sandbox.html(html).find("A").smart();
        ok(smart.click.source, "source");
        ok(smart.click.options, "options");
        ok(smart.click.onbinding, "onbinding");
        ok(smart.click.onrequest, "onrequest");
        ok(smart.click.onresponse, "onresponse");
        ok(smart.click.onsucess, "onsucess");
        ok(smart.click.onerror, "onerror");
        ok(smart.click.onbounded, "onbounded");

        ok(smart.click.target, "target");
        ok(smart.click.template, "template");
        ok(smart.click.emptytemplate, "emptytemplate");
        ok(smart.click.method, "method");
        ok(smart.click.once, "once");
        ok(smart.click.show, "show");
        ok(smart.click.hide, "hide");

    });

    test("SMART: Deve validar os argumentos do atributo SMART", function() {


        var html = "<a id='teste' smart=\"{click:{ source:'blank.htm' } }\" ></a>";
        equal(sandbox.html(html).find("A").smart().click.source, "blank.htm", "source válido!");

        var html = "<a id='teste' smart=\"{click:{ source:'javascript:;' } }\" ></a>";
        equal(sandbox.html(html).find("A").smart().click.source, "", "source inválido!");

        var html = "<a id='teste' smart=\"{click:{ source:'javascript:void;' } }\" ></a>";
        equal(sandbox.html(html).find("A").smart().click.source, "", "source inválido!");

        var html = "<a id='teste' smart=\"{click:{ source:'javascript:void(0);' } }\" ></a>";
        equal(sandbox.html(html).find("A").smart().click.source, "", "source inválido!");

        var html = "<a id='teste' smart=\"{click:{onbinding:1}}\" ></a>";
        raises(function() { sandbox.html(html).find("A").smart(); }, "onbinding inválido!");

        var html = "<a id='teste' smart=\"{click:{ onbinding:function(){} } }\" ></a>";
        equal(typeof (sandbox.html(html).find("A").smart().click.onbinding), "function", "onbinding válido!");

        var html = "<a id='teste' smart=\"{click:{ onrequest:1 } }\" ></a>";
        raises(function() { sandbox.html(html).find("A").smart(); }, "onrequest inválido!");

        var html = "<a id='teste' smart=\"{click:{ onrequest:function(){} } }\" ></a>";
        equal(typeof (sandbox.html(html).find("A").smart().click.onrequest), "function", "onrequest válido!");


        var html = "<a id='teste' smart=\"{click:{ onresponse:1 } }\" ></a>";
        raises(function() { sandbox.html(html).find("A").smart(); }, "onresponse inválido!");

        var html = "<a id='teste' smart=\"{click:{ onresponse:function(){} } }\" ></a>";
        equal(typeof (sandbox.html(html).find("A").smart().click.onresponse), "function", "onresponse válido!");



        var html = "<a id='teste' smart=\"{click:{ onsucess:1 } }\" ></a>";
        raises(function() { sandbox.html(html).find("A").smart(); }, "onsucess inválido!");

        var html = "<a id='teste' smart=\"{click:{ onsucess:function(){} } }\" ></a>";
        equal(typeof (sandbox.html(html).find("A").smart().click.onsucess), "function", "onsucess válido!");



        var html = "<a id='teste' smart=\"{click:{ onerror:1 } }\" ></a>";
        raises(function() { sandbox.html(html).find("A").smart(); }, "onerror inválido!");

        var html = "<a id='teste' smart=\"{click:{ onerror:function(){} } }\" ></a>";
        equal(typeof (sandbox.html(html).find("A").smart().click.onerror), "function", "onerror válido!");



        var html = "<a id='teste' smart=\"{click:{ onbounded:1 } }\" ></a>";
        raises(function() { sandbox.html(html).find("A").smart(); }, "Validação onbounded disparada!");

        var html = "<a id='teste' smart=\"{click:{ onbounded:function(){} } }\" ></a>";
        equal(typeof (sandbox.html(html).find("A").smart().click.onbounded), "function", "onbounded válido!");


        var html = "<a id='teste' smart=\"{click:{ once:1 } }\" ></a>";
        raises(function() { sandbox.html(html).find("A").smart(); }, "Validação once disparada!");

        var html = "<a id='teste' smart=\"{click:{ once:true } }\" ></a>";
        equal(typeof (sandbox.html(html).find("A").smart().click.once), "boolean", "once válido!");


        var html = "<a id='teste' smart=\"{click:{ method:1 } }\" ></a>";
        raises(function() { sandbox.html(html).find("A").smart(); }, "Validação method disparada!");

        var html = "<a id='teste' smart=\"{click:{ method:'GET' } }\" ></a>";
        equal(typeof (sandbox.html(html).find("A").smart().click.method), "string", "method válido!");



        var html = "<a id='teste' smart=\"{click:{ target:1 } }\" ></a>";
        raises(function() { sandbox.html(html).find("A").smart(); }, "Validação target disparada!");

        var html = "<a id='teste' smart=\"{click:{ target:'@' } }\" ></a>";
        raises(function() { sandbox.html(html).find("A").smart(); }, "Validação target disparada!");

        var html = "<a id='teste' smart=\"{click:{ target:'#teste' } }\" ></a>";
        ok($(sandbox.html(html).find("A").smart().click.target).size() > 0, "target válido!");




        var html = "<a id='teste' smart=\"{click:{ template:1 } }\" ></a>";
        raises(function() { sandbox.html(html).find("A").smart(); }, "Validação template disparada!");

        var html = "<a id='teste' smart=\"{click:{ template:'@' } }\" ></a>";
        raises(function() { sandbox.html(html).find("A").smart(); }, "Validação template disparada!");

        var html = "<a id='teste' smart=\"{click:{ template:'#teste' } }\" ></a>";
        ok($(sandbox.html(html).find("A").smart().click.template).size() > 0, "template válido!");


        var html = "<a id='teste' smart=\"{click:{ emptytemplate:1 } }\" ></a>";
        raises(function() { sandbox.html(html).find("A").smart(); }, "Validação emptytemplate disparada!");

        var html = "<a id='teste' smart=\"{click:{ emptytemplate:'@' } }\" ></a>";
        raises(function() { sandbox.html(html).find("A").smart(); }, "Validação emptytemplate disparada!");

        var html = "<a id='teste' smart=\"{click:{ emptytemplate:'#teste' } }\" ></a>";
        ok($(sandbox.html(html).find("A").smart().click.emptytemplate).size() > 0, "emptytemplate válido!");

    });


    test("Um elemento com atributo SMART deve disparar o evento LOAD", function() {
        //window.t = 0;
        sandbox.html("<p><div smart=\"{load:{onbinding:function(){window.t=2}}}\" /></p>")
               .initializeControls()
               .find("div")
        equals(t, 2);
    });

    test("Um elemento com atributo SMART não tiver evento, automaticamente usará o evento load", function() {
        //window.t = 0;
        sandbox.html("<p><div smart=\"onbinding:function(){window.t=2}\" /></p>")
               .initializeControls()
               .find("div")
        equals(t, 2);
    });

    test("Um elemento com atributo SMART deve disparar o evento CLICK", function() {
        window.t = 0;
        sandbox.html("<p><div smart=\"{click:{onbinding:function(){window.t=3}}}\" /></p>")
               .initializeControls()
               .find("div")
               .click();
        equals(t, 3);
    });



    test("Um elemento com atributo SMART deve disparar o evento KEYPRESS", function() {
        window.t = 0;
        var e = $.Event("keypress");

        sandbox.html("<p><div smart=\" { keypress:{onbinding:function(){window.t=3 } } } \" /></p>")
               .initializeControls()
               .find("div")
               .trigger(e);
        equals(t, 3);
    });

    test("Um elemento com atributo SMART deve disparar o keyCode especifico do KEYPRESS", function() {
        window.t = 0;
        var e = $.Event("keypress");
        e.keyCode = 27;
        sandbox.html("<p><input type='text' smart=\"{" +
                                        "keypress: {" +
                                           "27 : {" +
                                                "onbinding:function(){window.t=3}" +
                                           "}" +
                                        "}" +
                                     "}\" /></p>")
               .initializeControls()
               .find("input")
               .trigger(e);
        equals(t, 3);
    });





    test("Um elemento com atributo SMART deve disparar o evento onbinding", function() {
        window.t = 0;
        sandbox.html("<p><div smart=\"{click:{onbinding:function(){window.t=2}}}\" /></p>")
               .initializeControls()
               .find("div")
               .click();
        equals(t, 2);
    });

    test("Um elemento com atributo SMART deve disparar o evento onbounded", function() {
        window.t = 0;
        sandbox.html("<p><div smart=\"{click:{onbounded:function(){window.t=4}}}\" /></p>")
               .initializeControls()
               .find("div")
               .click();
        equals(t, 4);
    });

    test("Um elemento com atributo SMART deve disparar o evento onrequest", function() {
        window.t = 0;
        sandbox.html("<p><div smart=\"{click:{source:'blank.htm', method:'GET', onrequest:function(){window.t=6}}}\" /></p>")
               .initializeControls()
               .find("div")
               .click();
        equals(t, 6);
    });


    asyncTest("Um elemento com atributo SMART deve disparar o evento onresponse", function() {

        sandbox.html("<p><div smart=\"{click:{method:'GET', source:'blank.htm', onresponse:function(result){ok(true); start(); return result; }}}\" /></p>")
               .initializeControls()
               .find("div")
               .click();
    });

    asyncTest("Um elemento com atributo SMART deve disparar o evento onerror", function() {

        sandbox.html("<p><div smart=\"{click: {source: 'blank.htm', onerror: function(result) {ok(true);start();}}}\" /></p>")
               .initializeControls()
               .find("div")
               .click();
    });



    asyncTest("Um elemento com atributo SMART deve disparar o evento onsucess", function() {

        sandbox.html("<p><div smart=\"{click: {method:'GET', source:'blank.htm', onsucess:function(result) {ok(true);start();}}}\" /></p>")
                    .initializeControls()
                    .find("div")
                    .click();
    });

    asyncTest("Um elemento com atributo SMART deve disparar o evento onbounded", function() {

        sandbox.html("<p><div smart=\"{click: {method:'GET', " +
                                              "source:'blank.htm', " +
                                              "onbounded:function(result) {ok(true);start();}" +
                                              "}}\" /></p>")
                    .initializeControls()
                    .find("div")
                    .click();
    });


    test("Um elemento com atributo SMART pode chamar funções do jQuery no mesmo elemento", function() {
        var tag = sandbox.html("<div smart=\"{load:{hide:'0'}}\" ></div>").initializeControls().find("div");
        ok(tag.is(":hidden"));
    });

    test("Um elemento com atributo SMART pode chamar funções do jQuery, passando o contexto", function() {
        var tag = sandbox.html("<p style=\"display: none;\" id=\"oculto\">teste</p>" +
                               "<p style=\"display: block;\" id=\"visivel\">teste</p>" +
                               "<div smart=\"{load:{hide:['#visivel'], show:['#oculto'], speed:0}}\" ></div>")
               .initializeControls()
               .find("p");
        ok($("#oculto").is(":visible"));
        ok($("#visivel").is(":hidden"));
    });





    asyncTest("Um elemento com atributo SMART configurado, pode ser copiado por outro elemento que use a diretiva INHERITS", function() {
        t = 0;
        sandbox.html("<p><div id='base' smart=\"load:{sourceparams:1}\" /></p>" +
                     "<p><div smart=\"load:{inherits:'#base', onbinding:function(options){equals(options.sourceparams, 1); start();}}\" /></p>")
               .initializeControls()
               .find("div");
    });


    test("A diretiva ONCE só permite executar o evento uma vez", function() {
        window.t = 0;
        sandbox.html("<p><div smart=\"{click:{once:true, onbinding:function(){window.t++}}}\" /></p>")
               .initializeControls()
               .find("div")
               .click()
               .click();

        equals(t, 1);
    });





















    module("RENDER");

    test("A renderização deve funcionar sem dados!", function() {
        window.t = 0;
        sandbox.html("<p id='template'>teste</p>" +
                     "<span id='target'></span>" +
                     "<div smart=\"{click:{" +
                                      "template:'#template', " +
                                      "target:'#target', " +
                                      "onbounded:function(){equals($('#target').html(), 'teste');}" +
                                      "}}\" />")
               .initializeControls()
               .find("div")
               .click();
    });


    test("Uma renderização sem dados deve usar o EMPTY TEMPLATE!", function() {
        window.t = 0;
        sandbox.html("<p id='template'>teste</p>" +
                     "<p id='emptytemplate'>Vazio</p>" +
                     "<span id='target'></span>" +
                     "<div smart=\"{click:{" +
                                      "dataSource:[], " +
                                      "template:'#template', " +
                                      "emptytemplate:'#emptytemplate', " +
                                      "target:'#target', " +
                                      "onbounded:function(){equals($('#target').html(), 'Vazio');}" +
                                      "}}\" />")
               .initializeControls()
               .find("div")
               .click();
    });




    asyncTest("A renderização deve funcionar quando o retorno é JSON!", function() {
        window.t = 0;
        sandbox.html("<p id='template'>teste <$=t$></p>" +
                     "<span id='target'>Teste</span>" +
                     "<div smart=\"{click:{" +
                                      "dataSource:{t:1}, " +
                                      "method:'GET', " +
                                      "target:'#target', " +
                                      "template:'#template', " +
                                      "onbounded:function(){equals($('#target').html(),'teste 1'); start();}" +
                                      "}}\" />")
               .initializeControls()
               .find("div")
               .click();
    });




    asyncTest("A renderização deve funcionar informando o item a ser renderizado!", function() {
        window.t = 0;
        sandbox.html("<p id='template'>teste <$=index$> </p>" +
                     "<span id='target'>Teste</span>" +
                     "<div smart=\"{click:{" +
                                      "dataSource:[{t:1},{t:4},{t:6},{t:8}], " +
                                      "method:'GET', " +
                                      "target:'#target', " +
                                      "template:'#template', " +
                                      "onbounded:function(){equals($('#target').html(),'teste 0 teste 1 teste 2 teste 3 '); start();}" +
                                      "}}\" />")
               .initializeControls()
               .find("div")
               .click();
    });




    test("Uma renderização com dados deve usar o próprio html quando NÃO tiver TEMPLATE!", function() {
        window.t = 0;
        sandbox.html("<span id='target'></span>" +
                     "<div smart=\"{click:{" +
                                      "dataSource:[{t:1},{t:4},{t:6},{t:8}], " +                                      
                                      "target:'#target', " +
                                      "onbounded:function(){equals($('#target').html(), 'teste 1 teste 4 teste 6 teste 8 ');}" +
                                      "}}\" >teste <$=t$> </div>")
               .initializeControls()
               .find("div")
               .click();
    });

    test("Uma renderização com dados usando o próprio html deve permitir renderizar mais de uma vez!", function() {
        window.t = 0;
        sandbox.html("<div id='second' smart=\"click:{trigger:'#first', onbounded:function(){ equals($('#first').html(), 'teste 1 teste 4 ');}}\"></span>" +
                     "<span id='first' smart=\"dataSource:[{t:1},{t:4}], " +                                  
                                      "onbounded:function(){ equals($('#first').html(), 'teste 1 teste 4 ');}\" >" +
                                      "teste <$=t$> </span>")
               .initializeControls()
               .find("div")
               .click();
    });



















    module("DATA BINDING");

    test("A diretiva dataMember indica onde a informação deve ser inserida ", function() {

        window.dataSources.temp = { teste: 2 };
        var tag = sandbox.html("<input type='text' value='err' smart=\"click:{dataSource:'temp', dataMember:'teste'}\" />")
               .initializeControls()
               .find("input");

        tag.trigger($.Event("click"));
        equals(tag.val(), 2);
    });


    asyncTest("Quando o retorno do source é JSON e há um dataSource como string, salvar o dado no dataSource", function() {
        window.t = 0;
        sandbox.html("<p id='template'>teste <$=t$></p>" +
                     "<span id='target'>Teste</span>" +
                     "<div smart=\"dataSource:'temp', " +
                              "method:'GET', " +
                              "source:'data.js', " +
                              "onbounded:function(){ok(window.dataSources.temp); start();}\" />")
               .initializeControls()
               .find("div");
    });







    module("TARGET POSITION");


    test("Quando adicionar um conteúdo a uma tag, deve usar a diretiva targetPosition para indicar onde colocar", function() {
        window.dataSources.temp = [{ t: 1 }, { t: 2 }, { t: 3 }, { t: 4}];
        sandbox.html("<p id='target'><u>ini</u></p>" +
                     "<div smart=\"dataSource:'temp', target:'#target', targetPosition:'after'\"><span><$=t$></span></div>")
                .initializeControls()
                .find("div");

    });

















    module("TRIGGER");

    asyncTest("Ao disparar o DataBind deve disparar o elemento no atributo TRIGGER", function() {
        window["t"] = 0;
        sandbox.html("<p  smart=\"{click: { " +
                                  "onbinding:function(result) {ok(true);start(); return false;}" +
                                  "}}\"  id='target'>" +
                     "<div smart=\"click: { trigger:'#target' }\" /></p>")
                .initializeControls()
                .find("div")
                .click();

    });


    asyncTest("Ao disparar o DataBind deve disparar subsequentemente o elemento no atributo TRIGGER respeitando o evento ", function() {

        sandbox.html("<p  smart=\"mouseover: {onbinding:function(result) {throw new Exception(); }}," +
                                  "click: { onbinding:function(result) {ok(true); start(); return false;}}\"  id='target'>" +
                     "<div smart=\"click: { trigger:'#target' }\" /></p>")
                .initializeControls()
                .find("div")
                .trigger($.Event("click"));
    });

    asyncTest("O atributo trigger não deve propagar evitando uma chamada recursiva disparando sempre o mesmo elemento", function() {

        sandbox.html("<p  smart=\"mouseover: {onbinding:function(result) {throw new Exception(); }}," +
                                  "click: { onbinding:function(result) {ok(true); start(); return true;}}\"  id='target'>" +
                     "<div smart=\"click: { trigger:'#target' }\" /></p>")
                .initializeControls()
                .find("div")
                .trigger($.Event("click"));
    });



    asyncTest("Ao disparar a tag deve passar o parametro options para o próximo elemento", function() {

        sandbox.html("<p  id='target'>" +
                     "<div smart=\"click: {method:'GET', " +
                                  "source:'blank.htm', " +
                                  "sourceparams:{teste:1}, " +
                                  "onrequest:function(options) {equals(options.sourceparams.teste, 1, 'OK');start(); return false;}" +
                                  "}\" /></p>")
                .initializeControls()
                .find("div")
                .click();
    });


    asyncTest("Ao disparar a tag deve passar o parametro options sem sobrescrever o options do proximo elemento", function() {

        sandbox.html("<p id='target' smart=\"click: {method:'GET', " +
                                  "once:true, " +
                                  "source:'blank.htm', " +
                                  "sourceparams:{teste:1}, " +
                                  "onrequest:function(options) { equals(options.once, true, 'OK'); equals(options.sourceparams.div, true, 'OK'); start(); return false;}" +
                                  "}\" ></p>" +
                     "<div smart=\"click: {method:'POST', " +
                                  "sourceparams:{div:true}, " +
                                  "once:false, " +
                                  "trigger:'#target' " +
                                  "}\" ></div>")
                .initializeControls()
                .find("div")
                .click();
    });









    //    asyncTest("Ajax deve ter a capacidade de buscar arquivos atraves de Iframe para casos 304", function() {
    //        stop();
    //        var div = sandbox.html("<div><p command='click' href='data.js' /></div>")
    //                         .hide()
    //                         .initializeControls();


    //        div.find("p").dataBind({
    //            onsucess: function(result, status, xhr) {
    //                //Http 304
    //                div.find("p").dataBind({
    //                    onsucess: function(result, status, xhr) {
    //                        equals(status, "notmodified");
    //                        ok(result != "", result);
    //                        start();
    //                    }
    //                });
    //            }
    //        });

    //    });




    //    asyncTest("TARGET: Ao disparar o DataBind o retorno da requisição deve ser enviada para o controle identificado no atributo TARGET", function() {
    //        stop();

    //        if ($("#test").hide().size() == 0)
    //            $(document.body).prepend("<p id='test' />");


    //        sandbox.html("<p><a command='click' href='json.aspx' target='#test' /></p>")
    //               .initializeControls()
    //               .find("A")
    //               .dataBind({
    //                   onsucess: function(result, status, request) {
    //                       ok($("#test").html(), "OK, Pegou o conteúdo: " + $("#test").html());
    //                       start();
    //                   }
    //               });
    //    });

    //    test("Outer HTML: Deve retornar o conteúdo do html incluindo ele mesmo", function() {
    //        var html = "<p><a command=\"click\" href=\"blank.htm\"></a></p>";
    //        var outerHtml = $(html).outerHtml();
    //        equal(outerHtml, html);
    //    });




    module("SCENARIO");


    asyncTest("Links devem carregar assincronamente", function() {
        sandbox.html("<a href='data.js' smart=\"{click: {onresponse:function(){ok(true); start();}}}\" /></p>")
                .initializeControls()
                .find("a")
                .trigger($.Event("click"));
    });

    asyncTest("Links devem carregar assincronamente com metodo GET", function() {
        sandbox.html("<a href='data.js' " +
                        "smart=\"{click: {onbounded:function(options){ok(options.method=='GET'); start();}" +
                                         "}}\" /></p>")
                .initializeControls()
                .find("a")
                .trigger($.Event("click"));
    });

    asyncTest("Links devem carregar assincronamente colocando o conteudo no TARGET", function() {
        sandbox.html("<div id='text'></div>" +
                     "<a id='link' href='qunit/qunit.css' " +
                        "smart=\"{click: { target:'#text', " +
                                         "onbounded:function(options){ " +
                                            "ok(options.responseBody != ''); " +
                                            "$('#div').html(' '); " +
                                            "start();" +
                                         "}" +
                                    "}}\" >teste</a>")
                .initializeControls()
                .find("#link")
                .trigger($.Event("click"));
    });


    module("HASH");

    test("Links que começam com # devem marcar na barra de endereços", function() {
        sandbox.html("<a href='#data.aspx' smart=\"click:{onbinding:function(){}}\" /></p>")
                .initializeControls()
                .find("a")
                .trigger($.Event("click"));
        equals(location.hash, '#data.aspx');
    });

    //    test("GRID Editável", function() {
    //        ok(false);
    //    });

    //    test("Filter", function() {
    //        ok(false);
    //    });

    //    test("Paging", function() {
    //        ok(false);
    //    });

    //    test("Alfabetical Paging", function() {
    //        ok(false);
    //    });

    //    test("Wizard", function() {
    //        ok(false);
    //    });

    //    test("Form", function() {
    //        ok(false);
    //    });

    //    test("Graphics", function() {
    //        ok(false);
    //    });

    //    test("Mouseover Stylesheet", function() {
    //        ok(false);
    //    });

    //    test("Alert On Delete", function() {
    //        ok(false);
    //    });



});


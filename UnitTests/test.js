$(document).ready(function() {

    var sandbox = $("<div />").hide().appendTo("Body");

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

    module("SMART")

    test("SMART: Deve utilizar o atributo SMART para pegar as configurações", function() {
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

        var html = "<a id='teste' smart=\"\" ></a>";
        raises(function() { sandbox.html(html).find("A").smart(); }, "Validação Conteúdo Vazio disparada!");

        var html = "<a id='teste' smart=\"{}\" ></a>";
        raises(function() { sandbox.html(html).find("A").smart(); }, "Validação Conteúdo Vazio disparada!");

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

    test("getAddress: Deve retornar o endereço do recurso a ser acessado by HREF ", function() {
        var html = "<a href=\"index.html\"></a>";
        var outerHtml = sandbox.html(html).find("A").getAddress();
        equal(outerHtml, "index.html");
    });

    test("getAddress: Deve retornar o endereço do recurso a ser acessado by SOURCE ", function() {
        var html = "<span smart=\"{click:{source:'data.js', options:{companyId:1, itemId:null}}}\"></span>";
        var outerHtml = sandbox.html(html).find("span").getAddress();
        equal(outerHtml, "data.js");
    });

    test("getAddress: Deve retornar o endereço do recurso a ser acessado. SOURCE ends with slash ", function() {
        var html = "<a smart=\"{click:{source:'data.js/', options:{companyId:1, itemId:null}}}\"></a>";
        var outerHtml = sandbox.html(html).find("A").getAddress();
        equal(outerHtml, "data.js");
    });


    test("Um elemento com atributo SMART deve disparar o evento de acordo com conteúdo do atributo", function() {
        window.t = 0;
        sandbox.html("<p><div smart=\"{click:{onbinding:function(){window.t=2}}}\" /></p>")
               .initializeControls()
               .find("div")
               .click();
        equals(t, 2);
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
        sandbox.html("<p><div smart=\"{click:{source:'blank.htm', onrequest:function(){window.t=6}}}\" /></p>")
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





    asyncTest("TRIGGER: Ao disparar o DataBind deve chamar o DataBind do elemento que está do atributo trigger", function() {
        window["t"] = 0;
        sandbox.html("<p  smart=\"{click: {method:'GET', " +
                                  "onbounded:function(result) {ok(true);start();}" +
                                  "}}\"  id='target'>" +
                     "<div smart=\"{click: {method:'GET', " +
                                  "source:'blank.htm', " +
                                  "trigger:'#target' " +
                                  "}}\" /></p>")
                .initializeControls()
                .find("div")
                .click();

    });


    asyncTest("TRIGGER: Ao disparar a tag A deve passar o parametro options", function() {

        window["t"] = 0;
        sandbox.html("<p  id='target'>" +
                     "<div smart=\"{click: {method:'GET', " +
                                  "source:'blank.htm', " +
                                  "data:{teste:1}, " +
                                  "onrequest:function(options) {equals(options.data.teste, 1, 'OK');start();}" +
                                  "}}\" /></p>")
                .initializeControls()
                .find("div")
                .click();

    });



    //    module("NOT MODIFIED")

    //    asyncTest("Ajax Iframe: Ajax deve ter a capacidade de buscar arquivos atraves de Iframe para casos 304, VAZIO", function() {
    //        stop();
    //        sandbox.html("<P />")
    //               .ajaxIframe('blank.htm', sandbox, function(result, status, xhr) {
    //                   ok(result === "");
    //                   start();
    //               });
    //    });

    //    asyncTest("Ajax Iframe: Ajax deve ter a capacidade de buscar arquivos atraves de Iframe para casos 304, FORMSAMPLE", function() {
    //        stop();
    //        sandbox.html("<P />")
    //               .ajaxIframe('data.js', sandbox, function(result, status, xhr) {
    //                   ok(result != "" && result != null, "OK, Pegou o conteudo: " + result);
    //                   start();
    //               });
    //    });


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




    //    module("SCENARIO");

    //    test("GRID", function() {
    //        ok(false);
    //    });

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


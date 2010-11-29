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


    test("getAddress: Deve retornar o endereço do recurso a ser acessado. HREF ", function() {
        var html = "<a command=\"click\" href=\"index.html\"></a>";
        var outerHtml = sandbox.html(html).find("A").getAddress();
        equal(outerHtml, "index.html");
    });

    test("getAddress: Deve retornar o endereço do recurso a ser acessado. SOURCE ", function() {
        var html = "<a command=\"click\"  source='data.js' " +
                 "params='{companyId:1, itemId:null}'></a>";
        var outerHtml = sandbox.html(html).find("A").getAddress();
        equal(outerHtml, "data.js");
    });

    test("getAddress: Deve retornar o endereço do recurso a ser acessado. SOURCE ends with slash ", function() {
        var html = "<a command=\"click\"  source='data.js/' " +
                 "params='{companyId:1, itemId:null}'></a>";
        var outerHtml = sandbox.html(html).find("A").getAddress();
        equal(outerHtml, "data.js");
    });


    test("getAddress: Deve retornar o endereço do recurso a ser acessado. SOURCE w/ACTION ends with slash", function() {
        var html = "<a command=\"click\"  source='data.js/' " +
                "action='GetSampleData' params='{companyId:1, itemId:null}'></a>";
        var outerHtml = sandbox.html(html).find("A").getAddress();
        equal(outerHtml, "data.js/GetSampleData");
    });

    test("getAddress: Deve retornar o endereço do recurso a ser acessado. SOURCE w/ACTION ends with slash", function() {
        var html = "<a command=\"click\"  source='data.js' " +
                "action='GetSampleData' ></a>";
        var outerHtml = sandbox.html(html).find("A").getAddress();
        equal(outerHtml, "data.js/GetSampleData");
    });

    module("COMMAND");

    test("Um elemento com atributo COMMAND deve disparar o evento de acordo com conteúdo do atributo", function() {
        window.t = 0;
        sandbox.html("<p><div command='click' onbinding='window.t=2' /></p>")
               .initializeControls()
               .find("div")
               .click();
        equals(t, 2);

    });

    test("Um elemento com atributo COMMAND='click' deve ao ser clicado disparar o DataBind, result 2", function() {
        window["t"] = 0;
        sandbox.html("<a command='click' onbinding='window.t=2' />").find("A").dataBind();
        equals(t, 2);
    });

    test("Um elemento com atributo COMMAND='click' deve ao ser clicado disparar o DataBind, result 1", function() {
        window["t"] = 0;
        sandbox.html("<a command='click' onbinding='window.t=1' />").find("A").dataBind();
        equals(t, 1);
    });

    module("DATABIND");

    asyncTest("chama arquivos assincronamente BLANK.HTM", function() {
        stop();
        sandbox.html("<p><a command='click' href='blank.htm' /></p>")
                .initializeControls()
                .find("A")
                .dataBind({
                    onsucess: function(result, status, request) {
                        ok(result.replace(/( )+/g, "") == "", "OK Vazio!");
                        start();
                    }
                });
    });

    asyncTest("chama arquivos assincronamente DATA.JS", function() {
        stop();
        sandbox.html("<p><a command='click' href='DATA.JS' /></p>")
               .initializeControls()
               .find("A")
               .dataBind({
                   onsucess: function(result, status, request) {
                       ok(result != "", "OK, Pegou o conteúdo: " + result);
                       start();
                   }
               });
    });

    asyncTest("chama recursos de dados em JSON assincronamente", function() {
        stop();
        sandbox.html("<div><span command='click' source='json.aspx' " +
                     "action='GetSampleData' options='{parameters:{companyId:1, itemId:null}, formData:{}}' /></div>")
                .initializeControls()
                .find("span")
                .dataBind({
                    onsucess: function(result, status, request) {
                        ok(result.d, "OK, Veio JSON: " + $.toJSON(result.d));
                        start();
                    }
                });

    });


    asyncTest("TRIGGER: Ao disparar o DataBind deve chamar o DataBind do elemento que está do atributo trigger", function() {
        window["t"] = 0;
        stop();
        var c = sandbox
                .html("<p id='test'  onbinding='t=2; ok(true, \"dataBind do Test\"); start();' /><p><a command='click' trigger='#test' /></p>")
                .initializeControls()
                .find("A")
                .dataBind();
    });


    asyncTest("TRIGGER: Ao disparar a tag A deve passar o parametro options", function() {
        stop();
        var c = sandbox
                .html("<p id='test'  onbinding='ok(options.data.teste, \"dataBind do Test: \" + options.data.teste); start();' /><p>" +
                      "<a command='click' trigger='#test' options='{\"teste\":\"ok\"}' /></p>")
                .initializeControls()
                .find("A")
                .dataBind();
    });


    asyncTest("TRIGGER: Ao disparar a tag A deve chamar o DataBind do elemento que está do atributo trigger", function() {
        stop();
        var c = sandbox
                .html("<span id='test' command='click' source='json.aspx' action='GetSampleData' " +
                      " onsucess='ok(true, request.responseText); start();' " +
                      " options='{parameters:{companyId:1, itemId:null}, formData:{}}'  ></span>" +
                      "<a command='click' trigger='#test'  ></a>")
                .initializeControls()
                .find("A")
                .dataBind();
    });

    module("NOT MODIFIED")

    asyncTest("Ajax Iframe: Ajax deve ter a capacidade de buscar arquivos atraves de Iframe para casos 304, VAZIO", function() {
        stop();
        sandbox.html("<P />")
               .ajaxIframe('blank.htm', sandbox, function(result, status, xhr) {
                   ok(result === "");
                   start();
               });
    });

    asyncTest("Ajax Iframe: Ajax deve ter a capacidade de buscar arquivos atraves de Iframe para casos 304, FORMSAMPLE", function() {
        stop();
        sandbox.html("<P />")
               .ajaxIframe('data.js', sandbox, function(result, status, xhr) {
                   ok(result != "" && result != null, "OK, Pegou o conteudo: " + result);
                   start();
               });
    });


    asyncTest("Ajax deve ter a capacidade de buscar arquivos atraves de Iframe para casos 304", function() {
        stop();
        var div = sandbox.html("<div><p command='click' href='data.js' /></div>")
                         .hide()
                         .initializeControls();


        div.find("p").dataBind({
            onsucess: function(result, status, xhr) {
                //Http 304
                div.find("p").dataBind({
                    onsucess: function(result, status, xhr) {
                        equals(status, "notmodified");
                        ok(result != "", result);
                        start();
                    }
                });
            }
        });

    });

    


    asyncTest("TARGET: Ao disparar o DataBind o retorno da requisição deve ser enviada para o controle identificado no atributo TARGET", function() {
        stop();

        if ($("#test").hide().size() == 0)
            $(document.body).prepend("<p id='test' />");
      

        sandbox.html("<p><a command='click' href='json.aspx' target='#test' /></p>")
               .initializeControls()
               .find("A")
               .dataBind({
                   onsucess: function(result, status, request) {
                       ok($("#test").html(), "OK, Pegou o conteúdo: " + $("#test").html());
                       start();
                   }
               });
    });

    test("Outer HTML: Deve retornar o conteúdo do html incluindo ele mesmo", function() {
        var html = "<p><a command=\"click\" href=\"blank.htm\"></a></p>";
        var outerHtml = $(html).outerHtml();
        equal(outerHtml, html);
    });




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


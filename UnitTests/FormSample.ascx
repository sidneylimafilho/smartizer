<%@ Control Language="C#" AutoEventWireup="true" %>

<div command="load" controller="<%=ResolveUrl("~/Infocontrol/SearchService/GetOneSampleData") %>"          
     selecteditemclass="myselected">
     <!--
    <label>Nome:</label>
    <input type="text" name="nome" value="<$= Nome $>" />
    <br />
    <label onclick=`alert($("#dataCriacao0").size());`>Data Criação:</label>
    <input type="text" name="dataCriacao" plugin="calendar" />
    <br />    
    <input type="button" value="Enviar"  command="GetOneSampleData" />
    -->
</div>

<a href="gridSample.ascx" target="#content" command="click">Voltar</a> 
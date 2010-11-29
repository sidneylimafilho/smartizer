<%@ Control Language="C#" AutoEventWireup="true" %>

<table id="table1" command="load" controller="<%=ResolveUrl("~/infocontrol/SearchService.svc/") %>"
    action="GetSampleData" params="{companyId:1, teste:{ casa:'JPA', status:'Atrasado', data: new Date(2010, 11, 31)}, itemId:null}" template="#table1 .template"
    target="#table1 .body" selectedclass="myselected">
    <thead>
        <tr>
            <th command="click" params="{orderby: 'ID'}">Numero </th>
            <th command="click" params="{orderby: 'Nome'}">Nome </th>
            <th command="click" params="{orderby: 'Data'}">Data </th>
            <th></th>
        </tr>
    </thead>
    <tbody class="template">
        <!--
        <tr command="click" href="FormSample.ascx" params="{itemId:<$=ID$>}" target="#content">
            <td><$= ID $> </td>
            <td><$= Nome $></td>
            <td>
                <input name="data" type="text" plugin="calendar" />
            </td>
            <td action="DeleteCustomer" command="click" style="cursor: pointer">&times; </td>
        </tr>
        -->
    </tbody>
    <tbody class="body" />
</table>

<h1>Arvore Recursiva 1</h1>

<table id="table2" command="load" controller="<%=ResolveUrl("~/infocontrol/SearchService.svc/") %>"
    action="GetSampleData" params="{companyId:1}" template="#table2 .template" target="#table2 .body"
    selecteditemclass="myselected">
    <thead>
        <tr>
            <th command="order" params="{orderby: 'Nome'}">Nome </th>
            <th command="order" params="{orderby: 'Data'}">Data </th>
            <th></th>
        </tr>
    </thead>
    <tbody class="template">
        <!-- 
       <tr command="click" params="{itemId:<$=ID$>}" template="#table2 .template" mode="after" once="true">
            <td><$=Nome$> </td>
            <td>
                <input name="data" type="text" plugin="calendar" />
            </td>
            <td style="cursor: pointer" command="click" onsucess="$(this).hide()">&times; </td>
        </tr>
        -->
    </tbody>
    <tbody class="body" />
</table>

<a href="blank.htm" command="click" target="#content">Limpa Tela</a> sd
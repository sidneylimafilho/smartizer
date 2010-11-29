<%@ Control Language="C#" AutoEventWireup="true" %>
<fieldset>
            <legend>Combo:</legend>
            Exemplo de combo:
            <select name="select">
                <option value="11">teste</option>
                <option value="12">teste 1</option>
                <option value="13">teste 12</option>
                <option value="14">teste3</option>
                <option value="15">teste4</option>
            </select>
        </fieldset>
        <fieldset>
            <legend>DateTime:</legend>
            <input type="text" plugin="calendar" alt="date" />
        </fieldset>
        <fieldset>
            <legend>Number:</legend>
            <input type="text" plugin="calendar" alt="date" />
        </fieldset>
        <fieldset>
            <legend>Mask:</legend>
        </fieldset>
        <fieldset>
            <legend>CheckBoxList / RadioButtonList:</legend>
            <span><$=Nome $>:<input type="checkbox" name="id" value="<$=id $>"></span> <span><$=Nome
                $>:<input type="radio" name="id" value="<$=id $>"></span>
        </fieldset>
        <fieldset>
            <legend>Editor Html:</legend>
            <textarea name="txt" plugin="htmlbox" style="width: 600px"></textarea>
        </fieldset>
        <fieldset>
            <legend>Buttons:</legend>
            <input type="submit" command="click" value="enviar">
        </fieldset>

<a href="blank.htm" command="click" target="#content">Limpa Tela</a>  sd <a href="SampleAll.ascx" command="click">Reload</a>
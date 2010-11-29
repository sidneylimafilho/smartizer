<%@ Page Language="C#" %>
<script runat="server">
    [System.Web.Services.WebMethod]
    public static object GetSampleData(Hashtable parameters, Hashtable formData) {
        return new {
            Data = new[]{
                new {Nome = Convert.ToString(parameters["itemId"]) + "1) asfdasd", ID = 1},
                new {Nome = Convert.ToString(parameters["itemId"]) + "2) fdgfjfgf", ID = 2},
                new {Nome = Convert.ToString(parameters["itemId"]) + "3) gk lyui yui ", ID = 3},
                new {Nome = Convert.ToString(parameters["itemId"]) + "4) 645retyy", ID = 4},
                new {Nome = Convert.ToString(parameters["itemId"]) + "5) sdgfhdfrd", ID = 5},
                new {Nome = Convert.ToString(parameters["itemId"]) + "6) fde wertewrtw", ID = 6},
                new {Nome = Convert.ToString(parameters["itemId"]) + "7) Haroldo de Andrade", ID = 7}
            }
        };
    }
</script>.
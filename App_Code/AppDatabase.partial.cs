using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.Linq;
using System.Data.Linq.Mapping;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;



public partial class AppDatabase : System.Data.Linq.DataContext
{	
	public AppDatabase() : base("Data Source=|DataDirectory|\\AppDatabase.sdf")
	{
		OnCreated();
	}	
}

[Serializable]
[System.Data.Services.Common.DataServiceKey("Id")]
public partial class Users {}


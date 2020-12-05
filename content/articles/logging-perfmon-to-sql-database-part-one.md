---
title: "Logging Perfmon to SQL Database"
date: "2015-09-02"
published: true
---

Disk Queue Length!

This is what we wanted to track prior to making a significant change to our Citrix environment. Namely, moving AppData\\Roaming from being redirected to our file server and moving it back to local disk.

It seems to be Citrix's recommendation to redirect AppData\\Roaming, but everyone we talked to said it wasn't a great idea. We definitely found this when we had the occasional file server issue and everyone's Citrix sessions would grind to a halt - which we didn't use to see prior to making this change.

So, we've come full circle again and are looking at not redirecting AppData\\Roaming. But - before we made the change, we wanted to get some data before and after the change - to make sure that the change wouldn't just move the problem from our file server to our Citrix servers.

So - how do you log using Perfmon without actually writing to the disk that you're monitoring? Well, you could a) add another drive, and save the Perfmon data to that drive, or way cooler - b) save the Perfmon data to a SQL database!

Now, technically we are using typeperf - not perfmon. But it works the same-ish (just commandline).

Steps:

1. Create an empty SQL Database named PerfmonDB on your SQL server SAAAS-SQL01
2. Create a user DSN on the VDA that you're wanting to log
3. Create a batch script that starts typeperf at boot, or some interval e.g. typeperf -f SQL -s SAAAS-VDA01 \`"\\LogicalDisk(C:)\\Current Disk Queue Length\`" -si 5 -o SQL:PerfmonDB!RedirectAppData
4. Log!

This will create 3x tables in PerfmonDB

[![PerfmonDB](/images/perfmondb.png)](/images/2015/09/perfmondb.png)

CounterData - the data

[![PerfmonDB 2](/images/2015/09/perfmondb-2.png?w=300)](/images/2015/09/perfmondb-2.png)

CounterDetails - details on the counter(s) - I have used 3x in here

[![PerfmonDB 3](/images/2015/09/perfmondb-3.png?w=300)](/images/2015/09/perfmondb-3.png)

DisplayToID

[![PerfmonDB 4](/images/2015/09/perfmondb-4.png?w=300)](/images/2015/09/perfmondb-4.png)

With this data, you should be able to chart the Average Disk Queue length on your VDAs over a number of hours/days!

But hang on... that sounds like a lot of manual work... what if I'm doing this for SAAAS-VDA01 to SAAAS-VDA67??? I'm going to get RSI before lunch!

Glad you asked... Here's a handy little script that will do all of the typeperf stuff in a single step. You'll still need to create the SQL Database manually. And assuming that you are running this under an account that has permission to the SQL Database...

\[code language="powershell"\] #Create ODBC connection Add-OdbcDsn -Name PerfmonDB -DsnType User -Platform "64-bit" -DriverName "SQL Server" -SetPropertyValue @("Trusted\_Connection=Yes", "Database=PerfmonData", "Server=SAAAS-SQL01")

#Create the typeperf batch script #Counter - C: Current Disk Queue Length, run every 5 seconds mkdir C:\\Perfmon $task = "typeperf -f SQL -s SAAAS-VDA01 \`"\\LogicalDisk(C:)\\Current Disk Queue Length\`" -si 5 -o SQL:PerfmonData!RedirectAppData" $task | out-file "C:\\Perfmon\\StartPerfmon.bat" -Force -Encoding ascii

#Schedule the batch script to run on startup schtasks.exe /create /TN "Start Perfmon Logging" /SC ONSTART /TR "C:\\Perfmon\\StartPerfmon.bat" /ru SAAAS\\Administrator /rp \*

\[/code\]

 

 [](/images/2015/09/perfmondb-2.png)

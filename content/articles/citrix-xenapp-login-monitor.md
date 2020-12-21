---
title: "Citrix XenApp - Login Monitor"
date: "2015-12-02"
published: true
description: 'Simulated logon to Citrix using PowerShell'
tags: ['Citrix','PowerShell']
---

***Update***: I'd recommend using one of the many free tools available to do this now, like ControlUp Scoutbees free edition, or just using the ControlUp Logon Simulator, or using Desktop/Application Probing in Citrix itself (if you're licensed for it!)


This has been an ambition of mine ever since I started playing with some of the ICA Client DLLs in PowerShell and watching Citrix sessions launch by magic (if you could get it to work, it was magic, plain and simple).

Since then, I've wanted to be able to have my monitoring system (in this case, Nagios) log into all of my XenApp servers, and report back whenever there was an issue getting into one.

It's taken months of working on this on and off, but I finally have something in a reasonably stable state... almost stable enough to add it to our after-hours alerting group (not while I'm on call - just the other engineers, of course!)

 

### The Overview

The script runs on one VM, contacts the controllers for my XenApp 6.5 and XenApp 7.6 farms, gathers a list of current XenApp nodes, then iterates through each one and attempts to log in.

If it logs in successfully, a file is updated on a central share, and the monitoring script moves onto the next server in the queue. If it waits for longer than the timeout period, it'll assume failure and alert in Nagios.

### Disclaimer!

This script is not a clean, finished, completely working product. There are better ways to do what I've done. There are probably safer ways to do this without periodically killing wfica32 processes... there are _definitely_ smarter ways to do a lot of the below... But hopefully this will provide you with inspiration to rewrite this to suit your own environment.

### Requirements

#### Permissions

I've set up 3 accounts in total: one account that runs the monitoring script (MonitorService), one account that logs into the Server 2012 R2 nodes (MonitorService-2012R2), and one account that logs into the Server 2008 R2 nodes (MonitorService-2008R2).

MonitorService needs to have local administrative permissions on the server that you're running this check from, as well as on your controller servers (i.e., the XenApp 6.5 ZDC and the XenApp 7.6 DC), as well as being a read-only administrator to both farms.

MonitorService-2012R2 and MonitorService-2008R2 need to have permission to log directly onto the XenApp nodes - this is important, as we aren't using the brokering process through a Web Interface/Storefront/Netscaler - we're connecting directly to the XenApp server itself. For XenApp 6.5, you need to create a user policy, then under ICA > select Desktop Launches and allow it (I do this only for a specified AD group, lets call it MonitoringServiceAccounts). Then, you need to add this AD group to the Remote Desktop Users group on each 2008 R2 XenApp node - I used a GPO to do this. For XenApp 7.6, you only need to add the group to the "Direct Access Users" group on the 2012 R2 XenApp node.

#### Firewall

The server running the script needs to be able to reach your XenApp nodes on 2598/1494, or port 443 if you can set up SSL Relay. It also needs to be able to reach your controllers on the WinRM port 5985/5986.

#### Share

I've set up a central share that stores the result entries - this should be accessible from all XenApp nodes and all MonitoringService accounts should have modify permissions to the share.

#### Roaming Profiles

I've set up my Monitoring Service accounts to use Roaming Profiles, there is a bit of pain involved in that - first and foremost - you should use a separate account or at least profile path for logging into different OSs. Secondly, I've scripted in clearing out the Roaming Profile for each account at the end of each monitoring run. This helps keep things running more stable.

#### Client Drives, Audio Redirection & Printer Mapping

Disable these for your monitoring accounts, ideally through Citrix policies. It will speed up the login process and prevent the Citrix Receiver from crashing under stress.

### The Script

OK, here goes... I always hate posting code online as I tend to see the glaring errors, poor naming conventions and general shoddiness of the code... if it bugs you - clean it up and post me a nicer, shinier version!

\[code language="powershell"\]

$start = Get-Date

#Get list of servers Write-Host "Generating list of servers from XenApp 6.5 and XenApp 7.6 environments" -fore Cyan

\## XenApp 7.6 try{ $xa76session = New-PSSession -ComputerName XA76DC01.saaas.com Invoke-Command -Session $xa76session -ScriptBlock {Add-PSSnapin Citrix\*} $XA76Servers = Invoke-Command -Session $xa76session -ScriptBlock {Get-BrokerMachine | select @{n="ServerName";e={$\_.DNSName -replace "\\.saaas.com"}},InMaintenanceMode} | Select ServerName,InMaintenanceMode

}catch{ Write-Host "Failed to retrieve list of servers from XenApp 7.6 farm. Using default list." -fore Yellow $XA76Servers = Import-CSV "C:\\Scripts\\LoginMonitor\\ServerLists\\XA76Servers.csv" }

\## XenApp 6.5 try{ $xa65Session = New-PSSession -ComputerName XA65ZDC01.saaas.com -ErrorAction SilentlyContinue Invoke-Command -Session $xa65session -ScriptBlock {Add-PSSnapin Citrix\*} $XA65servers = Invoke-Command -Session $xa65session -ScriptBlock {Get-XAServer | select ServerName,@{n="InMaintenanceMode";e={ if($\_.LogOnMode -like "Prohibit\*"){$true}elseif($\_.LogOnMode -eq "AllowLogons"){$false} }} } | Select ServerName,InMaintenanceMode }catch{ Write-Host "Failed to retrieve list of servers from XenApp 6.5 farm. Using default list." -fore Yellow $XA65Servers = Import-CSV "C:\\Scripts\\LoginMonitor\\ServerLists\\XA65Servers.csv" }

Write-Host "Got list of servers, closing connection to XenApp farms" -fore Cyan if($xa65Session){ Remove-PSSession $xa65Session } if($xa76session){ Remove-PSSession $xa76session }

\# Global variables $masterResultTable = Import-CSV "C:\\Scripts\\LoginMonitor\\LoginMonitorResults.csv" ## Set the logon user for the 7.6 and 6.5 farms respectively $XA76Servers | Add-Member -MemberType NoteProperty -Name LogonUser -Value "MonitoringService-2012R2" $XA65Servers | Add-Member -MemberType NoteProperty -Name LogonUser -Value "MonitoringService-2008R2" $servers = $null $servers += $XA76Servers $servers += $XA65Servers

\# Create ICA Template $icaTemplate = '\[Encoding\] InputEncoding = ISO8859\_1 \[WFClient\] Version=2 ProxyType=None HttpBrowserAddress=XASERVER:80 ConnectionBar=0 CDMAllowed=False CPMAllowed=Off

\[ApplicationServers\] XASERVER=

\[XASERVER\] Address=XASERVER InitialProgram= CGPAddress=\*:2598 ClientAudio=Off DesiredColor=2 DesiredHRes = 1024 DesiredVRes = 768 TWIMode = False KeyboardTimer = 0 MouseTimer = 0 ConnectionBar=0 Username=XAUSERNAME Clearpassword=MonitoringServicePassword Domain=saaas TransportDriver=TCP/IP WinStationDriver=ICA 3.0 BrowserProtocol=HTTPonTCP Compress=On EncryptionLevelSession=Basic \[Encrypt\] DriverNameWin32=PDCRYPTN.DLL DriverNameWin16=PDCRYPTW.DLL \[Compress\] DriverName=PDCOMP.DLL DriverNameWin16=PDCOMPW.DLL DriverNameWin32=PDCOMPN.DLL '

\# Find my session ID (so I don't go closing other people's processes!) $session = \[System.Diagnostics.Process\]::GetCurrentProcess().SessionId

\# Launch Desktops

foreach($server in $servers){ if(Get-Process wfica32 -ErrorAction SilentlyContinue){ #Close hung wfica32 and wfcrun32 processes Write-Host "Force restarting wfcrun/wfica processes" -fore yellow Get-Process wfica32 | ? {$\_.SessionId -eq $session} | Stop-Process -Force Get-Process wfcrun32 | ? {$\_.SessionId -eq $session} | Stop-Process -Force }

\# Sleep a bit for wfica32 to catch its breath. Start-Sleep 3

$result = $null

\# Create launch result file Write-Host "Creating result file for $($server.ServerName)..." Write-Output "ComputerName,LastLogonTime,InMaintenanceMode" | Out-File "\\\\saaas.com\\LoginMonitor\\$($server.ServerName).txt" -Force -Encoding ascii

\# Create ICA file $icaFile = "C:\\Scripts\\LoginMonitor\\LaunchFiles\\$($server.ServerName).ica" $icaTemplate -replace "XASERVER","$($server.ServerName)" -replace "XAUSERNAME","$($server.LogonUser)" | Out-File $icaFile -Force -Encoding ASCII

\# Launch Desktop Start-Process "C:\\Program Files (x86)\\Citrix\\ICA Client\\wfica32.exe" "$($icaFile)" Write-Host "Launching desktop on $($server.ServerName)."

$launchTime = Get-Date

\# If this server isn't in our result table already, add it. Else, update the existing entry. if($server.ServerName -notin $masterResultTable.Server ){ $masterResultTable += \[PSCustomObject\]@{Server = $server.ServerName;LaunchTime = $launchtime; LastLogonTime = $null; Result = $result} }else{ $masterResultTable\[$masterResultTable.Server.IndexOf("$($server.Servername)")\].LaunchTime = $launchtime $masterResultTable\[$masterResultTable.Server.IndexOf("$($server.Servername)")\].LastLogonTime = $null $masterResultTable\[$masterResultTable.Server.IndexOf("$($server.Servername)")\].Result = $result }

\# Get Results $loginResultFile = "\\\\saaas.com\\LoginMonitor\\$($server.ServerName).txt" $launchTime = $masterResultTable\[$masterResultTable.Server.IndexOf("$($server.Servername)")\].LaunchTime # Check to see if the user has logged in Write-Host "Checking to see if the login result file for $($server.ServerName) has been updated" -NoNewLine

\# Check to see if the LogonTime attribute in the CSV file has been updated more recently than the LaunchTime, if its been more than 3 minutes waiting, or if the server is in Maintenance mode. # if so, try log in anyway but don't mark as a failure if it doesn't log in. do{ Write-Host "." -NoNewline $loginResult = Import-Csv $loginResultFile Start-Sleep 1

}until((($loginResult.LastLogonTime -as \[datetime\]) -gt $launchtime) -or ((Get-Date).AddMinutes(-2) -gt $launchTime))

\# Create the result variable depending on whether the LastLogonTime has been updated or not or whether the server is in Maintenance Mode if(($loginResult.LastLogonTime -as \[datetime\]) -gt $launchtime){ Write-Host " Logged into $($server.ServerName) successfully!" -Fore Green $result = "Success" }elseif($server.InMaintenanceMode -eq $true){ Write-Host " $($server.Servername) is in maintenance mode, skipping checks..." -fore yellow $result = "InMaintenanceMode" }else{

Write-Host " User has not successfully logged into $($server.ServerName) in two minutes, skipping :(" -Fore red $result = "Failure" }

\# Update the master table $masterResultTable\[$masterResultTable.Server.IndexOf("$($server.ServerName)")\].Result = $result $masterResultTable\[$masterResultTable.Server.IndexOf("$($server.ServerName)")\].LastLogonTime = ($loginResult.LastLogonTime -as \[datetime\])

\# Update the CSV $masterResultTable | Export-CSV C:\\Scripts\\LoginMonitor\\LoginMonitorResults.csv -NoTypeInformation -Force

}

\# Stop any still-running Citrix processes - this tends to ruin Citrix Receiver. Better to just log off. Get-Process wfica32 | ? {$\_.SessionId -eq $session} | Stop-Process -Force Get-Process wfcrun32 | ? {$\_.SessionId -eq $session} | Stop-Process -Force # Gives "Receiver has stopped working" error #Get-Process receiver | Stop-Process -Force -Confirm:$false -ErrorAction SilentlyContinue #Get-Process SelfServicePlugin | Stop-Process -Force -Confirm:$false -ErrorAction SilentlyContinue

\# Reset the roaming profile to avoid corruption issues if((Test-Path .\\Blank) -eq $false){ mkdir blank } # MonitoringService needs to have modify perms to the below folders robocopy ".\\Blank" "\\\\saaas.com\\RoamingProfiles\\MonitoringService-2008R2.v2\\" /MIR /NJH /NJS /NDL /NS robocopy ".\\Blank" "\\\\saaas.com\\RoamingProfiles\\MonitoringService-2012R2.v2\\" /MIR /NJH /NJS /NDL /NS

$masterResultTable | Export-CSV C:\\Scripts\\LoginMonitor\\LoginMonitorResults.csv -NoTypeInformation -Force $end = Get-Date $length = $end - $start Write-Output "$($end) - Script took $($length.Hours) hours, $($length.Minutes) minutes, and $($length.Seconds) seconds to complete." | Out-File "C:\\Scripts\\LoginMonitor\\LoginMonitor.log" -Force

\# Log off shutdown /l

\[/code\]

### Nagios

The last piece of the puzzle, Nagios simply runs a check using the NSClient plugin to see if the result file (LoginMonitorResults.csv) has been updated and what the last logon result for each host was.

I aim to "decentralize" this more in future - by getting the NSClient check to run the "Was the login successful" logic. The login monitor itself could also be repurposed to run on each XenApp node individually, so each server is checking itself, rather than one server checking them all (which tends to cause more false positives etc.)

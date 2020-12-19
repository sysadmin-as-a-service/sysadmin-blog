---
title: "QUSER and PowerShell"
date: "2015-08-10"
published: true
description: 'PowerShell function that converts QUSER output to a PS object!'
---

UPDATED! with better Date format handling and added in Idle Time and shortened it and better coding in general. But still using QUSER :)

Quser is great. So is qwinsta/rwinsta and tsdisconn. But unfortunately they're not super-simple to parse the output when using PowerShell.

I've seen some examples of Quser > Powershell conversion scripts before (I think splitting on "\\r\\n" or similar, ) but I decided to make my own... In retrospect it would probably be a lot easier to do this using WMI, but hey.

I've added the ability to check against remote systems as well, but it does require you having the regular remote RPC calls that quser uses (correct me if I'm wrong on that one).

The more I review this, the more I want to clean it up (e.g., use WMI, use array splicing to add in the null SessionName rather than if/else... etc.). But it works, and at this point I need to move on...

Update: have moved the script to a GitHub repo for easier contributions. If someone knows how to add a GitHub repo to a WordPress page easily... let me know!

[View Script on Github](https://github.com/jeremysprite/ps-quser)

\[code language="powershell"\] function Get-LoggedOnUsers ($server) {

if($server -eq $null){ $server = "localhost" }

$users = @() # Query using quser, 2>$null to hide "No users exists...", then skip to the next server $quser = quser /server:$server 2>$null if(!($quser)){ Continue }

#Remove column headers $quser = $quser\[1..$($quser.Count)\] foreach($user in $quser){ $usersObj = \[PSCustomObject\]@{Server=$null;Username=$null;SessionName=$null;SessionId=$Null;SessionState=$null;LogonTime=$null;IdleTime=$null} $quserData = $user -split "\\s+"

#We have to splice the array if the session is disconnected (as the SESSIONNAME column quserData\[2\] is empty) if(($user | select-string "Disc") -ne $null){ #User is disconnected $quserData = ($quserData\[0..1\],"null",$quserData\[2..($quserData.Length -1)\]) -split "\\s+" }

\# Server $usersObj.Server = $server # Username $usersObj.Username = $quserData\[1\] # SessionName $usersObj.SessionName = $quserData\[2\] # SessionID $usersObj.SessionID = $quserData\[3\] # SessionState $usersObj.SessionState = $quserData\[4\] # IdleTime $quserData\[5\] = $quserData\[5\] -replace "\\+",":" -replace "\\.","0:0" -replace "Disc","0:0" if($quserData\[5\] -like "\*:\*"){ $usersObj.IdleTime = \[timespan\]"$($quserData\[5\])" }elseif($quserData\[5\] -eq "." -or $quserData\[5\] -eq "none"){ $usersObj.idleTime = \[timespan\]"0:0" }else{ $usersObj.IdleTime = \[timespan\]"0:$($quserData\[5\])" } # LogonTime $usersObj.LogonTime = (Get-Date "$($quserData\[6\]) $($quserData\[7\]) $($quserData\[8\] )")

$users += $usersObj

}

return $users

}

\[/code\]

 

Thanks

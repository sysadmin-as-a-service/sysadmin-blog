---
title: "Allowing non-Admins to Shadow, Message, and more on 2012 R2 RDS..."
date: "2015-12-03"
---

Although this one has been posted a few times before, I thought I'd add it in for my own reference as it taught me something I wasn't aware of - setting permissions through WMI objects.

Windows Server 2012 is great. In some respects, even better than Server 2008 R2.

In _many_ respects however, it is absolute bollocks, so I'm glad they came along with 2012 R2 to improve some of this.

One of the really bollocks-y things about the 2012 range of Server OSs is having Terminal Services Manager removed... and not replaced (until R2 - and even then...)

This can make managing RDS installations a pain.

 

We had a number of clients moving from XenApp 6.5 to XenApp 7.6 (and 2008 R2 servers > 2012 R2 servers), who used to be able to shadow other users using the Citrix Shadow Taskbar. Unfortunately, this was no longer possible, and because of some Active Directory peculiarities, we weren't able to give them access to Citrix Director.

So. We had to allow some non-admins to shadow some other non-admins. How?

Initially we looked at Remote Assistance (Citrix uses this in Citrix Director), but because the admin-initiated-request way required making an RPC call to the DCOM server on the VDA itself to generate a request etc. etc., and getting users to initiate the Remote Assistance request was always a pain, we scrapped this idea.

Luckily, someone invented the internet (and Google).

It turns out, the Terminal Services Managers group still exists in WMI, and the required permissions are still there - all you have to do is grant them. **Warning:** I don't know how to reverse this, so YMMV, etc.

This will allow your selected group to do the following:

Shadow other users\* List logged in users Disconnect users Log users off Kill processes of other users Open an administrative command prompt and type the following command (make sure you've actually created the group first):

\[code language="powershell"\] $protocols = \` "ICA-CGP", "ICA-CGP-1", "ICA-CGP-2", "ICA-CGP-3", "ICA-TCP", "ICA-SSL", "ICA-HTML5"</div> <div></div> <div>foreach($protocol in $protocols){</div> <div>(Get-WmiObject -Namespace "root/cimv2/terminalservices" -Class win32\_tspermissionssetting | Where-Object {$\_.TerminalName -eq $protocol}).AddAccount("SAAAS\\Client\_RDSAdmins",2) }</div> <div>\[/code\]

You will also need to add in the Group Policy settings as per https://technet.microsoft.com/en-us/library/cc771538.aspx

---
title: "Citrix Profile Manager - IE Saved Passwords"
date: "2015-08-10"
---

A winner first post... Internet Explorer not remembering Forms-based (i.e., AutoComplete) passwords for a website after the Citrix VDA has been restarted, or if I log into a different server.

This was a real pain for some of my users that I didn't pick up on during the testing phase of deploying UPM (because I don't generally save passwords for websites I go to, I remember them... but that's another story) and caused a few swears & tears when it took me a few days to resolve.

Internet Explorer (I'm working with v11 and up on Server 2012 R2, XenApp 7.6 published desktops, UPM 5.2) remembers passwords in two ways - the Username/Password popup box that it displays when presented with an HTTP 401 challenge - these are stored as Generic Credentials in the Windows Credential Manager.

The other way it can store passwords is via an AutoComplete form.

[According to Nirsoft,](http://www.nirsoft.net/utils/internet_explorer_password.html) the HTTP Auth passwords are stored in AppData\\Roaming\\Credentials and the forms-based auth passwords are stored in HKEY\_CURRENT\_USER\\Software\\Microsoft\\Internet Explorer\\IntelliForms\\Storage2. I couldn't quite match this up with what was happening in my environment, but using [this post](http://discussions.citrix.com/topic/361602-ie11-on-2012r2-vda-user-registry-hive-not-saved/?p=1875198) (and after restarting my VDAs) I was able to get the "Web Credentials" section of Credential Manager to roam to different servers & persist after a reboot.

In summary, configure the following Citrix Profile Manager policies:

**Directories to Synchronize:**

AppData\\Local\\Microsoft\\Credentials

**Folders to Mirror:**

AppData\\Local\\Microsoft\\Vault

**Process Internet Cookies at Logoff:**

Enabled

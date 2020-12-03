---
title: "Clean Citrix UPM Profiles"
date: "2016-06-08"
---

UPDATE: This is now built into Profile Manager, and I'd recommend you use this instead of the below script. https://docs.citrix.com/en-us/profile-management/current-release/configure/include-and-exclude-items/enable-logon-exclusion-check.html Thanks Citrix!

I have a hate/love relationship with Citrix Profile Manager.

On the other hand, I HATE how much time I seem to spend on it, tweaking my UPM policies to troubleshoot slow logons, trying to figure out which parts of the Google Chrome User Data folder I need to make it work properly, trying to figure out what some obscure folder in AppData is for and what will potentially break if I exclude it.

On the one hand, I love the fancy features like Profile Streaming, Active Writeback, and mirroring of credentials (and browser sessions!) across different servers between logon/logoff. I also appreciate some handy tools that Citrix/the Citrix Community have produced for UPM, like the UPM Log Parser and UPMConfigCheck.

 

Now, I'm happy to be able to add to this with a useful script of my own!

One thing I've noticed with Profile Manager is that the profile store doesn't get 'cleaned' when you change your Citrix Policies.

So, let's say you've been including all of AppData\\Local\\Google Chrome in your "Folders to synchronize" list (or you selected "Migration of existing profiles: **Local** and Roaming") , and start getting complaints of slow logins because the AppData\\Local\\Google Chrome\\User Data\\Default\\Cache folder is growing large.

After some brief Googling and a few prayers, you add AppData\\Local\\Google Chrome\\User Data\\Default\\Cache to your list of excluded folders.

But lo, and behold! Your logins are still slow? The AppData\\Local\\Google Chrome\\User Data\\Default\\Cache folder still exists in your users' profile store? Whaaa...?

Unfortunately, possibly for clever reasons, Profile Manager won't retroactively clean up your profile store, nor do the exclusion lists etc. apply on logon (i.e., UPM just copies _everything_ in your profile store down to the server).

This presents you with the difficult choice of either a) PowerShell'ing your way through each user profile and deleting the folders you no longer want, or b) resetting the profile.

 

Muralidhar Maram from Citrix wrote a handy little CLI tool that will do this for you, but with one caveat... it only works if you're using Citrix GPOs to deploy your UPM settings - not Citrix Studio Policies. Muralidhar probably has a lot to do, so I've written what is hopefully a useful script to clean up a UPM profile.

Caveats:

- It only works (has been tested) if you're using Citrix Studio policies :P
- It will ignore the AppData\\Roaming folder (i.e., just copy it in its entirety). If you don't want it to do this, comment out line 100 (and test, because I haven't) $savedFoldersList += "$($pathToUserStore)\\AppData\\Roaming"
- It doesn't delete the old UPM folder, but you could easily modify the script to.
- It assumes your PathToUserStore setting is based on the #SAMAccountName# variable. If you're using something different (e.g. #profilePath#), you'll need to modify the top do-until loop.

**How it works:**

It looks in the registry for your Profile Manager policies (so you have to run this on a VDA), and copies any files/folders in your "Directories to synchronize", "Folders to Mirror", "Files to synchronize" list from your current UPM folder to a new UPM folder.

It then goes through your "Exclusion list - directories" and "Exclusion list - files" policies and deletes any files/folders in your new UPM folder that match these.

Then, it resets the permissions on the folder, and renames your old UPM folder to UPM\_PROFILE\_backup.... and renames your new UPM folder to UPM\_PROFILE (so it'll get used at next logon/logoff).

**The script:**

Ta da.

 

\[code language="powershell"\]

######################################################################################### # Start up # Run from a VDA #########################################################################################

do{ $user = Read-Host "Enter the SAMAccount name of the user you wish to clean up" #PathToUserStore $pathToUserStore = ((Get-ItemProperty "HKLM:\\Software\\Policies\\Citrix\\UserProfileManagerHDX").PathToUserStore -replace "#SAMAccountName#",$user) + "\\UPM\_PROFILE" if(!(Test-Path $pathToUserStore)){ Write-Host "Can't find $($pathToUserStore), re-enter your username." -fore Red } }until(Test-Path $pathToUserStore)

Write-Host "Scanning UPM folder..." -fore yellow $savedFoldersList = @() $savedFilesList = @() $deleteFoldersList = @() $excFoldersList = @() $excFilesList = @() #SyncFileList foreach($file in (Get-ItemProperty "HKLM:\\Software\\Policies\\Citrix\\UserProfileManagerHDX\\SyncFileList").SyncFileList){ $file = $file \` -replace "!ctx\_localappdata!","AppData\\Local" \` -replace "!ctx\_internetcache!","AppData\\Local\\Microsoft\\Windows\\Temporary Internet Files" \` -replace "!ctx\_localsettings!","AppData\\Local" \` -replace "!ctx\_roamingappdata!","AppData\\Roaming" \` -replace "!ctx\_startmenu!","AppData\\Roaming\\Microsoft\\Windows\\Start Menu" # Also need to check if the file has a wildcard in it if($file -match "\\\*" -and $file -match "\\."){ # Get the parent directory of the file $periodIndex = $file.LastIndexOf(".") $parentDir = $file.Substring( 0,$periodIndex ) -replace "\\\*" $fileExt = $file.Substring( $periodIndex, ($file.Length - $periodIndex) ) foreach($wildcardFile in (gci -Path "$($pathToUserStore)\\$($parentDir)\*" -Include "\*$($fileExt)" -Force)){ $savedFilesList += $wildcardFile.FullName } }else{ $savedFilesList += "$($pathToUserStore)\\$($file)" }

} #SyncDirList foreach($folder in (Get-ItemProperty "HKLM:\\Software\\Policies\\Citrix\\UserProfileManagerHDX\\SyncDirList").SyncDirList){ $folder = $folder \` -replace "!ctx\_localappdata!","AppData\\Local" \` -replace "!ctx\_internetcache!","AppData\\Local\\Microsoft\\Windows\\Temporary Internet Files" \` -replace "!ctx\_localsettings!","AppData\\Local" \` -replace "!ctx\_roamingappdata!","AppData\\Roaming" \` -replace "!ctx\_startmenu!","AppData\\Roaming\\Microsoft\\Windows\\Start Menu" $savedFoldersList += "$($pathToUserStore)\\$($folder)" } #MirrorFoldersList foreach($folder in (Get-ItemProperty "HKLM:\\Software\\Policies\\Citrix\\UserProfileManagerHDX\\MirrorFoldersList").MirrorFoldersList){ $folder = $folder \` -replace "!ctx\_localappdata!","AppData\\Local" \` -replace "!ctx\_internetcache!","AppData\\Local\\Microsoft\\Windows\\Temporary Internet Files" \` -replace "!ctx\_localsettings!","AppData\\Local" \` -replace "!ctx\_roamingappdata!","AppData\\Roaming" \` -replace "!ctx\_startmenu!","AppData\\Roaming\\Microsoft\\Windows\\Start Menu" $savedFoldersList += "$($pathToUserStore)\\$($folder)" } #SyncExclusionListDir foreach($folder in (Get-ItemProperty "HKLM:\\Software\\Policies\\Citrix\\UserProfileManagerHDX\\SyncExclusionListDir").SyncExclusionListDir){ $folder = $folder \` -replace "!ctx\_localappdata!","AppData\\Local" \` -replace "!ctx\_internetcache!","AppData\\Local\\Microsoft\\Windows\\Temporary Internet Files" \` -replace "!ctx\_localsettings!","AppData\\Local" \` -replace "!ctx\_roamingappdata!","AppData\\Roaming" \` -replace "!ctx\_startmenu!","AppData\\Roaming\\Microsoft\\Windows\\Start Menu" $excFoldersList += "$($pathToUserStore)\\$($folder)" } #SyncExclusionListFiles foreach($file in (Get-ItemProperty "HKLM:\\Software\\Policies\\Citrix\\UserProfileManagerHDX\\SyncExclusionListFiles").SyncExclusionListFiles){ $file = $file \` -replace "!ctx\_localappdata!","AppData\\Local" \` -replace "!ctx\_internetcache!","AppData\\Local\\Microsoft\\Windows\\Temporary Internet Files" \` -replace "!ctx\_localsettings!","AppData\\Local" \` -replace "!ctx\_roamingappdata!","AppData\\Roaming" \` -replace "!ctx\_startmenu!","AppData\\Roaming\\Microsoft\\Windows\\Start Menu" # Also need to check if the file has a wildcard in it if($file -match "\\\*" -and $file -match "\\."){ # Get the parent directory of the file $periodIndex = $file.LastIndexOf(".") $parentDir = $file.Substring( 0,$periodIndex ) -replace "\\\*" $fileExt = $file.Substring( $periodIndex, ($file.Length - $periodIndex) ) $exFile = $null foreach($exFile in (gci -Path "$($pathToUserStore)\\$($parentDir)\*" -Include "\*$($fileExt)" -Force).FullName){ if($exFile){ $excFilesList += $exFile } } }else{ $excFilesList += "$($pathToUserStore)\\$($file)" } }

\# Add in system folders/folders $savedFoldersList += "$($pathToUserStore)\\Citrix" $savedFoldersList += "$($pathToUserStore)\\WINDOWS" $savedFoldersList += "$($pathToUserStore)\\AppData\\Roaming" foreach($file in (gci "$($pathToUserStore)\\\*" -Include \*.dat,\*.log\*,\*.blf,\*.ini,\*.pol,\*.bin -File -Force)){ $savedFilesList += $file.FullName }

######################################################################################### # How many files...? #########################################################################################

$preFileCount = (Get-Item $pathToUserStore).GetFiles("\*",\[System.IO.SearchOption\]::AllDirectories).Count

######################################################################################### # Copy only the saved FOLDERS to a new location #########################################################################################

Write-Host "Copying saved folders to new location"

$folder = $null $pathToNewUserStore = $pathToUserStore -replace "UPM\_PROFILE","UPM\_PROFILE\_NEW" if(!(Test-Path $pathToNewUserStore)){ mkdir $pathToNewUserStore | Out-Null } foreach($folder in $savedFoldersList){ $destDir = ( $folder -replace \[regex\]::Escape($pathToUserStore),$pathToNewUserStore ) robocopy $folder $destDir /e /r:0 /w:0 /mt:64 /dcopy:t /copyall /log:robocopy.log | Out-Null }

######################################################################################### # Copy only the saved FILES to a new location #########################################################################################

Write-Host "Copying saved files to new location"

$file = $null foreach($file in $savedFilesList){ $destFile = ( $file -replace \[regex\]::Escape($pathToUserStore),$pathToNewUserStore ) if(Test-Path $file){ New-Item -ItemType File -Path $destFile -Force | Out-Null Copy-Item -Path $file -Destination $destFile -Force | Out-Null } }

######################################################################################### # Now delete the $excFoldersList from our copied profile #########################################################################################

Write-Host "Deleting excluded folders from new profile"

$folder = $null foreach($folder in $excFoldersList){ $folder = ($folder -replace \[regex\]::Escape($pathToUserStore),$pathToNewUserStore) if(Test-Path $folder){ Remove-Item $folder -Recurse } }

######################################################################################### # Now delete the $excFilesList from our copied profile #########################################################################################

Write-Host "Deleting excluded files from new profile"

$file = $null foreach($file in $excFilesList){ $destFile = ( $file -replace \[regex\]::Escape($pathToUserStore),$pathToNewUserStore ) Remove-Item $destFile -Force }

######################################################################################### # Remove/rename the old profile folder #########################################################################################

Write-Host "Renaming profile folders"

Rename-Item $pathToUserStore "$($pathToUserStore).upm\_backup\_$(Get-Date -Format dd\_MM\_yy)" sleep 1 Rename-Item $pathToNewUserStore $pathToUserStore

######################################################################################### # Reset permissions #########################################################################################

Write-Host "Resetting permissions"

icacls.exe $pathToUserStore /setowner $user /T /C /Q | Out-Null icacls.exe $pathToUserStore /reset /T /C /Q | Out-Null

$postFileCount = (Get-Item $pathToUserStore).GetFiles("\*",\[System.IO.SearchOption\]::AllDirectories).Count

Write-Host "Removed a total of $($preFileCount - $postFileCount) files." -fore yellow

\[/code\]

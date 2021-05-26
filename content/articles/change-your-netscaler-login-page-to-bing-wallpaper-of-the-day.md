---
title: "Change Your NetScaler Login Page to Bing Wallpaper of the Day"
date: "2016-10-05"
published: true
description: 'Bing daily wallpaper for your NetScaler Gateway!'
tags: ['Citrix','Bash']
---

If you have done a Bing search for "How to change my Netscaler Login page to the Bing daily Wallpaper", you have come to the right place.

I first thought of this after I was woken up by our on-call team at 3:00a.m. one morning. While I was busily a) cursing their mothers and b) trying to resolve some now forgotten issue, I thought Hey, you know what would be cool? If the background picture on our Netscaler login page changed to match the Bing Wallpaper of the Day every day!

Disclaimer: I'm not sure if this abides by Bing's Terms and Conditions - I advise you to seek your own legal advice before implementing anywhere except a lab.

This process involves three parts:

- A bash script to copy the Bing Wallpaper of the Day down to your Netscaler
- Some edits to our crontab & rc.netscaler files
- Some edits to a CSS file

### Part one - the cool part!

This part is a modified version of jadijadi's bash script that does the same thing for Ubuntu Desktop: https://gist.github.com/jadijadi/56d90cc8c2956dd59119. I had to modify some bits as the Netscaler didn't have wget or a version of grep with the -P option

P.S. don't judge me on my bash scripting, it's not my forte!

 

```bash
#!/bin/bash

# $bing is needed to form the fully qualified URL for # the Bing pic of the day 
bing="www.bing.com"

#$xmlURL is needed to get the xml data from which # the relative URL for the Bing pic of the day is extracted # # The mkt parameter determines which Bing market you would like to # obtain your images from. # Valid values are: en-US, zh-CN, ja-JP, en-AU, en-UK, de-DE, en-NZ, en-CA. # # The idx parameter determines where to start from. 0 is the current day, # 1 the previous day, etc. 
xmlURL="http://www.bing.com/HPImageArchive.aspx?format=xml&idx=1&n=1&mkt=en-US"

# $saveDir is used to set the location where Bing pics of the day # are stored. $HOME holds the path of the current user's home directory 
saveDir="/var/customisations/images/"

# Create saveDir if it does not already exist 
mkdir -p $saveDir

# The file extension for the Bing pic 
picExt=".jpg"

# Extract the relative URL of the Bing pic of the day from # the XML data retrieved from xmlURL, form the fully qualified # URL for the pic of the day, and store it in $picURL

# Form the URL for the default pic resolution # Netscaler grep doesn't have -P, so we use perl instead 
defaultPicURL=$bing$(echo $(curl -s $xmlURL) | perl -nle "print $& if m{<url>(.\*)</url>}" | cut -d ">" -f 2 | cut -d "<" -f 1)

# Set picName to the desired picName picName=bingWallpaper.jpg # Download the Bing pic of the day at desired resolution 
curl -s -o $saveDir$picName $defaultPicURL

echo Saved Bing Wallpaper to $saveDir$picName and Netscaler images directories 
cp $saveDir$picName /var/netscaler/gui/vpn/images/ cp $saveDir$picName /netscaler/ns_gui/vpn/images/
```

Copy this file somewhere persistent onto your Netscaler, e.g. /var/customisations/get-bingWallpaper.sh Log into the Netscaler, then open the shell Navigate to the location you saved the script cd /var/customisations Make the file executable with chmod u+x get-bingWallpaper.sh Run the script! sh get-bingWallpaper.sh

### Part Two - Make It Happen Daily

Now, we need to add the script into our crontab file. For those non-Linux types out there, the crontab file is like Windows Scheduled Tasks. We can add stuff into this file and make it run periodically.

However, the crontab file will get wiped on reboot of the Netscaler, so we need a way to make sure the crontab file always has our command to run get-bingWallpaper.sh - this is where the rc.netscaler file comes in.

Anything in the /nsconfig/rc.netscaler file will automatically get executed at first boot of the Netscaler.

Add the following to your rc.netscaler file

```bash

echo "30 5 \* \* \* nsroot sh /var/customisations/get-bingwallpaper.sh" >> /etc/crontab sh /var/customisations/get-bingwallpaper.sh

```

Crontab format is "minute hour mday month wday who command", so our entry reads "On the 30th minute of the 5th hour every day of the month every month every day of the week, get nsroot to execute sh /var/customisations/get-bingwallpaper.sh"

Now, at 5:30a.m. every day, we should get a new Bing Wallpaper file downloaded!

### Part Three - CSS

If you're using the default theme, then your CSS file will be in /var/netscaler/logon/themes/Default/css/base.css

You want to add/edit the "background" section as so:

```css

    background: black url(/vpn/images/Awesome-Starfish-Wallpaper-HD.jpg) no-repeat center center fixed; 
    background-size:   cover;

```

If you're using a custom theme, then you'll have a different CSS file (and hopefully you know where that is!)


I hope you enjoy the wonderful comments from all your users about the lovely pictures they get on their logon screen every day.

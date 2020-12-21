---
title: "Login to Storefront with cURL"
date: "2015-08-30"
published: true
description: 'Automate user logons using the Storefront API'
tags: ['Citrix','PowerShell']
---

This is the project that made me want to start documenting some of my scripts & discoveries.

We had an existing client that used their own .NET application to log into their MetaFrame environment (using Web Interface/Secure Gateway). With the impending doom placed upon all Windows Server 2003 servers (and hence our MetaFrame environment), we had a requirement to a) move them to XenApp 7.6 running Server 2012 R2, and b) adapt their current login process to work the same but with Netscaler Gateway/Storefront.

I'd had very little exposure to web technologies at this point, so it was a grind from the start, but some with some help from my friendly development community I was pushed in the right direction... enter amazing new discoveries like Fiddler, CSRF tokens, and cURL. Much much much later, I discovered the _official_ API documentation for the Storefront API...

Now, a little tangent on cURL. I'd heard about it before but being a Powershell lover I'd never really used it - Invoke-WebRequest always did what I needed. In this case however, I discovered that Invoke-WebRequest didn't seem to handle cookies quite the same as cURL. Plus - the client's example script they sent us was using cURL - so I had to sent it back using cURL again, but utilising Storefront rather than Secure Gateway.

DISCLAIMER: This script was polished up a little by another developer. You know who you are.

So. Let's start with the full script. As mentioned, this was scripted to login to our Netscaler Gateway, with passthrough authentication to the Storefront. Direct login to Storefront is also possible and easy, but not directly covered in this script.

https://desktop.saaas.com is the URL of our Netscaler Gateway vServer.

\[code language="powershell"\]

$curlPath = "C:\\cURL" $outputFile = "$curlPath\\Login.txt" $cookieJar = "$curlPath\\cookie.txt" $icaProg = "C:\\Program Files (x86)\\Citrix\\ICA Client\\wfica32.exe" $deliveryGroupName = "SysAdmin As A Service Desktop" $username = "user@saaas.com" $password = "MyPassword"

$step = 1

.\\curl.exe  --cookie-jar $cookieJar --output "$($curlPath)\\OUTPUT1.txt" \` --data "login=$($username)&passwd=$($password)" \` \` --header 'Accept: text/html, application/xhtml+xml, image/jxr, \*/\*' \` --header 'Referer: https://desktop.saaas.com/vpn/index.html' \` "https://desktop.saaas.com/cgi/login"</div>

\# 2. /home/configuration - Get CSRF Token & ASP Session ID $step = 2 .\\curl.exe --request POST --location --cookie-jar $cookieJar --cookie $cookieJar --output "$($curlPath)\\OUTPUT2.txt" \` --dump-header "$($curlPath)\\CSRF-Token.txt" \` --cacert "$($curlPath)\\curl-ca-bundle.crt" \` --header 'Accept: application/xml, text/xml, \*/\*; q=0.01'\` --header 'Content-Length: 0'\` --header 'X-Citrix-IsUsingHTTPS: Yes'\` --header 'Referer: https://desktop.saaas.com/Citrix/StoreWeb/'\` "https://desktop.saaas.com/Citrix/StoreWeb/Home/Configuration"

\# 3. Find CSRF Token $step = 3

$headers = Get-Content "$($curlPath)\\CSRF-Token.txt" | Select-String "Set-Cookie: CsrfToken=" $csrfToken = ($headers -split "=" -split ";")\[1\] #echo ($csrfToken)</div>

\# Storefront GetAuthMethods - must do this before login .\\curl.exe --request POST --cookie-jar $cookieJar --cookie $cookieJar --output "$($curlPath)\\OUTPUT3.txt" \` --header 'Accept: application/xml, text/xml, \*/\*; q=0.01'\` --header "Csrf-Token: $($csrfToken)"\` --header 'X-Citrix-IsUsingHTTPS: Yes'\` --header 'Referer: https://desktop.saaas.com/Citrix/StoreWeb/'\` --header 'Content-Length: 0'\` "https://desktop.saaas.com/Citrix/StoreWeb/Authentication/GetAuthMethods"

\# 4. storefront login $step = 4

.\\curl.exe --request POST --cookie-jar $cookieJar --cookie $cookieJar \` --header 'Accept: application/xml, text/xml, \*/\*; q=0.01'\` --header "Csrf-Token: $($csrfToken)"\` --header 'X-Citrix-IsUsingHTTPS: Yes'\` --header 'Referer: https://desktop.saaas.com/Citrix/StoreWeb/'\` --header 'Content-Length: 0'\` "https://desktop.saaas.com/Citrix/StoreWeb/GatewayAuth/Login"</div>

\# 5. List resources $step = 5

.\\curl.exe --request POST --cookie-jar $cookieJar --cookie $cookieJar  \` --output "$($curlPath)\\Resources.json" \` \` --header 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8'\` --header 'Accept: application/json, text/javascript, \*/\*; q=0.01'\` --header "Csrf-Token: $($csrfToken)"\` --header 'X-Citrix-IsUsingHTTPS: Yes'\` --header 'Referer: https://desktop.saaas.com/Citrix/StoreWeb/'\` --data "format=json&resourceDetails=Default" \` "https://desktop.saaas.com/Citrix/StoreWeb/Resources/List"

$j = (Get-Content "$curlPath\\Resources.json" -Raw) | ConvertFrom-Json $desktopDeliveryGroup = $j.resources | where {$\_.name -eq "Sysadmin As A Service Desktop"}

\# 6. Launch URL $step = 6

.\\curl.exe --request GET --cookie-jar $cookieJar --cookie $cookieJar \` --output "$($curlPath)\\launch.ica"\` "https://desktop.saaas.com/Citrix/StoreWeb/Resources/LaunchIca/$($desktopDeliveryGroup.id).ica?CsrfToken=$($csrfToken)&IsUsingHttps=Yes"

\# 7. Launch Desktop $step = 7

Start-Process "$($curlPath)\\launch.ica"

\[/code\]

Ok, now let's break it down into steps.

**Step 1: Login to Netscaler Gateway**

This is pretty straightforward - just pass the username & password in the data portion of cURL, and store the cookie in a file.

\[code language="powershell"\]

.\\curl.exe  --location --cookie-jar $cookieJar --output "$($curlPath)\\OUTPUT1.txt" \` --data "login=$($username)&passwd=$($password)" \` \` --header 'Accept: text/html, application/xhtml+xml, image/jxr, \*/\*' \` --header 'Referer: https://desktop.saaas.com/vpn/index.html' \` "https://desktop.saaas.com/cgi/login"

\[/code\]

**Step 2: Get CSRF Token & ASP.NET session ID**

This step is pretty important - it's the first call to our Storefront server, and when we get the CSRF token and ASP.NET session ID. Without these passed into every subsequent call to Storefront, you'll get a 403 Forbidden response.

\[code language="powershell"\]

<div>.\\curl.exe --request POST --location --cookie-jar $cookieJar --cookie $cookieJar --output "$($curlPath)\\OUTPUT2.txt" \` --dump-header "$($curlPath)\\CSRF-Token.txt" \` --cacert "$($curlPath)\\curl-ca-bundle.crt" \` --header 'Accept: application/xml, text/xml, \*/\*; q=0.01'\` --header 'Content-Length: 0'\` --header 'X-Citrix-IsUsingHTTPS: Yes'\` --header 'Referer: https://desktop.saaas.com/Citrix/StoreWeb/'\` "https://desktop.saaas.com/Citrix/StoreWeb/Home/Configuration"</div>

\[/code\]

**Step 3: Store the CSRF token in a new variable**

This takes the response from Step 2 and stores the CSRF token in a new variable.

\[code language="powershell"\]

$headers = Get-Content "$($curlPath)\\CSRF-Token.txt" | Select-String "Set-Cookie: CsrfToken=" $csrfToken = ($headers -split "=" -split ";")\[1\] #echo ($csrfToken)

\[/code\]

**Step 3b: Get Authentication Methods from Storefront**

Although we know what Authentication method we want to use to log into the Storefront (passthrough from Netscaler Gateway), we still need to initiate GetAuthMethods before Storefront will be ready for us to send a login request.

\[code language="powershell"\]

.\\curl.exe --request POST --cookie-jar $cookieJar --cookie $cookieJar --output "$($curlPath)\\OUTPUT3.txt" \` --header 'Accept: application/xml, text/xml, \*/\*; q=0.01'\` --header "Csrf-Token: $($csrfToken)"\` --header 'X-Citrix-IsUsingHTTPS: Yes'\` --header 'Referer: https://desktop.saaas.com/Citrix/StoreWeb/'\` --header 'Content-Length: 0'\` "https://desktop.saaas.com/Citrix/StoreWeb/Authentication/GetAuthMethods"

\[/code\]

**Step 4: Login to Storefront**

Finally, we can login to the Storefront by passing our cookie with our NSC\_AAAC token to the Storefront server.

\[code language="powershell"\]

.\\curl.exe --request POST --cookie-jar $cookieJar --cookie $cookieJar \` --header 'Accept: application/xml, text/xml, \*/\*; q=0.01'\` --header "Csrf-Token: $($csrfToken)"\` --header 'X-Citrix-IsUsingHTTPS: Yes'\` --header 'Referer: https://desktop.saaas.com/Citrix/StoreWeb/'\` --header 'Content-Length: 0'\` "https://desktop.saaas.com/Citrix/StoreWeb/GatewayAuth/Login"

\[/code\]

**Step 5: List Resources**

Now, we request a list of all available resources (Delivery Groups & Published Apps) from the Storefront server. We'll get back a JSON file with names, IDs and launch URLs. Then, we parse the output to select the resource name of our chosen Delivery Group.

\[code language="powershell"\]

.\\curl.exe --request POST --cookie-jar $cookieJar --cookie $cookieJar  \` --output "$($curlPath)\\Resources.json" \` \` --header 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8'\` --header 'Accept: application/json, text/javascript, \*/\*; q=0.01'\` --header "Csrf-Token: $($csrfToken)"\` --header 'X-Citrix-IsUsingHTTPS: Yes'\` --header 'Referer: https://desktop.saaas.com/Citrix/StoreWeb/'\` --data "format=json&resourceDetails=Default" \` "https://desktop.saaas.com/Citrix/StoreWeb/Resources/List"

$j = (Get-Content "$curlPath\\Resources.json" -Raw) | ConvertFrom-Json $desktopDeliveryGroup = $j.resources | where {$\_.name -eq $deliveryGroupName}

\[/code\]

**Step 6: Get Launch.ica file**

This is where we request the ICA file of our chosen Delivery Group and save the output as launch.ica

\[code language="powershell"\]

.\\curl.exe --request GET --cookie-jar $cookieJar --cookie $cookieJar \` --output "$($curlPath)\\launch.ica"\` "https://desktop.saaas.com/Citrix/StoreWeb/Resources/LaunchIca/$($desktopDeliveryGroup.id).ica?CsrfToken=$($csrfToken)&IsUsingHttps=Yes"

\[/code\]

**Step 7: Launch!**

Finally, we launch Citrix using wfica32.exe and our launch.ica file

\[code language="powershell"\]

Start-Process "$($curlPath)\\launch.ica"

\[/code\]

Congratulations! You have now logged into & launched a Citrix session using the Storefront API.

For full details on the API documentation - see [Citrix SDK Page](https://www.citrix.com/downloads/storefront-web-interface/sdks.html) - you will need a Citrix login to access this :)

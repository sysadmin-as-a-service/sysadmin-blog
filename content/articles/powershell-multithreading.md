---
title: "PowerShell Multithreading"
date: "2018-02-10"
published: false
---

PowerShell is great at automating lots of stuff. Reset passwords, create user accounts, restart computers, etc.

Sometimes, those things that you need to automate are the _same_ thing, just done multiple times. Suppose you want to check 000's of domains in your multi-tenanted Hosted Exchange environment and  verify whether or not they have the correct DNS records in place?

The usual way you do this is just build your array, then tell it to do something with each item.

\[code language=powershell\]

$myListOfStuff = "item1","item2",..."itemn"

foreach($item in $myListOfStuff){

\# Do something!

}

\[/code\]

 

But in the above example, PowerShell will work on each item one at a time. What if (as in my example of checking DNS records), there was an inherent delay in the #DoSomething block, say it took 10 seconds to complete a certain process. If you have 1,000 items to go through, that's almost 3 hours of waiting!

What if you could get it to do 100 items at once? You'll cut the processing time down to about 2 minutes! Or, if your particular process can handle it - do them _all_ at once!

There are a few different ways to do this in PowerShell. They range from the not-a-huge-performance-improvement-but-easy-to-perform to the difficult-to-do-but-much-faster. I'll try list a few below.

 

#### Option 1: PowerShell Jobs

 

#### Option 2: For-Each -Process

 

#### Option 3: Runspace Factory

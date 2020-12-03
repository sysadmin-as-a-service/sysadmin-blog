---
title: "Search for and Delete Emails in PowerShell"
date: "2018-02-04"
---

I am on the on-call roster for work. Most of the time, it's just annoying servers alerting that they've reached a critical drive space level, some service failing that someone thought was important to monitor, and someone who has gotten themselves locked out.

However, I occasionally get an interesting call. The other night it was a panicked C-level who wanted to delete an email that was sent to all of their users (from an external party). I put them through the normal obstacles, do you want this done right away (it was close to midnight already), do you want to pay the associated charges, are you authorised to do this, etc. etc., but when it came down to it they were adamant that this email needed to be deleted, and the person blocked from emailing their staff in the future.

Well, screw logging into a few hundred mailboxes manually, searching for an email, deleting it, deleting it from Deleted Items, then deleting it from Recoverable Deleted Items... Surely I can script this, right?

Thankfully there's a lot of scripts/posts out there that show you how to do bits and pieces of this. I just had to piece together the bits that I needed and rewrite for my particular use case.

**Step 1** - Install the EWS Managed API https://www.microsoft.com/en-us/download/details.aspx?id=42951

**Step 2** - Ensure your 'audit' account has Impersonation Rights to the mailboxes in question - set up a new Management Role (https://msdn.microsoft.com/en-us/library/office/dn722376(v=exchg.150).aspx)

**Step 3** - [View script on GitHub](https://github.com/jeremysprite/powershell-exchange/tree/master/search-emailmessage)

**Further Reading and credit:**

Virtually none of this code is original, all stolen from other better authors.

StackOverflow (I'm really sorry I can't find the original Q&A to give full credit!)

https://blogs.technet.microsoft.com/circularlogging/2015/02/10/using-ews-impersonation-and-powershell-to-log-into-an-exchange-online-mailbox/

Different Search Filters https://msdn.microsoft.com/en-us/library/office/dn579422(v=exchg.150).aspx

EWS Best Practice https://blogs.msdn.microsoft.com/webdav\_101/2015/05/11/best-practices-ews-authentication-and-access-issues/

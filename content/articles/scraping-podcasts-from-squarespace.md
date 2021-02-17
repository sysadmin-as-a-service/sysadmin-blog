---
title: "Scraping Podcasts From Squarespace"
date: "2021-02-17"
published: false
description: 'Create a custom podcast feed from a Squarespace site'
tags: ['Azure','PowerShell']
---

So, this project probably has a limited audience. Like, who wants to scrape episodes off a Squarespace hosted website, and convert them into a podcast-compatible XML feed for importing into a podcast app of their choice?

Well - me, for one! Probably the _only_ one.

This perhaps goes without saying, but Squarespace has a [built-in podcast feed feature](https://support.squarespace.com/hc/en-us/articles/205814338-Podcasting-with-Squarespace-overview) that makes it easy to add new podcast episodes etc.

My local church had recently visited the 21st Century and started posting messages online, which was great, but I wanted to get them in my podcast app as well!

Sure, I could have asked someone to learn to use the Squarespace podcasting feature, or even volunteered to do it myself, but it was ~~easier~~ ~~more fulfilling~~ ~~cheaper~~ more entertaining? to try script creating a podcast feed myself.

The idea of the script here is that it 

- scrapes the webpage for new audio block posts
- creates a new version of the podcast XML feed
- uploads it to Azure

We can then add the URL of the podcast XML feed to our podcast app, and it'll show those episodes in our podcast feed!

(I opted here to keep the podcast feed private, i.e. not submit it to Apple Podcasts etc. where everyone could see it, in case anyone was uncool with me making a publicly available resource _more_ publicly available.)


## Steps
Pretty easy!
- Create Azure Storage account and get access token
- Upload our PowerShell script etc. to Azure Storage
- Create an Azure Function to run our script daily

### Set up Azure Storage
OK, we're assuming a basic level of Azure-understanding here, like setting up a subscription, resource group, etc.!

Find Azure Storage and create a new storage account, pick a unique storage account name.

**Note**: This will be part of your podcast feed URL so try make it easy for yourself!
The other options won't matter much unless you expect high traffic volumes!

![](static/images/az-storage.png)







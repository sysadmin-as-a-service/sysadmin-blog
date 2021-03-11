---
title: "Moving from WordPress to a Static Site"
date: "2021-03-09"
published: false
description: 'WordPress -replace "(word)(press)","buzz$1"'
tags: ['JavaScript','Azure']
---

# Dear, WordPress
You've been my blog hosting platform for years now. From my first posts in 2015, we've spent many hours together (partly because your editor was terrible). You weren't especially... _attractive_, but you were dependable. Somewhat. 

But, it's time to move on. It's me, it's not you. To be honest... there's someone else. 

I'm moving on... to a static site generator.

Maybe we can still be friends?

# The New Hotness

Static sites are all the rage at the moment, and for good reason. This post isn't about the pros and cons of static sites vs. server side hosting, but more of a walkthrough of how I broke up with WordPress.com after more than 5 years of (sporadic) posting.

# First Steps

The first thing I needed to do was export my existing posts & media from WordPress. There's a few ways you can do this, but looking for something that would export direct to Markdown, I happened across [LoneKorean's Wordpress Export to Markdown script](https://github.com/lonekorean/wordpress-export-to-markdown).

First, export your WordPress content from within the WordPress admin page.

![](/images/moving-from-wordpress-1.png)

Then, run the WordPress Export script pointing to your XML file.

I opted to just export all my posts into one directory, not into months/years which _is_ possible. This would cause me some pain later, but I was blissfully unaware at this stage!

# Jekby, Hugyll, Gatso... What Static Site Generator to Choose?

The next thing I had to decide was the choice of CMS. At this point I was just thinking "Everything Static! Put it in git!", and just figured "Markdown". That has proven to be a _little_ more difficult than I realised - for example, setting classes on something to style it a certain way, or pasting screenshots directly into a post while editing. These are things I took for granted when using WordPress's editor, but I've found a few workarounds for these issues (which I'll share...)

Most (all?) the popular static generators support markdown, so that didn't limit (or help) me in my choice. I took a quick look at the three most popular static site generators at the time:

- Jekyll
- Hugo
- Gatsby

I skimmed a few blogs discussing the pro's and con's of all these, but it boiled down to choice of language. I'm still wet behind the ears when it comes to web tech, so I was looking to build upon a language I'd already used. 

Hugo is written in Go, so that was out. 

Jekyll is written in Ruby, and used Liqiud templates (ugh), so, also out. 

Gatsby was close, but it _sounded_ quite complex given it bundled GraphQL, and although I was familiar with Vue, I hadn't learned React.

Then, I found **Nuxt.js**. Not quite as popular as the above three, but written in Vue, and I could use it to deploy server-side-rendered pages if I preferred. 

It also had the benefit of [Nuxt Content](https://content.nuxtjs.org/) - a simple headless CMS that renders your Markdown articles and makes them available via an API.

In hindsight now... Nuxt.js isn't as super simple as I'd hoped, and VuePress or even Hugo (language barriers aside) probably would have been a simpler setup _just for this blog_. However, I don't regret diving a little into Nuxt, as I'm sure I'll use it again in future!

# CSS Framework

This was possibly harder than choosing a static site generator... there are hundreds+ of CSS and JS UI Frameworks out there. I tried out Vuetify briefly, and although it looked slick, I just couldn't get a nice looking blog page out of it quickly. 

It'd probably be great for a more complex site in future, but I just wanted a simple, clean blog and found [Bulma](https://bulma.io/) hit all the right notes.




# sss

workarounds with markdown
- markdown paste
- image tags?

bulma
- setting up scss to change variable colours

nuxt
    adding routes for wordpress links

clarity

forwarding from wordpress

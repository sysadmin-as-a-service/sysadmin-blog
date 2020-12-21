---
title: "Babbling About Azure B-Series Burstable VMs"
date: "2020-02-03"
published: true
description: 'Better performance for less money? Impossible!'
tags: ['Azure']
---

The Azure B-Series burstable VMs have been around for [quite some time now](https://azure.microsoft.com/en-us/blog/introducing-b-series-our-new-burstable-vm-size/), but up until now, I hadn't had a reason to use them.

For those of you who are unfamiliar with them, the B-Series VMs are a family of Azure virtual machines that provide _burstable_ compute power. They're based on the Intel Haswell or Broadwell E5-2673 CPUs, which have a base clock speed of 2.3-2.4GHz and can "turbo" up to 3.2GHz.

The idea is that servers that are idle lots of the time, and then occasionally really really busy, can use more compute power than expected when they need it (sounds like me at work).

However, funnily enough, the pricing is also _burstable_, in that it can spike beyond what you expect if you're not watching it carefully. Unsurprisingly, the pricing can be quite complex to understand.

Each size VM has a "baseline" CPU amount, from 10% to 135%. Your VM will earn CPU credits any time that it is _under_ the baseline CPU threshold, and spend CPU credits any time that it is _over_ (up to a maximum)

![](/images/2020/02/image-1.png?w=871)

Preview pricing - no longer accurate!

They all have the "s" moniker, so support SSDs, and there are options for "memory-optimized" VM sizes (those tagged with an "m").

So recently, we had a customer that needed to move a server over to Azure quick smart, and we only had estimates from them on what the compute profile would be like.  
We decided to start with a 2vCPU 8GB RAM D2v3 (a comparable customer running the same application was quietly working away with a single-core VM), but as Murphy would have it, we started seeing performance issues when full load hit the server.

Interestingly enough, we noticed that this was only intermittent, and so suggested that one the B-series VMs would work. The added advantage was that we could double the core count and RAM allocation of the server while keeping the cost of the server roughly the same.

![](/images/2020/02/image-2.png?w=569)

Monthly cost D2s vs. B4ms

And the result? Fantastic. Now, the server can idle along most of the time, and then boost up to 400% of the baseline performance - i.e. it can use up to 16 cores if needed, rather than just the allocated 4 cores.

![](/images/2020/02/image-3.png?w=1024)

Before, and after.

Now, having run for a few more weeks, we've got enough data to see that even the B4ms is too large for this server, and we could consider downsizing this to the B2ms - a saving of around 50%!

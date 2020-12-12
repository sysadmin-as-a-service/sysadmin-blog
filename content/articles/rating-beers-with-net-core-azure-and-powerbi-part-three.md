---
title: "Rating Beers with .NET Core, Azure, and PowerBI - Part Three"
date: "2020-02-10"
published: true
description: 'Part three: deploying our app to Azure App Service'
---

This is a four part blog series on how I [wrote a webapp using Razor Pages](https://sysadminasaservice.blog/rating-beers-with-net-core-azure-and-powerbi-part-one/), [added an Azure SQL database](https://sysadminasaservice.blog/rating-beers-with-net-core-azure-and-powerbi-part-two/), [deployed to Azure App Service](https://sysadminasaservice.blog/rating-beers-with-net-core-azure-and-powerbi-part-three/), and then [viewed the results using PowerBI](https://sysadminasaservice.blog/rating-beers-with-net-core-azure-and-powerbi-part-four/).

Now we've built our Razor Pages webapp, added an Azure SQL Database, and in this post we're going to deploy it to Azure App Service.

Firstly, we'll need to containerize our application, so we'll download Docker for Windows (yes, I develop on Windows - sue me) and create an image of our application.  
For this part of the process, I followed the Docker docs on [Dockerizing an ASP.NET Core app.](https://docs.docker.com/engine/examples/dotnetcore/)

First, we need to create our Dockerfile. For those more from the Windows world, a Dockerfile is sort of like an Unattend.xml sysprep file or a VM template file. It contains all the steps necessary to build your application, and how configure the container - e.g. what services to run, firewall ports to open, etc.

I updated Docker's example a little, as they were using an ASP.NET Core 2.2 image, whereas I wanted the latest & greatest 3.0 release (at the time)

![](/images/2020/01/image-14.png?w=779)

Next, we'll create a .dockerignore file - this tells Docker not to include certain stuff in our image (to keep the size down) - similar to a .gitignore file. The Docker docs recommend adding bin\\ and obj\\ to your .dockerignore at least, but there are lots of more verbose examples online.

![](/images/2020/01/image-16.png?w=188)

Now, double check that Docker Desktop is running (green light on bottom corner of Dashboard)

![](/images/2020/01/image-17.png?w=1024)

Next, navigate to your project folder and run the below command **in an elevated PowerShell window**

![](/images/2020/01/image-18.png?w=313)

build the docker image with the tag "beercomp"

![](/images/2020/01/image-19.png?w=876)

list your docker image and filter by reference

![](/images/2020/01/image-20.png?w=727)

run the docker image "beercomp" and call it beercompapp  
\-d run in the background  
\-p map ("publish") the following ports from docker image to host

Now, you should be able to browse to http://localhost:8080 and view our webapp!

![](/images/2020/01/image-21.png?w=1024)

But this is just running your docker image on your local computer. Now, you need to publish your docker image to a "registry" and host it somewhere. Instead of Docker Hub, we're going to use Azure Container Registry and deploy to Azure App Service.

Log into portal.azure.com and search for "container registry"

![](/images/2020/01/image-22.png?w=455)

Create your Container Registry. We'll just use the basic SKU as we don't require a high level of performance. The Premium SKUs also allow you to lock down the firewall to certain IPs, but we're happy with this being public.

![](/images/2020/01/image-23.png?w=454)

Note: you'll have to enable the Admin user later to upload your image to your Container Registry

Once you've enabled your Admin user and retrieved the username/password, open up docker cli again and log into the registry

![](/images/2020/02/image-8.png?w=789)

Tag your docker image with your registry name

![](/images/2020/02/image-9.png?w=708)

And now push to your registry

![](/images/2020/02/image-11.png?w=638)

Success! Time to set up our Azure App Service that we can deploy our container to.

In the portal, search for "App Service **plans**" and click Add. App Service plans are the compute & storage backing for whatever resource you add on top of it - this could be an Azure Web App, Azure Function, Logic Apps, etc. The cool thing is you can use one App Service plan (or set of compute & storage resources) for multiple PaaS resources - i.e. run multiple Logic Apps, Azure Functions, or Web Apps on it.

Choose your Resource Group, Operating System (I'm using Linux for my container), region, and then pick your App Service size.

I found the F1 instance (which has a limit of 60m/day compute) was a little slow to use and the first B1 size Linux instance you use is free for the first 30 days (normally ~NZD20/month). This was "good enough" for testing etc., but I scaled up to the B2 instance, just to give it a snappier end user experience on the actual brew competition day.

Hurrah, cloud computing!

![](/images/2020/02/image-4.png?w=824)

Free? Yes plz!

We've created our App Service Plan, but still need to create an App Service - head over to "App Services" and click Add.

Fill out the details of the name of your instance, and select "Docker Container".

![](/images/2020/02/image-5.png?w=771)

B1 was OK for testing, but my users demand the best experience - so I scaled this up later

![](/images/2020/02/image-12.png?w=727)

![](/images/2020/02/image-13.png?w=676)

![](/images/2020/02/image-14.png?w=695)

Create!

Aaaaand... we're done.

![](/images/2020/02/image-15.png?w=1024)

Bonus points if you noticed I updated the banner to read "HomeBrew Competition 20**20**"

PRO TIP!

If you're using VSCode, you can actually install the Docker extension and quickly add your container registry, push your image, then in the Azure App Service extension for VSCode, create & manage your App Service from there!

You can choose "Create New Web App..." and it'll create a new App Service on the free tier, in Central US, with Application Insights enabled, or choose the Advanced option for more configuration options.

![](/images/2020/02/image-6.png?w=390)

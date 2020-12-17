---
title: "Rating Beers with .NET Core, Azure, and PowerBI - Part One"
date: "2020-01-16"
published: true
description: 'Part one: building the Razor Pages web app'
---

I work with a number of budding brewing enthusiasts. Last year, we decided to hold a homebrew competition to share and rate each others drops.

The competition was a wild success with a number of entries (and even more "testers"), but the one dark spot in the whole competition was the grading process. Being a last minute, thrown-together thing, I'd just printed out some [BJCP](https://www.bjcp.org)\-like grading sheets, which we then tried to count, collate and come to some conclusion on the winner.

Needless to say, it was a shambles.

So when the Social Committee\* approached me this year to help organize the homebrew competition, I decided we needed to up our game and develop a webapp to help us enter brews, scores, and view results.

This is a four part blog series on how I [wrote a webapp using Razor Pages](/rating-beers-with-net-core-azure-and-powerbi-part-one/), [added an Azure SQL database](/rating-beers-with-net-core-azure-and-powerbi-part-two/), [deployed to Azure App Service](/rating-beers-with-net-core-azure-and-powerbi-part-three/), and then [viewed the results using PowerBI](/rating-beers-with-net-core-azure-and-powerbi-part-four/).

Part one - building the webapp itself. Wanting a very minimal but viable product, I opted for using Razor Pages and ASP.NET Core (using [this tutorial](https://docs.microsoft.com/en-us/aspnet/core/tutorials/razor-pages/razor-pages-start?view=aspnetcore-3.1&tabs=visual-studio)). I employed Entity Framework Core as my ORM, and (initially) SQLite for the database.

Disclaimer: I'm completely new to C# - this was all learning on the go. So please, don't follow this tutorial if you're deploying a hyperscale beer-brewing-app for your national competition or something (or do, and pay me a royalty)

Getting started with Razor Pages was a little learning curve (this was my first ever ASP.NET project), but I still had a template project up and running in no time. I won't repeat all the code steps here, as you can read through it in the tutorial, but the basic overview was:

1. Build new project from template
2. Create your models
3. Scaffold (this creates basic Add/Edit/Index HTML pages for each of your models)
4. Add your database connection string and EF migrations (these are the SQL scripts that Entity Framework creates, that create the basic shell of your database - based on your models)
5. Modify your pages

I had a simple four model architecture (plus an Enum class as I didn't know how to make a SelectList at first)

![](/images/2020/01/image-9.png?w=166)

One of the best things I found about using the Razor Pages template was that it uses jQuery and DataAnnotations to create some basic in-page data validation. For example, I could annotate a property in my class to say that it should be an EmailAddress, or a whole number, or an integer within a range...

![](/images/2020/01/image-10.png?w=351)

![](/images/2020/01/image-11.png?w=331)

And when invalid input was added - the user automatically gets a handy validation message.

![](/images/2020/01/image-12.png?w=438)

I made a few edits to the basic scaffolded pages (removing the Edit and Delete buttons from the scorecards, for one - I didn't want anyone deleting votes they didn't like!), I prettied the page up a little bit with some FontAwesome and menu items.

While developing we just used SQLite, but in the next post I'll go into more detail how I moved the app to an Azure SQL Database.

\*Social Committee: me.

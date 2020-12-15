<template>
  <div>
    <div class="container">
      <div>
        <Logo />
        <h1 class="title">
          sysadmin as a service
        </h1>
        <div class="links">
          <a
            href="/my-first-article"
            class="button--green"
          >
            blog
          </a>
          <a
            href="https://github.com/sysadmin-as-a-service"
            target="_blank"
            rel="noopener noreferrer"
            class="button--grey"
          >
            github
          </a>
        </div>
      </div>
    </div>  
  

    <!-- Need to move this into component   -->
    <div class="container">
      <section>
        <h1 class="title">
          recent posts
        </h1>
  
        <div class="box media is-link" v-for="article in $store.state.articles" :key="article.slug">        
          <div class="media-content">
            <div class="title is-3 is-link has-text-left">
                <nuxt-link :to="article.slug">{{ article.title }}</nuxt-link>
            </div>
            <div class="subtitle is-4 has-text-left">{{ article.description }}</div>        
          </div>
          <div class="media-right">{{ article.date }}</div>
        </div>
  
      </section>
    </div>
  </div>

</template>

<script>
export default {  
  async asyncData({ $content, store }) {
    const articles = await $content('articles',{deep: true})
    .where({published: {$eq: true}})
    .sortBy('date', 'desc')
    .fetch()
    
    store.commit('setArticles',articles)
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family:
    'Quicksand',
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>

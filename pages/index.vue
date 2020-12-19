<template>
  <div>
    <div class="container">
      <div>
        <Logo />
        <div class="typewriter">
          <h1 class="title">
            sysadmin as a service
          </h1>
        </div>
        <div class="links">
          <nuxt-link
            :to="$store.state.articles[0].slug"
            class="button--green"
          >
            blog
          </nuxt-link>
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
/* html,body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
  font-size: 14px;
  background: #F0F2F4;
} */

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

img {
  display: block;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1), 0 0px 0 1px rgba(10, 10, 10, 0.02);
}

.typewriter h1 {
  overflow: hidden; /* Ensures the content is not revealed until the animation */
  border-right: .15em solid #4896ca; /* The typwriter cursor */
  border-radius: 2px;
  border-width: .1em;
  white-space: nowrap; /* Keeps the content on a single line */
  margin: 0 auto; /* Gives that scrolling effect as the typing happens */
  letter-spacing: .15em; /* Adjust as needed */
  animation: 
    typing 3.5s steps(42, end),
    blink-caret .75s step-end infinite,
    delay 2s;
}

/* The typing effect */
@keyframes typing {
  from { width: 0 }
  to { width: 100% }
}

/* The typewriter cursor effect */
@keyframes blink-caret {
  from, to { border-color: transparent }
  50% { border-color: #4896ca; }
}

</style>

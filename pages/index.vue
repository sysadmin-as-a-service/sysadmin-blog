<template>
  <div>
    <div class="container">
      <div class="mx-5">
          <Logo />
      </div>     
        <div class="typewriter">
          <h1 class="title">
            sysadmin as a service
          </h1>
        <div class="links">
          <nuxt-link
            :to="$store.state.articles[0].slug"
            class="button is-link is-medium is-outlined is-light"
          >
          <span class="icon">
            <i class="fab fa-align-right"></i>
          </span>
          <span>
            blog
          </span>
          </nuxt-link>
          <a
            href="https://github.com/sysadmin-as-a-service"
            target="_blank"
            rel="noopener noreferrer"
            class="button is-link is-medium is-outlined"
          >    
            <span class="icon">
              <i class="fab fa-github"></i>
            </span>
            <span>
              github
            </span>
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
  
        <div class="box columns m-4" v-for="article in $store.state.articles" :key="article.slug">        
          <div class="column is-four-fifths">
            
            <div class="title is-3 is-link has-text-left">
                <nuxt-link :to="article.slug">{{ article.title }}</nuxt-link>
            </div>
            
            <div class="subtitle is-4 has-text-left">
              {{ article.description }}
            </div>
            
            <div class="has-text-left">
              <span class="tag is-rounded mx-1" v-for="tag in article.tags" :key="tag">{{ tag.toLowerCase() }}</span>
            </div>
            
          </div>

          <div class="column is-hidden-mobile">
            {{ formatDate(article.date) }}
          </div>

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
  },
  methods: {
    formatDate(rawDate) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' }
      return new Date(rawDate).toLocaleDateString('en', options)
    }
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
  /* color: #017282 ; */
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
  letter-spacing: .10em; /* Adjust as needed */
  animation: 
    startAnimation 1s,
    typing 3s steps(21, end) 0.8s,
    /* typing2 0.5s steps(5, end) 2.5s,
    typing3 2s steps(12, end) 3s, */
    blink-caret .75s step-end infinite;
}

/* The typing effect */
@keyframes startAnimation {
  from { opacity: 0%; width: 0}
  to { opacity: 100%; width: 0}
}

@keyframes typing {
  from { width: 0 }
  to { width: 100% }
}

@keyframes typing2 {
  from { width: 50% }
  to { width: 30% }
}

@keyframes typing3 {
  from { width: 30% }
  to { width: 100% }
}

/* The typewriter cursor effect */
@keyframes blink-caret {
  from, to { border-color: transparent }
  50% { border-color: #017282; }
}

</style>

<template>
  <div>
    <div class="columns has-text-centered is-vcentered is-centered">
      <!-- <div class="logo pl-1 column is-one-quarter">
          
      </div>   -->
      <!-- <div class="column is-half "> -->

        <!-- <div class="logo">
          <Logo />
        </div> -->

        <div class="hero">
          <div class="hero-body">
            <typewriter text="sysadmin as a service."></typewriter>

          <div class="links">
              <nuxt-link
                :to="$store.state.articles[0].slug"
                class="button is-link is-medium is-outlined"
              >
                <span class="icon">
                  <fa :icon="['fas','align-right']"></fa>
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
                  <fa :icon="['fab','github']"></fa>
                </span>
                <span>
                  github
                </span>
              </a>

              <a
                href="https://resume.sysadminasaservice.blog"
                target="_blank"
                rel="noopener noreferrer"
                class="button is-link is-medium is-outlined"
              >    
                <span class="icon">
                  <fa :icon="['fas','info']"></fa>
                </span>
                <span>
                  about me
                </span>
              </a>

            </div>
            </div>        
        </div>
          
        <!-- </div>    -->

    </div>  
  
    <!-- Need to move this into component   -->
    <div class="container">
      <section>
        <h1 class="title is-3">
          recent posts
        </h1>
  
        <div class="box columns m-4" v-for="article in $store.state.articles" :key="article.slug">        
          <div class="column is-four-fifths">
            
            <div class="title is-3 is-link has-text-left">
                <nuxt-link :to="article.slug">{{ article.title }}</nuxt-link>
            </div>
            
            <div class="subtitle is-4 has-text-left mb-0">
              {{ article.description }}
            </div>
            
            <div class="has-text-left mx-1">
              <!-- <span class="tag is-rounded mx-1 is-size-6" v-for="tag in article.tags" :key="tag">{{ tag.toLowerCase() }}</span> -->
              <span v-for="tag in article.tags" :key="tag">
                <tag-component :tag="tag"></tag-component>
              </span>
            
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
import tagComponent from "~/components/tagComponent";
import typewriter from "~/components/typewriter.vue";

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
  },
  components: {
    tagComponent,
    typewriter
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
.links {
  padding-top: 15px;
}

img {
  display: block;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1), 0 0px 0 1px rgba(10, 10, 10, 0.02);
}

.NuxtLogo {
  max-width: 100%;
}

.title {
  font-size: 2rem;
  font-weight: lighter;
}

.logo {
  width: 10em;
  height: auto;
}

</style>

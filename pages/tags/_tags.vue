<template>
<div>
    <!-- Tag: {{ this.$route.params.tags }}

    <div v-for="article in articlesWithTag" :key="article.title">
        {{ article.title }} - {{ article.tags }}
    </div> -->

    <div class="container">
      <section>
        <h1 class="title is-1 mt-5">
          tagged: {{ this.$route.params.tags }}
        </h1>
  
        <div class="box columns m-4" v-for="article in articlesWithTag" :key="article.slug">        
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
export default {
    layout: 'blog',
    async asyncData({ $content, store }) {
    const articles = await $content('articles',{deep: true})
    .where({published: {$eq: true}})
    .sortBy('date', 'desc')
    .fetch()
    
    store.commit('setArticles',articles)
  },
  computed: {
      articlesWithTag() {
          // feck, javascript man
          return this.$store.state.articles.filter(x => x.tags.findIndex(
              item => this.$route.params.tags.toLowerCase() === item.toLowerCase() 
            ) != -1)
      }
  },
  methods: {
    formatDate(rawDate) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' }
      return new Date(rawDate).toLocaleDateString('en', options)
    }
  }

}
</script>

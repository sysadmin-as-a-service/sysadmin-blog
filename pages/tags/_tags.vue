<template>
<div>
    Tag: {{ this.$route.params.tags }}

    <div v-for="article in articlesWithTag" :key="article.title">
        {{ article.title }} - {{ article.tags }}
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
  }

}
</script>

<style>

</style>
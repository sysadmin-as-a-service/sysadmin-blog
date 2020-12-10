<template>
    <div class="box">

        <div class="content" v-for="article in articles" :key="article.slug">
          <h2 class="title is-link">
            <nuxt-link :to="article.slug">{{ article.title }}</nuxt-link>
          </h2> 
          {{ article.description }} {{ article.date}}
        </div>

    </div>
</template>

<script>
export default {
    async asyncData({ $content }) {
      const articles = await $content('articles',{deep: true}).where({published: {$eq: true}}).sortBy('date', 'desc').fetch()

      return { articles }
    }
}
</script>

<style>

</style>
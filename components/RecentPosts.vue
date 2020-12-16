<template>
      <div class="box">

          <div class="content" v-for="article in articles" :key="article.slug">
            <div class="title is-3 is-link">
              <nuxt-link :to="article.slug">{{ article.title }}</nuxt-link>
              {{ article.title }}
            </div>

            {{ article.description }}
          </div>
  
      </div>
</template>

<script>
  export default {
    props: {
      articles: {
        type: Array,
        default: () => null
      }
    }
  }
</script>

<style scoped>


</style>
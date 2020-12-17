<template>
      <div class="box mt-6 has-text-left">

        <div class="title is-3">
          Recent Posts
        </div>
          <div class="content" v-for="article in articles" :key="article.slug">
            <div class="title is-6 is-link">
              <nuxt-link :to="article.slug">{{ article.title }}</nuxt-link>
            </div>
            <div class="subtitle is-6">
              {{ article.description }}
            </div>
            
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
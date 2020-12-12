<template>
<div class="container mt-6">
  
      <div class="box">
  
          <div class="content" v-for="article in articles" :key="article.slug">
            <h3 class="title is-link">
              <nuxt-link :to="article.slug">{{ article.title }}</nuxt-link>
            </h3> 
            {{ article.description }}
          </div>
  
      </div>
</div>
</template>

<script>
  export default {
    props: {
      articles: {
        type: Object,
        default: () => null
      }
    }
  }
</script>

<style scoped>


</style>
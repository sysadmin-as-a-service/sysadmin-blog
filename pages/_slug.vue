<template>
<div class="has-fixed-navbar">
  <navbar></navbar>
  
  <div class="container">
    
    <div class="content">
      <article>
  
        <h1 class="title">{{ article.title }}</h1>
  
        <nuxt-content :document="article"></nuxt-content>
      </article>
    </div>
  </div>
</div>
</template>



<script>
import navbar from '~/components/Navbar.vue';

  export default {
    async asyncData({ $content, params }) {
      const article = await $content('articles', params.slug).fetch()

      return { article }
    }
  }
</script>

<style scoped>
.content {
  /* margin-top: 1em; */

}
</style>

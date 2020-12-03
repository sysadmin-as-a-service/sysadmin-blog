<template>
<div class="container">
  <div class="content">
    <article>
      <nuxt-content :document="article"></nuxt-content>
    </article>
  </div>
</div>
</template>



<script>
  export default {
    async asyncData({ $content, params }) {
      const article = await $content('articles', params.slug).fetch()

      return { article }
    }
  }
</script>

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
              <br/>
            <!-- </div>
            <div class="has-text-left"> -->
              <span class="tag is-rounded mx-1 mt-4" v-for="tag in article.tags" :key="tag">
                {{ tag.toLowerCase() }}
              </span>
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
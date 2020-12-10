<template>
    <div>



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
<template>
  <span class="tag is-rounded mx-1 mt-4">
    <nuxt-link style="text-decoration: none; color: inherit;" :to="'/tags/' + tag.toLowerCase()">
      {{ tag.toLowerCase() }}
    </nuxt-link>
  </span>
</template>

<script>
export default {
    props: ['tag']
}
</script>

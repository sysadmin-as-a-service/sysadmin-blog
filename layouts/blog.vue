<template>
  <div>
    <navbar></navbar>
      <div class="columns mx-1 is-centered">
        <div class="column is-one-fifth is-hidden-touch">
          <recent-posts :articles="$store.state.articles.slice(0,5)"></recent-posts>
        </div>
        <div class="column">
          <Nuxt />
        </div>
        <div class="column is-one-fifth is-hidden-touch">
          
        </div>

      </div>
      <vue-footer></vue-footer>
    </div>

</template>

<script>
import navbar from '~/components/Navbar.vue';
import RecentPosts from '~/components/RecentPosts.vue';
import VueFooter from '~/components/VueFooter.vue';

export default {
  components:{
    navbar,
    RecentPosts,
    VueFooter
  }

}
</script>

<style>
html {
  font-family:
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>

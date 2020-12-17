<template>
<div>
  
<div class="container">
        <!-- START ARTICLE FEED -->
        <section class="articles mt-6">
          <!-- START ARTICLE -->
          <div class="card article">
              <div class="card-content">
                  <div class="media">
                      <div class="media-content has-text-centered mt-0">
                          <p class="title article-title">{{ article.title }}
                          <div class="tags has-addons level-item">
                              <span class="tag is-rounded is-info">sysadmin</span>
                              <span class="tag is-rounded">{{ articleDate }}</span>
                          </div>
                      </div>
                  </div>
                  <div class="content article-body has-text-left">
                      <nuxt-content :document="article"></nuxt-content>
                  </div>
              </div>
          </div>
        </section>
</div>

</div>
</template>



<script>
  export default {
    layout: 'blog',
    async asyncData({ $content, params }) {
      const article = await $content('articles', params.slug).fetch()
      
      return { article }
    },
    computed: {
      articleDate() {
        const options = { year: 'numeric', month: 'long', day: 'numeric' }
        return new Date(this.article.date).toLocaleDateString('en', options)
      }
    }
  }
</script>

<style scoped>

img {
  box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1), 0 0px 0 1px rgba(10, 10, 10, 0.02);
}

.navbar.is-white {
  background: #F0F2F4;
}

.navbar-brand .brand-text {
  font-size: 1.11rem;
  font-weight: bold;
}

.articles {
  margin: 5rem 0;
}

.articles .content p {
    line-height: 1.9;
    margin: 15px 0;
}

.author-image {
    position: absolute;
    top: -30px;
    left: 50%;
    width: 60px;
    height: 60px;
    margin-left: -30px;
    border: 3px solid #ccc;
    border-radius: 50%;
}
.media-center {
  display: block;
  margin-bottom: 1rem;
}
.media-content {
  margin-top: 3rem;
}

.promo-block {
  margin-top: 3rem;
}
div.column.is-8:first-child {
  padding-top: 0;
  margin-top: 0;
}
.article-title {
  font-size: 2rem;
  font-weight: lighter;
  line-height: 2;
}
.article-subtitle {
  color: #909AA0;
  margin-bottom: 3rem;
}
.article-body {
  line-height: 1.4;
  margin: 0 4rem;
}
.promo-block .container {
  margin: 1rem 5rem;
}

</style>

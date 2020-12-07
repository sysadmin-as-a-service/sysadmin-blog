<template>
  <div class="navbar is-fixed-top is-primary">
      <div class="navbar-brand">
          <a href="/" class="navbar-item">sysadmin as a service</a>

            <a role="button" class="navbar-burger">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>

      </div>
      <div class="navbar-menu">
        <div class="navbar-start">
            <a href="/blog" class="navbar-item">blog</a>
            <a href="https://github.com/sysadmin-as-a-service" class="navbar-item">github</a>
        </div>
        <div class="navbar-end">

        </div>

      </div>


  </div>
</template>

<script>


export default {
    name: 'navbar'
}
</script>

<style>
.navbar {
    /* background: rgb(0, 45, 66); */
    /* width:100%; */
    /* height: 5em; */
    /* z-index: 1; */
}



</style>
<template>
  <div class="navbar">
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
    box-shadow: 0 -0.1em 1em -0.125em rgba(10, 10, 10, 0.2) inset;
}



</style>
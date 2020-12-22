<template>
  <div class="navbar is-fixed-top">

      <div class="navbar-brand">
        <a href="/" class="navbar-item navbar-logo">
            <Logo/>
        </a>

            <a role="button" class="navbar-burger">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>

      </div>
      <div class="navbar-menu">
        <div class="navbar-start">
            <a href="/blog" class="navbar-item is-tab">blog</a>
            <a href="https://github.com/sysadmin-as-a-service" class="navbar-item is-tab">github</a>
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

.navbar-logo {
    width:3.5em;
    height:auto;
}


</style>
<script>
  export default {
    middleware: [
      function({ redirect, params, route}) {
        var redirectPath = route.path.replace(/(.*\/)(.+$)/g,/$2/)
        console.log("_.vue: routing from " + route.path + " to " + redirectPath)
        redirect(redirectPath)
      }
    ]
  }
</script>

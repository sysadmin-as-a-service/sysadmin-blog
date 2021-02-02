<script>
  export default {
    middleware: [
      function({ redirect, params}) {
        redirect('/' + params.slug)
      }
    ]
  }
</script>

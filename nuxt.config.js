export default {
  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'sysadmin as a service',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'alternate icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    bodyAttrs: {
      class: 'has-navbar-fixed-top'
    },
    script: [
      {
        src: 'clarity.js'
      }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    { src: '~/assets/main.scss', lang: 'scss' },
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    ['nuxt-fontawesome', {
      component: 'fa', //customize component name
      imports: [{
          set: '@fortawesome/free-solid-svg-icons',
          icons: ['faAlignRight','faInfo']
          },
          {set: '@fortawesome/free-brands-svg-icons',
          icons: ['faGithub']
          }
      ]
   }]
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    // '@nuxtjs/bulma',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
  ],
  generate: {
    // routes: ['/2020/01/01/access-emails-in-powershell']
    async routes () {
      const { $content } = require('@nuxt/content')
      const files = await $content({ deep: true }).fetch()
      var routes = [] 
      for(var i = 0; i < files.length; i++){
        var file = files[i]
        if(file.path === '/index'){
          routes.push("/")
        }else if(file.date != null){
          // add an additional route for old wordpress links
          var d = new Date(file.date)
          var year = d.getFullYear()
          // to make it 2 digit and JS months are 0-indexed
          var month = (d.getMonth()+ 1).toLocaleString(undefined,{minimumIntegerDigits: 2})
          var day = d.getDate().toLocaleString(undefined,{minimumIntegerDigits: 2})
          routes.push("/" + year + "/" + month + "/" + day + "/" + file.slug)
        }
        
      }
      return routes
      // return files.map(file => file.path === '/index' ? '/' : file.path)
    }
  },

  // Content module configuration (https://go.nuxtjs.dev/config-content)
  content: {},

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    postcss: {
      preset: {
        features: {
          customProperties: false
        }
      }
    },
  }
}

export const state = () => ({
    articles: [],
    article: null
})

export const mutations = () => ({
    SET_ARTICLES (state, articles) {
        console.log('vuex: setting articles to' + JSON.stringify(articles))
        state.articles = articles
    },
    SET_ARTICLE (state,article) {
        console.log('vuex: setting article to ' + article.title)
        state.article = article
    }
})
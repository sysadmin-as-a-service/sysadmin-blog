export const state = () => ({
    articles: [],
    article: null
})

export const mutations = {
    setArticles (state, articles) {
        console.log('vuex: setting articles!')
        state.articles = articles
    },
    setArticle (state,article) {
        state.article = article
    }
}
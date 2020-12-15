export const state = () => ({
    articles: [],
    article: null
})

export const mutations = {
    setArticles (state, articles) {
        state.articles = articles
    },
    setArticle (state,article) {
        state.article = article
    }
}
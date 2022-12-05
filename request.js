export const getCategories = async () => {
    const response = await fetch(`https://techcrunch.com/wp-json/wp/v2/categories`)
    return await response.json()
}

export const getPostsByPage = async (pageNum) => {
    const response = await fetch(`https://techcrunch.com/wp-json/wp/v2/posts?page=${pageNum}`)
    return await response.json()
}

export const getPostsByPageAndCategory = async (pageNum, categoryId) => {
    const response = await fetch(`https://techcrunch.com/wp-json/wp/v2/posts?categories=${categoryId}&page=${pageNum}`)
    return await response.json()
}



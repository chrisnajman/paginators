import { maxVisiblePaginationButtons } from "../globals.js"
import initPaginator from "../pagination/paginator.js"

export default async function loadPosts() {
  try {
    const res = await fetch("./json/posts.json")
    if (!res.ok) throw new Error(`Failed to load posts.json: ${res.status}`)
    const data = await res.json()

    const templateId = "article-template-post"
    const containerId = "posts-page-container"

    initPaginator({
      data,
      templateId,
      containerId,
      itemsPerPage: 5, // Modify as required
      // maxButtons: Modify as required, e.g. 'maxButtons: 7'.
      // !If you set the value equal to or greater than the corresponding number of entries in posts.json,
      //  there won't be any ellipsis.
      maxButtons: maxVisiblePaginationButtons, // Default = 5
      itemsKey: "posts",
    })
  } catch (err) {
    console.error(err)
  }
}

document.addEventListener("DOMContentLoaded", loadPosts)

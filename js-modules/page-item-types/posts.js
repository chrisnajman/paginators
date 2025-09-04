import { maxVisiblePaginationButtons } from "../globals.js"
import initPaginator from "../pagination/paginator.js"
import redirect_404 from "../pagination/helpers/redirect-404.js"

export default async function loadPosts() {
  try {
    const res = await fetch("./json/posts.json")
    if (!res.ok) throw new Error(`Failed to load posts.json: ${res.status}`)
    const data = await res.json()

    const templateId = "article-template-post"
    const containerId = "posts-page-container"
    const pageAnchorId = "heading-posts"
    const itemsPerPage = 5 // Modify as required

    // Prevent users from manually requesting an invalid page number (e.g. ?page=999).
    // If the requested page is outside the valid range, send them to 404.html.
    redirect_404(data, itemsPerPage, "posts")

    initPaginator({
      data,
      templateId,
      containerId,
      pageAnchorId,
      itemsPerPage,
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

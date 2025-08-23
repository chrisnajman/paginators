import { maxVisiblePaginationButtons } from "../globals.js"
import initPaginator from "../pagination/paginator.js"

export default async function loadPages() {
  try {
    const res = await fetch("./json/pages.json")
    if (!res.ok) throw new Error(`Failed to load pages.json: ${res.status}`)
    const data = await res.json()

    const templateId = "article-template-page"
    const containerId = "pages-page-container"

    initPaginator({
      data,
      templateId,
      containerId,
      itemsPerPage: 1, // Modify as required.
      // maxButtons: Modify as required, e.g. 'maxButtons: 7'.
      // !If you set the value equal to or greater than the corresponding number of entries in pages.json,
      //  there won't be any ellipsis.
      maxButtons: maxVisiblePaginationButtons, // Default = 5
      itemsKey: null,
    })
  } catch (err) {
    console.error(err)
  }
}

document.addEventListener("DOMContentLoaded", loadPages)

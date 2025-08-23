import { maxVisiblePaginationButtons } from "../globals.js"
import initPaginator from "../pagination/paginator.js"

export default async function loadUsers() {
  try {
    const res = await fetch("./json/users.json")
    if (!res.ok) throw new Error(`Failed to load users.json: ${res.status}`)
    const data = await res.json()

    const templateId = "article-template-user"
    const containerId = "users-page-container"

    initPaginator({
      data,
      templateId,
      containerId,
      itemsPerPage: 3, // Modify as required
      // maxButtons: Modify as required, e.g. 'maxButtons: 7'.
      // !If you set the value equal to or greater than the corresponding number of entries in users.json,
      //  there won't be any ellipsis.
      maxButtons: maxVisiblePaginationButtons, // Default = 5
      itemsKey: null,
    })
  } catch (err) {
    console.error(err)
  }
}

document.addEventListener("DOMContentLoaded", loadUsers)

import { PAGE_TYPES } from "../globals.js"

import renderPageButtons from "./components/render-page-buttons.js"
import renderPagesContent from "./components/render-pages-content.js"
import renderPostsContent from "./components/render-posts-content.js"
import renderUsersContent from "./components/render-users-content.js"
import { getPageFromURL, setPageInURL } from "./helpers/url-sync.js"
import setLoaderTimeout from "./helpers/set-loader-timeout.js"
import { showLoader, hideLoader, announcePageLoaded } from "../loader.js"
import updateLiveRegion from "./components/live-region.js"

export default function initPaginator({
  data,
  templateId,
  containerId,
  pageAnchorId,
  itemsPerPage,
  maxButtons,
  itemsKey = null,
}) {
  const template = document.getElementById(templateId)
  const paginatorEl = document.getElementById("paginator")
  if (!template || !paginatorEl) return

  const arrayData = itemsKey ? data[itemsKey] : data
  if (!Array.isArray(arrayData)) return

  const totalPages = Math.ceil(arrayData.length / itemsPerPage)

  paginatorEl.style.display = totalPages > 1 ? "flex" : "none"

  let currentPage = getPageFromURL()

  const update = (page) => {
    currentPage = page
    setPageInURL(page)

    showLoader(document.body.id)

    requestAnimationFrame(() => {
      const bodyId = document.body.id
      if (bodyId === PAGE_TYPES.PAGES)
        renderPagesContent(
          data,
          template,
          containerId,
          pageAnchorId,
          page,
          itemsPerPage
        )
      if (bodyId === PAGE_TYPES.POSTS)
        renderPostsContent(
          data,
          template,
          containerId,
          pageAnchorId,
          page,
          itemsPerPage
        )
      if (bodyId === PAGE_TYPES.USERS)
        renderUsersContent(
          data,
          template,
          containerId,
          pageAnchorId,
          page,
          itemsPerPage
        )

      const msg = `Page ${page} loaded`
      announcePageLoaded(msg)
      updateLiveRegion(msg)

      renderPageButtons(
        paginatorEl,
        currentPage,
        totalPages,
        update,
        maxButtons
      )

      setLoaderTimeout(bodyId, hideLoader)
    })
  }

  update(currentPage)

  window.addEventListener("popstate", () => {
    const page = getPageFromURL()
    update(page)
  })
}

import themeSwitcher from "./js-modules/theme.js"
import { PAGE_TYPES } from "./js-modules/globals.js"
import { showLoader } from "./js-modules/loader.js"
import pages from "./js-modules/page-item-types/pages.js"
import posts from "./js-modules/page-item-types/posts.js"
import users from "./js-modules/page-item-types/users.js"
import pageNumber from "./js-modules/page-number.js"
import detailsPageNav from "./js-modules/details-page-nav.js"

// Initialize theme immediately
themeSwitcher()

// Wait until DOM is fully parsed before deciding which module to load
document.addEventListener("DOMContentLoaded", () => {
  // Output page number (if required) on first page load of page type
  pageNumber()

  const bodyId = document.body.id

  switch (bodyId) {
    case PAGE_TYPES.PAGES:
      pages()
      detailsPageNav()
      break
    case PAGE_TYPES.POSTS:
      posts()
      break
    case PAGE_TYPES.USERS:
      users()
      break
    default:
      // Non-paginator page, show loader with default timeout
      showLoader()
      break
  }
})

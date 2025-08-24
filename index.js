import themeSwitcher from "./js-modules/theme.js"
import { PAGE_TYPES } from "./js-modules/globals.js"
import { showLoader } from "./js-modules/loader.js"
import pages from "./js-modules/page-item-types/pages.js"
import posts from "./js-modules/page-item-types/posts.js"
import users from "./js-modules/page-item-types/users.js"

themeSwitcher()
const bodyId = document.body.id

if (bodyId === PAGE_TYPES.PAGES) {
  pages()
} else if (bodyId === PAGE_TYPES.POSTS) {
  posts()
} else if (bodyId === PAGE_TYPES.USERS) {
  users()
} else {
  // Non-paginator page, show loader with default timeout
  showLoader()
}

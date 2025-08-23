// Body IDs
export const PAGE_TYPES = {
  PAGES: "pages-pagination",
  POSTS: "posts-pagination",
  USERS: "users-pagination",
}

// Set default max number of visible pagination buttons for all paginators.
// You can customise this per page in pages.js, posts.js and users.js by changing the value of 'maxButtons'
// from 'maxVisiblePaginationButtons' to the required number.
export const maxVisiblePaginationButtons = 5

// Loader
export const loader = document.getElementById("loader")
export const pageLoaded = document.getElementById("page-loaded")

// Adjust loader setTimeout duration based on page type data load
export const defaultLoaderTimeout = 250
export const loaderTimeouts = {
  [PAGE_TYPES.PAGES]: 500, // Loads images so more time required
  // These can use defaultLoaderTimeout = 250 for now, but uncomment and change, if required
  // [PAGE_TYPES.POSTS]: 250,
  // [PAGE_TYPES.USERS]: 250,
}

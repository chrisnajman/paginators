// Ensures the requested page number is within range.
// If the user manually edits the URL to an invalid page (e.g. ?page=999),
// they are redirected to 404.html.

const DEBUG_REDIRECT = false // set to true to enable debug logs

export default function redirect_404(data, itemsPerPage, itemsKey = null) {
  // Exit early if there is no data (prevents unnecessary warnings)
  if (!data) return

  const urlParams = new URLSearchParams(window.location.search)
  const page = parseInt(urlParams.get("page")) || 1

  const arrayData = itemsKey ? data[itemsKey] : data

  // Exit if arrayData is missing or empty
  if (!Array.isArray(arrayData) || arrayData.length === 0) return

  const totalItems = arrayData.length
  const maxPage = Math.ceil(totalItems / itemsPerPage)

  // Optional: debug info (uncomment if needed)
  // console.log({ page, totalItems, maxPage })

  if (DEBUG_REDIRECT) {
    console.log("redirect_404 debug:", { page, totalItems, maxPage, arrayData })
  }

  if (page < 1 || page > maxPage) {
    window.location.href = "./404.html"
  }
}

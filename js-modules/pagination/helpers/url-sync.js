export function getPageFromURL() {
  const params = new URLSearchParams(window.location.search)
  const page = parseInt(params.get("page"))
  return isNaN(page) || page < 1 ? 1 : page
}

export function setPageInURL(page) {
  const params = new URLSearchParams(window.location.search)
  params.set("page", page)
  history.pushState({}, "", `${location.pathname}?${params.toString()}`)
}

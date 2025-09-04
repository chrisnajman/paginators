export default function pageNumber() {
  const pageNo = document.getElementById("page-no")

  if (!pageNo) return

  const pageHref = window.location.href
  const url = new URL(pageHref)
  const page = url.searchParams.get("page")

  console.log(page)

  // Output page number in h1 (where specified)
  pageNo.textContent = page
}

// Adds global click handling so that the <details id="page-nav"> dropdown
// on index.html automatically closes when the user clicks anywhere outside of it.

export default function detailsPageNav() {
  document.addEventListener("click", (e) => {
    const pageNav = document.getElementById("page-nav")
    if (!pageNav) return

    if (!pageNav.contains(e.target)) {
      pageNav.removeAttribute("open")
    }
  })
}

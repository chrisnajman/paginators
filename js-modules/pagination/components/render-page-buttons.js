export default function renderPageButtons(
  paginatorEl, // <div id="paginator">
  currentPage,
  totalPages,
  onPageChange, // (page) => { ... }
  maxVisible = 5
) {
  if (!paginatorEl) return

  // Find controls robustly (works even if classes are missing)
  const allButtons = Array.from(paginatorEl.querySelectorAll("button"))
  const nextBtn =
    paginatorEl.querySelector(".next-btn") ||
    allButtons[allButtons.length - 1] ||
    null

  const prevBtn =
    paginatorEl.querySelector(".prev-btn") ||
    allButtons.find((b) => b !== nextBtn) ||
    null

  const ul = paginatorEl.querySelector(".page-numbers-container")
  if (!ul || !prevBtn || !nextBtn) return

  // Clear only the numbered items
  ul.innerHTML = ""

  // Prev/Next disabled states
  prevBtn.disabled = currentPage === 1
  nextBtn.disabled = currentPage === totalPages

  // Generate visible page list with ellipses
  const pages = computePages(currentPage, totalPages, maxVisible)

  // Render items
  pages.forEach((p) => {
    const li = document.createElement("li")
    if (p === "…") {
      const span = document.createElement("span")
      span.className = "ellipsis"
      span.setAttribute("aria-hidden", "true")
      span.textContent = "…"
      li.appendChild(span)
    } else {
      const btn = document.createElement("button")
      btn.type = "button"
      btn.className = "page-number"
      btn.textContent = p
      btn.dataset.pageNumber = p
      btn.tabIndex = 0
      btn.setAttribute("aria-current", p === currentPage ? "page" : "false")
      btn.disabled = p === currentPage
      if (p !== currentPage) {
        btn.addEventListener("click", () => {
          onPageChange(p)
        })
      }
      li.appendChild(btn)
    }
    ul.appendChild(li)
  })

  // Hook up prev/next (overwrite on each render)
  prevBtn.onclick = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }
  nextBtn.onclick = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }
}

// ---- helpers ----

function computePages(current, total, maxVisible) {
  if (total <= maxVisible) return range(1, total)

  // Reserve first & last; fill a middle window
  const middleSlots = Math.max(0, maxVisible - 2)
  let start = current - Math.floor(middleSlots / 2)
  let end = current + Math.ceil(middleSlots / 2) - 1

  // Clamp window to [2, total-1]
  if (start < 2) {
    end += 2 - start
    start = 2
  }
  if (end > total - 1) {
    start -= end - (total - 1)
    end = total - 1
  }
  start = Math.max(2, start)
  end = Math.min(total - 1, end)

  const out = [1]
  if (start > 2) out.push("…")
  for (let i = start; i <= end; i++) out.push(i)
  if (end < total - 1) out.push("…")
  out.push(total)
  return out
}

function range(a, b) {
  const arr = []
  for (let i = a; i <= b; i++) arr.push(i)
  return arr
}

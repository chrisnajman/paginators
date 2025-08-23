export default function renderContent(
  data,
  template,
  containerId,
  options = {}
) {
  const {
    page = 1,
    itemsPerPage = 1, // Customise value in pages.js, posts.js and users.js
    contentKeys = [],
    itemsKey = null,
  } = options

  // Determine the array to render
  const arrayData = itemsKey ? data[itemsKey] : data
  if (!Array.isArray(arrayData)) return

  const start = (page - 1) * itemsPerPage
  const end = start + itemsPerPage
  const items = arrayData.slice(start, end)

  const container = document.getElementById(containerId)
  if (!container) return

  container.innerHTML = ""

  items.forEach((item) => {
    const tpl = document.getElementById(template.id)
    if (!tpl) return
    const clone = tpl.content.cloneNode(true)

    function renderItem(obj, parentEl) {
      Object.keys(obj).forEach((key) => {
        const value = obj[key]

        // Handle nested objects recursively
        if (value && typeof value === "object" && !Array.isArray(value)) {
          const nestedParent = parentEl
            ? parentEl.querySelector(`[data-${key}]`)
            : clone.querySelector(`[data-${key}]`)
          if (nestedParent) {
            renderItem(value, nestedParent)
          }
          return
        }

        // Find the element corresponding to this key
        const el = parentEl
          ? parentEl.querySelector(`[data-${key}]`)
          : clone.querySelector(`[data-${key}]`)

        // Only set textContent if this element does NOT have link-handling attrs.
        // We skip when data-href or data-mailto is present so those branches
        // can manage text themselves (avoids duplicate/incorrect text).
        if (
          el &&
          !el.hasAttribute("data-href") &&
          !el.hasAttribute("data-mailto")
        ) {
          if (contentKeys.includes(key)) el.innerHTML = value
          else if (Array.isArray(value)) el.textContent = value.join(", ")
          else el.textContent = value
        }

        // Handle elements with data-tel="key"
        const telEl = parentEl
          ? parentEl.querySelector(`[data-tel="${key}"]`)
          : clone.querySelector(`[data-tel="${key}"]`)
        if (telEl && value) {
          // Strip out anything that's not digits, +, or whitespace for href
          const cleanNumber = value.replace(/[^\d+]/g, "")
          telEl.setAttribute("href", `tel:${cleanNumber}`)
          telEl.textContent = value // Display original (formatted) number
        }

        // --- Email links: <a data-mailto="key">...</a> ---
        const mailtoEl = parentEl
          ? parentEl.querySelector(`[data-mailto="${key}"]`)
          : clone.querySelector(`[data-mailto="${key}"]`)

        if (mailtoEl && value) {
          // Basic email format check; if it doesn't match, we still set mailto
          // but this avoids obvious mistakes if you want to tighten later.
          // const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))
          // if (isEmail) { ... }
          mailtoEl.setAttribute("href", `mailto:${value}`)
          if (!mailtoEl.textContent.trim()) {
            // If no custom inner text provided, show the email itself
            mailtoEl.textContent = value
          }
        }

        // --- Website/URL links: <a data-href="key">...</a> ---
        const hrefEl = parentEl
          ? parentEl.querySelector(`[data-href="${key}"]`)
          : clone.querySelector(`[data-href="${key}"]`)

        if (hrefEl && value) {
          let url = String(value)
          // Add https:// if missing
          if (!/^https?:\/\//i.test(url)) url = `https://${url}`
          hrefEl.setAttribute("href", url)
          // Note: we intentionally do NOT set textContent here.
          // Provide your own inner text via:
          // <a data-href="key"><span data-[someTextKey]></span></a>
        }
      })
    }

    renderItem(item, null)
    container.appendChild(clone)
  })

  container.setAttribute("tabindex", "-1")
  container.focus({ preventScroll: true })
  container.removeAttribute("tabindex")
}

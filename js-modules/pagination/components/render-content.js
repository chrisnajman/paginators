export default function renderContent(
  data,
  template,
  containerId,
  pageAnchorId,
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
  const mainHeading = document.getElementById(pageAnchorId)
  moveFocusToMainHeading(mainHeading, { scroll: true })
}

// Track whether the user’s last interaction was via keyboard or mouse.
// This global flag is used to decide how to handle page transitions:
//
// - If the last interaction was via keyboard, the title element is scrolled
//   into view and receives focus (with a visible outline).
// - If the last interaction was via mouse, the page scrolls to the very top
//   and focus is not moved (so no outline is shown).
//
// This ensures consistent behavior for both input types:
// keyboard users get clear focus feedback, while mouse users avoid unwanted outlines.

let lastInteractionWasKeyboard = false
window.addEventListener("keydown", () => {
  lastInteractionWasKeyboard = true
})
window.addEventListener("mousedown", () => {
  lastInteractionWasKeyboard = false
})

/**
 * Move focus to the page title safely after content changes, with input-type-specific behavior.
 *
 * Behavior:
 * - Keyboard activation:
 *   • Scrolls the title into view smoothly, using an optional vertical offset.
 *   • Moves focus to the title so the user sees the focus-visible outline.
 * - Mouse activation:
 *   • Scrolls to the top of the page (banner visible).
 *   • Does not move focus, so no focus outline appears.
 *
 * Accessibility notes:
 * - The title element has a permanent tabindex="0" in the HTML, so it is always focusable.
 *   (No dynamic tabindex manipulation is needed.)
 * - For programmatic focus, the 'focus-silent' class suppresses outlines for mouse users.
 *
 */

function moveFocusToMainHeading(target, { offset = 20 } = {}) {
  const el =
    typeof target === "string" ? document.getElementById(target) : target
  if (!el) return

  if (lastInteractionWasKeyboard) {
    // Keyboard: scroll to title and focus with outline
    const addedTabindex = !el.hasAttribute("tabindex")
    if (addedTabindex) el.setAttribute("tabindex", "-1")

    const top = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: "smooth" })

    requestAnimationFrame(() => {
      el.focus({ preventScroll: true })
    })

    el.addEventListener(
      "blur",
      () => {
        if (addedTabindex) el.removeAttribute("tabindex")
      },
      { once: true }
    )
  } else {
    // Mouse: scroll to very top, do not move focus
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
}

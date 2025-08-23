import {
  loader,
  pageLoaded,
  loaderTimeouts,
  defaultLoaderTimeout,
} from "./globals.js"

export function showLoader(pageType) {
  if (loader) {
    loader.classList.remove("loader-hidden")

    // Safety net: auto-hide loader after appropriate duration
    // Use loaderTimeouts if pageType provided, else defaultLoaderTimeout
    const duration =
      (pageType && loaderTimeouts[pageType]) ?? defaultLoaderTimeout

    setTimeout(() => {
      hideLoader()
    }, duration)
  }
}

export function hideLoader() {
  if (loader) loader.classList.add("loader-hidden")
}

export function announcePageLoaded(msg = "Page loaded") {
  if (pageLoaded) pageLoaded.textContent = msg
}

import { loaderTimeouts, defaultLoaderTimeout } from "../../globals.js"

export default function setLoaderTimeout(pageType, func) {
  const duration = loaderTimeouts[pageType] || defaultLoaderTimeout
  setTimeout(func, duration)
}

export default function updateLiveRegion(msg) {
  const live = document.getElementById("live-region")
  if (live) live.textContent = msg
}

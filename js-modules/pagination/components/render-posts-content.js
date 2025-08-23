import renderContent from "./render-content.js"

export default function renderPostsContent(
  data,
  template,
  containerId,
  page,
  itemsPerPage
) {
  renderContent(data, template, containerId, {
    page,
    itemsPerPage,
    contentKeys: [], // add HTML keys here if needed
    itemsKey: "posts", // posts.json uses a wrapper object
  })
}

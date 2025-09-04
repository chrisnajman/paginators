import renderContent from "./render-content.js"

export default function renderPagesContent(
  data,
  template,
  containerId,
  pageAnchorId,
  page,
  itemsPerPage
) {
  renderContent(data, template, containerId, pageAnchorId, {
    page,
    itemsPerPage,
    contentKeys: ["content"], // render HTML safely
    itemsKey: null, // data is already an array
  })
}

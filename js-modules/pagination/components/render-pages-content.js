import renderContent from "./render-content.js"

export default function renderPagesContent(
  data,
  template,
  containerId,
  page,
  itemsPerPage
) {
  renderContent(data, template, containerId, {
    page,
    itemsPerPage,
    contentKeys: ["content"], // render HTML safely
    itemsKey: null, // data is already an array
  })
}

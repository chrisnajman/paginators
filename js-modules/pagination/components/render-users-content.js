import normaliseData from "./normalise-data.js"
import { userTransformations } from "./render-customisations/normalise-users-data.js"
import renderContent from "./render-content.js"

export default function renderUsersContent(
  data,
  template,
  containerId,
  page,
  itemsPerPage
) {
  // Customised JSON fields:
  const dataNormalised = normaliseData(data, userTransformations)

  renderContent(dataNormalised, template, containerId, {
    page,
    itemsPerPage,
    contentKeys: [], // plain text
    itemsKey: null, // data is already an array
  })
}

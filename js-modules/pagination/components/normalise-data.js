export default function normaliseData(data, transformations = []) {
  if (!Array.isArray(data)) return data

  return data.map((item) => {
    const newItem = { ...item }

    transformations.forEach(({ keyPath, transform }) => {
      const keys = keyPath.split(".")
      let target = newItem

      // Traverse to the nested object
      for (let i = 0; i < keys.length - 1; i++) {
        target = target?.[keys[i]]
        if (!target) return // nested path missing → skip
      }

      const lastKey = keys[keys.length - 1]
      if (target && target[lastKey] !== undefined) {
        target[lastKey] = transform(target[lastKey])
      }
    })

    return newItem
  })
}

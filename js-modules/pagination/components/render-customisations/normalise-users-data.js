export const userTransformations = [
  // Converts `.bs` field in users.json into a comma separated string.
  {
    keyPath: "company.bs",
    transform: (val) => {
      if (Array.isArray(val)) return val.join(", ")
      else if (val.includes(",")) return val
      else return val.split(" ").join(", ")
    },
  },

  // Test examples only - uncomment if you want to test

  // a) Find any hyphenated company names and replace the hyphen with a space:
  // { keyPath: "company.name", transform: (val) => val.split("-").join(" ") },

  // b) Reverse first name and last name and separate by a comma:
  // { keyPath: "name", transform: (val) => val.split(" ").reverse().join(", ") },
]

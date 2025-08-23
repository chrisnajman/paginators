const fs = require("fs")
const path = require("path")
const { minify } = require("html-minifier-terser")

const docsDir = "docs"

const minifyOptions = {
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeEmptyAttributes: true,
  minifyCSS: true,
  minifyJS: true,
}

;(async () => {
  const files = fs.readdirSync(docsDir)

  for (const file of files) {
    if (file.endsWith(".html")) {
      const filePath = path.join(docsDir, file)
      const rawContent = fs.readFileSync(filePath, "utf-8")

      try {
        let content = await minify(rawContent, minifyOptions)

        // Replace JS and CSS references
        content = content
          .replace(
            /<script[^>]*\s(src=["']\.?\/index\.js["'])[^>]*type=["']module["'][^>]*><\/script>/i,
            '<script src="./bundle.js" defer></script>'
          )

          .replace(
            /<link[^>]+href=["']\.?\/style\.css["'][^>]*>/i,
            '<link rel="stylesheet" href="./style.min.css">'
          )

        fs.writeFileSync(filePath, content, "utf-8")
      } catch (err) {
        console.error(`Failed to process ${file}:`, err)
      }
    }
  }
})()

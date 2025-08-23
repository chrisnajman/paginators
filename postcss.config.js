module.exports = {
  plugins: [
    require("postcss-import"),
    require("postcss-nesting"),
    require("postcss-url")({
      url: "copy",
      assetsPath: "img",
      useHash: true,
    }),
    require("cssnano")({ preset: "default" }),
  ],
}

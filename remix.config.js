/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  // export default for modules
  ignoredRouteFiles: ["**/.*"],
  serverModuleFormat: "cjs", // "esm"
  serverDependenciesToBundle: [
    // "@remix-pwa/sw",
    // "@remix-pwa/push",
    "axios",
    // /.*/,
  ],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
};

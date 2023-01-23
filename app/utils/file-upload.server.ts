import type { UploadHandler } from "@remix-run/node" // or cloudflare/deno
import { unstable_createFileUploadHandler } from "@remix-run/node" // or cloudflare/deno
// import { createCloudinaryUploadHandler } from "some-handy-remix-util"

export const standardFileUploadHandler = unstable_createFileUploadHandler({
  directory: "/storage/firmware",
})

// export const cloudinaryUploadHandler = createCloudinaryUploadHandler({
//   folder: "/my-site/avatars",
// })

// export const fileUploadHandler: UploadHandler = args => {
//   if (args.name === "calendarEvent") {
//     return standardFileUploadHandler(args)
//   } else if (args.name === "eventBanner") {
//     return cloudinaryUploadHandler(args)
//   }
//   return undefined
// }

export const fileUploadHandler: UploadHandler = args => {
  console.log(
    "File Upload Handler Created: ",
    args.name,
    args.filename,
    args.contentType
  )
  return standardFileUploadHandler(args)
}

// export const uploadFirmwareToCore

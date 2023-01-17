import { FolderPlusIcon } from "@heroicons/react/24/solid"
import { ActionFunction } from "@remix-run/node"
import { useActionData, useNavigation } from "@remix-run/react"
import Button from "~/components/atoms/Button"

type ActionData = {
  errors: string[]
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
}

const chips = [
  { value: "esp8266", displayName: "ESP8266" },
  {
    value: "esp32",
    displayName: "ESP32",
  },
]

export const AdminOTAUpdatesNew = () => {
  // const navigation = useNavigation()
  const actionData = useActionData<ActionData>()

  return (
    <div className="admin-page">
      <h2 className="page-title">Upoad New Firmware Update(OTA)</h2>
      <form
        method="post"
        className="form max-w-xs mx-auto bg-white rounded-lg shadow-lg px-2 py-3 sm:p-4 flex flex-col items-stretch justify-center gap-4"
      >
        <label className="label">
          Chip:
          <select className="input mt-2" name="chip">
            {chips.map(ch => (
              <option value={ch.value}>{ch.displayName}</option>
            ))}
          </select>
        </label>
        <label className="label">
          Device Type: (Optional)
          <input
            type="text"
            name="deviceType"
            placeholder="KEY, Leave empty for all device types"
          />
          <span className="text-xs">
            supported device types will be added and you can choose
          </span>
        </label>
        <label className="label">
          Firmware Version:
          <input
            type="text"
            name="version"
            placeholder="1.0.19.beta"
            required
          />
        </label>
        <label className="label">
          Manufacturer ID: (Optional)
          <input
            type="text"
            name="manufacturerId"
            placeholder="Leave empty for global manufacturer scope"
          />
        </label>
        <label className="label">
          Building ID: (Optional)
          <input
            type="text"
            name="buildingId"
            placeholder="Leave empty for global building scope"
          />
        </label>
        <label className="label">
          File:
          <input type="file" name="file" required />
        </label>
        <Button className="bg-primary py-1 px-3 shadow-blue-300 flex items-center justify-center gap-2.5">
          <FolderPlusIcon className="w-5 h-5" />
          Upload Firmware
        </Button>
      </form>
    </div>
  )
}

export default AdminOTAUpdatesNew

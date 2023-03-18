import type { ReactNode } from "react"
import type { DeviceControlProps } from "~/types/Device"

export default function TVControl({
  type: t,
  state,
  onUpdate: updateHandler,
}: DeviceControlProps): ReactNode {
  return "TV CONTROL"
}

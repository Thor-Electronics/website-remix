import type { HTMLAttributes } from "react"
import type { Group } from "~/types/Group"
import { SiPorsche } from "react-icons/si"

export interface Props extends HTMLAttributes<HTMLElement> {
  data: Group
}

export const VehicleCard = ({ data: v }: Props) => {
  return (
    <div className="VehicleCard">
      <div className="head">
        <div className="icon">
          <SiPorsche className="w-6" />
        </div>
        <h3 className="name">{v.name}</h3>
      </div>
      <div className="body">
        <div className="dash">
          <div className="item">
            Speed: {v.devices![0]?.state.speed as string} km/h
          </div>
          <div className="item">
            RPM: {v.devices![0]?.state.rpm as string} rpm
          </div>
          <div className="item">
            Fuel: {v.devices![0]?.state.fuel as string}%
          </div>
          <div className="item">
            Temperature: {v.devices![0]?.state.temperature as string}℃
          </div>
        </div>
        <div className="map"></div>
      </div>
    </div>
  )
}

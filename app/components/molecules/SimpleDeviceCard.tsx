export const SimpleDeviceCard = ({}) => {
  return (
    <div className="SimpleDeviceCard">Super Simple Device Card with Switch</div>
  )
}
// TODO: maybe we'd better create a device card which is only a wrapper and shows some details and then create smaller components for each device type (KEY, KEY2, KEY4, RELAY, RELAY12, etc.) so that the complexity is less. Also custom UI for each typoe of device will be done. For undefined device types or new ones, we can just show a simple UI! That's times better!

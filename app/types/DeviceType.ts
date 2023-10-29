export enum DeviceType {
  // A device with general functionalities
  General = "GENERAL",

  // A device with base functionalities
  Core = "CORE",

  // General key?
  Key = "KEY",

  // 1 Pole key
  Key1 = "KEY1",

  // 2 Pole key
  Key2 = "KEY2",

  // 3 Pole key
  Key3 = "KEY3",

  // 4 Pole key
  Key4 = "KEY4",

  // Relay card
  Relay = "RELAY",

  // Relay card 8
  Relay8 = "RELAY8",

  // Relay card 12
  Relay12 = "RELAY12",

  // Power outlet/wall plug/power socket
  Plug = "PLUG",

  // Smart Light with colors
  Light = "LIGHT",

  // Bell
  Bell = "BELL",

  // Lock
  Lock = "LOCK",

  // Door
  Door = "DOOR",

  // Smart TV
  TV = "TV",

  // Window Blinds
  Blinds = "BLINDS",

  // Window Curtain
  Curtain = "CURTAIN",

  // Thermostat / Soil Moisture Meter / Humidity Meter / Hygrometer
  Thermostat = "THERMOSTAT",

  // IR_HUB?
  IRHub = "HUB_IR",

  // RF Translator Hub?
  RFHub = "HUB_RF",

  // Local Mini Server
  LocalHub = "HUB_LOCAL",

  // Dev device used for development purposes
  Dev = "DEV",

  // Cars ECU
  ECU = "ECU",

  // Solar Panel
  SolarPanel = "SOLAR_PANEL",

  // Battery
  Battery = "BATTERY",

  // Fan / Fan Quail
  Fan = "FAN",

  // KEY = "KEY",
  // KEY1 = "KEY1",
  // KEY2 = "KEY2",
  // KEY3 = "KEY3",
  // KEY4 = "KEY4",
  // LOCK = "LOCK",
  // BELL = "BELL",
  // TV = "TV",
  // IRHUB = "IRHUB",
  // BLINDS = "BLINDS",
  // DOOR = "DOOR",
  // VEHICLE = "VEHICLE",
}

export type ServerDeviceTypes = {
  [key in DeviceType]: string; // [k: DeviceType]: string
};

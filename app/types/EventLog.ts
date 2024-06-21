import { Message } from "./Message";

export type EventLog<T> = {
  text?: string;
  data?: T;
  time?: Date;
};

export const parseEventLog = <T>(obj: Message | any): EventLog<T> => {
  // console.log(`[DEBUG] Parsing Event Log: `, obj);
  return {
    text: obj.text ?? "",
    data: obj.data ?? {},
    time: obj.time ? new Date(obj.time) : new Date(),
  };
};

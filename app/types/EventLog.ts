export type EventLog<T> = {
  text?: string;
  data?: T;
  time?: Date;
};

export const parseEventLog = <T>(obj: any): EventLog<T> => {
  return {
    text: obj.text ?? "",
    data: obj.data ?? {},
    time: new Date(obj.time ?? undefined),
  };
};

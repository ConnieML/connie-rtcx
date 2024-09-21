export interface Contact {
  key: string;
  name: string;
  notes: string;
  phoneNumber: string;
<<<<<<< HEAD
  allowColdTransfer?: boolean;
  allowWarmTransfer?: boolean;
=======
>>>>>>> c559c5a243a27da5a618422e334f7a79e970f814
}

export interface HistoricalContact {
  taskSid: string;
  direction: string | undefined;
  channelType?: string;
  customerAddress?: string;
  inboundAddress?: string;
  name?: string;
  dateTime: string;
  duration: number;
  queueName: string;
  outcome?: string;
  notes?: string;
}

export interface Message {
  index: number;
  date: string;
  author: string;
  body: string;
}

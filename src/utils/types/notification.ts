export type TNotification = {
  id: string;
  title: string;
  description: string;
  notificationType: string;
  scheduledStart?: number;
  scheduledEnd?: number;
  sendNow: string;
  postedBy: string;
  timezone?: string;
  _ts: number;
};

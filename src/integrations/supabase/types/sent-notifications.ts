
export type SentNotificationsRow = {
  id: string;
  trip_id: string;
  sent_by: string;
  recipients: any;
  sent_at: string;
};

export type SentNotificationsInsert = Omit<SentNotificationsRow, 'id' | 'sent_at'>;

export type SentNotificationsUpdate = Partial<SentNotificationsInsert>;

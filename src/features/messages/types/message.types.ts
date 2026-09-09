export type MessageStatus =
  | "NEW"
  | "READ"
  | "ARCHIVED";


export type ContactMessage = {
  id: number;

  name: string;
  email: string;
  subject: string;
  message: string;

  status: MessageStatus;

  created_at: string;
  read_at: string | null;
};


export type ContactMessageListResponse = {
  items: ContactMessage[];
  total: number;
};


export type ContactMessageStatusUpdate = {
  status: MessageStatus;
};
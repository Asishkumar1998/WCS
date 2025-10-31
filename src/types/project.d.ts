export interface NewsItem {
  title: {
    rendered: string;
  };
  content: object;
  link: string;
  modified: string;
}

export interface UpdateItem {
  updateId: number;
  createdBy: string;
  createdAt: string;
  modifiedBy: string;
  modifiedAt: string;
  isActive: boolean;
  updateStatus: number;
  title: string;
  description: string;
  attachment: any[];
  publishedDate: string;
}

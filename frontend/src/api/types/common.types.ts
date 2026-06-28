export type ApiErrorResponse = {
  statusCode: number;
  message: string | string[];
  error?: string;
  timestamp?: string;
  path?: string;
};

export type Paging = {
  page: number;
  pageSize: number;
  total: number;
};

export type AuthUser = {
  id: string;
  email: string;
  fullname: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: AuthUser;
};

export type ApiErrorResponse = {
  statusCode: number;
  message: string | string[];
  error?: string;
  timestamp?: string;
  path?: string;
};

export type InvoiceStatus = 'Draft' | 'Pending' | 'Paid' | 'Overdue';

export type InvoiceStatusFilter = InvoiceStatus | 'All';

export type InvoiceSortBy = 'invoiceDate' | 'dueDate' | 'totalAmount';

export type Ordering = 'ASC' | 'DESC';

export type InvoiceListQuery = {
  page: number;
  pageSize: number;
  keyword?: string;
  status?: InvoiceStatus;
  sortBy?: InvoiceSortBy;
  ordering?: Ordering;
  fromDate?: string;
  toDate?: string;
};

export type Paging = {
  page: number;
  pageSize: number;
  total: number;
};

export type InvoiceListItem = {
  id: string;
  invoiceNumber: string;
  customerName: string;
  invoiceDate: string;
  dueDate: string;
  currency: string;
  currencySymbol: string;
  totalAmount: string;
  status: InvoiceStatus;
};

export type InvoiceListResponse = {
  data: InvoiceListItem[];
  paging: Paging;
};

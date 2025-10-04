// User related types
export type UserRole = 'admin' | 'manager' | 'employee';
export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  department: string;
  joinDate: string;
  password?: string; // Only used during creation
}

// Expense related types
export type ExpenseStatus = 'draft' | 'submitted' | 'approved' | 'rejected' | 'processing' | 'paid';
export type ExpenseCategory = 'travel' | 'meals' | 'accommodation' | 'office_supplies' | 'entertainment' | 'other';

export interface Expense {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  currency: string;
  category: ExpenseCategory;
  description: string;
  date: string;
  status: ExpenseStatus;
  receiptUrl?: string;
  receiptName?: string;
  submittedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectedAt?: string;
  rejectedReason?: string;
  paymentDate?: string;
  paymentMethod?: string;
  paymentReference?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Approval related types
export interface Approval {
  id: string;
  expenseId: string;
  approverId: string;
  approverName: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  actionedAt?: string;
  required: boolean;
  level: number;
  createdAt: string;
  updatedAt: string;
}

// Workflow related types
export interface WorkflowRule {
  id: string;
  name: string;
  description?: string;
  conditions: WorkflowCondition[];
  steps: WorkflowStep[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowCondition {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains' | 'startsWith' | 'endsWith' | 'in';
  value: any;
  logicalOperator?: 'and' | 'or';
}

export interface WorkflowStep {
  id: string;
  name: string;
  approverRole: UserRole | 'specific';
  specificApproverId?: string;
  isRequired: boolean;
  order: number;
  autoApproveIfSameAsSubmitter: boolean;
  notifyApprover: boolean;
  notifySubmitter: boolean;
  notifyOnApproval: boolean;
  notifyOnRejection: boolean;
  allowDelegate: boolean;
  timeLimit?: number; // in hours
  escalationToRole?: UserRole;
  escalationAfter?: number; // in hours
}

// Notification related types
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
  readAt?: string;
}

// Report related types
export interface ExpenseReport {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  filters: ReportFilters;
  columns: string[];
  groupBy?: string[];
  sortBy?: { field: string; direction: 'asc' | 'desc' }[];
  createdAt: string;
  updatedAt: string;
}

export interface ReportFilters {
  dateRange?: {
    from: string;
    to: string;
  };
  statuses?: ExpenseStatus[];
  categories?: ExpenseCategory[];
  departments?: string[];
  amountRange?: {
    min?: number;
    max?: number;
  };
  userIds?: string[];
  hasReceipt?: boolean;
}

// Settings related types
export interface AppSettings {
  id: string;
  companyName: string;
  companyLogo?: string;
  defaultCurrency: string;
  dateFormat: string;
  timeZone: string;
  expensePolicies: {
    maxAmountWithoutReceipt: number;
    requireReceiptForAll: boolean;
    requireDescription: boolean;
    requireCategory: boolean;
    requireProjectCode: boolean;
    requireCostCenter: boolean;
    allowInternationalExpenses: boolean;
    defaultExpenseCategories: string[];
  };
  approvalWorkflow: {
    enableMultiLevelApproval: boolean;
    autoApproveIfNoApprovers: boolean;
    allowSelfApproval: boolean;
    requireManagerApproval: boolean;
    requireReceiptForApproval: boolean;
    enableExpiration: boolean;
    expirationDays: number;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    notifyOnSubmission: boolean;
    notifyOnApproval: boolean;
    notifyOnRejection: boolean;
    notifyOnPayment: boolean;
  };
  integrations: {
    accountingSystem: {
      enabled: boolean;
      system: 'quickbooks' | 'xero' | 'netsuite' | 'other';
      settings: Record<string, any>;
    };
    paymentGateway: {
      enabled: boolean;
      provider: 'stripe' | 'paypal' | 'other';
      settings: Record<string, any>;
    };
    ocrService: {
      enabled: boolean;
      provider: 'google_vision' | 'amazon_textract' | 'other';
      settings: Record<string, any>;
    };
  };
  security: {
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
      expiresInDays: number;
    };
    twoFactorAuth: boolean;
    sessionTimeout: number; // in minutes
    ipRestrictions: string[];
  };
  updatedAt: string;
  updatedBy: string;
}

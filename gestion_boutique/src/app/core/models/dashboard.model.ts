export interface DashboardStats {
  today: {
    sales: number;
    expenses: number;
    profit: number;
    transactionsCount: number;
  };
  week: {
    sales: number;
    expenses: number;
    profit: number;
    transactionsCount: number;
  };
  month: {
    sales: number;
    expenses: number;
    profit: number;
    transactionsCount: number;
  };
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
  }[];
}

export interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  period: {
    start: Date;
    end: Date;
  };
}

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '@core/services/dashboard.service';
import { FinancialSummary } from '@core/models/dashboard.model';
import { CurrencyFormatPipe } from '@shared/pipes/currency-format.pipe';
import { LoadingSpinnerComponent } from '@shared/components/ui/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-daily-report',
  standalone: true,
  imports: [CommonModule, CurrencyFormatPipe, LoadingSpinnerComponent],
  templateUrl: './daily-report.page.html',
  styleUrl: './daily-report.page.scss'
})
export class DailyReportPageComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  summary: FinancialSummary | null = null;
  isLoading = false;
  Math = Math;

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      this.summary = await this.dashboardService.getFinancialSummary(today, tomorrow);
    } finally {
      this.isLoading = false;
    }
  }
}

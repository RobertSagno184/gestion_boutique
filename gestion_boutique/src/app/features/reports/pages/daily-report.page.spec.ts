import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DailyReportPageComponent } from './daily-report.page';
import { DashboardService } from '@core/services/dashboard.service';

describe('DailyReportPageComponent', () => {
  let component: DailyReportPageComponent;
  let fixture: ComponentFixture<DailyReportPageComponent>;
  let mockDashboardService: any;

  beforeEach(async () => {
    mockDashboardService = {
      getFinancialSummary: jasmine.createSpy('getFinancialSummary').and.returnValue(Promise.resolve({
        totalRevenue: 0,
        totalExpenses: 0,
        netProfit: 0,
        profitMargin: 0,
        transactionCount: 0,
        expenseCount: 0
      }))
    };

    await TestBed.configureTestingModule({
      imports: [DailyReportPageComponent],
      providers: [
        { provide: DashboardService, useValue: mockDashboardService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DailyReportPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

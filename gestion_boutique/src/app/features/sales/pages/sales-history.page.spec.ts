import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalesHistoryPageComponent } from './sales-history.page';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TransactionsService } from '@core/services/transactions.service';
import { of } from 'rxjs';

describe('SalesHistoryPageComponent', () => {
  let component: SalesHistoryPageComponent;
  let fixture: ComponentFixture<SalesHistoryPageComponent>;
  let mockTransactionsService: any;

  beforeEach(async () => {
    mockTransactionsService = {
      getSales: jasmine.createSpy('getSales').and.returnValue(Promise.resolve([]))
    };

    await TestBed.configureTestingModule({
      imports: [SalesHistoryPageComponent, RouterModule.forRoot([]), FormsModule],
      providers: [
        { provide: TransactionsService, useValue: mockTransactionsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SalesHistoryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

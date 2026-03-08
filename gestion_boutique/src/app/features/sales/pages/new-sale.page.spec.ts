import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewSalePageComponent } from './new-sale.page';
import { FormsModule } from '@angular/forms';
import { TransactionsService } from '@core/services/transactions.service';
import { StockService } from '@core/services/stock.service';
import { of } from 'rxjs';
import { signal } from '@angular/core';

describe('NewSalePageComponent', () => {
  let component: NewSalePageComponent;
  let fixture: ComponentFixture<NewSalePageComponent>;
  let mockTransactionsService: any;
  let mockStockService: any;

  beforeEach(async () => {
    mockTransactionsService = {
      createSale: jasmine.createSpy('createSale').and.returnValue(Promise.resolve())
    };
    mockStockService = {
      loadProducts: jasmine.createSpy('loadProducts').and.returnValue(Promise.resolve()),
      products$: signal([])
    };

    await TestBed.configureTestingModule({
      imports: [NewSalePageComponent, FormsModule],
      providers: [
        { provide: TransactionsService, useValue: mockTransactionsService },
        { provide: StockService, useValue: mockStockService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NewSalePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

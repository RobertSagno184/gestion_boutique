import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockEntryPageComponent } from './stock-entry.page';
import { ReactiveFormsModule } from '@angular/forms';
import { StockService } from '@core/services/stock.service';
import { signal } from '@angular/core';

describe('StockEntryPageComponent', () => {
  let component: StockEntryPageComponent;
  let fixture: ComponentFixture<StockEntryPageComponent>;
  let mockStockService: any;

  beforeEach(async () => {
    mockStockService = {
      loadProducts: jasmine.createSpy('loadProducts').and.returnValue(Promise.resolve()),
      products$: signal([]),
      getStockMovements: jasmine.createSpy('getStockMovements').and.returnValue(Promise.resolve([]))
    };

    await TestBed.configureTestingModule({
      imports: [StockEntryPageComponent, ReactiveFormsModule],
      providers: [
        { provide: StockService, useValue: mockStockService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StockEntryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

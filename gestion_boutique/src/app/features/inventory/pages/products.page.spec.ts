import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsPageComponent } from './products.page';
import { RouterModule } from '@angular/router';
import { StockService } from '@core/services/stock.service';
import { signal } from '@angular/core';

describe('ProductsPageComponent', () => {
  let component: ProductsPageComponent;
  let fixture: ComponentFixture<ProductsPageComponent>;
  let mockStockService: any;

  beforeEach(async () => {
    mockStockService = {
      loadProducts: jasmine.createSpy('loadProducts').and.returnValue(Promise.resolve()),
      products$: signal([]),
      updateProduct: jasmine.createSpy('updateProduct').and.returnValue(Promise.resolve())
    };

    await TestBed.configureTestingModule({
      imports: [ProductsPageComponent, RouterModule.forRoot([])],
      providers: [
        { provide: StockService, useValue: mockStockService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

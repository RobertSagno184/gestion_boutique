import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpensesListPageComponent } from './expenses-list.page';
import { RouterModule } from '@angular/router';
import { ExpensesService } from '@core/services/expenses.service';
import { signal } from '@angular/core';

describe('ExpensesListPageComponent', () => {
  let component: ExpensesListPageComponent;
  let fixture: ComponentFixture<ExpensesListPageComponent>;
  let mockExpensesService: any;

  beforeEach(async () => {
    mockExpensesService = {
      loadExpenses: jasmine.createSpy('loadExpenses').and.returnValue(Promise.resolve()),
      expenses$: signal([]),
      getTotalExpensesByPeriod: jasmine.createSpy('getTotalExpensesByPeriod').and.returnValue(Promise.resolve(0)),
      deleteExpense: jasmine.createSpy('deleteExpense').and.returnValue(Promise.resolve())
    };

    await TestBed.configureTestingModule({
      imports: [ExpensesListPageComponent, RouterModule.forRoot([])],
      providers: [
        { provide: ExpensesService, useValue: mockExpensesService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ExpensesListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

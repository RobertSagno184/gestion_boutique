import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterPageComponent } from './register.page';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/firebase/auth.service';

describe('RegisterPageComponent', () => {
  let component: RegisterPageComponent;
  let fixture: ComponentFixture<RegisterPageComponent>;
  let mockAuthService: any;

  beforeEach(async () => {
    mockAuthService = {
      register: jasmine.createSpy('register').and.returnValue(Promise.resolve())
    };

    await TestBed.configureTestingModule({
      imports: [RegisterPageComponent, ReactiveFormsModule, RouterModule.forRoot([])],
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

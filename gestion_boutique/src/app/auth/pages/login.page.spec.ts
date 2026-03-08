import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPageComponent } from './login.page';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/firebase/auth.service';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let mockAuthService: any;

  beforeEach(async () => {
    mockAuthService = {
      login: jasmine.createSpy('login')
    };

    await TestBed.configureTestingModule({
      imports: [LoginPageComponent, ReactiveFormsModule, RouterModule.forRoot([])],
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

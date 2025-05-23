import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigService } from 'src/app/layout/service/app.config.service';
import SharedUtil from 'src/app/lib/shared.util';
import { ApiService } from '../../service/api.service';
import { SharedService } from '../../service/shared.service';
import { ToastService } from 'src/app/service/toast.service';
import { CommonModule } from '@angular/common';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PasswordModule, CheckboxModule, ButtonModule, InputTextModule],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends SharedUtil implements OnInit {
  isLoading: boolean = false;
  form: FormGroup;

  constructor(
    public configService: ConfigService,
    private sharedService: SharedService,
    private toastService: ToastService,
    private router: Router,
    private apiService: ApiService,
    private formBuilder: FormBuilder
  ) {
    super();

    const state = router.getCurrentNavigation()?.extras?.state;
    if (state?.expired || state?.logout) {
      this.sharedService.logoutUser();
      if (state.logout) this.toastService.showToast('success', 'Successfully logged out.');
    }
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.minLength(5), Validators.required]],
      rememberMe: [false],
    });

    this.sharedService.user$.subscribe(() => {
      if (this.sharedService.isLoggedIn) this.router.navigateByUrl('/admin/order');
    });
  }

  onSubmit() {
    this.isLoading = true;
    this.apiService.login(this.form.value).subscribe((res) => {
      this.isLoading = false;
      if (res.status === 200) {
        this.sharedService.user = res.data;
        this.toastService.successToast('Login success!');
      } else if (res.status === 429) {
        this.sharedService.showNotification('You are suspicious, please try again later.', '😡');
      } else {
        this.toastService.errorToast('Failed to authorize the user!');
      }
    });
  }
}

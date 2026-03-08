import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [],
  template: `
    <div [class]="containerClasses">
      <div class="animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"
        [style.width.px]="size"
      [style.height.px]="size"></div>
      @if (message) {
        <p class="mt-4 text-gray-600">{{ message }}</p>
      }
    </div>
    `,
  styles: []
})
export class LoadingSpinnerComponent {
  @Input() size = 40;
  @Input() message = '';
  @Input() fullScreen = false;

  get containerClasses(): string {
    if (this.fullScreen) {
      return 'fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-75 z-50';
    }
    return 'flex flex-col items-center justify-center p-8';
  }
}

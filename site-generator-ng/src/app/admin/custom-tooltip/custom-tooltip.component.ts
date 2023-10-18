import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-custom-tooltip',
  templateUrl: './custom-tooltip.component.html',
  styleUrls: ['./custom-tooltip.component.css']

})
export class CustomTooltipComponent {
  @Input() show: boolean = false;
  @Input() color: string;
  @Output() colorChange = new EventEmitter<string>();

  constructor(private snackBar: MatSnackBar) {

  }

  onColorChange(event: any): void {
    this.color = event.target.value;
    this.colorChange.emit(this.color);
    this.copyToClipboard(this.color);
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Color copied to clipboard:', text);
      this.snackBar.open(text + ' Copied', 'Close', {
        duration: 5000,
      });
    }).catch(err => {
      console.error('Error in copy to clipboard: ', err);
    });
  }
}

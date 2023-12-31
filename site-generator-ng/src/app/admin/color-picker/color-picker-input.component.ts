import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-color-picker-input',
  templateUrl: './color-picker-input.component.html',
  styleUrls: ['./color-picker-input.component.css']

})
export class ColorPickerInputComponent {
  @Input() color: string;
  @Output() colorChange = new EventEmitter<string>();
  showTooltip: boolean = false;
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

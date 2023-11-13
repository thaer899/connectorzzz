import { Component } from '@angular/core';
import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';
import { ControlProps } from '@jsonforms/core';

@Component({
  selector: 'app-data-component',
  template: `
  <mat-form-field  style="width: 100%">
    <textarea  class="data-textarea" matInput [(ngModel)]="dataAsString"></textarea>
  </mat-form-field>
`
})
export class DataDisplayComponent extends JsonFormsControl {

  dataAsString: string;

  constructor(service: JsonFormsAngularService) {
    super(service);
  }

  public mapAdditionalProps(props: ControlProps) {
    this.dataAsString = JSON.stringify(props.data, null, 2);
  }
}

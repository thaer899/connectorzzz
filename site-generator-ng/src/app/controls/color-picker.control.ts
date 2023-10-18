import { Component } from '@angular/core';
import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';
import { ControlProps } from '@jsonforms/core';

@Component({
  selector: 'app-color-picker-component',
  template: `
     <app-color-picker-input [(color)]="color"></app-color-picker-input>
     `
})
export class ColorPickerComponent extends JsonFormsControl {

  dataAsString: string;
  color: string = '#3b9029';

  constructor(service: JsonFormsAngularService) {
    super(service);
  }

  public mapAdditionalProps(props: ControlProps) {
    this.color = props.data.color || this.color;

  }

  onEventLog(eventType: string, event: Event) {
    console.log(eventType, event);
  }
}

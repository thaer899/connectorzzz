import { Component } from '@angular/core';
import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';
import { ControlProps } from '@jsonforms/core';

@Component({
  selector: 'app-color-picker-component',
  template: `
     <app-color-picker [(color)]="color"></app-color-picker>
     `
})
export class ColorPickerComponent extends JsonFormsControl {

  dataAsString: string;
  color: string = '#ffffff';  // initialize with a default color

  constructor(service: JsonFormsAngularService) {
    super(service);
  }

  public mapAdditionalProps(props: ControlProps) {
    this.color = props.data.color || this.color;  // Assuming 'color' is the relevant property from your data

  }

  onEventLog(eventType: string, event: Event) {
    console.log(eventType, event);
  }
}

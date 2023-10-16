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

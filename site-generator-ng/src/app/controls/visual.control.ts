import { Component } from '@angular/core';
import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';
import { ControlProps } from '@jsonforms/core';

@Component({
  selector: 'app-visual-component',
  template: `
   <app-site-visual [(dataFromParent)]="data">></app-site-visual>
     `
})
export class VisualComponent extends JsonFormsControl {

  dataAsString: string;
  data: any = {};

  constructor(service: JsonFormsAngularService) {
    super(service);
  }

  public mapAdditionalProps(props: ControlProps) {
    this.data = props.data || this.data;

  }

  onEventLog(eventType: string, event: Event) {
    console.log(eventType, event);
  }
}

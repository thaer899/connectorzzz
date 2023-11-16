import { Component } from '@angular/core';
import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';
import { ControlProps } from '@jsonforms/core';

@Component({
  selector: 'app-data-component',
  styles: [
    `
      :host ::ng-deep .editor-container {
        height: 300px;
      }
      :host ::ng-deep .my-code-editor  {
        height: 250px;
        border: 0.5px solid #cdcdcd5e;
    padding-top: 1vh;      }
    `
  ],
  template: `
    <div class="editor-container">
      <ngx-monaco-editor class="my-code-editor" [options]="editorOptions" [(ngModel)]="code"></ngx-monaco-editor>
    </div>
  `
})
export class CodeComponent extends JsonFormsControl {

  editorOptions = { theme: 'vs-dark', language: 'python' };
  code = 'def x():\n    print("Hello world!")\n'

  constructor(service: JsonFormsAngularService) {
    super(service);
  }



}

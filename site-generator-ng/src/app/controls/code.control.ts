import { Component } from '@angular/core';
import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';

@Component({
  selector: 'app-code-component',
  styles: [
    `
      :host ::ng-deep .editor-container {
        height: 300px;
      }
      :host ::ng-deep .my-code-editor {
        height: 250px;
        border: 0.5px solid #cdcdcd5e;
        padding-top: 1vh;
      }
      .toggle-language-button {
        margin-bottom: 10px;
      }
    `
  ],
  template: `
    <div class="editor-container">
      <button mat-button class="toggle-language-button" (click)="toggleLanguage()">
        Code in {{ this.currentLanguage | uppercase }}
      </button>
      <ngx-monaco-editor class="my-code-editor" [options]="editorOptions" [(ngModel)]="code"></ngx-monaco-editor>
    </div>
  `
})
export class CodeComponent extends JsonFormsControl {
  editorOptions = { theme: 'vs-dark', language: 'python' };
  code = 'def x():\n    print("Hello world!")\n';
  currentLanguage: 'python' | 'yaml' = 'python';

  constructor(service: JsonFormsAngularService) {
    super(service);
  }

  toggleLanguage() {
    if (this.currentLanguage === 'python') {
      this.currentLanguage = 'yaml';
      this.editorOptions = { ...this.editorOptions, language: 'yaml' };
      // Update the code variable if you also want to change the content of the editor
      this.code = 'yaml: content';
    } else {
      this.currentLanguage = 'python';
      this.editorOptions = { ...this.editorOptions, language: 'python' };
      // Update the code variable if you also want to change the content of the editor
      this.code = 'def x():\n    print("Hello world!")\n';
    }
  }

  getNextLanguage() {
    return this.currentLanguage === 'python' ? 'yaml' : 'python';
  }
}

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';
import { ControlProps } from '@jsonforms/core';
import { darkTheme } from '../themes/monaco/dark-theme';
import * as monaco from 'monaco-editor';

@Component({
  selector: 'app-code-component',
  styles: [
    `
      :host ::ng-deep .editor-container {
        height: 80vh;
      }
      :host ::ng-deep .my-code-editor {
        height: 70vh;
        border: 0.5px solid #cdcdcd5e;
        padding-top: 1vh;
      }
      :host ::ng-deep .mat-raised-button {
        margin-bottom: 20px;
        font-size: 12px;
      }

      mat-button-toggle-group {
        margin-bottom: 10px;
        font-size: 12px;
      }
    `
  ],
  template: `
        <button mat-raised-button (click)="start()" *ngIf="!init"><span class="material-symbols-outlined">
expand_more
</span></button>
    <div class="editor-container"  *ngIf="init">
      <mat-button-toggle-group 
        name="languageToggle"
        aria-label="Language Toggle"
        [(ngModel)]="currentLanguage"
        (change)="toggleLanguage()">
        <mat-button-toggle value="python">Script in Python</mat-button-toggle>
        <mat-button-toggle value="yaml">Workflow in YAML</mat-button-toggle>
      </mat-button-toggle-group>
      <ngx-monaco-editor class="my-code-editor" [options]="editorOptions" [(ngModel)]="code"></ngx-monaco-editor>
    </div>
  `
})
export class CodeComponent extends JsonFormsControl implements OnInit {
  editorOptions = { theme: 'vs-dark', language: 'python' };
  code: string; func
  currentLanguage: 'python' | 'yaml' = 'python';
  init: boolean = false;
  constructor(private cdRef: ChangeDetectorRef, service: JsonFormsAngularService) {
    super(service);

  }

  ngAfterViewInit() {
    // monaco.editor.defineTheme('vs-dark', darkTheme);
    // this.editorOptions = { theme: 'vs-dark', language: 'python' };
    this.cdRef.detectChanges();
  }

  public mapAdditionalProps(props: ControlProps) {
    this.code = props.data;
    this.currentLanguage = props.data.language || this.currentLanguage;
    this.updateEditorOptions();
  }

  toggleLanguage() {
    // Update the language based on the current state of `currentLanguage`
    this.updateEditorOptions();
    // Update the code snippet based on the selected language
    this.code = this.currentLanguage === 'python'
      ? this.generatePythonFunction(this.code)
      : this.code;
  }

  start() {
    this.toggleLanguage();
    this.init = true;
  }

  private updateEditorOptions() {
    this.editorOptions = { ...this.editorOptions, language: this.currentLanguage };
  }

  generatePythonFunction(funcData: any): string {
    // Create function signature
    let funcSignature = `def ${funcData.name}(`;
    funcSignature += funcData.parameters.map((param: any) => `${param.name}: ${this.mapPythonType(param.type)}`).join(', ');
    funcSignature += `) -> ${this.mapPythonType(funcData.return_type)}:\n`;

    // Create docstring
    let docstring = `    \"\"\"\n    ${funcData.description}\n\n`;
    funcData.parameters.forEach((param: any) => {
      docstring += `    ${param.name} (${this.mapPythonType(param.type)}): ${param.description}\n`;
    });
    docstring += `    Returns:\n    ${this.mapPythonType(funcData.return_type)}: ${funcData.return_description}\n    \"\"\"\n`;

    // Combine
    const fullFunction = funcSignature + docstring + "    # Implementation goes here\n    pass\n\n";
    return fullFunction;
  }

  mapPythonType(typeScriptType: string): string {
    // Mapping TypeScript types to Python types
    const typeMapping: { [key: string]: string } = {
      "string": "str",
      "any": "object",
      // Add more mappings as needed
    };
    return typeMapping[typeScriptType] || "object";
  }
}
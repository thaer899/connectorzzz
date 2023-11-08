import { Pipe, PipeTransform } from '@angular/core';
import * as marked from 'marked';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({ name: 'markdown' })
export class MarkdownPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }

  transform(content: string): SafeHtml {
    const html = marked.parse(content);
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}

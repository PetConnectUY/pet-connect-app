import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'htmlToSafeHtml'
})
export class HtmlToSafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer){}

  transform(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

}

import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAppScrollable]'
})
export class AppScrollableDirective {

  constructor(private _el: ElementRef) {}
  set scrollTop(value: any) { this._el.nativeElement.scrollTop = value; }

}

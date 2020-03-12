import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAppOffsetTop]'
})
export class AppOffsetTopDirective {

  constructor(private _el: ElementRef) { }
  get offsetTop(): any { return this._el.nativeElement.offsetTop; }

}

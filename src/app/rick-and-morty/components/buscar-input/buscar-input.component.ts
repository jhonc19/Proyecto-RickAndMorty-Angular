import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-buscar-input',
  templateUrl: './buscar-input.component.html',
  styles: [
    `
      .full-width {
        width: 100%;
        height: 100%;
      }

      mat-expansion-panel-header {
        padding-top: 10px;
      }

      mat-icon {
        padding-right: 10px;
      }
    `,
  ],
})
export class BuscarInputComponent implements OnInit {
  @Output() onDebounce: EventEmitter<string> = new EventEmitter();

  debounce: Subject<string> = new Subject();

  termino: string = '';

  constructor() {}

  ngOnInit(): void {
    this.debounce.pipe(debounceTime(300)).subscribe((valor) => {
      this.onDebounce.emit(valor);
    });
  }

  teclaPresionada() {
    this.debounce.next(this.termino);
  }
}

import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('400ms', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class InitComponent {

  enviar: boolean = false

  enviarNum(){
    this.enviar = !this.enviar
  }
}

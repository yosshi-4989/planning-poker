import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-poker-card',
  templateUrl: './poker-card.component.html',
  styleUrls: ['./poker-card.component.scss'],
})
export class PokerCardComponent implements OnInit {
  @Input() card: string;
  @Input() isOpen: boolean;
  @Input() userColor: string; // カード色
  @Input() disabled: boolean;
  frontStyle;

  constructor() { }

  ngOnInit() {
    // userColorのテーマの値を取得する
    this.frontStyle = {
      color: 'var(--ion-color-' + this.userColor + ')',
      backgroundColor: 'white',
    };
  }
}

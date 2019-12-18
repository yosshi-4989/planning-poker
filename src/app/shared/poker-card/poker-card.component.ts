import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-poker-card',
  templateUrl: './poker-card.component.html',
  styleUrls: ['./poker-card.component.scss'],
})
export class PokerCardComponent implements OnInit {
  @Input() userName: string;
  @Input() number: string; // 数字以外も入るため文字列型
  @Input() userColor: string; // カード色
  @Input() isOpen: boolean;
  frontStyle;

  constructor() { }

  ngOnInit() {
    // userColorのテーマの値を取得する
    this.frontStyle = {color: 'var(--ion-color-' + this.userColor + ')'};
  }

}

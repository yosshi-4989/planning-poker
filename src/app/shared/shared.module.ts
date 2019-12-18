import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProfilePage } from './profile/profile.page';
import { PokerCardComponent } from './poker-card/poker-card.component';

@NgModule({
  declarations: [ProfilePage, PokerCardComponent],
  exports: [PokerCardComponent],
  entryComponents: [ProfilePage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ]
})
export class SharedModule { }

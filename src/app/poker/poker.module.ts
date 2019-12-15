import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Routes, RouterModule } from '@angular/router';
import { ListPage } from './list/list.page';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  {
    path: 'list',
    component: ListPage
  }
];

@NgModule({
  declarations: [ListPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class PokerModule { }

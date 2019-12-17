import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { AuthService } from 'src/app/auth/auth.service';
import { FirestoreService, IUser, IRoom } from 'src/app/shared/firestore.service';
import { ProfilePage } from 'src/app/shared/profile/profile.page';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  uid: string;
  user: IUser;
  roomList: Observable<IRoom[]>;

  constructor(
    public modalController: ModalController,
    public auth: AuthService,
    public firestore: FirestoreService,
  ) {}

  async ngOnInit() {
    // authからuidを取得し、firestoreのデータを確認
    const user = await this.firestore.userInit( this.auth.getUserId() );
    if (!user) {
      // modalを作成
      const modal = await this.modalController.create({
        component: ProfilePage,
      });
      // modalを表示
      await modal.present();
      // モーダルが非表示になった時にも表示するメソッドを実行してユーザー情報を取得する
      modal.onWillDismiss().then(() => this.ionViewWillEnter());
    }
    this.roomList = this.firestore.roomListInit();
  }

  // ユーザ情報を取得
  async ionViewWillEnter() {
    this.uid = this.auth.getUserId();
    this.user = await this.firestore.userInit(this.uid);
  }

  signOut() {
    this.auth.authSignOut();
  }

  // プロフィールモーダルを開く
  async openProfile() {
    const modal = await this.modalController.create({
      component: ProfilePage,
    });
    modal.present();
  }
  trackByFn(index, item) {
    return item.roomName;
  }
}

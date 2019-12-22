import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { FirestoreService, IUser } from 'src/app/shared/firestore.service';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-room',
  templateUrl: './room.page.html',
  styleUrls: ['./room.page.scss'],
})
export class RoomPage implements OnInit {
  roomId: string;
  user: IUser;
  uid: string;

  constructor(
    public route: ActivatedRoute,
    public alertController: AlertController,
    public navController: NavController,
    public auth: AuthService,
    public firestore: FirestoreService,
  ) { }

  async ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => this.roomId = params.get('roomId'));
    // authからuidを取得し、firestoreのデータを確認
    const user = await this.firestore.userInit( this.auth.getUserId() );
    if (!user) {
      const alert = await this.alertController.create({
        header: 'プロフィール登録が必要です。',
        buttons: [
          {
            text: '閉じる',
            role: 'cancel',
            handler: data => this.navController.navigateBack('/poker')
          }
        ]
      });
      alert.present();
    }
  }

  // ユーザ情報を取得
  async ionViewWillEnter() {
    this.uid = this.auth.getUserId();
    this.user = await this.firestore.userInit(this.uid);
  }

}

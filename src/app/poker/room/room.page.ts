import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { FirestoreService, IRoomUser, IRoomInfo, IChat, ICard } from 'src/app/shared/firestore.service';
import { AlertController, NavController, IonContent } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';

@Component({
  selector: 'app-room',
  templateUrl: './room.page.html',
  styleUrls: ['./room.page.scss'],
})
export class RoomPage implements OnInit {
  roomId: string;
  user: IRoomUser;
  uid: string;
  users: Observable<ICard[]>;
  roomInfo: IRoomInfo;
  cardOpen: Observable<boolean>;
  messages: Observable<IChat[]>;
  message: string;

  @ViewChild(IonContent, { static: true})
  content: IonContent;

  constructor(
    public route: ActivatedRoute,
    public alertController: AlertController,
    public navController: NavController,
    public auth: AuthService,
    public firestore: FirestoreService,
  ) { }

  // カード情報を更新
  async updateCard(num: string) {
    if (await this.firestore.roomInfoInit(this.roomId).pipe(map(v => v.cardOpen), first()).toPromise(Promise)) {
      return;
    }
    this.user.card = num;
    this.firestore.roomUserSet(this.roomId, this.user);
  }
  // 表示カードを開く
  async openCard() {
    this.roomInfo.cardOpen = true;
    this.firestore.roomInfoSet(this.roomId, this.roomInfo);
  }
  // 表示カードを伏せる
  async closeCard() {
    this.roomInfo.cardOpen = false;
    this.firestore.roomInfoSet(this.roomId, this.roomInfo);
  }
  // メッセージ送信
  postMessage() {
    if (!this.user) {
      alert('ユーザー情報がありません。');
      return;
    }
    this.firestore.messageAdd(this.roomId, {
      uid: this.uid,
      card: this.user.card,
      message: this.message,
      timestamp: Date.now(),
    });
    this.message = '';
    this.content.scrollToBottom(100);
  }

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
    // ユーザーを取得(すでに存在する場合に取得できる)
    this.user = await this.firestore.roomUserInit(this.roomId, this.uid);
    // ユーザーが存在しない場合は登録する
    if (!this.user) {
      const user = await this.firestore.userInit( this.auth.getUserId() );
      this.user = {
        id: this.uid,
        name: user.displayName,
        card: null,
        enterDate: new Date(), // 入室日時を格納
      };
      this.firestore.roomUserSet(this.roomId, this.user);
    }
    // ルームのユーザーリストの取得
    this.users = this.firestore.roomUserListInit(this.roomId);
    // ルーム情報を取得
    const info = this.firestore.roomInfoInit(this.roomId);
    // カードの表示情報のバインディングのためにObservableで取得
    this.cardOpen = info.pipe( map(inf => inf.cardOpen) );
    // こちらは更新用に固定値でよいのでIRoomInfoオブジェクトを取得
    this.roomInfo = await info.pipe(first()).toPromise(Promise);
    // チャット欄のメッセージ一覧
    this.messages = this.firestore.messageInit(this.roomId);
  }

  trackByFn(index, item) {
    return item.id;
  }
  trackByFnForMsg(index, msg) {
    return msg.mid;
  }
}

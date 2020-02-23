import { Injectable } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { first, concatMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface IUser {
  displayName: string;
  photoDataUrl: string;
}

export interface IRoomInfo {
  roomName: string;
  createDate: number;
  cardOpen: boolean;
}

export interface IRoom extends IRoomInfo {
  roomId: string;
}

// 入室メンバーのステータス
export interface IRoomUser {
  id: string;
  name: string;
  card: string;
  enterDate: Date;
}

export interface ICard extends IRoomUser {
  openFlag: Observable<boolean>;
}

export interface IMessage {
  uid: string;
  card: string;
  message: string;
  timestamp: number;
}

export interface IChat extends IUser, IMessage {
  openFlag: Observable<boolean>;
}

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  userDoc: AngularFirestoreDocument<IUser>;
  roomCollection: AngularFirestoreCollection<IRoomInfo>;

  constructor(public af: AngularFirestore) {
    this.roomCollection = this.af.collection<IRoomInfo>('room', ref => ref.orderBy('createDate', 'desc'));
  }

  // ユーザー情報(userDoc)を初期化するメソッド
  userInit(uid: string): Promise<IUser> {
    // users/[uid]/[IUser型データ] の形で保存する
    this.userDoc = this.af.doc<IUser>('users/' + uid);
    return this.userDoc.valueChanges()
      .pipe(first())
      .toPromise(Promise);
  }

  // ユーザー情報を更新する
  userSet(user: IUser): Promise<void> {
    return this.userDoc.set(user);
  }

  // ルーム一覧情報を取得する
  roomListInit(): Observable<IRoom[]> {
    return this.roomCollection.valueChanges({idField: 'roomId'});
  }

  // ルーム情報を取得
  roomInfoInit(roomId: string): Observable<IRoomInfo> {
    return this.roomCollection.doc<IRoomInfo>(roomId).valueChanges();
  }
  // ルーム情報を更新する
  roomInfoSet(roomId: string, roomInfo: IRoomInfo) {
    this.roomCollection.doc<IRoomInfo>(roomId).set(roomInfo);
  }

  // 入室ユーザー情報の取得
  roomUserInit(roomId: string, uid: string): Promise<IRoomUser> {
    return this.roomCollection.doc<IRoomUser>(roomId + '/users/' + uid)
      .valueChanges()
      .pipe(first())
      .toPromise(Promise);
  }
  // 入室ユーザー情報の登録
  roomUserSet(roomId: string, user: IRoomUser): Promise<void> {
    return this.roomCollection.doc<IRoomUser>(roomId + '/users/' + user.id).set(user);
  }
  // ルームにいるユーザー一覧の取得(変更をリアルタイムに受けるためObservable)
  roomUserListInit(roomId: string): Observable<ICard[]> {
    return this.roomCollection.doc(roomId)
      .collection<IRoomUser>('users', ref => ref.orderBy('enterDate', 'asc'))
      .valueChanges().pipe(
        concatMap(async users => {
          // asyncのloop内でasyncを利用するとasyncが聞かないことがあるのでloop内で値はすべてここでまとめる
          const cardOpen = await this.roomCollection.doc<IRoomInfo>(roomId)
            .valueChanges().pipe( map(inf => inf.cardOpen) );
          return users.map(user => {
            return Object.assign(user, {openFlag: cardOpen});
          });
        })
      );
  }
  // チャットメッセージの取得
  messageInit(roomId: string): Observable<IChat[]> {
    return this.roomCollection.doc(roomId)
      .collection<IMessage>('messages', ref => ref.orderBy('timestamp', 'asc'))
      .valueChanges({idField: 'mid'}).pipe(
        concatMap(async messages => {
          const users = await this.af.collection<IUser>('users')
            .valueChanges( {idField: 'uid'} ).pipe(first()).toPromise(Promise);
          // asyncのloop内でasyncを利用するとasyncが聞かないことがあるのでloop内で値はすべてここでまとめる
          const cardOpen = await this.roomCollection.doc<IRoomInfo>(roomId)
            .valueChanges().pipe( map(inf => inf.cardOpen) );
          return messages.map(message => {
            const user = users.find(u => u.uid === message.uid);
            return Object.assign(message, user, {openFlag: cardOpen});
          });
        })
      );
  }
  // チャットメッセージの追加
  messageAdd(roomId: string, message: IMessage) {
    return this.roomCollection.doc(roomId).collection<IMessage>('messages').add(message);
  }
}

import { Injectable } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { first } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface IUser {
  displayName: string;
  photoDataUrl: string;
}

// 入室メンバーのステータス
export interface IRoomUser {
  id: string;
  name: string;
  card: string;
  enterDate: Date;
}

export interface IRoomInfo {
  roomName: string;
  createDate: number;
}

export interface IRoom extends IRoomInfo {
  roomId: string;
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
  roomUserListInit(roomId: string): Observable<IRoomUser[]> {
    return this.roomCollection.doc(roomId)
      .collection<IRoomUser>('users', ref => ref.orderBy('enterDate', 'asc'))
      .valueChanges();
  }
}

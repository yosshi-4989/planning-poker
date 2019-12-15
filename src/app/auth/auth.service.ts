import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController, AlertController } from '@ionic/angular';
import { firebaseError } from './firebase.error';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    public afAuth: AngularFireAuth,
    public navController: NavController,
    public alertController: AlertController,
  ) { }

  // 登録して一覧ページへ遷移
  authSignUp(login: { email: string, password: string}) {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(login.email, login.password)
      .then(() => this.navController.navigateForward('poker/list'))
      .catch(error => {
        this.alertError(error);
        throw error;
      });
  }
  // ログインして一覧ページへ遷移
  authSignIn(login: { email: string, password: string}) {
    return this.afAuth.auth
      .signInWithEmailAndPassword(login.email, login.password)
      .then(() => this.navController.navigateForward('poker/list'))
      .catch(error => {
        this.alertError(error);
        throw error;
      });
  }
  // ログアウトしてタイトル画面へ遷移
  authSignOut() {
    return this.afAuth.auth.signOut()
      .then(() => this.navController.navigateRoot('/'))
      .catch(error => {
        this.alertError(error);
        throw error;
      });
  }
  // アラートを表示
  async alertError(e) {
    if (firebaseError.hasOwnProperty(e.code)) {
      e = firebaseError[e.code];
    }
    const alert = await this.alertController.create({
      header: e.code,
      message: e.message,
      buttons: ['閉じる'],
    });
    await alert.present();
  }
}

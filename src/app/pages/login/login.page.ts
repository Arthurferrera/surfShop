import { User } from './../../interfaces/user';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @ViewChild(IonSlides) slides: IonSlides;
  public wavesPosition = 0;
  public wavesDiference = 80;
  public userLogin: User = {};
  public userRegister: User = {};
  public loading: any;

  constructor(
    public keyboard: Keyboard,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private authService: AuthService
    ) {
   }

  ngOnInit() {
    // FAZER O ION CHANGE PARA PERMITIR O SWIPE

    // this.keyboard.isVisible
  }

  segmentChanged(event: any) {
    if (event.detail.value === 'login') {
      this.slides.slidePrev();
      this.wavesPosition += this.wavesDiference;
    } else {
      this.slides.slideNext();
      this.wavesPosition -= this.wavesDiference;
    }
  }

  async login() {
    await this.presentLoading();

    try {
      await this.authService.login(this.userLogin);

      // this.router.navigate('/home');
    } catch(error) {
      let message: string;
      // validando retorno do firebase e definindo a mensagem de erro
      switch (error.code) {
      case 'auth/user-not-found':
          message = 'Usuário não encontrado. Faça o cadastro e tente novamente.';
          break;
        case 'auth/wrong-password':
          message = 'Senha inválida, caso tenha esquecido, tente redefini-la depois volta ae.';
          break;
        case 'auth/invalid-email':
          message = 'Este formato de-mail não é válido, favor tente outro.';
          break;
      }
      this.presentToast(message);
    } finally {
      this.loading.dismiss();
    }
  }

  async register() {
    await this.presentLoading();

    try {
      await this.authService.register(this.userRegister);
    } catch(error) {
      let message: string;
      // validando retorno do firebase e definindo a mensagem de erro
      switch (error.code) {
        case 'auth/weak-password':
          message = 'Senha fraca, mínimo requerido são 6 digitos';
          break;
        case 'auth/email-already-in-use':
          message = 'Este e-mail já existe em nossa base de dados.';
          break;
        case 'auth/invalid-email':
          message = 'Este formato de-mail não é válido, favor tente outro.';
          break;
      }
      this.presentToast(message);
    } finally {
      this.loading.dismiss();
    }

  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Aguarde...',
    });
    return this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000
    });
    toast.present();
  }

}

import { toastController } from "@ionic/core";
import { Component, h, Listen, State } from "@stencil/core";
import { PLATFORM } from "../../enums/platform.enum";
import { AuthService } from "../../services/auth.service";
import { RouteService } from "../../services/route.service";
import { UXService } from "../../services/ux.service";

@Component({
  tag: 'app-login',
  styleUrl: 'app-login.css'
})
export class AppLogin{
  @State() width: number;
  private _email: string;
  private _password: string;
  toastErrorReference: HTMLIonToastElement;

  @Listen('resize', { target: 'window' })
  windowResize() {
    this.width = window.innerWidth;
  }

  componentWillLoad() {
    this.windowResize()
  }

  private inputEmailHandler(event) {
    this.clearToastMessages();
    this._email = event.target.value;
  }

  private inputPasswordHandler(event) {
    this.clearToastMessages();
    this._password = event.target.value;
  }

  private async loginWithGoogle() {
    UXService.showLoadingIndicator();
    this.clearToastMessages();
    await AuthService.loginGoogle();
    AuthService.onUserStateChanged({
      online: () => {
        RouteService.routerElement.push('/');
        UXService.hideLoadingIndicator();
      }
    });
  }

  private async loginWithEmailAndPassword() {
    UXService.showLoadingIndicator();
    this.clearToastMessages();
    AuthService.loginWithEmailAndPassword({
      email: this._email,
      password: this._password,
      onSuccess: () => {
        UXService.hideLoadingIndicator();
        RouteService.routerElement.push('/');
      },
      onError: async () => {
        UXService.hideLoadingIndicator();
        this.toastErrorReference = await toastController.create({
          message: 'Ops, houve um problema ao fazer o login. Verifique se seu e-mail/senha estão corretos e tente novamente.',
          duration: 10000,
          color: 'danger'
        });
        this.toastErrorReference.present();
      }
    });
  }

  private clearToastMessages() {
    if (!!this.toastErrorReference) {
      this.toastErrorReference.dismiss();
    }
  }

  formLogin(){
    return [
      <ion-grid>
        <ion-row>
          <ion-col>
            <ion-text class='title'>Entrar</ion-text>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col class='ion-align-self-center ion-padding-start'>
            <ion-text class='ion-padding-end'>Novo usuário?</ion-text>
          </ion-col>
          <ion-col class='ion-text-end'>
            <ion-button href="/create-account" color='secondary' fill='clear'>Criar conta</ion-button>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <ion-item>
              <ion-label position='floating'>Email:</ion-label>
              <ion-input clearInput required type='email' onInput={(event) => this.inputEmailHandler(event)} name='email'></ion-input>
            </ion-item>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <ion-item>
              <ion-label position='floating'>Senha:</ion-label>
              <ion-input clearInput type='password' onInput={(event) => this.inputPasswordHandler(event)} name='password'></ion-input>
            </ion-item>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <ion-button shape='round' size='large' expand='full' color='secondary' onClick={() => this.loginWithEmailAndPassword()}><ion-text color='dark'>Entrar</ion-text></ion-button>
          </ion-col>
        </ion-row>
        <ion-row class='ion-padding'>
          <ion-col class='ion-align-self-center'><div class='line'></div></ion-col>
          <ion-col class='ion-text-center'><ion-text>Entrar com</ion-text></ion-col>
          <ion-col class='ion-align-self-center'><div class='line'></div></ion-col>
        </ion-row>
        <ion-row>
          <ion-col class='ion-text-center'>
            <ion-button onClick={() => this.loginWithGoogle()} fill='clear' shape='round' color='secondary'>
              <ion-icon class='button-icon-round' name='logo-google'></ion-icon>
              <ion-label>Google</ion-label>
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    ]
  }

  render(){
    return [
      <ion-card color='primary' class={this.width > PLATFORM.MOBILE_SIZE_WIDTH ? 'web' : 'mobile'}>
        <ion-card-content>
          <ion-grid>
            <ion-row>
              <ion-col>
                {this.formLogin()}
              </ion-col>
              {this.width > PLATFORM.MOBILE_SIZE_WIDTH &&
              <ion-col class='ion-align-self-center ion-text-center'>
                <img src={RouteService.illustrationPath('login.png')} alt="Mulher com chave na mão"></img>
              </ion-col>}
            </ion-row>
          </ion-grid>
        </ion-card-content>
      </ion-card>
    ]
  }
}
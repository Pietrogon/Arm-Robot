import { toastController } from "@ionic/core";
import { Component, h, Listen, State } from "@stencil/core";
import { PLATFORM } from "../../enums/platform.enum";
import { User } from "../../interfaces/user.interface";
import { AuthService } from "../../services/auth.service";
import { RouteService } from "../../services/route.service";
import { UXService } from "../../services/ux.service";

@Component({
  tag: 'app-create-account',
  styleUrl: 'app-create-account.css'
})
export class AppLogin{
  @State() width: number;
  @State() user: User = {} as User;
  toastErrorReference: HTMLIonToastElement;
  toastSuccessReference: HTMLIonToastElement;

  @Listen('resize', { target: 'window' })
  windowResize() {
    this.width = window.innerWidth;
  }

  handleInput(event){
    this.user = {...this.user, [event.target.name]: event.target.value};
  }

  componentWillLoad() {
    this.windowResize()
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
  
  private async createUserWithEmailAndPassword() {
    UXService.showLoadingIndicator();
    this.clearToastMessages();
    AuthService.createUserWithEmailAndPassword({
      userData: this.user,
      onSuccess: async () => {
        UXService.hideLoadingIndicator();
        this.toastErrorReference = await toastController.create({
          message: 'Conta criada com sucesso!',
          duration: 10000,
          color: 'success'
        });
        this.toastErrorReference.present();
        RouteService.routerElement.push('/');
      },
      onError: async (error) => {
        UXService.hideLoadingIndicator();
        this.toastErrorReference = await toastController.create({
          message: error,
          duration: 10000,
          color: 'danger'
        });
        this.toastErrorReference.present();
      }
    });
  }

  private clearToastMessages() {
    if (!!this.toastErrorReference) this.toastErrorReference.dismiss();
    if (!!this.toastErrorReference) this.toastErrorReference.dismiss();
  }

  formCreateAccount(){
    return [
      <ion-grid>
        <ion-row>
          <ion-col>
            <ion-text class='title'>Criar conta</ion-text>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col class='ion-align-self-center ion-padding-start'>
            <ion-text class='ion-padding-end'>Já tem uma conta?</ion-text>
          </ion-col>
          <ion-col class='ion-text-end'>
            <ion-button href="/login" color='secondary' fill='clear'>Entrar</ion-button>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <ion-item>
              <ion-label position='floating'>Nome:</ion-label>
              <ion-input onIonInput={(event) => this.handleInput(event)} clearInput required type='text' name='nameFirst'></ion-input>
            </ion-item>
          </ion-col>
          <ion-col>
            <ion-item>
              <ion-label position='floating'>Sobrenome:</ion-label>
              <ion-input onIonInput={(event) => this.handleInput(event)} clearInput required type='text' name='nameLast'></ion-input>
            </ion-item>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <ion-item>
              <ion-label position='floating'>Email:</ion-label>
              <ion-input onIonInput={(event) => this.handleInput(event)} clearInput required type='email' name='email'></ion-input>
            </ion-item>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <ion-item>
              <ion-label position='floating'>Senha:</ion-label>
              <ion-input onIonInput={(event) => this.handleInput(event)} clearInput type='password' name='password'></ion-input>
            </ion-item>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <ion-button onClick={() => this.createUserWithEmailAndPassword()} shape='round' size='large' expand='full' color='secondary'><ion-text color='dark'>Criar conta</ion-text></ion-button>
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
              <ion-col class='ion-align-self-center'>
                {this.formCreateAccount()}
              </ion-col>
              {this.width > PLATFORM.MOBILE_SIZE_WIDTH &&
              <ion-col class='ion-align-self-center ion-text-center'>
                <img src={RouteService.illustrationPath('create-account.png')} alt="Mulher olhando um celular"></img>
              </ion-col>}
            </ion-row>
          </ion-grid>
        </ion-card-content>
      </ion-card>
    ]
  }
}
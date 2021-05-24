import { Component, h, State } from '@stencil/core';
import { User } from '../../interfaces/user.interface';
import { AuthService } from '../../services/auth.service';
import { BlynkService } from '../../services/blynk.service';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
})
export class AppHome {  
  @State() user: User = AuthService.user;
  
  async componentWillLoad(){
    AuthService.userObserver(() => {
      this.user = {...AuthService.user};
    });
    console.log(this.user);    
  }

  inputV0Handler(event: Event){
    var armRobot = new BlynkService("pO1g8yFnszYjhhk6WvO008RlMNUCWocf");
    armRobot.update('V0','20');
    armRobot.update('V1', '95');
  }

  render(){
    return (
      <comp-page-menu-pattern>
        <ion-content class="ion-padding ion-text-center">
          <ion-grid>
            <ion-row>
              <ion-col>
                <ion-item>
                  <ion-label position='floating'>Eixo X</ion-label>
                  <ion-input clearInput onInput={(event) => this.inputV0Handler(event)} name='password'></ion-input>
                </ion-item>
                <ion-item lines='none'>
                  <ion-button class='ion-padding' size='large'>Send</ion-button>
                </ion-item>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-content>
      </comp-page-menu-pattern>
    );
  }
}

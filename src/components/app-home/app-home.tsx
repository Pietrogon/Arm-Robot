import { Component, h, State } from '@stencil/core';
import { User } from '../../interfaces/user.interface';
import { AuthService } from '../../services/auth.service';

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

  render(){
    return (
      <comp-page-menu-pattern>
        <ion-content class="ion-padding ion-text-center">
          <ion-grid>
            <ion-row>
              <ion-col>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-content>
      </comp-page-menu-pattern>
    );
  }
}

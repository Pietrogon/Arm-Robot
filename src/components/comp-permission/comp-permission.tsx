import { Component, h, State } from "@stencil/core";
import { AuthService } from "../../services/auth.service";
import { RouteService } from "../../services/route.service";

@Component({
  tag: 'comp-permission',
  styleUrl: 'comp-permission.css'
})
export class CompPermission{
  @State() slot: boolean = false;
  width: number;
  height: number;
  
  componentWillLoad(){
    AuthService.onUserStateChanged({
      online: () => {
        this.slot = true;       
      },
      offline: () => {
        this.slot = false;
      }
    });
  }

  async componentDidLoad(){
    await this.wait();
    await this.loginPage();
  }

  private delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  private async wait(){
    let count = 0;
    while (!this.slot && count < 30) {
      await this.delay(50);
      count++;
    }
  }

  private loginPage() {
    !this.slot && RouteService.appMenu.close();
    !this.slot && RouteService.routerElement.push('/login');
  }

  render(){
    return [
      <div class={(this.slot ? 'show' : 'hide') + ' backgroundPrimary'}><slot/></div>,
      <comp-loading class={this.slot ? 'hide' : 'show'}></comp-loading>
    ]
  }
}
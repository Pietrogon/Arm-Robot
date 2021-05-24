import { Component, h, Element, State } from '@stencil/core';
import { AuthService } from '../../services/auth.service';
import { RouteService } from '../../services/route.service';
import { UXService } from '../../services/ux.service';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
})
export class AppRoot {
  @Element() thisComponentElement: HTMLElement;
  @State() isLoadingIndicatorShown = false;

  componentWillLoad() {
    AuthService.verifyEmailLink(location.href);
  }

  componentDidLoad() {
    this.setAppUXServiceProperties();
  }

  private setAppUXServiceProperties() {
    UXService.setAppRootElement(this.thisComponentElement);
    UXService.setAppRootReference(this);
  }

  private async logout() {
    RouteService.appMenu.close();
    await AuthService.logout();
    RouteService.routerElement.push('/login');
  }

  async openRouteMenu(route: string){
    await RouteService.routerElement.push(route);
    RouteService.appMenu.close();
  }

  renderMenu() {
    return (
      <ion-menu side="start" type='overlay' menuId='menu' contentId="main" ref={(menuRef) => {RouteService.appMenu = menuRef}}>
        <ion-header>
          <ion-toolbar color="primary">
            <ion-title>Menu</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <ion-list>
            <ion-item lines='none' button onClick={() => this.openRouteMenu('/')}>
              <ion-icon name="home-outline" slot="start"></ion-icon>
              <ion-label>Painel</ion-label>
            </ion-item>
            <ion-item-divider class='ion-padding-top'>Configurações</ion-item-divider>
            <ion-item lines='none' button>
              <ion-icon name="person-outline" slot="start"></ion-icon>
              <ion-label>Minha Conta</ion-label>
            </ion-item>
            <ion-item lines='none' button onClick={() => this.logout()}>
              <ion-icon name="log-out-outline" slot="start"></ion-icon>
              <ion-label>Sair</ion-label>
            </ion-item>
          </ion-list>
        </ion-content>
      </ion-menu>
    )
  }

  renderRoute(){
    return (
      <ion-router useHash={false} ref={(routerRef) => {RouteService.appRouter = routerRef}}>
        <ion-route url="/" component="app-home" />
        <ion-route url="/login" component="app-login" />
        <ion-route url="/create-account" component="app-create-account" />
        <ion-route url=":any" component="app-path-not-found" />
      </ion-router>
    )
  }

  renderLoadingIndicator() {
    return (
      !!this.isLoadingIndicatorShown
      ? <ion-progress-bar type='indeterminate' class='progress-bar' color='secondary'></ion-progress-bar>
      : ''
    )
  }
  
  render() {
    return (
      <ion-app>
        {this.renderLoadingIndicator()}
        {this.renderRoute()}
        {this.renderMenu()}
        <ion-content id="main">
          <ion-nav></ion-nav>
        </ion-content>
      </ion-app>
    );
  }
}

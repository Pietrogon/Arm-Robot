class RouteServiceController {
  private _appMenu: HTMLIonMenuElement;
  private _appRouter: HTMLIonRouterElement;

  set appMenu(value: HTMLIonMenuElement) {
    this._appMenu = value;
  }

  get appMenu() {
    return this._appMenu;
  }

  set appRouter(value: HTMLIonRouterElement) {
    this._appRouter = value;
  }

  get appRouter() {
    return this._appRouter;
  }

  get routerElement(): HTMLIonRouterElement {
    return document.querySelector('ion-router');
  }

  get publicPath() {
    return 'https://markia.com.br/';
  }

  imgPath(name) {
    return this.publicPath + 'assets/img/' + name;
  }

  illustrationPath(name) {
    return this.publicPath + 'assets/illustration/' + name;
  }
}

export const RouteService = new RouteServiceController();
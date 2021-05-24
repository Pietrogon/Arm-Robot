import { AppRoot } from "../components/app-root/app-root";

class UXServiceProvider {
  private _isLoadingIndicatorShown: boolean;
  private _appRootReference: AppRoot;

  public showLoadingIndicator() {
    this._appRootReference.isLoadingIndicatorShown = true;
  }

  public hideLoadingIndicator() {
    this._appRootReference.isLoadingIndicatorShown = false;
  }

  public setAppRootElement(appRootElement: HTMLElement) {
    console.log(appRootElement);
    
    // this._appRootElement = appRootElement;
  }

  get isLoadingIndicatorShown(): boolean {
    return this._isLoadingIndicatorShown;
  }

  public setAppRootReference(appRootReference: AppRoot) {
    this._appRootReference = appRootReference;
  }
}

export const UXService = new UXServiceProvider();
import { Component, h, Listen } from "@stencil/core";
import { PLATFORM } from "../../enums/platform.enum";

@Component({
  tag: 'comp-loading',
  styleUrl: 'comp-loading.css'
})
export class CompLoading{
  width: number;

  componentWillLoad(){
    this.windowResize()
  }

  @Listen('resize', { target: 'window' })
  windowResize() {
    this.width = window.innerWidth;
  }

  render(){
    return (
      <div class='loading'>
        <ion-card class={this.width > PLATFORM.MOBILE_SIZE_WIDTH ? 'web' : 'mobile '}>
          <ion-card-content>
            <ion-grid>
              <ion-row>
                <ion-col>
                  <h1>ARM<ion-text color='secondary'>ROBOT</ion-text></h1>
                </ion-col>
              </ion-row>
              <ion-row>
                <ion-col class='ion-text-center'>
                  <ion-progress-bar type="indeterminate" color='secondary'></ion-progress-bar>
                </ion-col>
              </ion-row>
            </ion-grid>
          </ion-card-content>
        </ion-card>
      </div>
    )
  }
}
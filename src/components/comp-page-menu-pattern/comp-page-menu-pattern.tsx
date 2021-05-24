import { Component, h, Listen, Prop, State } from "@stencil/core";
import { PLATFORM } from "../../enums/platform.enum";
import { AuthService } from "../../services/auth.service";

@Component({
  tag: 'comp-page-menu-pattern',
  styleUrl: 'comp-page-menu-pattern.css'
})
export class CompPageMenuPattern {
  @Prop() titlePage: string;
  @State() height: number;
  @State() width: number;

  componentWillLoad(){
    this.windowResize();
  }

  @Listen('resize', { target: 'window' })
  windowResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }
  
  render(){
    return [
      <comp-permission>
        <ion-header>
          <ion-toolbar color="primary">
            <ion-buttons slot="start">
              <ion-menu-button></ion-menu-button>
            </ion-buttons>
            {!this.titlePage ? <ion-title>ARM<ion-text color='secondary'>ROBOT</ion-text></ion-title> : <ion-title>{this.titlePage}</ion-title>}
            <ion-buttons slot="end">
              <ion-button>
                <ion-label>{AuthService.formattedName()}</ion-label>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <div class='content' style={{
          'height': `${this.height - 56}px`,
          'max-width': `${PLATFORM.WEB_SIZE_WIDTH}px`
        }}>
          <slot></slot>
        </div>
      </comp-permission>
    ]
  }
}
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  triangle,
  ellipse,
  square,
  home,
  homeOutline,
  copy,
  copyOutline,
  download,
  downloadOutline,
} from 'ionicons/icons';
import { SharedDirectivesModule } from 'src/app/shared/directives/shared-directives.module';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel,
    SharedDirectivesModule,
  ],
})
export class TabsPage {
  @ViewChild(IonTabs) tabs!: IonTabs;
  selected: any = '';

  public imageBaseUrl = 'https://image.tmdb.org/t/p';
  constructor() {
    addIcons({
      triangle,
      ellipse,
      square,
      home,
      homeOutline,
      copy,
      copyOutline,
      download,
      downloadOutline,
    });
  }

  setSelectedTab() {
    if (this.tabs) {
      this.selected = this.tabs!.getSelected();
    }
  }
}

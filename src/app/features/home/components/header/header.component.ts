import { Component, OnInit, inject } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonRow,
  IonCol,
  IonIcon,
} from '@ionic/angular/standalone';
import { SharedDirectivesModule } from 'src/app/shared/directives/shared-directives.module';
import { addIcons } from 'ionicons';
import {
  caretDownOutline,
  menuOutline,
  settings,
  add,
  informationCircleOutline,
  play,
  chevronForward,
  person,
  personCircle,
  heart,
  heartOutline,
  search,
} from 'ionicons/icons';
import { RouterModule } from '@angular/router';
import { UiService } from 'src/app/shared/services/ui.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    IonIcon,
    IonCol,
    IonRow,
    IonHeader,
    IonToolbar,
    RouterModule,
    SharedDirectivesModule,
  ],
})
export class HeaderComponent implements OnInit {
  protected uiService = inject(UiService);
  constructor() {
    addIcons({
      search,
      personCircle,
      play,
      informationCircleOutline,
      chevronForward,
      menuOutline,
      caretDownOutline,
      add,
      person,
      settings,
      heart,
      heartOutline,
    });
  }

  ngOnInit() {}
}

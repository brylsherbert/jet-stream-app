import { inject, Injectable } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular/standalone';
import { AuthComponent } from '../components/auth/auth.component';
@Injectable({
  providedIn: 'root',
})
export class UiService {
  private modalController = inject(ModalController);
  private alertController = inject(AlertController);
  constructor() {}

  async loginAlert() {
    const alert = await this.alertController.create({
      header: 'Login Required',
      subHeader: 'Access Restricted',
      message: 'Please log in to continue.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert-cancel',
        },
        {
          text: 'OK',
          handler: () => {
            this.openAuthModal();
          },
          cssClass: 'alert-ok',
        },
      ],
      cssClass: 'custom-alert',
    });

    await alert.present();
  }

  async openAuthModal() {
    const modal = await this.modalController.create({
      component: AuthComponent,
    });
    return await modal.present();
  }
}

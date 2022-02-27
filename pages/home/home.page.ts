import { Component } from '@angular/core';
import { SleepService } from '../../services/sleep.service';
import { SleepData } from '../../data/sleep-data';
import { OvernightSleepData } from '../../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../../data/stanford-sleepiness-data';

import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { ViewPage } from '../view/view.page';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
	startTime:string = null
	endTime:string = null
	
	degree:number = null
	sleepinessTime:string = null
	sleepinessList:string[] = StanfordSleepinessData.ScaleValues.slice(1)

	constructor(private sleepService:SleepService, private alertController: AlertController, private toastController: ToastController) {

	}

	ngOnInit() {
		// console.log(this.allSleepData);
		// for (let s of this.allSleepData)
		// {
		// 	console.log(s.id)
		// }
	}

	/* Ionic doesn't allow bindings to static variables, so this getter can be used instead. */


	logEvent() {
		if (this.startTime == null || this.endTime == null)
		{
			this.emptyFieldAlert('Overnight Sleep')
			return
		}

		if (this.endTime < this.startTime)
		{
			this.illegalTimeAlert()
			return
		}

		let sleepData = new OvernightSleepData(new Date(this.startTime), new Date(this.endTime))
		// console.log(sleepData.summaryString())
		this.sleepService.logOvernightData(sleepData)
		this.presentToast("Overnight Sleep");

		console.log(SleepService.sleepMap)

		// console.log(this.allSleepData);
	}

	sleepinessLog() {
		if (this.sleepinessTime == null || this.degree == null)
		{
			this.emptyFieldAlert('Sleepiness');
			return
		}

		let sleepinessData = new StanfordSleepinessData(this.degree, new Date(this.sleepinessTime))
		this.sleepService.logSleepinessData(sleepinessData)
		this.presentToast("Sleepiness Data");

		// console.log(this.allSleepData);
	}

	async emptyFieldAlert(err) {
		const alert = await this.alertController.create({
			header: 'Try Again!',
			message: 'One of the '+err+' time fields is empty',
			buttons: ['OK']
		});

		await alert.present();
	}

	async illegalTimeAlert() {
		const alert = await this.alertController.create({
			header: 'Try Again!',
			message: 'End Time end before Start Time',
			buttons: ['OK']
		});

		await alert.present();
	}

	async presentToast(message) {
		const toast = await this.toastController.create({
			message: message+' Logged Successfully!',
			duration: 2000,
			color: 'success'
		});

		await toast.present();
	}

	get allSleepData() {
		return SleepService.AllSleepData;
	}

	

}

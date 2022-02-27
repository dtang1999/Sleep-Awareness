import { Injectable } from '@angular/core';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { Storage } from '@ionic/storage'
import { KeyedWrite } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class SleepService {
	private static LoadDefaultData:boolean = true;
	public static AllSleepData:SleepData[] = [];
	public static AllOvernightData:OvernightSleepData[] = [];
	public static AllSleepinessData:StanfordSleepinessData[] = [];

	public static sleepMap = new Map()

	


	constructor(private storage:Storage) {
		storage.create()

	// 	if(SleepService.LoadDefaultData) {
	// 		this.addDefaultData();
	// 	SleepService.LoadDefaultData = false;
	// }
		this.loadFromStorage();
	}



	private addDefaultData() {
		this.logOvernightData(new OvernightSleepData(new Date('February 18, 2021 01:03:00'), new Date('February 18, 2021 09:25:00')));
		this.logSleepinessData(new StanfordSleepinessData(4, new Date('February 19, 2021 14:38:00')));
		this.logOvernightData(new OvernightSleepData(new Date('February 20, 2021 23:11:00'), new Date('February 21, 2021 08:03:00')));
	}

	public logOvernightData(sleepData:OvernightSleepData) {
		// console.log(this.overStorage)
		this.storage.set(sleepData.id, sleepData);
		SleepService.AllSleepData.push(sleepData);
		SleepService.AllOvernightData.push(sleepData);
		SleepService.sleepMap.set(sleepData, sleepData.id)
	}

	public logSleepinessData(sleepData:StanfordSleepinessData) {
		this.storage.set(sleepData.id, sleepData);
		SleepService.AllSleepData.push(sleepData);
		SleepService.AllSleepinessData.push(sleepData);
		SleepService.sleepMap.set(sleepData, sleepData.id)
	}

	private loadFromStorage() {

		this.storage.forEach((key, value, index) => {
			let sleep = null
			if (key.sleepStart)
			{
				sleep = new OvernightSleepData(key.sleepStart, key.sleepEnd)
				SleepService.AllOvernightData.push(sleep)
			}
			else
			{
				sleep = new StanfordSleepinessData(key.loggedValue, key.loggedAt)
				SleepService.AllSleepinessData.push(sleep)
			}
			SleepService.AllSleepData.push(sleep)
			SleepService.sleepMap.set(sleep, value)
			// console.log(SleepService.AllSleepData)
		})

		// this.sleepyStorage.forEach((key) => {
		// 	console.log(key)
		// 	SleepService.AllSleepData.push(new StanfordSleepinessData(key.loggedValue, key.loggedAt))
		// 	SleepService.AllSleepinessData.push(new StanfordSleepinessData(key.loggedValue, key.loggedAt))
		// })
		
	}

	public removeSingle(item, id) {
		for (let i = 0; i < SleepService.AllSleepData.length; i++)
		{
			if (SleepService.AllSleepData[i] == item)
			{
				SleepService.AllSleepData.splice(i, 1)
			}
		}
		this.storage.remove(id)
		SleepService.sleepMap.delete(item)
	}

	public clearAllStorage() {
		this.storage.clear();
		SleepService.AllOvernightData = []
		SleepService.AllSleepinessData = []
		SleepService.AllSleepData = []
		console.log(SleepService.AllSleepData)
	}
}

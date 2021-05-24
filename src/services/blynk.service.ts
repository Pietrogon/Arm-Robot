import { firestore, functions } from "../firebase";
import { CommandAdmin } from "../interfaces/commandAdmin.interface";

export class BlynkService {
	private _commandAdmin: CommandAdmin = {} as CommandAdmin;

	constructor(uidDevice: string) {
		this._commandAdmin = {...this._commandAdmin, uidDevice: uidDevice};
	}

  public observer(pin: string, execute: (result: CommandAdmin) => void) {
    return this.loadDeviceWithObserver(pin, execute);
	}
	
	private loadDeviceWithObserver(pin: string, execute?: (result: CommandAdmin) => void){
		return firestore.collection('pins').where('uidDevice', '==', this._commandAdmin.uidDevice).get().then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				let command = doc.data() as CommandAdmin;
				this._commandAdmin = {...this._commandAdmin, uid: command.uid};
				if (command.pin.localeCompare(pin) == 0){
					return firestore.doc(`pins/${this._commandAdmin.uid}`).onSnapshot((result) => {
						execute && execute(result.data() as CommandAdmin);
					});
				}
			})
		});
	}

  async update(pin: string, value: string){
		this._commandAdmin = {...this._commandAdmin, pin: pin, value: value, type: 'update'};
		let httpsService = await functions.httpsCallable('httpsService');
		httpsService({text: JSON.stringify(this._commandAdmin)});
		this.updatePinFirestore();
    return this.loadPin(this._commandAdmin.pin); 
	}
	
	async loadPin(pin: string){
		this._commandAdmin = {...this._commandAdmin, pin: pin, type: 'get'};
    let httpsService = functions.httpsCallable('httpsService');
    return await httpsService({text: JSON.stringify(this._commandAdmin)}).then((result) => {
      return result.data[0];
    });
	}

	public setPinFirestore(command: CommandAdmin){
    return firestore.collection(`pins`).add(command).then(
			(record) => {
				console.log(record);
				this._commandAdmin = {...command, uid: record.id}
				this.updatePinFirestore();
			}
		).catch((err) => {
			console.log(err);			
		});
	}

	private updatePinFirestore(){
		if (!!this._commandAdmin.uid){
			return firestore.doc(`pins/${this._commandAdmin.uid}`).set(this._commandAdmin);
		}else{
			firestore.collection('pins').where('uidDevice', '==', this._commandAdmin.uidDevice).get().then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					let command = doc.data() as CommandAdmin;
					this._commandAdmin = {...this._commandAdmin, uid: command.uid};
					if (command.pin.localeCompare(this._commandAdmin.pin) == 0){
						return firestore.doc(`pins/${command.uid}`).set(this._commandAdmin);
					}
				})
			});
		}
	}
}
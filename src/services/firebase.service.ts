import { firestore } from "../firebase";

export class FirebaseServiceProvider {

	async add({collection, data, onSuccess, onError}: {
    data: any,
    collection: string;
    onSuccess?: (pricing: any) => void,
    onError?: (error) => void
  }) {
    let recordData: any;
    await firestore.collection(collection).add(data).then( async (record) => {
      recordData = {...data, id: record.id}
      await firestore.doc(`${collection}/${recordData.id}`).set(recordData).then(async () => {
        !!onSuccess && await onSuccess(recordData);
      }).catch(async (error) => {
        !!onError && await onError(error);
      });
		}).catch(async (error) => {
      !!onError && await onError(error);
    });
  }

  async update({collection, data, onSuccess, onError}: {
    data: any,
    collection: string;
    onSuccess?: (pricing: any) => void,
    onError?: (error) => void
  }) {
    await firestore.doc(`${collection}/${data.id}`).set(data).then(async () => {
      !!onSuccess && await onSuccess(data);
    }).catch(async (error) => {
      !!onError && await onError(error);
    });
  }

}

export const FirebaseService = new FirebaseServiceProvider();
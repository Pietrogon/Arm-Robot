import firebase from 'firebase/app';
import { auth, firestore } from '../firebase';
import { User } from "../interfaces/user.interface";

export class AuthServiceProvider {
  private observerController;
  private _user: User = this.genericUser;
  private onUserStateChangedController = false;

	constructor(){    
    this.onUserStateChanged({
      online: (user) => {
        this._user = {status: !!user} as User;
        this.loadUser(user);
      },
      offline: (user) => {
        this._user = {...this.genericUser, status: !!user} as User;
      },
    });
  }

	get genericUser(): User{
		return {
			photoURL: 'https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y'
		} as User;
	}

	get user(): User {
    return this._user;
	}
	
  /**
  * Observa quando o User muda o status de atividade.
  * 
  * @param online Faz a chamada quando o usuario ficar online.
  * @param offline Faz a chamada quando o usuário ficar offline.
  * @param all Faz a chamada em qualquer state do usuario.
  */
	public onUserStateChanged({online, offline, all}: {
			online?: (user: firebase.User) => void,
			offline?: (user: firebase.User) => void,
			all?: (user) => void
		}){
    !!this._user.uid && all && all(this._user);
    if (!this._user.uid) this.onUserStateChangedController = true;
		return auth.onAuthStateChanged((user) => {
			!!user
			? online && online(user)
			: offline && offline(user);
      this.onUserStateChangedController && all && all(user);
      this.onUserStateChangedController = true;
		});
	}

	private loadUser(user: firebase.User){
    return firestore.doc(`users/${user.uid}`).get().then((doc) => {
      !!doc.exists
       ? this._user = {...doc.data() as User, status: !!user}
       : this.pushUserInFirestore(user);
    });
  }

	private pushUserInFirestore(user: firebase.User){
    this.userAuthToFirestore(user);
    this._user = {...this.user};
    delete this._user.password;
    delete this._user.status;
    return firestore.doc(`users/${this.user.uid}`).set(this.user);
  }

	private userAuthToFirestore(user: firebase.User){
    this._user = {
      uid: user.uid,
      email: user.email || this._user.email,
      nameFirst: !!user.displayName ? user.displayName.split(' ')[0] : this._user.nameFirst,
      nameLast: !!user.displayName ? user.displayName.substr(user.displayName.indexOf(' '), user.displayName.length) : this._user.nameLast,
      photoURL: !!user.photoURL ? user.photoURL : this.genericUser.photoURL,
      ...this.user,
    } as User;
  }
  
  /**
  * Observa quando o existe alguma alteração no usuário e quando ele muda o status de atividade.
  * 
  * Recomendado iniciar @Prop / @State user utilizando o AuthService.user.
  * * @Prop() user: User = AuthService.user;
  * * @State() user: User = AuthService.user;
  */
  public async userObserver(execute: () => void) {
    this.stopUserObserver();
    this.onUserStateChangedController = false;
    this.onUserStateChanged({
      all: (currentUser) => this.loadUserWithObserver(currentUser, execute)
    });
  }

  public stopUserObserver(){
    try{this.observerController();}catch{}
  }

  private async loadUserWithObserver(user, execute?: () => void){
    if (!!user){
      let controller = false;
      await firestore.doc(`users/${user.uid}`).get().then(async (doc) => {
        if (!!doc.data()) this._user = {...doc.data() as User, status: !!user};
        execute && execute();
        console.log('Observer: get');
      });
      this.observerController = await firestore.doc(`users/${user.uid}`).onSnapshot((doc) => {
        if (controller) {
          this._user = {...doc.data() as User, status: !!user};
          execute && execute();
          console.log('Observer: onSnapshot');    
        }  
        controller = true;
      });
    }
  }

  private pushUser(user: User){
    this._user = {...user};
    return this.pushUserInFirestore(auth.currentUser);
	}
	
	public createUserWithEmailAndPassword({userData, onSuccess, onError} : {
    userData: User,
    onSuccess?: (user: User) => void,
    onError?: (error) => void
  }) {
    auth.createUserWithEmailAndPassword(userData.email, userData.password).then(async () => {
      await this.pushUser(userData);
			onSuccess && onSuccess(this._user);
    }).catch((error) => {
      onError && onError(error);
    });
	}
	
  public loginWithEmailAndPassword({email, password, onSuccess, onError} : {
    email: string,
    password: string,
    onSuccess?: () => void,
    onError?: (error) => void
  }) {
    auth.signInWithEmailAndPassword(email, password).then(() => {
      onSuccess && onSuccess();
    }).catch((error) => {
      onError && onError(error);
    });
	}

	public formattedName(): string {
    return this.user.nameFirst + this.user.nameLast;
  }
  
  private async updateUserAuthProfile({displayName, photoURL, onSuccess, onError} : {
    displayName: string,
    photoURL: string,
    onSuccess?: () => void,
    onError?: (error) => void
  }) {
    await auth.currentUser.updateProfile({
      displayName: displayName,
      photoURL: photoURL
    }).then(() => {
      onSuccess && onSuccess();
    }).catch((error) => {
      onError && onError(error);
    });
  }

  private async updateUserAuthEmail({email, onSuccess, onError} : {
    email: string,
    onSuccess?: () => void,
    onError?: (error) => void
  }) {
    await auth.currentUser.updateEmail(email)
    .then(() => {
      onSuccess && onSuccess();
    }).catch((error) => {
      onError && onError(error);
    });
  }
  
  private async updateUserAuthPassword({password, onSuccess, onError} : {
    password: string,
    onSuccess?: () => void,
    onError?: (error) => void
  }) {
    await auth.currentUser.updatePassword(password)
    .then(() => {
      onSuccess && onSuccess();
    }).catch((error) => {
      onError && onError(error);
    });
  }

  private async reauthenticateWithCredential(email: string, currentPassword: string){
    let credential = await firebase.auth.EmailAuthProvider.credential(
      email,
      currentPassword
    ); 
    return auth.currentUser.reauthenticateWithCredential(credential);
  }

  public async updateUser ({userData, currentPassword, currentEmail, onSuccess, onError} : {
    userData: User,
    currentPassword: string,
    currentEmail: string,
    onSuccess?: () => void,
    onError?: (error) => void
  }) {
    let getError;
    await this.reauthenticateWithCredential(currentEmail, currentPassword).then(async () => {
      (!!userData.nameFirst || !!userData.nameLast || !!userData.photoURL) && await this.updateUserAuthProfile({
        displayName: userData.nameFirst + userData.nameLast,
        photoURL: userData.photoURL,
        onError: (error) => {getError = error;}
      });

      await this.reauthenticateWithCredential(currentEmail, currentPassword)
  
      !!userData.email && await this.updateUserAuthEmail({
        email: userData.email,
        onError: async (error) => {
          getError = error;
          await this.reauthenticateWithCredential(currentEmail, currentPassword);
          (!!userData.nameFirst || !!userData.nameLast || !!userData.photoURL) && await this.updateUserAuthProfile({
            displayName: this._user.nameFirst + this._user.nameLast,
            photoURL: this._user.photoURL,
            onError: (error) => {getError = error;}
          });
        }
      });

      await this.reauthenticateWithCredential(!!userData.email ? userData.email : currentEmail, currentPassword)
  
      !!userData.password && await this.updateUserAuthPassword({
        password: userData.password,
        onError: async (error) => {
          getError = error;
          await this.reauthenticateWithCredential(!!userData.email ? userData.email : currentEmail, currentPassword);
          (!!userData.nameFirst || !!userData.nameLast || !!userData.photoURL) && await this.updateUserAuthProfile({
            displayName: this._user.nameFirst + this._user.nameLast,
            photoURL: this._user.photoURL,
          });
          await this.reauthenticateWithCredential(!!userData.email ? userData.email : currentEmail, currentPassword);
          !!userData.email && await this.updateUserAuthEmail({
            email: this._user.email
          });
        }
      });
    })
    .catch((error) => {
      getError = error;
    });

    !!getError
     ? onError && onError(getError)
     : onSuccess && onSuccess();

    !getError && (this._user = {...this.user, ...userData});
    !getError && this.pushUserInFirestore(auth.currentUser);
  }
 
  public userDelete({onSuccess, onError} : {
    onSuccess?: () => void,
    onError?: (error) => void
  }) {
    auth.currentUser.delete()
    .then(() => {
      onSuccess && onSuccess();
    }).catch((error) => {
      onError && onError(error);
    });
  }

  public sendEmailVerification({onSuccess, onError} : {
    onSuccess?: () => void,
    onError?: (error) => void
  }) {
    auth.currentUser.sendEmailVerification()
    .then(() => {
      onSuccess && onSuccess();
    }).catch((error) => {
      onError && onError(error);
    });
  }

  public async verifyEmailLink(url: string) {
    auth.signInWithEmailLink(url).catch(() => {
      let email = localStorage.getItem('emailForSignIn');
      
      if (!email) {
        // email = window.prompt('Please provide your email');
        //console.error('fallback para quando não há email ainda')
      }else{
        auth.signInWithEmailLink(email, url).catch(() => {
          //Tratar erro futuramente
        });
      }
      
      if (history && history.replaceState) {
        history.replaceState({}, document.title, url.split('?')[0]);
      }
    });
  }

  public loginGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.providerHandler(provider);
  }

  private providerHandler(provider: any) {
    return auth.signInWithPopup(provider);
  }

  public logout() {
    return auth.signOut();
  }
}

export const AuthService = new AuthServiceProvider();
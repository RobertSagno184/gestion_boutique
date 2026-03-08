import { Injectable, signal, computed } from '@angular/core';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseFirestore } from './firebase.config';
import { User, UserProfile } from '../../models/user.model';
import { Observable, from, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = getFirebaseAuth();
  private firestore = getFirebaseFirestore();
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  currentUser = signal<User | null>(null);
  isAuthenticated = computed(() => this.currentUser() !== null);

  constructor() {
    this.initAuthState();
  }

  private initAuthState(): void {
    onAuthStateChanged(this.auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const user = await this.getUserProfile(firebaseUser.uid);
        this.currentUser.set(user);
        this.currentUserSubject.next(user);
      } else {
        this.currentUser.set(null);
        this.currentUserSubject.next(null);
      }
    });
  }

  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = await this.getUserProfile(userCredential.user.uid);
      this.currentUser.set(user);
      return user;
    } catch (error: any) {
      let errorMessage = 'Erreur lors de la connexion';
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Email ou mot de passe incorrect';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Format d\'email invalide';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'Ce compte a été désactivé';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'La connexion par email/mot de passe n\'est pas activée dans la console Firebase.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Trop de tentatives échouées. Veuillez réessayer plus tard.';
      } else if (error.code === 'auth/invalid-api-key') {
        errorMessage = 'Clé API Firebase invalide.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      console.error('Erreur Firebase Login:', error);
      throw new Error(errorMessage);
    }
  }

  async register(email: string, password: string, displayName: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      
      // Mettre à jour le profil Firebase
      await updateProfile(userCredential.user, { displayName });

      // Créer le profil dans Firestore
      const userProfile: UserProfile = {
        uid: userCredential.user.uid,
        email: email,
        displayName: displayName,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(doc(this.firestore, 'users', userCredential.user.uid), userProfile);

      const user: User = {
        uid: userCredential.user.uid,
        email: email,
        displayName: displayName,
        createdAt: new Date(),
        role: 'user'
      };

      this.currentUser.set(user);
      return user;
    } catch (error: any) {
      // Gestion d'erreurs Firebase plus détaillée
      let errorMessage = 'Erreur lors de la création du compte';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Cet email est déjà utilisé';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email invalide';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'L\'inscription par email/mot de passe n\'est pas activée. Vérifiez la configuration Firebase.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Le mot de passe est trop faible (minimum 6 caractères)';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Erreur de connexion réseau';
      } else if (error.code === 'auth/invalid-api-key') {
        errorMessage = 'Clé API Firebase invalide. Vérifiez votre configuration.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      console.error('Erreur Firebase Auth:', error);
      throw new Error(errorMessage);
    }
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    this.currentUser.set(null);
  }

  private async getUserProfile(uid: string): Promise<User> {
    const userDoc = await getDoc(doc(this.firestore, 'users', uid));
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        uid: data['uid'],
        email: data['email'],
        displayName: data['displayName'],
        photoURL: data['photoURL'],
        createdAt: data['createdAt']?.toDate() || new Date(),
        role: data['role'] || 'user'
      };
    }

    // Fallback si le profil n'existe pas encore
    const firebaseUser = this.auth.currentUser;
    if (firebaseUser) {
      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || undefined,
        photoURL: firebaseUser.photoURL || undefined,
        createdAt: new Date(),
        role: 'user'
      };
    }

    throw new Error('User not found');
  }
}

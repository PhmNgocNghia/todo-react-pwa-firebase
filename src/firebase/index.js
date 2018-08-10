import firebase from 'firebase';

import 'firebase/auth/dist/index.cjs';
import 'firebase/database/dist/index.cjs';

import { firebaseConfig } from './config';


export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const firebaseAuth = firebase.auth();
export const firebaseDb = firebase.database();

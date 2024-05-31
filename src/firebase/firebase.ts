import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBIK2iLDXVJGyt8dvAT_ax_hV-ILOPemzs',
  authDomain: 'kuura-4fbc4.firebaseapp.com',
  databaseURL:
    'https://kuura-4fbc4-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'kuura-4fbc4',
  storageBucket: 'kuura-4fbc4.appspot.com',
  messagingSenderId: '234707873023',
  appId: '1:234707873023:web:6155145e4151a581b9b0ca',
  measurementId: 'G-8DK5D7C2JL',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

export { auth, db }

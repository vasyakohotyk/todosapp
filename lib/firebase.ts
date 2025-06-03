import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBE4IElQhnYJjbYAwNOd6s6ZJdluojDIOI",
  authDomain: "todoapp-4e95e.firebaseapp.com",
  projectId: "todoapp-4e95e",
  storageBucket: "todoapp-4e95e.firebasestorage.app",
  messagingSenderId: "142655680060",
  appId: "1:142655680060:web:f7388cc7db3d1805859d39",
  measurementId: "G-5GFYKYX3BJ",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export default app

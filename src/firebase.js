import { initializeApp } from "firebase/app";
import { getFirestore} from "@firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBzh-eqVuSuHhoR4CrjLssI3ICvprn8STQ",
    authDomain: "baby-shower-259ca.firebaseapp.com",
    projectId: "baby-shower-259ca",
    storageBucket: "baby-shower-259ca.appspot.com",
    messagingSenderId: "250036459034",
    appId: "1:250036459034:web:7a1436ba9a2ea3f2ed23a3",
    measurementId: "G-YNGJS84184"
  };
  
  export const app = initializeApp(firebaseConfig);
  export const firestore = getFirestore(app);


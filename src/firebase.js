import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC7x4ERHbGllvDspxYpHzSPC0Mue36k_AA",
  authDomain: "employeeleavemanagements-68e10.firebaseapp.com",
  projectId: "employeeleavemanagements-68e10",
  storageBucket: "employeeleavemanagements-68e10.appspot.com",
  messagingSenderId: "1051261609924",
  appId: "1:1051261609924:web:cad9c0c6e585e175096691",
  measurementId: "G-NT126NF20K",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// const analytics = getAnalytics(app);

export { app, auth };

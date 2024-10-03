import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// const firebaseConfig = {
//   apiKey: "AIzaSyC7x4ERHbGllvDspxYpHzSPC0Mue36k_AA",
//   authDomain: "employeeleavemanagements-68e10.firebaseapp.com",
//   databaseURL:
//     "https://employeeleavemanagements-68e10-default-rtdb.firebaseio.com",
//   projectId: "employeeleavemanagements-68e10",
//   storageBucket: "employeeleavemanagements-68e10.appspot.com",
//   messagingSenderId: "1051261609924",
//   appId: "1:1051261609924:web:cad9c0c6e585e175096691",
//   measurementId: "G-NT126NF20K",
// };

const firebaseConfig = {
  apiKey: "AIzaSyBI3CfiSECWoPnpNUvUOVWZ7qZn2N8eeJ8",
  authDomain: "leave-management-system-138b1.firebaseapp.com",
  databaseURL: "https://leave-management-system-138b1-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "leave-management-system-138b1",
  storageBucket: "leave-management-system-138b1.appspot.com",
  messagingSenderId: "1072021421405",
  appId: "1:1072021421405:web:64f19c14aea3e639e6fcb4"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { app, auth, database };

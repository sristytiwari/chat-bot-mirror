import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyC9OIjbImlE76VC9UKmpMs0WdRcMmKid2E",
  authDomain: "chat-bot-3c3a8.firebaseapp.com",
  projectId: "chat-bot-3c3a8",
  storageBucket: "chat-bot-3c3a8.appspot.com",
  messagingSenderId: "811877671951",
  appId: "1:811877671951:web:ffd75c450dde46826aef7a",
};

const FirebaseApp = initializeApp(firebaseConfig);

export default FirebaseApp;

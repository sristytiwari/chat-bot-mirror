import FirebaseApp from "./FirebaseApp";
import {
  getDatabase,
  ref,
  onValue,
  child,
  update,
  push,
  get,
} from "firebase/database";

const FirebaseRDB = getDatabase(FirebaseApp);

const getData = (path) => {
  return get(child(FirebaseRDB, path)).then((snapshot) => {
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null;
    }
  });
};

const pushData = (path, object) => {
  const newPostKey = push(child(ref(FirebaseRDB), path)).key;

  const updates = {};

  updates[path + newPostKey] = object;

  return update(ref(FirebaseRDB), updates);
};

const listenToData = (path, callback = () => {}) => {
  const starCountRef = ref(FirebaseRDB, path);

  onValue(starCountRef, (snapshot) => {
    const data = [];

    snapshot.forEach((item) => {
      data.push({
        ...item.val(),
        messageId: item.key,
      });
    });

    callback(data);
  });
};

export default { getData, pushData, listenToData };

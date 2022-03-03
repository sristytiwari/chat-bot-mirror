// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

const usersPath = "/users/";

exports.addChatBotMessage = functions.database
  .ref(`${usersPath}{messageId}`)
  .onCreate((snapshot) => {
    const messagePayload = snapshot.val();
    if (messagePayload.senderId === "user") {
      return admin
        .database()
        .ref(usersPath)
        .push({
          ...messagePayload,
          senderId: "bot",
          createdAt: admin.database.ServerValue.TIMESTAMP,
        });
    } else {
      return Promise.resolve();
    }
  });

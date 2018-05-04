// Initialize Firebase
// TODO: Replace with your project's customized code snippet
var config = {
  apiKey: "AIzaSyA-PKjJLMCcvi5UMS1h_FO5-64lWJZJqHE",
  authDomain: "dojoball-1571e.firebaseapp.com",
  databaseURL: "https://dojoball-1571e.firebaseio.com",
  projectId: "dojoball-1571e",
};

firebase.initializeApp(config);
var database = firebase.database();

console.log(database);

function writeUserData() {
  firebase.database().ref("loic").set({
    highscore: 5
  });
}

writeUserData();

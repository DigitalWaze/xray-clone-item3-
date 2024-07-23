import * as firebase from "firebase";
import "firebase/storage";

// Status = 1  Untouched
// Status = 2 Alotted
// Status = 3 Evaluated

const firebaseConfig = {
  apiKey: "AIzaSyBLXI1rjXZEVRhExcg7foaWXIZZBsuGkR8",
  authDomain: "xray-clone-item3.firebaseapp.com",
  databaseURL: "https://xray-clone-item3.firebaseio.com",
  projectId: "xray-clone-item3",
  storageBucket: "xray-clone-item3.appspot.com",
  messagingSenderId: "896539207861",
  appId: "1:896539207861:web:a040589437b2e4009136fc",
};
let uid = "qMeHOBHKItZVKq7w8nLf6MuIrFh1";
let uid2 = "rW0WKjLa7Ygog0ggEhRfTVpHhXy1";

const baseUrl = "https://xray-backend.codingtier.com";

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var storage = firebase.storage();

export function currentUser() {
  return JSON.parse(localStorage.getItem("userInfo"));
}

async function checkIfCompleted(currentImage) {}

async function UploadImage(img) {
  const data = new FormData();
  data.append("file_name", img.name);
  data.append("file", img);

  try {
    let response = await fetch(baseUrl + "/xray-eval-3/image", {
      method: "POST",
      body: data,
    }).then(async (response) => {
      return response.json();
    });
    console.log("response", response);

    let { url, STORAGE_TYPE_ID } = response;
    let imageUrl = url;
    return { imageUrl, STORAGE_TYPE_ID };
    // Handle response
  } catch (error) {
    console.error("Error occurred:", error);
    throw error;
  }
}
async function UploadImageFirebase(img) {
  var imageUrl = null,
    key = null;
  let storageRef = firebase.storage().ref().child(`xray/${img.name}`);
  await storageRef
    .getMetadata()
    .then((response) => {
      var e = new Error("File already exists!");
      e.name = "ALREADY_EXISTS";
      throw e;
    })
    .catch((err) => {
      if (err.name === "ALREADY_EXISTS") {
        console.log("errr in upload");
        throw err;
      }
      return storageRef.put(img);
    })
    .then((snapshot) => {
      console.log("snap");
      return snapshot.ref.getDownloadURL();
    })
    .then((sanpUrl) => {
      console.log("sanpUrl", sanpUrl);

      //url yahan se milega sanpurl
      imageUrl = sanpUrl;
    });
  return { imageUrl, key };
}

export function uploadObject(ImageObject) {
  // console.log(ImageObject);
  let key = null;
  key = firebase.database().ref("evaluation/").push(ImageObject).key;
  // console.log("successs========>", key)
}

export async function DeleteImageObject(key) {
  firebase.database().ref(`evaluation/${key}`).remove();
  return;
}

export async function DeleteImage(fileName) {
  firebase.storage().ref().child(`xray/${fileName}`).delete();
  return;
}

async function Register(email, password) {
  var result = null;
  await firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((user) => {
      // console.log("user=========>", user)
      result = user;
    });
  return result;
}

export async function GetAllUser() {
  var users = [];
  await firebase
    .auth()
    .listUsers(500, "")
    .then((snapshot) => {
      snapshot.forEach((i) => {
        users.push({ key: i.key, value: i.val() });
      });
    });
  return users;
}

function savedata(email, password, img) {
  // console.log("firebase wala chala")
  var userobject = {
    email,
    password,
    img,
  };
  try {
    var key = firebase.database().ref("Userinfo/").push(userobject).key;
    // console.log("message=========>", key);
  } catch (error) {
    console.log(error.message);
  }
}

async function Authenticate(email, password) {
  let user = null;
  try {
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userinfo) => {
        // console.log("userinfo=========>", userinfo)
        user = {
          email,
          uid: userinfo.user.uid,
          token: userinfo.user.refreshToken,
        };
      });
  } catch (err) {}
  return user;
}
export async function VerifyToken(token) {
  let user = null;
  try {
    await firebase
      .auth()
      .signInWithCustomToken(token)
      .then((userinfo) => {
        // console.log("userinfo=========>", userinfo)
        user = {
          email: userinfo.user.email,
          uid: userinfo.user.uid,
          token: userinfo.user.refreshToken,
        };
      });
  } catch (err) {}
  return user;
}

export async function IsStill() {
  let user = await firebase.auth().currentUser;
  return user != null;
}

export function isAdmin(userId) {
  return userId === uid || userId === uid2;
}
function Logout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      localStorage.setItem("userInfo", null);
    });
}
async function getNewImage(currentImage) {
  // console.log('e')
  let data = null;
  await firebase
    .database()
    .ref()
    .child("evaluation")
    .orderByChild("status")
    .equalTo(1)
    .limitToFirst(1)
    .once("value", (response) => {
      response.forEach((i) => {
        data = { key: i.key, value: i.val() };
      });

      if (data != null) {
        // console.log('chala');

        firebase.database().ref(`/evaluation/${data.key}`).update({
          backImage: currentImage,
          evaluator: currentUser().uid,
          status: "2",
        });

        // console.log(data)

        if (currentImage) {
          firebase.database().ref(`evaluation/${currentImage}`).update({
            nextImage: data.key,
            status: "3",
          });
        }
        // console.log(data.key);
        firebase.database().ref(`/inProc/${currentUser().uid}`).update({
          evalId: data.key,
          lastImage: currentImage,
        });
      }
    });
  return data;
}

export async function getImage(key) {
  var data = null;
  await firebase
    .database()
    .ref()
    .child(`evaluation/${key}`)
    .once("value")
    .then((snapshot) => {
      data = { key: snapshot.key, value: snapshot.val() };
    });
  return data;
}

export async function getMyImage(imageKey) {
  var data = null;
  var userId = currentUser().uid;

  if (imageKey) {
    await firebase
      .database()
      .ref(`/evaluation/${imageKey}`)
      .once("value", async (response) => {
        response.forEach((i) => {
          data = { key: i.key, value: i.val() };
        });

        console.log("data", data);

        if (data.value.evaluator?.toString() !== userId) {
          data = await getMyImage();
          return data;
        }
      });
    return data;
  } else {
    await firebase
      .database()
      .ref(`/inProc/${userId}`)
      .then((response) => {
        var key = null;
        response.forEach((i) => {
          key = i.val();
        });

        console.log("key", key);

        if (key) {
          return firebase
            .database()
            .ref(`/evaluation/${key.evalId}`)
            .once("value");
        }
        return null;
      })
      .then((response) => {
        if (response != null) {
          data = { key: response.key, value: response.val() };
        }
      });
    return data;
  }
}

export async function saveImage(key, value) {
  var result = null;
  await firebase
    .database()
    .ref(`/evaluation/${key}`)
    .set(value, (error) => {
      if (error) {
        // console.log(error);
        result = false;
      }
      let userId = currentUser().uid;
      firebase.database().ref(`/inProc/${userId}`).update({
        evalId: "",
        lastImage: key,
      });

      result = true;
    });
  return result;
}

export async function DeleteCurrentImage(key) {
  await DeleteImageObject(key);
  let userId = currentUser().uid;
  firebase
    .database()
    .ref("/inProc")
    .orderByChild("userId")
    .equalTo(userId)
    .limitToFirst(1)
    .once("value", (snapshot) => {
      snapshot.getRef().remove();
    });
}

export async function getAllMyImages() {
  //var result = null;
  //await firebase.database().ref("/evaluation").
}

export async function getAllEvaluated() {
  var result = [];
  await firebase
    .database()
    .ref("/evaluation")
    .orderByChild("status")
    .equalTo(3)
    .once("value", (snapshot) => {
      snapshot.forEach((i) => {
        result.push(i.val());
      });
    });
  return result;
}

export async function getDefaultRates() {
  var data = null;
  await firebase
    .database()
    .ref("/default-rates")
    .once("value")
    .then((snapshot) => {
      data = { key: snapshot.key, value: snapshot.val() };
    });
  return data;
}

export async function setDefaultRates(config) {
  var b = null;
  await firebase
    .database()
    .ref("/default-rates")
    .update(config, (a) => {
      if (a) {
        b = false;
      }

      b = true;
    });
  return b;
}

export async function setDefaults(
  imageName,
  leftMedial,
  rightMedial,
  leftLateral,
  rightLateral
) {
  var result = null;
  await firebase
    .database()
    .ref("/evaluation/")
    .orderByChild("imageName")
    .equalTo(imageName)
    .once("value")
    .then((snapshot) => {
      var key = null;
      snapshot.forEach((i) => {
        key = i.key;
      });
      if (key == null) {
        return;
      }
      return firebase.database().ref(`/evaluation/${key}`).update({
        d_rightMedial: rightMedial,
        d_rightLateral: rightLateral,
        d_leftMedial: leftMedial,
        d_leftLateral: leftLateral,
      });
    })
    .then((response) => {
      if (response) {
        result = false;
      }
      result = true;
    });

  return result;
}

export async function setPelvisDefaults(
  refnum,
  leftZone1,
  leftZone2,
  leftZone3,
  rightZone1,
  rightZone2,
  rightZone3
) {
  // console.log(leftZone1+ " "+leftZone2+" "+leftZone3)
  // console.log(rightZone1+ " "+rightZone2+" "+rightZone3)

  // console.log(refnum)
  var result = null;
  await firebase
    .database()
    .ref("/evaluation/")
    .orderByChild("RefNum")
    .equalTo(refnum)
    .once("value")
    .then((snapshot) => {
      var key = null;
      snapshot.forEach((i) => {
        key = i.key;
        // console.log(key)
      });
      if (key == null) {
        // console.log('image not found')
        return;
      }
      return firebase
        .database()
        .ref(`/evaluation/${key}`)
        .update({
          LeftHipImage: {
            zone1: leftZone1,
            zone2: leftZone2,
            zone3: leftZone3,
          },
          RightHipImage: {
            zone1: rightZone1,
            zone2: rightZone2,
            zone3: rightZone3,
          },
        });
    })
    .then((response) => {
      if (response) {
        result = false;
      }
      result = true;
    });

  return result;
}

export async function setLeftFrogDefaults(refnum, zone1, zone2, zone3) {
  // console.log(zone1+ " "+zone2+" "+zone3)

  // console.log(refnum)
  var result = null;
  await firebase
    .database()
    .ref("/evaluation/")
    .orderByChild("RefNum")
    .equalTo(refnum)
    .once("value")
    .then((snapshot) => {
      var key = null;
      var ImageName = null;
      var imageUrl = null;
      snapshot.forEach((i) => {
        key = i.key;
        ImageName = i.val().LeftFrogImage.ImageName;
        imageUrl = i.val().LeftFrogImage.imageUrl;
        // console.log(ImageName)
        // console.log(key)
      });
      if (key == null) {
        // console.log('image not found')
        return;
      }
      return firebase
        .database()
        .ref(`/evaluation/${key}`)
        .update({
          LeftFrogImage: {
            zone1: zone1,
            zone2: zone2,
            zone3: zone3,
            imageUrl: imageUrl || "",
            ImageName: ImageName || "",
          },
        });
    })
    .then((response) => {
      if (response) {
        result = false;
      }
      result = true;
    });

  return result;
}

export async function setRightFrogDefaults(refnum, zone1, zone2, zone3) {
  // console.log(zone1+ " "+zone2+" "+zone3)

  // console.log(refnum)
  var result = null;
  await firebase
    .database()
    .ref("/evaluation/")
    .orderByChild("RefNum")
    .equalTo(refnum)
    .once("value")
    .then((snapshot) => {
      var key = null;
      var ImageName = null;
      var imageUrl = null;
      snapshot.forEach((i) => {
        key = i.key;
        // console.log(i.val())
        ImageName = i.val().RightFrogImage.ImageName;
        imageUrl = i.val().RightFrogImage.imageUrl;
        // console.log(ImageName)
      });
      if (key == null) {
        // console.log('image not found')
        return;
      }
      return firebase
        .database()
        .ref(`/evaluation/${key}`)
        .update({
          RightFrogImage: {
            zone1: zone1,
            zone2: zone2,
            zone3: zone3,
            imageUrl: imageUrl || "",
            ImageName: ImageName || "",
          },
        });
    })
    .then((response) => {
      if (response) {
        result = false;
      }
      result = true;
    });

  return result;
}

export {
  Register,
  Authenticate,
  getNewImage,
  storage,
  firebase,
  UploadImage,
  Logout,
};

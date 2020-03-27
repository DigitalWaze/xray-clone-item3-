import * as firebase from 'firebase';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBLXI1rjXZEVRhExcg7foaWXIZZBsuGkR8",
    authDomain: "xray-clone-item3.firebaseapp.com",
    databaseURL: "https://xray-clone-item3.firebaseio.com",
    projectId: "xray-clone-item3",
    storageBucket: "xray-clone-item3.appspot.com",
    messagingSenderId: "896539207861",
    appId: "1:896539207861:web:a040589437b2e4009136fc"
  };
let uid= "qMeHOBHKItZVKq7w8nLf6MuIrFh1";



// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var storage = firebase.storage();

export function currentUser(){
    return JSON.parse(localStorage.getItem("userInfo"));
}
async function UploadImage(img, rightMedial, rightLateral, leftLateral, leftMedial,imageName,isError, comment) {
    var imageUrl =null, key= null;
    let storageRef = firebase.storage().ref().child(`xray/${img.name}`);
    await storageRef.getMetadata().then(response =>{
        var e = new Error("File already exists!");
        e.name="ALREADY_EXISTS";
        throw e;
    }).catch(err =>{
        if(err.name==="ALREADY_EXISTS"){
            throw err;
        }
        return storageRef.put(img)        
    }).then((snapshot) => {
        return snapshot.ref.getDownloadURL();
    }).then((sanpUrl) => {
            //url yahan se milega sanpurl
            imageUrl = sanpUrl;
            console.log(sanpUrl)
            var Image =
            {
                imageUrl,
                rightLateral,
                rightMedial,
                leftMedial,
                leftLateral,
                imageName,
                isError,
                comment,
                evaluator: "",
                createdOn: (new Date()).toJSON(),
                isEvaluated:false,
                status: 1 ,
                backImage:"",
                nextImage:""                 
            }
            key = firebase.database().ref('evaluation/').push(Image).key;
            console.log("successs========>", key)

    });
 return {imageUrl, key};
}

export async function DeleteImage(fileName, key){
    firebase.storage().ref().child(`xray/${fileName}`).delete();
    firebase.database().ref(`evaluation/${key}`).remove();
}

async function Register(email, password) {
    var result = null;
    await firebase.auth().createUserWithEmailAndPassword(email, password).then((user => {
        console.log("user=========>", user)
        result = user;
    }))
    return result;
}

export async function GetAllUser(){
    var users = [];
    await firebase.auth().listUsers(500, "").then(snapshot=>{
        snapshot.forEach(i=>{
            users.push({key:i.key, value:i.val()});
        })
    });
    return users;
}

function savedata(email, password, img) {
    console.log("firebase wala chala")
    var userobject = {
        email,
        password,
        img
    }
    try {
        var key = firebase.database().ref('Userinfo/').push(userobject).key;
        console.log("message=========>", key);

    } catch (error) {
        console.log(error.message)
    }





}

async function Authenticate(email, password) {
    let user = null;
    try {
    await firebase.auth().signInWithEmailAndPassword(email, password).then((userinfo => {
        console.log("userinfo=========>", userinfo)
         user ={email, uid: userinfo.user.uid,
                token: userinfo.user.refreshToken};
    }));
    } catch(err){

    }
    return user;
}
export async function VerifyToken(token){
    let user = null;
    try {
    await firebase.auth().signInWithCustomToken(token).then((userinfo => {
        console.log("userinfo=========>", userinfo)
         user ={email: userinfo.user.email, uid: userinfo.user.uid,
                token: userinfo.user.refreshToken};
    }));
    } catch(err){

    }
    return user;
}

export async function IsStill(){
    let user = await firebase.auth().currentUser;
    return user !=null;
}

export function isAdmin(userId){
    return userId===uid;
}
function Logout(){
    firebase.auth().signOut().then(()=>{
        localStorage.setItem("userInfo", null);
    })
}
async function getNewImage(currentImage) {
    var data = null;
   await firebase.database().ref().child("evaluation")
   .orderByChild("status")
   .equalTo(1)   
   .limitToFirst(1)
   .once("value", response =>{
        response.forEach(i=>{
            data = { key: i.key, value: i.val()};                        
        });
        if(data!=null){
            firebase.database().ref(`/evaluation/${data.key}`).update({
                status:2, 
                evaluator: currentUser().uid, 
                userName: currentUser().userName || currentUser().email,
                backImage: currentImage
            });

            if(currentImage){
                firebase.database().ref(`evaluation/${currentImage}`).update({
                    nextImage:data.key
                })
            }

            firebase.database().ref("/inProc").push({ userId: currentUser().uid, evalId: data.key });            
        }
    });
    return data;
}

export async function getImage(key){
    var data = null;
    await firebase.database().ref().child(`evaluation/${key}`)
    .once("value").then(snapshot=>{        
        data = {key: snapshot.key, value: snapshot.val()}        
    })
    return data;
}

 export async function getMyImage(){
     var data = null;
     var userId = currentUser().uid;
     await firebase.database().ref("/inProc")
     .orderByChild("userId")
     .equalTo(userId)
     .limitToFirst(1)
     .once("value")
     .then(response =>{
         var key = null;
         response.forEach(i=>{
            key = i.val();
        });

        if(key){
            return firebase.database().ref(`/evaluation/${key.evalId}`)
            .once("value")
        }
        return null;        
     }).then(response =>{
         if(response !=null){
            data = { key:response.key, value: response.val()};
        }
     });
     return data;
 }

export async function saveImage(key ,value) {
    var result = null;
    await firebase.database().ref(`/evaluation/${key}`).set(value, error=>{        
        if(error){
            console.log(error);
            result= false;
        }
        let userId = currentUser().uid;
        firebase.database().ref("/inProc").orderByChild("userId")
        .equalTo(userId).limitToFirst(1).once("value", snapshot=>{
            snapshot.getRef().remove();
        });
        result= true;
    });
    return result;
}

export async function DeleteCurrentImage(fileName, key) {
    await DeleteImage(fileName, key);
    let userId = currentUser().uid;
    firebase.database().ref("/inProc").orderByChild("userId")
        .equalTo(userId).limitToFirst(1).once("value", snapshot=>{
            snapshot.getRef().remove();
        });
}

export async function getAllMyImages(){
    //var result = null;
    //await firebase.database().ref("/evaluation").
}

export async function getAllEvaluated(){
    var result = [];
    await firebase.database().ref("/evaluation")
    .orderByChild("status").equalTo(3).once("value", snapshot=>{
        snapshot.forEach(i=>{
            result.push(i.val());
        });
    });
    return result;
}

export async function getDefaultRates() {
    var data = null;
    await firebase.database().ref("/default-rates").once("value").then(snapshot=>{ 
            data= {key: snapshot.key, value: snapshot.val()}
    })
    return data;
}

export async function setDefaultRates(config){
    var b = null;
    await firebase.database().ref("/default-rates").update(config, a=>{
        if(a){
            b = false;
        }

        b = true;
    });
    return b;
}

export async function setDefaults (imageName, leftMedial, rightMedial, leftLateral, rightLateral){
    var result = null;
    await firebase.database().ref("/evaluation/")
    .orderByChild("imageName")
    .equalTo(imageName)
    .once("value")
    .then(snapshot=>{
        var key = null;
        snapshot.forEach(i=> {
            key = i.key;
        })
        if(key == null){
            return;
        }
        return firebase.database()
        .ref(`/evaluation/${key}`)
        .update({
            d_rightMedial: rightMedial,
            d_rightLateral: rightLateral,
            d_leftMedial: leftMedial,
            d_leftLateral: leftLateral
        });
    }).then(response =>{
        if(response){
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
    Logout
}
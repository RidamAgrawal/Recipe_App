
import {initializeApp} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {getDatabase, ref, onValue, child, get, query, orderByChild,orderByKey, limitToLast ,equalTo,startAt ,endAt,set ,push } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
import {getAuth,onAuthStateChanged,signInWithEmailAndPassword,createUserWithEmailAndPassword,sendEmailVerification,EmailAuthProvider,reauthenticateWithCredential,updateEmail,updateProfile,updatePassword,verifyBeforeUpdateEmail } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

import myFirebaseConfiguration from '../myFirebaseConfiguration.js';


const firebaseConfig = {
  apiKey: myFirebaseConfiguration.apiKey,
  authDomain: myFirebaseConfiguration.authDomain,
  databaseURL: myFirebaseConfiguration.databaseURL,
  projectId: myFirebaseConfiguration.projectId,
  storageBucket: myFirebaseConfiguration.storageBucket,
  messagingSenderId: myFirebaseConfiguration.messagingSenderId,
  appId: myFirebaseConfiguration.appId,
};

// Initialize Firebase
initializeApp(firebaseConfig);
const auth=getAuth();
var dB=getDatabase();


function getRecipes(pg){
    let data=[];
    const dataQuery=query(ref(dB,'recipes/'),orderByKey(),startAt(String(pg*12)),endAt(String((pg*12)+11)));
    
    return new Promise((resolve, reject) => {
      onValue(dataQuery, (snapshot) => {
        if (snapshot.exists()) {
          data = Object.values(snapshot.val());
          resolve(data); // Resolve the promise with the data
        } else {
          resolve(data); // Resolve with an empty array if no data exists
        }
      });
    });
}

function getNewRecipes(){
  let data=[];
    const dataQuery=query(ref(dB,'newRecipes/'),orderByKey());
    
    return new Promise((resolve, reject) => {
      onValue(dataQuery, (snapshot) => {
        if (snapshot.exists()) {
          data=snapshot.val();
          for(let i in data){
            data[i].ID=i;
          }
          data = Object.values(data);
          resolve(data); // Resolve the promise with the data
        } else {
          resolve(data); // Resolve with an empty array if no data exists
        }
      });
    });
}

function getARecipe(id){
  let obj={};
  const dataQuery=query(ref(dB,'recipes/'),orderByKey(),startAt(String(id)),endAt(String(id)));

  return new Promise((resolve,reject)=>{
    onValue(dataQuery,(snapshot)=>{
      if(snapshot.exists()){
        obj = snapshot.val();
        obj=obj[`${id}`];
        // console.log(obj);
        resolve(obj);
      }
      else{
        resolve(obj);
      }
    });
  });
}

function getANewRecipe(id){
  let obj={};
  const dataQuery=query(ref(dB,'newRecipes/'),orderByKey(),equalTo(id));

  return new Promise((resolve,reject)=>{
    onValue(dataQuery,(snapshot)=>{
      if(snapshot.exists()){
        obj = snapshot.val();
        obj=obj[`${id}`];
        // console.log(obj);
        resolve(obj);
      }
      else{
        resolve(obj);
      }
    });
  });
}

async function UserSignup(name,email,password) {
  try {
    // Create user with email and password
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    // Update user's profile (displayName)
    if(name){
      await updateProfile(user,{
        displayName: name // You can use email or any other name you prefer
      });
    }
    
    await sendEmailVerification(user);
    console.log("Verification email sent to:", email);
    addUser(user.uid,name,email);
    return user; // Return the user object with the updated profile
  } catch (error) {
    console.error('Error during signup or profile update:', error);
    throw error; // Optional: Re-throw error if you want to handle it outside this function
  }
}

function UserLogin(email,password){
  return signInWithEmailAndPassword(auth,email,password)
}

function deleteUser(){

}

async function updateUser(name, email, password) {
  const user = auth.currentUser;

  if(!user){console.log("Please relogin!");throw new Error('reauthenicate');}

  try {
    const credential = EmailAuthProvider.credential(user.email, password);

    await reauthenticateWithCredential(user, credential);
    // console.log("User reauthenticated.");

    // Step 1: Update the display name (username)
    if(name&&name!==user.displayName){
      await updateProfile(user, { displayName: name });
      // console.log("Display Name Updated:", user.displayName);
    }

    
    // Step 3: Send a verification email to the new email
    if(email&&email!==user.email){
      await verifyBeforeUpdateEmail(user,email);
      alert('Please check your inbox to verify the new email address.\nYour will not be updated till you verify your email');
      // console.log("Verification email sent to:", email);
    }

    // console.log(user); koi fayda nhi he pta nhi kyu ye updated user nhi dikha rha lekin firebase auth me update ker de rha h

  } catch (err) {
    throw err;
  }
}

async function updateUserPassword(email,password,newPassword){
  const user=auth.currentUser;
  if(!user){
    console.log("please relogin!");throw new Error('reauthenticate');
  }
  try {
    const credential=EmailAuthProvider.credential(user.email,password);

    await reauthenticateWithCredential(user , credential);
    // console.log("user reauthenticated");

    await updatePassword(user,newPassword);
    // console.log("password has been updated successfully");
  } catch (err) {
    // console.log(err);
    throw err;
  }
}

async function addUser(uid,name,email){ //need of it as of now
  console.log(name);
    if(!name){
      throw Error("invalid user");
    }
    // user.updateProfile({displayName:name})
    // .then((res)=>{console.log('username is set ',res);})
    // .catch((err)=>{console.log(err);})

    await set(ref(dB, "users/"+uid), {
      uid: uid,
      displayName: name,
      email: email,
      savedRecipes: [6000],
    })
    .then((resp)=>{console.log('user added into db');})
    .catch((err)=>{console.log(err);throw err;});
}

async function getUserUid(name,email){
  const dataQuery=query(ref(dB,'users/'));

  return new Promise((resolve,reject)=>{
    onValue(dataQuery,(snapshot)=>{
      if(snapshot.exists()){
        let data=snapshot.val();
        for(let itm in data){
          if(data[itm].displayName===name&&data[itm].email===email){
            resolve(itm);
          }
        }
        reject(`user with ${name} and ${email} Not Found`);
      }
      else{
        reject('other error');
      }
    })
  })
}

async function getUserName(uid){
  const dataQuery=query(ref(dB,'users/'+uid));

  try {
    return new Promise((resolve,reject)=>{
      onValue(dataQuery,(snapshot)=>{
        if(snapshot.exists()){
          resolve(snapshot.val());
        }
        else{reject(`User with ${uid} Not found`);}
      })
    })
  } catch (err) {
    throw err;
  }

}

async function addRecipe(arr,uid){
  let [title,cuisine,imgLink,time,ingredient,instr]=arr;
  await push(ref(dB,'newRecipes/'),{
    CleanedIngredients : ingredient,
    Cuisine : cuisine,
    ID : 0,
    ImageUrl : imgLink,
    IngredientCount : ingredient.split(',').length,
    TotalTimeInMins : time,
    TranslatedIngredients : ingredient,
    TranslatedInstructions : instr,
    TranslatedRecipeName : title,
    URL : '',
    uid : uid,
  })
  .then((resp)=>{return resp;})
  .catch((err)=>{throw err;})
}

async function getUsersRecipe(uid){
  let data=[];
  const dataQuery=query(ref(dB,'newRecipes/'),orderByChild('uid'),equalTo(uid));
  return new Promise((resolve,reject)=>{
    onValue(dataQuery,(snapshot)=>{
      if(snapshot.exists()){
        data=snapshot.val();
        for(let i in data){
          data[i].ID=i;
        }
        data=Object.values(data);
        resolve(data);
      }
      else{
        reject('New Recipes Not found');
      }
    })
  })
}

async function addUserComment(userName,userEmail,recipeId,comment){
  await getUserUid(userName,userEmail)
  .then((res)=>{

    set(ref(dB, 'comments/'+recipeId+'/'+Date.now()),{
      uid : res,
      // ID : recipeId,
      cmt : comment,
    })
    .then((res)=>{
      // console.log(res); res is undefined always
      return res;
    })
    .catch((err)=>{console.log(err);throw err;})
    
  })

}

async function getComments(recipeId){
  let data=[];
  const dataQuery=query(ref(dB,`comments/${recipeId}/`));
  
  return new Promise((resolve,reject)=>{
    onValue(dataQuery,(snapshot)=>{
      if(snapshot.exists()){
        data=snapshot.val();
        // for(let itm in data){
        //   getUserName(data[itm].uid)
        //   .then((rs)=>{
        //     data[itm].name=rs.displayName;
        //   })
        // }
        resolve(changeUidtoNames(data));
      }
      else{
        reject('comments Not found');
      }
    })
  })
}

async function changeUidtoNames(data){
  for(let itm in data){
    await getUserName(data[itm].uid)
    .then((rs)=>{
      data[itm].name=rs.displayName;
    })
  }
  return data;
}
async function getSavedRecipeIds(uid){
  let dataQuery=query(ref(dB,'users/'+uid+'/savedRecipes'));

  return new Promise((resolve,reject)=>{
    onValue(dataQuery,(snapshot)=>{
      if(snapshot.exists()){
        resolve(snapshot.val());
      }
      else{
        reject(`User with ${uid} No found`);
      }
    });
  })
}
async function updateUserSavedRecipe(uid,savedRecipes){
  // let dataQuery=query(ref(dB,'users/'+uid+'/'));

  await set(ref(dB,'users/'+uid+'/savedRecipes/'),{
    savedRecipes
  })
}

export { getRecipes,getNewRecipes,getARecipe,getANewRecipe,UserSignup,UserLogin,updateUser,updateUserPassword,addUserComment,getComments,getSavedRecipeIds,updateUserSavedRecipe,addRecipe,getUsersRecipe };
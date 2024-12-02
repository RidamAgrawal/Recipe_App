
import { getRecipes,getNewRecipes,UserSignup,UserLogin,updateUser,updateUserPassword,getARecipe,getANewRecipe,addUserComment,getComments,getSavedRecipeIds,updateUserSavedRecipe,addRecipe,getUsersRecipe } from './db/db.js';
// import myFirebaseConfiguration from './myFirebaseConfiguration.js';

// console.log('hello',myFirebaseConfiguration);

var navBar=document.querySelector('nav');
var modal=document.querySelector('.modal');
var loginForm=document.querySelector('.login');
var signupForm=document.querySelector('.signup');
var editProfile=document.querySelector('.editProfile');
var updatePassword=document.querySelector('.updatePassword');
var newRecipeForm=document.querySelector('.newRecipe');
var sideBar1=document.querySelector('.sideBar1');
var sideBar2=document.querySelector('.sideBar2');
var indexBar=document.querySelector('.indexBar');
var notificationBar=document.querySelector('.notificationBar');
var mainContainer=document.querySelector('main');
var pg=0;
var id=undefined;
var userStatus=JSON.parse(localStorage.getItem('RecipeUser'))||{};
var commentInterval=undefined;


chk();
showItems();

async function showItems(){
    await getRecipes(pg)
    .then((res)=>{
        mainContainer.innerHTML='';

        res.forEach(itm => {
            mainContainer.innerHTML+=`
                <div class="card" data-id='${itm.ID}'>
                    <div class="cardImage" data-id='${itm.ID}'>
                        <img src="${itm.ImageUrl}" alt="${itm.TranslatedRecipeName}" height='300px' width='200px' data-id='${itm.ID}'>
                    </div>
                    <div class="cardDetails" data-id='${itm.ID}'>
                        <div class="name" data-id='${itm.ID}'>Name:${itm.TranslatedRecipeName}</div>
                        <div class="cuisine" data-id='${itm.ID}'>Cuisine:${itm.Cuisine}</div>
                        <div class="time" data-id='${itm.ID}'><span data-id='${itm.ID}'>Avg. Time To Cook:${itm.TotalTimeInMins}</span><svg xmlns="http://www.w3.org/2000/svg" data-id='${itm.ID}' height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path data-id='${itm.ID}' d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"/></svg></div>
                        <div class="ingredientsCount" data-id='${itm.ID}'>Ingredients Count:${itm.IngredientCount}</div>
                    </div>
                </div>
            `;
        });

    });
}
async function showNewItems(){
    await getNewRecipes()
    .then((res)=>{
        // console.log(res);
        mainContainer.innerHTML='';

        for(let i=(pg*12);i<Math.min((pg+1)*12,res.length);i++){
            let itm=res[i];
            mainContainer.innerHTML+=`
                <div class="card" data-id='${itm.ID}'>
                    <div class="cardImage" data-id='${itm.ID}'>
                        <img src="${itm.ImageUrl}" alt="${itm.TranslatedRecipeName}" height='300px' width='200px' data-id='${itm.ID}'>
                    </div>
                    <div class="cardDetails" data-id='${itm.ID}'>
                        <div class="name" data-id='${itm.ID}'>Name:${itm.TranslatedRecipeName}</div>
                        <div class="cuisine" data-id='${itm.ID}'>Cuisine:${itm.Cuisine}</div>
                        <div class="time" data-id='${itm.ID}'><span data-id='${itm.ID}'>Avg. Time To Cook:${itm.TotalTimeInMins}</span><svg xmlns="http://www.w3.org/2000/svg" data-id='${itm.ID}' height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path data-id='${itm.ID}' d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"/></svg></div>
                        <div class="ingredientsCount" data-id='${itm.ID}'>Ingredients Count:${itm.IngredientCount}</div>
                    </div>
                </div>
            `;
        }
    })
    .catch((err)=>{console.log(err);})
}
async function showUserCreation(){
    await getUsersRecipe(userStatus.uid)
    .then((res)=>{
        // console.log(res);
        mainContainer.innerHTML='';

        for(let itm in res){
            mainContainer.innerHTML+=`
                <div class="card" data-id='${res[itm].ID}'>
                    <div class="cardImage" data-id='${res[itm].ID}'>
                        <img src="${res[itm].ImageUrl}" alt="${res[itm].TranslatedRecipeName}" height='300px' width='200px' data-id='${res[itm].ID}'>
                    </div>
                    <div class="cardDetails" data-id='${res[itm].ID}'>
                        <div class="name" data-id='${res[itm].ID}'>Name:${res[itm].TranslatedRecipeName}</div>
                        <div class="cuisine" data-id='${res[itm].ID}'>Cuisine:${res[itm].Cuisine}</div>
                        <div class="time" data-id='${res[itm].ID}'><span data-id='${res[itm].ID}'>Avg. Time To Cook:${res[itm].TotalTimeInMins}</span><svg xmlns="http://www.w3.org/2000/svg" data-id='${res[itm].ID}' height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path data-id='${res[itm].ID}' d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"/></svg></div>
                        <div class="ingredientsCount" data-id='${res[itm].ID}'>Ingredients Count:${res[itm].IngredientCount}</div>
                    </div>
                </div>
            `;
        }
    })
    .catch((err)=>{console.log(err);})
}
async function showSavedRecipe(){
    indexBar.children[0].classList.add('show');
    indexBar.children[1].classList.remove('show');
    mainContainer.classList.remove('showRecipe');
    mainContainer.innerHTML='Please Wait loading...';
    pg=0;
    let arr=[];
    for(let i=(pg*12);i<Math.min((pg*12)+11,userStatus.savedRecipes.length);i++){
        await getARecipe(userStatus.savedRecipes[i])
        .then((res)=>{
            arr.push(res);
        })
        .catch((err)=>{console.log(err);})
    }
    mainContainer.innerHTML='';

    arr.forEach(itm => {
        mainContainer.innerHTML+=`
            <div class="card" data-id='${itm.ID}'>
                <div class="cardImage" data-id='${itm.ID}'>
                    <img src="${itm.ImageUrl}" alt="${itm.TranslatedRecipeName}" height='300px' width='200px' data-id='${itm.ID}'>
                </div>
                <div class="cardDetails" data-id='${itm.ID}'>
                    <div class="name" data-id='${itm.ID}'>Name:${itm.TranslatedRecipeName}</div>
                    <div class="cuisine" data-id='${itm.ID}'>Cuisine:${itm.Cuisine}</div>
                    <div class="time" data-id='${itm.ID}'><span data-id='${itm.ID}'>Avg. Time To Cook:${itm.TotalTimeInMins}</span><svg xmlns="http://www.w3.org/2000/svg" data-id='${itm.ID}' height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path data-id='${itm.ID}' d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"/></svg></div>
                    <div class="ingredientsCount" data-id='${itm.ID}'>Ingredients Count:${itm.IngredientCount}</div>
                </div>
            </div>
        `;
    });
    if(!arr.length){
        mainContainer.innerHTML='your Wishlist is Empty';
    }
}
async function showARecipe(){
    indexBar.children[0].classList.remove('show');
    indexBar.children[1].classList.add('show');
    mainContainer.classList.add('showRecipe');
    await getARecipe(id)
    .then((res)=>{
        // console.log("yay we got the recipe",res);
        let f=false;
        if(userStatus&&userStatus.savedRecipes){f=userStatus.savedRecipes.find(itm=>itm===id)+1;}
        mainContainer.innerHTML=`<div class="RecipeTitle">
                <div><h3>${res.TranslatedRecipeName}</h3></div>
                <div><h3>Cuisine:${res.Cuisine}</h3><ul><li><a href="${res.URL}"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z"/></svg><span>Source</span></a></li><li><button class='${f?'show':'hide'}' data-action='remove'><svg xmlns="http://www.w3.org/2000/svg"  data-action='remove'height="24px" viewBox="0 0 24 24" width="24px" fill="#000"><path  data-action='remove'd="M0 0h24v24H0z" fill="none"/><path data-action='remove' d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg><span data-action='remove'>Remove</span></button><button class='${f?'hide':'show'}' data-action='save' ><svg xmlns="http://www.w3.org/2000/svg" data-action='save' height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path data-action='save' d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/></svg><span data-action='save' >Save</span></button></li></ul></div>
            </div>
            <div class="RecipeImage"><!--class will be grid of two cols-->
                <div class="RecipeDetails">
                    <span class="time">Cooking Time:${res.TotalTimeInMins}</span>
                    <span class="cleanedIngredients">Ingredients:${res.CleanedIngredients}</span>
                    <!-- <span class="source"><a href="${res.URL}">Source<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z"/></svg></a></span> -->
                </div>
                <div class="image"><img src="${res.ImageUrl}" alt="${res.TranslatedRecipeName}"></div>
            </div>
            <div class="translatedIngredients">
                <h3>Ingredients:</h3>
                <ol>${res.TranslatedIngredients.split(',').map((str)=>{return `<li>${str}</li>`}).join('')}</ol>
            </div>
            <div class="instructions">
                <h3>Instructions:</h3>
                <ol>${res.TranslatedInstructions.split('\r\n').map((str)=>{return `<li>${str}</li>`}).join('')}</ol>
            </div>
            <div class="commentSection">
            <div class="commentHeader"><h3>Comments</h3></div>
            <div class="addComment">
                <textarea name="comment" placeholder="add a comment" rows="2" width="5rem"></textarea><ul><li><button data-action="add"><svg xmlns="http://www.w3.org/2000/svg" data-action="add" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path data-action="add" d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z"/></svg><span data-action="add">send</span></button></li></ul>
            </div>
            <div class="comments"></div>
        </div>`;
        getCommentsofARecipe();
        commentInterval=setInterval(getCommentsofARecipe,60000);
    })
    .catch((err)=>{console.log(err);})
}
async function showAnewRecipe(rId){
    indexBar.children[0].classList.remove('show');
    indexBar.children[1].classList.add('show');
    indexBar.children[1].children[1].style.display='none';
    indexBar.children[1].children[2].style.display='none';
    mainContainer.classList.add('showRecipe');
    // console.log(rId);
    await getANewRecipe(rId)
    .then((res)=>{
        // console.log(res);
        let f=false;
        if(userStatus&&userStatus.savedRecipes){f=userStatus.savedRecipes.find(itm=>itm===id)+1;}
        mainContainer.innerHTML=`<div class="RecipeTitle">
                <div><h3>${res.TranslatedRecipeName}</h3></div>
                <div><h3>Cuisine:${res.Cuisine}</h3><ul><li><a href="${res.URL}"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z"/></svg><span>Source</span></a></li><li><button class='${f?'show':'hide'}' data-action='remove'><svg xmlns="http://www.w3.org/2000/svg"  data-action='remove'height="24px" viewBox="0 0 24 24" width="24px" fill="#000"><path  data-action='remove'd="M0 0h24v24H0z" fill="none"/><path data-action='remove' d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg><span data-action='remove'>Remove</span></button><button class='${f?'hide':'show'}' data-action='save' ><svg xmlns="http://www.w3.org/2000/svg" data-action='save' height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path data-action='save' d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/></svg><span data-action='save' >Save</span></button></li></ul></div>
            </div>
            <div class="RecipeImage"><!--class will be grid of two cols-->
                <div class="RecipeDetails">
                    <span class="time">Cooking Time:${res.TotalTimeInMins}</span>
                    <span class="cleanedIngredients">Ingredients:${res.CleanedIngredients}</span>
                    <!-- <span class="source"><a href="${res.URL}">Source<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z"/></svg></a></span> -->
                </div>
                <div class="image"><img src="${res.ImageUrl}" alt="${res.TranslatedRecipeName}"></div>
            </div>
            <div class="translatedIngredients">
                <h3>Ingredients:</h3>
                <ol>${res.TranslatedIngredients.split(',').map((str)=>{return `<li>${str}</li>`}).join('')}</ol>
            </div>
            <div class="instructions">
                <h3>Instructions:</h3>
                <ol>${res.TranslatedInstructions.split('\r\n').map((str)=>{return `<li>${str}</li>`}).join('')}</ol>
            </div>
            <div class="commentSection">
            <div class="commentHeader"><h3>Comments</h3></div>
            <div class="addComment">
                <textarea name="comment" placeholder="add a comment" rows="2" width="5rem"></textarea><ul><li><button data-action="add"><svg xmlns="http://www.w3.org/2000/svg" data-action="add" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path data-action="add" d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z"/></svg><span data-action="add">send</span></button></li></ul>
            </div>
            <div class="comments"></div>
        </div>`;
        getCommentsofARecipe();
        commentInterval=setInterval(getCommentsofARecipe,60000);
    })
    .catch((err)=>{console.log(err);})
}
async function getCommentsofARecipe(){
    var commentContainer=document.querySelector('.comments');
    commentContainer.innerHTML='Please wait for sometime comments are loading';
    await getComments(id)
    .then((res)=>{
        // console.log(res);
        commentContainer.innerHTML='';
        for(let itm in res){
            commentContainer.innerHTML+=`
                <div class="cmt">
                    <div><ul><li><button data-action="user"><svg xmlns="http://www.w3.org/2000/svg" data-action="user" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path data-action="user" d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"/></svg><span data-action="user">user</span></button></li></ul><span>${res[itm].name}</span></div>
                    <div><span>${res[itm].cmt}</span>
                    <ul>
                        <li><button data-action="like"><svg xmlns="http://www.w3.org/2000/svg" data-action="like" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path data-action="like" d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z"/></svg><span data-action="like">like</span></button></li>
                        <li><button data-action="dislike"><svg xmlns="http://www.w3.org/2000/svg" data-action="dislike" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path data-action="dislike" d="M240-840h440v520L400-40l-50-50q-7-7-11.5-19t-4.5-23v-14l44-174H120q-32 0-56-24t-24-56v-80q0-7 2-15t4-15l120-282q9-20 30-34t44-14Zm360 80H240L120-480v80h360l-54 220 174-174v-406Zm0 406v-406 406Zm80 34v-80h120v-360H680v-80h200v520H680Z"/></svg><span data-action="dislike">dislike</span></button></li>
                        <li><button data-action="reply"><svg xmlns="http://www.w3.org/2000/svg" data-action="reply" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path data-action="reply" d="M760-200v-160q0-50-35-85t-85-35H273l144 144-57 56-240-240 240-240 57 56-144 144h367q83 0 141.5 58.5T840-360v160h-80Z"/></svg><span data-action="reply">reply</span></button></li>
                    </ul>
                    </div>
                </div>`
        }
    })
    .catch((err)=>{commentContainer.innerHTML='No Comments yet!';});
}
function chk(){
    if(userStatus.login){
        sideBar2.children[0].children[0].children[0].classList.add('hide');
        sideBar2.children[0].children[0].children[1].classList.remove('hide');
        sideBar2.children[0].children[1].children[0].children[0].classList.add('hide');
        sideBar2.children[0].children[1].children[0].children[1].classList.remove('hide');
        sideBar2.children[0].children[1].children[0].children[2].classList.remove('hide');
        navBar.children[0].children[2].children[0].children[1].innerText=(userStatus.name)?userStatus.name:userStatus.email;
    }
    else{
        sideBar2.children[0].children[0].children[0].classList.remove('hide');
        sideBar2.children[0].children[0].children[1].classList.add('hide');
        sideBar2.children[0].children[1].children[0].children[0].classList.remove('hide');
        sideBar2.children[0].children[1].children[0].children[1].classList.add('hide');
        sideBar2.children[0].children[1].children[0].children[2].classList.add('hide');
        navBar.children[0].children[2].children[0].children[1].innerText='User';
    }
}

document.addEventListener('click',(event)=>{
    event.preventDefault();
    let element=event.target;
    if(navBar.contains(element)){
        if(element.dataset.action==='menu'){
            sideBar1.classList.toggle('hide');
        }
        else if(element.dataset.action==='users'){
            sideBar2.classList.toggle('hide');
        }
    }
    else if(modal.contains(element)){
        console.log(element);
        if(element.dataset.action==='login'){
            toggleModal(loginForm,signupForm,0);
        }
        else if(element.dataset.action==='signup'){
            toggleModal(signupForm,loginForm,0);
        }
        else if(element.dataset.action==='editProfile'){
            // editProfile.children[0].children[0].value=userStatus.name;
            // editProfile.children[0].children[1].innerText=userStatus.name;
            // editProfile.children[1].children[0].value=userStatus.email;
            // editProfile.children[1].children[1].innerText=userStatus.email;
            toggleModal(editProfile,updatePassword,1);
        }
        else if(element.dataset.action==='updatePassword'){
            toggleModal(updatePassword,editProfile,1);
        }
        else if(element.dataset.action==='submit'){
            if(loginForm.classList.contains('show')){

                UserLogin(loginForm.children[0].children[0].children[0].value,loginForm.children[1].children[0].children[0].value)
                .then((res)=>{
                    // console.log(res);
                    userStatus.email=res.user.email;
                    userStatus.name=res.user.displayName;
                    userStatus.uid=res.user.uid;
                    userStatus.login=true;
                    userStatus.savedRecipes=[];
                    getSavedRecipeIds(userStatus.uid)
                    .then((rs)=>{
                        // console.log(rs);
                        userStatus.savedRecipes=rs.filter(i=>i!==6000);
                        localStorage.setItem('RecipeUser',JSON.stringify(userStatus));
                    })
                    loginForm.children[0].children[0].children[0].value='';
                    loginForm.children[1].children[0].children[0].value='';
                    chk();
                    toggleModal(loginForm,signupForm,0);
                    openNotificationBar('success','Login Successful',`Yay! ${(userStatus.name)?userStatus.name:userStatus.email} has successfully login`)
                })
                .catch((err)=>{
                    console.log(err);
                    loginForm.children[1].children[0].children[0].value=''; //erasing previous enetered data
                    if(String(err).includes('invalid-email')){
                        // console.log("invalid-email");
                        //open notifaiction and show invalid-email
                        openNotificationBar('danger','Invalid Email','Entered Email does not exists');
                    }
                    else if(String(err).includes('missing-password')){
                        // console.log('missing-password');
                        //open notifaiction and show invalid-email
                        openNotificationBar('alert','Missing Pasword','Please Enter Password');
                    }
                    else if(String(err).includes('invalid-credential')){
                        // console.log('invalid-credential');
                        //open notifaiction and show invalid-email
                        openNotificationBar('danger','invalid Credentials','Either email or password is incorrect');
                    }
                })
            }
            else{

                UserSignup(signupForm.children[0].children[0].children[0].value,signupForm.children[1].children[0].children[0].value,signupForm.children[2].children[0].children[0].value)
                .then((res)=>{
                    // console.log(res);
                    openNotificationBar('success','Signup Successful',`Yay! ${signupForm.children[0].value} is registered successfully`);
                    toggleModal(signupForm,loginForm,0);
                })
                .catch((err)=>{
                    console.log(err);
                    if(String(err).includes('invalid-email')){
                        // console.log("invalid-email");
                        //open notifaiction and show invalid-email
                        openNotificationBar('alert','Invalid Email','Please enter a valid email');
                    }
                    else if(String(err).includes('missing-password')){
                        // console.log('missing-password');
                        //open notifaiction and show invalid-email
                        openNotificationBar('alert','Missing Pasword','Please Enter Password');
                    }
                    else if(String(err).includes('weak-password')){
                        // console.log('weak-password');
                        //open notifaiction and show invalid-email
                        openNotificationBar('alert','invalid Credentials','Password should be at least 6 six characters');
                    }
                    else if(String(err).includes('already-in-use')){
                        // console.log('already-in-use');
                        //open notifaiction and show invalid-email
                        openNotificationBar('danger','invalid Credentials','A user with this email already exists');
                    }
                    else if(String(err).includes('invalid-user')){
                        // console.log('already-in-use');
                        //open notifaiction and show invalid-email
                        openNotificationBar('alert','invalid Credentials','Please enter a valid username');
                    }
                });
                signupForm.children[0].children[0].children[0].value='';
                signupForm.children[1].children[0].children[0].value='';
                signupForm.children[2].children[0].children[0].value='';
            }
        }
        else if(element.dataset.action==='edit'){
            while(element.localName!=='div'){
                element=element.parentNode;
            }
            if(element.classList.contains('d-input')){element=element.parentElement;}
            if(editProfile.classList.contains('show')&&element!==editProfile.children[2]){
                element.children[1].classList.add('hide');
                element.children[2].classList.remove('hide');
                element.children[0].children[0].focus();
                element.children[0].children[0].value=(element.children[0].children[1].innerText==='Name')?userStatus.name:userStatus.email;
                element.children[0].children[0].classList.add('checked');
                element.children[0].children[1].classList.add('checked');
                editProfile.children[2].classList.remove('hide');
                editProfile.children[3].classList.remove('hide');
            }
            else if(loginForm.classList.contains('show')||signupForm.classList.contains('show')||newRecipeForm.contains(element)){
                element.children[0].children[0].classList.add('checked');
                element.children[0].children[1].classList.add('checked');
            }
            else{
                element.children[0].children[0].focus();
            }
        }
        else if(element.dataset.action==='reset'){
            while(element.localName!=='span'){
                element=element.parentNode;
            }
            if(editProfile.classList.contains('show')){
                if(!element.parentElement.previousElementSibling){element.previousElementSibling.previousElementSibling.children[0].value=userStatus.name;}
                else{element.previousElementSibling.previousElementSibling.children[0].value=userStatus.email;}
                element.previousElementSibling.previousElementSibling.children[0].focus();   
            }
            else if(loginForm.classList.contains('show')){
                element.parentElement.children[0].children[0].value='';
                element.parentElement.children[0].children[0].focus();
            }
            else{
                element.previousElementSibling.value='';
                element.previousElementSibling.focus();
            }
        }
        else if(element.dataset.action==='visible'){
            while(element.localName!=='span'){element=element.parentElement;}
            element.children[0].classList.toggle('hide');element.children[1].classList.toggle('hide');
            element=element.parentElement;
            if(element.children[0].children[0].type==='password'){
                element.children[0].children[0].type='text';
            }else{element.children[0].children[0].type='password';}
            element.children[0].children[0].focus();
        }
        else if(element.dataset.action==='save'){
            if(editProfile.classList.contains('show')){
                var name=editProfile.children[0].children[0].children[0].value;
                var email=editProfile.children[1].children[0].children[0].value;
                var pass=editProfile.children[2].children[0].children[0].value;
                updateUser(name,email,pass)
                .then((res)=>{//res is undefined means task done
                    userStatus.name=name;
                    userStatus.email=email;
                    localStorage.setItem('RecipeUser',JSON.stringify(userStatus));
                    openNotificationBar('success','updated successfully',`updated name is ${name} and email is ${email}`);
                    closeUpdateProfile();
                })
                .catch((err)=>{
                    if(String(err).includes('invalid-credential')){
                        openNotificationBar('danger','Wrong Password','Please Enter Correct Password');
                        editProfile.children[2].children[0].value='';editProfile.children[2].children[0].focus();
                    }
                    else if(String(err).includes('reauthenticate')){
                        openNotificationBar('alert','Session Timeout','Please logout and then login again');
                        closeUpdateProfile();
                    }
                });
            }
            else if(updatePassword.classList.contains('show')){
                var oldPass=updatePassword.children[0].children[0].children[0].value;
                var newPass=updatePassword.children[1].children[0].children[0].value;
                var cnfPass=updatePassword.children[2].children[0].children[0].value;
                if(oldPass&&newPass&&cnfPass&&newPass===cnfPass&&oldPass!==newPass){
                    updateUserPassword(userStatus.email,oldPass,newPass)
                    .then((res)=>{//res is undefined means task done
                        openNotificationBar("success",'Updated Successfully','your password has been updated');
                        updatePassword.children[0].children[0].value='';updatePassword.children[0].children[1].value='';updatePassword.children[0].children[2].value='';
                        toggleModal(updatePassword,editProfile,1);
                    })
                    .catch((err)=>{
                        if(String(err).includes('weak-password')){openNotificationBar('alert','invalid Password','Password must be atleast 6 characters');updatePassword.children[1].children[0].value='';updatePassword.children[2].children[0].value='';}
                        if(String(err).includes('invalid-credential')){openNotificationBar('danger','Wrong Password','Please enter correct password');updatePassword.children[0].children[0].value='';}
                        else if(String(err).includes('reauthenticate')){openNotificationBar('alert','Session Timeout','Please logout and then login again');}
                        
                    })
                }else if(!oldPass){
                    openNotificationBar('alert','Missing info','old password is required for password update');
                    updatePassword.children[0].children[0].focus();
                }
                else if(!newPass||!cnfPass){
                    openNotificationBar('alert','Missing info','new password is required');
                    if(!newPass){updatePassword.children[1].children[0].focus();}
                    if(!cnfPass){updatePassword.children[2].children[0].focus();}
                }
                else if(oldPass===newPass){
                    openNotificationBar('alert','Password match','old Password and new password cannot be same');
                }
                else if(newPass!==newPass){
                    openNotificationBar('alert','Passwords Not Match','please enter same passwords');
                }
            }
            else{
                let arr=[];
                for(let itm of newRecipeForm.children){
                    if(itm.children[0].localName==='ul'){break;}
                    if(!itm.children[0].value){openNotificationBar('alert','missing info','all fields are required');break;}
                    else{arr.push(itm.children[0].value);}
                }
                if(arr.length===6){
                    addRecipe(arr,userStatus.uid)
                    .then((res)=>{console.log(res);})
                    .catch((err)=>{console.log(err);})
                }
            }
        }
        else if(element.dataset.action==='close'||(!modal.children[0].contains(element)&&!modal.children[1].contains(element)&&!modal.children[2].contains(element))){
            //close modal
            if(loginForm.classList.contains('show')){
                toggleModal(loginForm,signupForm,0);
            }else if(signupForm.classList.contains('show')){
                toggleModal(signupForm,loginForm,0);
            }else if(editProfile.classList.contains('show')){
                closeUpdateProfile();
            }else if(updatePassword.classList.contains('show')){
                updatePassword.children[0].children[0].value='';updatePassword.children[1].children[0].value='';updatePassword.children[2].children[0].value='';
                toggleModal(updatePassword,editProfile,1);
            }
            else{
                modal.children[2].classList.remove('show');
                modal.classList.remove('show');
            }
        }
    }
    else if(sideBar1.contains(element)){
        if(element.dataset.action==='myRecipe'){
            while(!element.classList.contains('dropDown')){element=element.parentElement;}
            element.nextElementSibling.classList.toggle('show');
            element.children[1].classList.toggle('rotate');
            // subMenu.classList.toggle('show');  //now we are not using separate subMenu class elements ust use DOM
            // dropDownElement.children[1].classList.toggle('rotate');
        }
        else if(element.dataset.action==='add'){
            if(userStatus.login){
                modal.classList.add('show');
                modal.children[2].classList.add('show');
            }
            else{toggleModal(loginForm,signupForm,0);}
        }
        else if(element.dataset.action==='creation'){
            if(userStatus.login){
                mainContainer.classList.remove('showRecipe');
                pg=0;
                showUserCreation();
                removeActiveClass(element);
            }
            else{toggleModal(loginForm,signupForm,0);}    
        }
        else if(element.dataset.action==='saved'){
            if(userStatus.login){
                showSavedRecipe();
                removeActiveClass(element);
            }
            else{toggleModal(loginForm,signupForm,0);}
        }
        else if(element.dataset.action==='home'){
            mainContainer.classList.remove('showRecipe');
            pg=0;
            showItems();
            removeActiveClass(element);
        }
        else if(element.dataset.action==='new'){
            mainContainer.classList.remove('showRecipe');
            pg=0;
            showNewItems();
            removeActiveClass(element);
        }
    }
    else if(sideBar2.contains(element)){
        if(element.dataset.action==='login'){
            toggleModal(loginForm,signupForm,0);
        }
        else if(element.dataset.action==='signup'){
            toggleModal(signupForm,loginForm,0);
        }
        else if(element.dataset.action==='logout'){
            userStatus={};
            localStorage.removeItem('RecipeUser');
            chk();
            openNotificationBar('success','User Logout','you have been logout successfully');
        }
        else if(element.dataset.action==='account'){
            while(!element.classList.contains('dropDown')){element=element.parentElement;}
            element.nextElementSibling.classList.toggle('show');
            element.children[2].classList.toggle('rotate');
        }
        else if(element.dataset.action==='editProfile'){
            // editProfile.children[0].children[0].value=userStatus.name;
            // editProfile.children[0].children[1].innerText=userStatus.name;
            // editProfile.children[1].children[0].value=userStatus.email;
            // editProfile.children[1].children[1].innerText=userStatus.email;
            toggleModal(editProfile,updatePassword,1);
        }
        else if(element.dataset.action==='delete'){
            console.log('delete');
        }
        else if(element.dataset.action==='updatePassword'){
            toggleModal(updatePassword,editProfile,1);
        }
    }
    else if(indexBar.contains(element)){
        if(element.dataset.action==='previous'){
            if(!mainContainer.classList.contains('showRecipe')){
                if(pg>0){
                    pg--;
                    shakeNextPreviousBtn(element);
                    showItems();
                }
            }
            else{
                if(id>0){
                    id--;
                    shakeNextPreviousBtn(element);
                    showARecipe();
                }
            }
        }
        else if(element.dataset.action==='next'){
            if(!mainContainer.classList.contains('showRecipe')){
                pg++;
                shakeNextPreviousBtn(element);
                showItems();
            }
            else{
                id++;
                shakeNextPreviousBtn(element);
                showARecipe();
            }
        }
        else if(element.dataset.action==='back'){
            indexBar.children[0].classList.add('show');
            indexBar.children[1].classList.remove('show');
            indexBar.children[1].children[1].style.display='grid';
            indexBar.children[1].children[2].style.display='grid';
            mainContainer.classList.remove('showRecipe');
            clearInterval(commentInterval); //this is stopping that setInterval function which was set at 60,000 to load fresh comments
            pg=0;
            removeActiveClass();
            sideBar1.children[0].children[0].children[0].classList.add('active');
            showItems(pg);
        }
    }
    else if(mainContainer.contains(element)){
        // now open the recipe page
        // console.log(element.dataset);
        if(element.dataset.id){
            //now switch the main container display to flex or other from grid and hide indexBar and display the whole recipe
            if(sideBar1.children[0].children[0].children[0].classList.contains('active')||sideBar1.children[0].children[2].children[1].children[0].children[2].children[0].classList.contains('active')){
                mainContainer.innerHTML='please wait....';
                id=Number(element.dataset.id);
                showARecipe();
            }
            else{
                mainContainer.innerHTML='please wait....';
                showAnewRecipe(element.dataset.id);
            }
        }
        else if(element.dataset.action==='add'){
            while(element.localName!=='ul'){
                element=element.parentElement;
            }
            addUserComment(userStatus.name,userStatus.email,id,element.previousElementSibling.value)
            .then((res)=>{
                // console.log(res); res is undefined always
                getCommentsofARecipe();
            })
            .catch((err)=>{console.log(err);})
        }
        else if(element.dataset.action==='save'){
            if(userStatus.login){
                // console.log('saving this recipe in your account');
                userStatus.savedRecipes.push(id);
                // console.log(userStatus.savedRecipes);
                updateUserSavedRecipe(userStatus.uid,userStatus.savedRecipes)
                .then((res)=>{
                    localStorage.setItem('RecipeUser',JSON.stringify(userStatus));
                    while(element.localName!=='button'){element=element.parentElement;}
                    element.classList.remove('show');
                    element.classList.add('hide');
                    element=element.previousElementSibling;
                    element.classList.remove('hide');
                    element.classList.add('show');
                })
            }
            else{
                openNotificationBar('alert','Login Required','Please login before adding this recipe to wishlist');
            }
        }
        else if(element.dataset.action==='remove'){
            console.log('removing saved recipe');
            userStatus.savedRecipes=userStatus.savedRecipes.filter(i=>i!==id);
            // console.log(userStatus.savedRecipes);
            updateUserSavedRecipe(userStatus.uid,userStatus.savedRecipes)
            .then((res)=>{
                localStorage.setItem('RecipeUser',JSON.stringify(userStatus));
                while(element.localName!=='button'){element=element.parentElement;}
                element.classList.remove('show');
                element.classList.add('hide');
                element=element.nextElementSibling;
                element.classList.remove('hide');
                element.classList.add('show');
            })
        }
    }
});

function toggleModal(element,elementCounter,whichModalContent){
    if(element.classList.contains('show')){
        for(let i of modal.children){i.classList.remove('show');}
        modal.classList.remove('show');
        element.classList.remove('show');
    }
    else{
        modal.classList.add('show');
        modal.children[whichModalContent].classList.add('show');
        elementCounter.classList.remove('show');
        element.classList.add('show');
    }
}

function openNotificationBar(mode,heading,msg){
    notificationBar.classList.remove('danger');
    notificationBar.classList.remove('alert');
    notificationBar.classList.remove('success');
    notificationBar.classList.toggle('show');
    notificationBar.classList.add(mode);
    notificationBar.children[0].innerText=heading;
    notificationBar.children[1].innerText=msg;
    setTimeout(()=>{notificationBar.classList.toggle('show')},3000);
}

function closeUpdateProfile(){
    editProfile.children[0].children[0].value='';
    editProfile.children[0].children[0].classList.add('hide');
    editProfile.children[0].children[1].classList.remove('hide');
    editProfile.children[1].children[0].classList.add('hide');
    editProfile.children[1].children[1].classList.remove('hide');
    toggleModal(editProfile,updatePassword,1);
    chk();
    editProfile.children[2].classList.add('hide');
    editProfile.children[3].classList.add('hide');
    editProfile.children[2].children[0].value='';
}

function shakeNextPreviousBtn(element){
    while(element.localName!=='button'){element=element.parentElement;}
    element.classList.toggle('clicked');
    setTimeout(()=>{
        element.classList.toggle('clicked');
    },500);
}

function removeActiveClass(element){
    //pehla kaam saare active remove
    for(let i of sideBar1.children[0].children){
        if(i.children[0].classList.contains('dropDown')&&i.children[0]?.children[0]?.classList?.contains('active')){
            for(let it of i.children[1].children[0].children){
                it.children[0].classList.remove('active');
            }
            i.children[0].children[0].classList.remove('active');
        }
        i.children[0].classList.remove('active');
    }
    //dusra kaam curr ele pr active class lgaana
    if(!element){return;}
    while(element.localName!=='button'){element=element.parentElement;}
    element.classList.add('active');
    if(element.parentElement.parentElement.localName==='div'){
        while(!element.classList.contains('subMenu')){element=element.parentElement;}
        element.previousElementSibling.children[0].classList.add('active');
    }
}
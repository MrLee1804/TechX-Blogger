const user = document.getElementById('user');
const mail = document.getElementById('mail');
const media = document.getElementById('media');
const title = document.getElementById('title');
const desc = document.getElementById('desc');

const newPost = document.getElementById('newPost');
const posts = document.getElementById('posts');

const content = document.getElementById('content');

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, set, remove, onChildAdded, onChildRemoved } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBIhrHatdUWSUDUG6i4Bv2MurWqtyoxHro",
    authDomain: "blog-web-f8396.firebaseapp.com",
    databaseURL: "https://blog-web-f8396-default-rtdb.firebaseio.com",
    projectId: "blog-web-f8396",
    storageBucket: "blog-web-f8396.firebasestorage.app",
    messagingSenderId: "564793911422",
    appId: "1:564793911422:web:a4e707391285f99086d02f",
    measurementId: "G-LV49ZYBQZM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
var reader = new FileReader(), url, file, like = 0, isLiked = false;

function Gettime() {
    var d = new Date(),
    h = d.getHours(),
    m = d.getMinutes(),
    s = d.getSeconds(),
    
    months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    month = d.getMonth(),
    mon = months[month],
    y = d.getFullYear(),
    dt = d.getDate();
    
    if(h > 12) { h = h - 12 }
    if(h < 10) { h = "0" + h }
    if(m < 10) { m = "0" + m }
    if(s < 10) { s = "0" + s }
    
    return mon + " " + dt + ", " + y + "  " + h + ":" + m + ":" + s
}

media.onchange = () => {
    file = media.files[0];
    reader.onload = () => {
        url = reader.result;
    }
    reader.readAsDataURL(file);
}

newPost.addEventListener('click', () => {
    var time = Gettime();
    var timeStamp = new Date().getTime();
    set(ref(db, "TechX Blogger/" + timeStamp), {
        user: user.value,
        mail: mail.value,
        media: url,
        title: title.value,
        description: desc.value,
        time: time
    })
    .then(() => {
        console.log('Post Added Sucessfully');
    })
    .catch((error) => {
        console.log(error);
    })
})

onChildAdded(ref(db, "TechX Blogger"), (data) => {
    if(data) {
        
        posts.innerHTML += "<div class='col-12 card p-2 mb-5' id=" + data.key + "><div class='card-header'><div class='d-flex justify-content-between'><h1 class='text-primary'>" + data.val().user + "</h1><p style='size: 4px !important;'>" + data.val().time + "</p></div><p class='text-danger'>" + data.val().mail + "</p></div><div class='card-body'><img class='img-fluid' src=" + data.val().media + "></div><div class='card-footer'><div class='row form-control text-center m-auto'><i class='bi bi-share mx-3 fs-2'>0</i><i id=getLike onclick=module.liked(this.id) class='bi bi-heart mx-3 fs-2'>0</i><i class='bi bi-chat mx-3 fs-2'>0</i></div><div><button class='form-control my-3 btn btn-danger' id=dltMsg onclick=module.dltMsg(" + data.key + ")><i class='bi bi-trash px-2 fs-3'></i></button></div><p class='fs-3'>" + data.val().title + "</p><p class='fs-5'>" + data.val().description + "</p></div></div>"
        
        content.className = "d-none"
        posts.className = "d-inline"
    }
})

document.getElementById('new').addEventListener('click', () => {
    content.className = "d-inline"
    posts.className = "d-none"
})

document.getElementById('cancel').addEventListener('click', () => {
    content.className = "d-none"
    posts.className = "d-inline"
})

module.dltMsg = function dltMsg(key){
    remove(ref(db, "TechX Blogger/" + key))
}

onChildRemoved(ref(db, "TechX Blogger"), (data) => {
    var post = document.getElementById(data.key);
    posts.removeChild(post)
})

const getLike = document.getElementById('like');

module.liked = function Liked(id){
    if(!isLiked){
        like++
        var btn = document.getElementById(id);
        btn.className = "bi text-danger bi-heart-fill mx-3 fs-2"
        btn.innerHTML = like
        isLiked = true
    }else return
}
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getDatabase, ref, push, set,onValue} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
const firebaseConfig = {
        apiKey: "AIzaSyB54rMo9k-zgp2eRoThQxooySKsNzRonUM",
        authDomain: "classcraft-6be34.firebaseapp.com",
        projectId: "classcraft-6be34",
        databaseURL: "https://classcraft-6be34-default-rtdb.asia-southeast1.firebasedatabase.app",
        storageBucket: "classcraft-6be34.appspot.com",
        messagingSenderId: "945811480596",
        appId: "1:945811480596:web:604a3f32d46a9427f30701",
        measurementId: "G-3KM6RDH8SH"
        };
const app = initializeApp(firebaseConfig);
let score = 0;
document.getElementById("scoresub").style.display = "none";

const analytics = getAnalytics(app);
const database = getDatabase();
let anscount = 0;
document.getElementById("quizgo").style.display = "none";
document.getElementById("finish").style.display = "none";
function getQuiz(){
    const dbRef = ref(database, 'room/' + document.getElementById('classcode').value + '/quiz');
    onValue(dbRef, (snapshot) => {
     snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        console.log(childKey);
        console.log(childData.answer);
        console.log(childData.question);
  });
}, {
  onlyOnce: true
});
}
function getData(){
    const dbRef = ref(database, 'room/' + document.getElementById('classcode').value + '/data');

    onValue(dbRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        console.log(childKey);
        console.log(childData.data);
        const newParagraph = document.createElement('p');
        newParagraph.innerHTML = childData.data;
        newParagraph.style.textAlign = "center";
        document.body.appendChild(newParagraph);
        document.getElementById("classcode").style.display = "none";
        document.getElementById("go").style.display = "none";
        document.getElementById("quizgo").addEventListener("click", function(){
            newParagraph.style.display = "none";    
        })
  });
}, {
  onlyOnce: true
});
}
document.getElementById("go").addEventListener("click", function(){
    if(document.getElementById("classcode").value.length != 0){
    getData();
    getQuiz();
    document.getElementById("quizgo").style.display = "block";
    console.log(document.getElementById("classcode").length);
    }
    else{
        window.alert("Enter class code");
    }

});
document.getElementById("classcode").addEventListener("keypress", function(e){
    if(e.key === "Enter"){
        if(document.getElementById("classcode").value.length != 0){
            getData();
            getQuiz();
            document.getElementById("quizgo").style.display = "block";
            console.log(document.getElementById("classcode").length);
        }
        else{
            window.alert("Enter class code");
        }
    }
});
document.getElementById("quizgo").addEventListener("click", function(){
    let cdanswer;
    let cdquestion;
    let ck
    const dbRef = ref(database, 'room/' + document.getElementById('classcode').value + '/quiz');
    onValue(dbRef, (snapshot) => {
     snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        console.log(childKey);
        console.log(childData.answer);
        console.log(childData.question);
        let newq = document.createElement("h2")
        let ansbox = document.createElement("input");
        ansbox.className = "ansbox";
        let check = document.createElement("button");
        check.innerHTML = "Check";
        ansbox.style.textAlign = "center";
        newq.innerHTML = childData.question;
        document.body.appendChild(newq);
        document.body.appendChild(ansbox);
        document.body.appendChild(check);
        document.getElementById("quizgo").style.display = "none";
        document.getElementById("finish").style.display = "block";
        anscount = ansbox
        check.addEventListener("click", function(){
            console.log("Check button clicked");
            console.log( "Question" + childData.question +" Answer " + ansbox.value);
            if(ansbox.value == childData.answer){
                window.alert("Correct");
                score = score + 1;
                ansbox.disabled = true;
                check.disabled = true;
            }
            else{
                window.alert("Incorrect");
                ansbox.disabled = true;
                check.disabled = true;  
            }
        })
        ansbox.addEventListener("keypress" , (e)=>{
            if(e.key === "Enter"){
                console.log("Enter key pressed");
                console.log( "Question" + childData.question +" Answer " + ansbox.value);
                if(ansbox.value == childData.answer){
                    window.alert("Correct");
                    score = score + 1;
                    ansbox.disabled = true;
                    check.disabled = true;
                }
                else{
                    window.alert("Incorrect");
                    ansbox.disabled = true;
                    check.disabled = true;  
                }
            }

        })
        document.getElementById("finish").addEventListener("click", function(){
            newq.style.display = "none";
            ansbox.style.display = "none";
            check.style.display = "none";
        })
  });
}, {
  onlyOnce: true
});
document.getElementById("finish").addEventListener("click", function(){
    const numberOfAnsboxes = document.querySelectorAll('.ansbox').length;
    document.getElementById("finish").style.display = "none";
    let nameinp = document.createElement("input");
    let scoreshow = document.createElement("h2");
    scoreshow.innerHTML = "Score: " + score + "/" + numberOfAnsboxes;
    nameinp.placeholder = "Enter name";
    let submitsocre = document.createElement("button");
    submitsocre.innerHTML = "Submit Score";
    let br = document.createElement("br");
    document.body.appendChild(scoreshow);
    document.body.appendChild(br);
    document.body.appendChild(br);
    document.body.appendChild(nameinp);
    document.body.appendChild(br);
    document.body.appendChild(br);
    document.body.appendChild(submitsocre);
    submitsocre.addEventListener("click", function(){
        const postListRef = ref(database, 'scores/' + document.getElementById('classcode').value + '/name '  );
        const newPostRef = push(postListRef);
        set(newPostRef, {   
            name: nameinp.value,
            "score": score + "/" + numberOfAnsboxes,
            "percentage": score/numberOfAnsboxes * 100 + "%"  
    });
    nameinp.style.display = "none";
    submitsocre.style.display = "none";
    scoreshow.style.display = "none";
    let showmess = document.createElement("h1").innerHTML = "Score submitted";
    document.getElementById("scoresub").style.display = "block";
    })
})
});
let form=document.querySelector(".form-box");

//open form and close form by clicking add button
let addform=document.querySelector(".add-btn");
addform.addEventListener("click",()=>{
   if(form.style.display!=="initial"){
     form.style.display="initial";
}else{ form.style.display="none";}
});


//close form by clicking close button
let closebtn=document.querySelector(".close-btn");
closebtn.addEventListener("click",()=>{
    form.style.display="none";
});



// all form inputs selection
let img=document.querySelector(".img");
let name=document.querySelector(".name");
let town=document.querySelector(".town");
let purpose=document.querySelector(".purpose");
let submitbtn=document.querySelector(".create-btn");
let categoryRadio=document.querySelectorAll('input[name="category"]');


function savetoLocalStorage(obj){
    let existingData = JSON.parse(localStorage.getItem("notes")) || [];
    existingData.push(obj);
    localStorage.setItem("notes", JSON.stringify(existingData));
} 



//validation for form inputs
submitbtn.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("submit button clicked");
    const nameRegex = /^[A-Za-z ]{2,50}$/;
    const townRegex = /^[A-Za-z\s-]{2,50}$/;
    const purposeRegex = /^[A-Za-z0-9\s.,!?()-]{3,100}$/;
    const urlRegex = /^https?:\/\/.+/;


    if (!nameRegex.test(name.value)) {
        alert("Invalid name");
        return;
    }

    if (!townRegex.test(town.value)) {
        alert("Invalid town");
        return;
    }

    if (!purposeRegex.test(purpose.value)) {
        alert("Invalid purpose");
        return;
    }

    if (!urlRegex.test(img.value)) {
        alert("Invalid image URL");
        return;
    }

    let selectedCategory = false;
    categoryRadio.forEach(radio => {
        if (radio.checked) {
            selectedCategory = true;
        }
    });

    if (!selectedCategory) {
        alert("Please select a category");
        return;
    }

    savetoLocalStorage({
        img:img.value,
        name:name.value,
        town:town.value,
        purpose:purpose.value,
        category: Array.from(categoryRadio).find(radio => radio.checked).value
    });

    alert("Form submitted successfully!");
    form.querySelectorAll('input').forEach(input => input.value = '');
    let categorRadio = document.querySelectorAll('input[name="category"]');
    categorRadio.forEach(radio => radio.checked = false);
    form.style.display = "none";

});


function addcards(){
    let alltasks = JSON.parse(localStorage.getItem("notes")) 
    alltasks.forEach(note => {
        const card = document.createElement("div");
card.classList.add("card");

const top = document.createElement("div");
top.classList.add("top");

const img = document.createElement("img");
img.src = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500";
img.alt = "profile";

const info = document.createElement("div");

const h2 = document.createElement("h2");
h2.innerText = "Fatima Uma";

const p1 = document.createElement("p");
p1.innerText = "Home Town";

const p2 = document.createElement("p");
p2.innerText = "Bookings";

info.append(h2, p1, p2);

const rightInfo = document.createElement("div");
rightInfo.classList.add("right-info");

const p3 = document.createElement("p");
p3.innerText = "Singapore";

const p4 = document.createElement("p");
p4.innerText = "3 Times";

rightInfo.append(p3, p4);

top.append(img, info, rightInfo);

card.append(top);

document.querySelector(".cards").append(card);
    });
}




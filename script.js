let form=document.querySelector(".form-box");
let cardsWrapper = document.querySelector(".cards-wrapper");
let currentCardIndex = 0;
let filteredCards = [];
let filterCategory = null;

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
    
    // Refresh cards after adding new note
    currentCardIndex = 0;
    filterCategory = null;
    cardsWrapper.innerHTML = "";
    addcards();
    displayCard(0);

});


function addcards(){
    let alltasks = JSON.parse(localStorage.getItem("notes"));
    
    if (!alltasks || alltasks.length === 0) {
        cardsWrapper.innerHTML = "<p style='text-align: center; padding: 20px;'>No notes yet. Add one to get started!</p>";
        filteredCards = [];
        return;
    }
    
    // Filter cards based on selected category
    if (filterCategory) {
        filteredCards = alltasks.filter(note => note.category === filterCategory);
    } else {
        filteredCards = alltasks;
    }
    
    if (filteredCards.length === 0) {
        cardsWrapper.innerHTML = "<p style='text-align: center; padding: 20px;'>No notes in this category.</p>";
        return;
    }
    
    filteredCards.forEach((note, index) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.index = index;
        card.style.display = index === 0 ? "block" : "none";

        const top = document.createElement("div");
        top.classList.add("top");

        const img = document.createElement("img");
        img.src = note.img;
        img.alt = "profile";
        img.onerror = function() {
            this.src = "https://via.placeholder.com/70?text=No+Image";
        };

        const info = document.createElement("div");

        const h2 = document.createElement("h2");
        h2.innerText = note.name;

        const p1 = document.createElement("p");
        p1.innerText = "Home Town";

        const p2 = document.createElement("p");
        p2.innerText = "Purpose";

        info.append(h2, p1, p2);

        const rightInfo = document.createElement("div");
        rightInfo.classList.add("right-info");

        const p3 = document.createElement("p");
        p3.innerText = note.town;

        const p4 = document.createElement("p");
        p4.innerText = note.purpose;

        rightInfo.append(p3, p4);

        top.append(img, info, rightInfo);

        const actions = document.createElement("div");
        actions.classList.add("actions");

        const callBtn = document.createElement("button");
        callBtn.classList.add("call-btn");
        callBtn.innerHTML = '<i class="fa-solid fa-phone"></i> Call';

        const msgBtn = document.createElement("button");
        msgBtn.classList.add("msg-btn");
        msgBtn.innerText = "Message";

        actions.append(callBtn, msgBtn);

        // Add priority color indicator
        const priorityDiv = document.createElement("div");
        priorityDiv.style.marginTop = "15px";
        priorityDiv.style.padding = "10px";
        priorityDiv.style.borderRadius = "10px";
        priorityDiv.style.textAlign = "center";
        priorityDiv.style.fontWeight = "bold";
        
        const categoryColors = {
            "Emergency": "#ff0000",
            "Important": "#ffd700",
            "Urgent": "#8b00ff",
            "No Rush": "#808080"
        };
        
        priorityDiv.style.backgroundColor = categoryColors[note.category] || "#ccc";
        priorityDiv.style.color = (note.category === "Important") ? "black" : "white";
        priorityDiv.innerText = note.category;

        card.append(top, actions, priorityDiv);
        cardsWrapper.append(card);
    });
}

function displayCard(index) {
    let cards = document.querySelectorAll(".card");
    
    if (cards.length === 0) return;
    
    // Ensure index wraps around
    if (index >= cards.length) {
        currentCardIndex = 0;
    } else if (index < 0) {
        currentCardIndex = cards.length - 1;
    } else {
        currentCardIndex = index;
    }
    
    cards.forEach(card => {
        card.style.display = "none";
    });
    
    cards[currentCardIndex].style.display = "block";
}

// Arrow button navigation
let prevBtn = document.querySelector(".prev-btn");
let nextBtn = document.querySelector(".next-btn");

prevBtn.addEventListener("click", () => {
    displayCard(currentCardIndex - 1);
});

nextBtn.addEventListener("click", () => {
    displayCard(currentCardIndex + 1);
});

// Color dot filtering
const categoryMap = {
    "emergency": "Emergency",
    "important": "Important",
    "urgent": "Urgent",
    "norush": "No Rush"
};

document.querySelectorAll(".dot").forEach(dot => {
    dot.addEventListener("click", (e) => {
        const dotClass = Array.from(e.target.classList).find(cls => cls !== "dot");
        const selectedCategory = categoryMap[dotClass];
        
        filterCategory = selectedCategory;
        currentCardIndex = 0;
        cardsWrapper.innerHTML = "";
        addcards();
        displayCard(0);
    });
});

// Initialize cards on page load
window.addEventListener("DOMContentLoaded", () => {
    addcards();
    displayCard(0);
});

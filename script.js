// Get all DOM elements
let form = document.querySelector(".form-box");
let cardsWrapper = document.querySelector(".cards-wrapper");
let addBtn = document.querySelector(".add-btn");
let closeBtn = document.querySelector(".close-btn");
let submitBtn = document.querySelector(".create-btn");
let prevBtn = document.querySelector(".prev-btn");
let nextBtn = document.querySelector(".next-btn");

// Form inputs
let imgInput = document.querySelector(".img");
let nameInput = document.querySelector(".name");
let townInput = document.querySelector(".town");
let purposeInput = document.querySelector(".purpose");
let categoryRadios = document.querySelectorAll('input[name="category"]');

// State variables
let currentCardIndex = 0;
let allCards = [];

// Toggle form visibility
addBtn.addEventListener("click", () => {
    form.style.display = form.style.display === "block" ? "none" : "block";
});

closeBtn.addEventListener("click", () => {
    form.style.display = "none";
});

// Save to localStorage
function saveToLocalStorage(note) {
    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes.push(note);
    localStorage.setItem("notes", JSON.stringify(notes));
}

// Form submission
submitBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const nameRegex = /^[A-Za-z ]{2,50}$/;
    const townRegex = /^[A-Za-z\s-]{2,50}$/;
    const purposeRegex = /^[A-Za-z0-9\s.,!?()-]{3,100}$/;
    const urlRegex = /^https?:\/\/.+/;

    // Validation
    if (!nameRegex.test(nameInput.value)) {
        alert("Invalid name - must be 2-50 letters");
        return;
    }
    if (!townRegex.test(townInput.value)) {
        alert("Invalid town");
        return;
    }
    if (!purposeRegex.test(purposeInput.value)) {
        alert("Invalid purpose");
        return;
    }
    if (!urlRegex.test(imgInput.value)) {
        alert("Invalid image URL");
        return;
    }

    let selectedCategory = null;
    for (let radio of categoryRadios) {
        if (radio.checked) {
            selectedCategory = radio.value;
            break;
        }
    }

    if (!selectedCategory) {
        alert("Please select a category");
        return;
    }

    // Save to localStorage
    saveToLocalStorage({
        img: imgInput.value,
        name: nameInput.value,
        town: townInput.value,
        purpose: purposeInput.value,
        category: selectedCategory
    });

    // Clear form
    imgInput.value = "";
    nameInput.value = "";
    townInput.value = "";
    purposeInput.value = "";
    categoryRadios.forEach(r => r.checked = false);
    form.style.display = "none";

    // Refresh display
    currentCardIndex = 0;
    renderCards();
});

// Create card HTML for a note
function createCardElement(note, index) {
    const card = document.createElement("div");
    card.className = "card";
    card.style.display = index === 0 ? "block" : "none";

    const top = document.createElement("div");
    top.className = "top";

    const img = document.createElement("img");
    img.src = note.img;
    img.alt = "profile";
    img.style.width = "70px";
    img.style.height = "70px";
    img.style.borderRadius = "50%";
    img.style.objectFit = "cover";
    
    // Prevent infinite error loop - only set onerror once
    let errorHandled = false;
    img.addEventListener("error", function(e) {
        if (!errorHandled) {
            errorHandled = true;
            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='70' height='70'%3E%3Crect fill='%23ddd' width='70' height='70'/%3E%3Ctext x='50%25' y='50%25' font-size='12' text-anchor='middle' dy='.3em' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";
        }
    }, { once: true });

    const info = document.createElement("div");
    const h2 = document.createElement("h2");
    h2.innerText = note.name;
    const p1 = document.createElement("p");
    p1.innerText = "Home Town";
    const p2 = document.createElement("p");
    p2.innerText = note.town;
    info.append(h2, p1, p2);

    const rightInfo = document.createElement("div");
    rightInfo.className = "right-info";
    const p3 = document.createElement("p");
    p3.innerText = "Purpose";
    const p4 = document.createElement("p");
    p4.innerText = note.purpose;
    rightInfo.append(p3, p4);

    top.append(img, info, rightInfo);

    const actions = document.createElement("div");
    actions.className = "actions";
    const callBtn = document.createElement("button");
    callBtn.className = "call-btn";
    callBtn.innerHTML = '<i class="fa-solid fa-phone"></i> Call';
    const msgBtn = document.createElement("button");
    msgBtn.className = "msg-btn";
    msgBtn.innerText = "Message";
    actions.append(callBtn, msgBtn);

    // Priority indicator
    const priority = document.createElement("div");
    priority.style.marginTop = "15px";
    priority.style.padding = "10px";
    priority.style.borderRadius = "10px";
    priority.style.textAlign = "center";
    priority.style.fontWeight = "bold";

    const colors = {
        "Emergency": "#ff0000",
        "Important": "#ffd700",
        "Urgent": "#8b00ff",
        "No Rush": "#808080"
    };

    priority.style.backgroundColor = colors[note.category] || "#ccc";
    priority.style.color = note.category === "Important" ? "black" : "white";
    priority.innerText = note.category;

    card.append(top, actions, priority);
    return card;
}

// Render cards from localStorage
function renderCards() {
    cardsWrapper.innerHTML = "";
    let notes = JSON.parse(localStorage.getItem("notes")) || [];

    if (notes.length === 0) {
        cardsWrapper.innerHTML = "<p style='text-align: center; padding: 20px; width: 100%;'>No notes yet. Click + to add one!</p>";
        allCards = [];
        return;
    }

    allCards = notes;

    notes.forEach((note, index) => {
        const card = createCardElement(note, index);
        cardsWrapper.append(card);
    });
}

// Display specific card
function displayCard(index) {
    if (allCards.length === 0) return;

    if (index >= allCards.length) {
        currentCardIndex = 0;
    } else if (index < 0) {
        currentCardIndex = allCards.length - 1;
    } else {
        currentCardIndex = index;
    }

    let cards = document.querySelectorAll(".card");
    cards.forEach(card => card.style.display = "none");
    if (cards[currentCardIndex]) {
        cards[currentCardIndex].style.display = "block";
    }
}

// Navigation
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

        let notes = JSON.parse(localStorage.getItem("notes")) || [];
        let filtered = notes.filter(n => n.category === selectedCategory);

        cardsWrapper.innerHTML = "";

        if (filtered.length === 0) {
            cardsWrapper.innerHTML = `<p style='text-align: center; padding: 20px; width: 100%;'>No ${selectedCategory} notes</p>`;
            allCards = [];
            return;
        }

        allCards = filtered;
        filtered.forEach((note, index) => {
            const card = createCardElement(note, index);
            cardsWrapper.append(card);
        });

        currentCardIndex = 0;
    });
});

// Initialize on page load
renderCards();

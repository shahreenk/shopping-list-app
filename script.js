import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js';
import { getDatabase, ref, push, onValue, remove } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js';

const appSettings = {
    databaseURL: 'https://realtime-database-43314-default-rtdb.firebaseio.com/'
}

const app = initializeApp(appSettings) // creates a Firebase App object
const database = getDatabase(app); // sets up a database variable
const shoppingListInDB = ref(database, 'shoppingList'); // creates a reference to push data to

const inputFieldEl = document.getElementById('input-field');
const addButtonEl = document.getElementById('add-button');
const shoppingListEl = document.getElementById('shopping-list');

addButtonEl.addEventListener('click', () => {
    const inputValue = inputFieldEl.value;
    push(shoppingListInDB, inputValue);
    clearInputField();
})

onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        const itemsArray = Object.entries(snapshot.val());
        clearShoppingListEl();
        itemsArray.forEach(item => {
        appendToShoppingListEl(item);
    })
    } else {
        shoppingListEl.textContent = "No items here... yet";
    }
})

function clearInputField() {
    inputFieldEl.value = '';
}

function appendToShoppingListEl(item) {
    const itemID = item[0];
    const itemValue = item[1]
    const newLi = document.createElement('li');
    newLi.textContent = itemValue;
    newLi.addEventListener('click', () => {
        const itemLocationInDB = ref(database, `shoppingList/${itemID}`);
        remove(itemLocationInDB);
    })
    shoppingListEl.appendChild(newLi);
}

function clearShoppingListEl() {
    shoppingListEl.innerText = '';
}
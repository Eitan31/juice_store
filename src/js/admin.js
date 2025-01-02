import { Product } from './product.js'; // ייבוא המחלקה Product

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loadUsers').addEventListener('click', fetchUsers);
    document.getElementById('loadProducts').addEventListener('click', fetchProducts);
    document.getElementById('addProductButton').addEventListener('click', toggleAddProductForm);
    const hideUsersButton = document.getElementById('hideUsersButton');
    if (hideUsersButton) {
        hideUsersButton.addEventListener('click', hideUsers);
    }
    const hideDetailsButton = document.getElementById('hideDetailsButton');
    if (hideDetailsButton) {
        hideDetailsButton.addEventListener('click', hideDetails);
    }
});

let users = [];
let products = [];

async function fetchUsers() {
    try {
        const response = await fetch('/json/users.json');
        const data = await response.json();
        console.log('Data received from server:', data); // הוסף לוג כדי לבדוק את הנתונים המתקבלים
        if (typeof data !== 'object') {
            throw new Error('Data is not an object');
        }
        users = Object.values(data).flat();
        console.log('Users array:', users); // הוסף לוג כדי לבדוק את מערך המשתמשים
        displayUsers(users);
    } catch (error) {
        console.error('שגיאה:', error);
        alert(error.message);
    }
}

async function fetchProducts() {
    try {
        const response = await fetch('/json/products.json');
        const data = await response.json();
        products = data;
        displayProducts(products);
    } catch (error) {
        console.error('שגיאה:', error);
        alert(error.message);
    }
}

function displayUsers(users, city = 'all') {
    if (!Array.isArray(users)) {
        console.error('users is not an array:', users);
        return;
    }

    const userList = document.getElementById('userList');
    userList.innerHTML = ''; // נקה את הרשימה הקודמת
    const filteredUsers = city === 'all' ? users : users.filter(user => user.city === city);
    console.log('Filtered users:', filteredUsers); // הוסף לוג כדי לבדוק את המשתמשים המסוננים
    filteredUsers.forEach(user => {
        const userItem = document.createElement('div');
        userItem.style.border = '1px solid black';
        userItem.style.padding = '10px';
        userItem.style.margin = '10px';
        userItem.innerHTML = `
            <p>שם: ${user.name}</p>
            <p>טלפון: ${user.phone}</p>
            <p>עיר: ${user.city}</p>
            <p>כתובת: ${user.address}</p>
            <p>מיקום: ${user.position}</p>
            <button onclick="editUser('${user.id}')">ערוך</button>
            <button onclick="deleteUser('${user.id}')">מחק</button>
        `;
        userList.appendChild(userItem);
    });
}

function displayProducts(products) {
    const productList = document.getElementById('productList');
    productList.innerHTML = ''; // נקה את הרשימה הקודמת
    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.style.border = '1px solid black';
        productItem.style.padding = '10px';
        productItem.style.margin = '10px';
        productItem.innerHTML = `
            <h3>${product.name}</h3>
            <p>מחיר: ${product.price} ש"ח</p>
            <p>תיאור: ${product.description}</p>
            <p>קטגוריה: ${product.category}</p>
            <p>נפח: ${product.volume}</p>
            <p>תאריך תפוגה: ${product.shelfLife}</p>
            <p>אחסון: ${product.storage}</p>
            <img src="${product.image}" alt="${product.name}" style="width: 100px; height: auto;">
            <button onclick="editProduct('${product.id}')">ערוך</button>
            <button onclick="deleteProduct('${product.id}')">מחק</button>
        `;
        productList.appendChild(productItem);
    });
}

function hideUsers() {
    const userList = document.getElementById('userList');
    userList.innerHTML = ''; // נקה את הרשימה
}

function hideDetails() {
    const userList = document.getElementById('userList');
    userList.style.display = 'none'; // הסתר את הרשימה
    const productList = document.getElementById('productList');
    productList.style.display = 'none'; // הסתר את רשימת המוצרים
}

function addUser() {
    const form = document.createElement('div');
    form.innerHTML = `
        <label>שם:</label>
        <input type="text" id="newUserName" required>
        <label>טלפון:</label>
        <input type="text" id="newUserPhone" required>
        <label>עיר:</label>
        <input type="text" id="newUserCity" required>
        <label>כתובת:</label>
        <input type="text" id="newUserAddress" required>
        <label>מיקום:</label>
        <input type="number" id="newUserPosition" required>
        <label>הערה:</label>
        <input type="text" id="newUserNote">
        <label>סיסמה:</label>
        <input type="password" id="newUserPassword">
        <label>אימייל:</label>
        <input type="email" id="newUserEmail">
        <button id="saveNewUserButton">שמור משתמש חדש</button>
        <button id="cancelAddUserButton">ביטול</button>
    `;

    document.body.appendChild(form); // הוסף את הטופס לגוף הדף

    document.getElementById('saveNewUserButton').addEventListener('click', saveNewUser);
    document.getElementById('cancelAddUserButton').addEventListener('click', () => form.remove());
}

function saveNewUser() {
    const name = document.getElementById('newUserName').value;
    const phone = document.getElementById('newUserPhone').value;
    const city = document.getElementById('newUserCity').value;
    const address = document.getElementById('newUserAddress').value;
    const position = document.getElementById('newUserPosition').value;
    const note = document.getElementById('newUserNote').value;
    const password = document.getElementById('newUserPassword').value;
    const email = document.getElementById('newUserEmail').value;

    const newUser = {
        id: generateId(),
        name,
        phone,
        city,
        address,
        position,
        note,
        password,
        email,
        join_date: new Date().toISOString().split('T')[0],
        cart: [],
        purchases: [],
        code: ''
    };

    users.push(newUser);
    displayUsers(users);
    document.querySelector('div').remove(); // הסר את הטופס
}

function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

function editUser(userId) {
    console.log(`עריכת משתמש עם מזהה: ${userId}`);
    const user = users.find(user => user.id === userId);
    if (user) {
        user.name = prompt('ערוך שם משתמש:', user.name);
        user.phone = prompt('ערוך טלפון:', user.phone);
        user.city = prompt('ערוך עיר:', user.city);
        user.address = prompt('ערוך כתובת:', user.address);
        user.position = prompt('ערוך מיקום:', user.position);
        displayUsers(users);
    }
}

function deleteUser(userId) {
    console.log(`מחיקת משתמש עם מזהה: ${userId}`);
    const index = users.findIndex(user => user.id === userId);
    if (index !== -1) {
        users.splice(index, 1);
        displayUsers(users);
    }
}

function editProduct(productId) {
    console.log(`עריכת מוצר עם מזהה: ${productId}`);
    const product = products.find(p => p.id === productId);
    if (product) {
        product.name = prompt('ערוך שם מוצר:', product.name);
        product.price = prompt('ערוך מחיר:', product.price);
        product.description = prompt('ערוך תיאור:', product.description);
        product.category = prompt('ערוך קטגוריה:', product.category);
        product.volume = prompt('ערוך נפח:', product.volume);
        product.shelfLife = prompt('ערוך תאריך תפוגה:', product.shelfLife);
        product.storage = prompt('ערוך אחסון:', product.storage);
        displayProducts(products);
    }
}

function deleteProduct(productId) {
    console.log(`מחיקת מוצר עם מזהה: ${productId}`);
    const index = products.findIndex(product => product.id === productId);
    if (index !== -1) {
        products.splice(index, 1);
        displayProducts(products);
    }
}

// ודא שהפונקציה מוגדרת רק פעם אחת
function toggleAddProductForm() {
    // הוסף כאן את הקוד להצגת/הסתרת טופס הוספת מוצר
    console.log('הצגת/הסתרת טופס הוספת מוצר');
}

// הוסף את הפונקציות לאובייקט window כדי שיהיו נגישות מה-HTML
window.editUser = editUser;
window.deleteUser = deleteUser;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
import { shopItems } from "./data.js";

let label = document.getElementById('label');
let shoppingCart = document.getElementById('shopping-cart');

// טוען את נתוני הסל והמשתמש מה-localStorage
let basket = JSON.parse(localStorage.getItem("data")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser"));

// פונקציה לעדכון כמות מוצרים בסל
let calculation = () => {
    let cartIcon = document.getElementById("cartAmount");
    cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0);
};


// עדכון פרטי הסל
basket = basket.map(item => {
    let product = shopItems.find(product => product.id === item.id);
    if (product) {
        return {
            ...item,
            shelfLife: product.shelfLife || "-",
            storage: product.storage || "",
            volume: product.volume || "",
        };
    }
    return item;
});

localStorage.setItem("data", JSON.stringify(basket));

let generateCartItems = () => {
    if (basket.length !== 0) {
        shoppingCart.innerHTML = basket
            .map((x) => {
                let { id, item, shelfLife, storage, volume } = x;
                let search = shopItems.find((y) => y.id === id) || [];
                return `
                    <div class="cart-item">
                        <div class="title-price-x">
                        <h4 class="title-price">
                            <p>${search.name}</p>
                            <p class="cart-item-price">${search.price}₪</p>
                        </h4>
                        <img width="100" src=${search.img} alt="" />
                        <div class="details">
                                <i data-id="${id}" class="bi-x-lg"></i>
                                <div class="buttons">
                                    <i data-id="${id}" class="increment bi bi-plus-lg"></i>
                                    <div id=${id} class="quantity">${item}</div>
                                    <i data-id="${id}" class="decrement bi bi-dash-lg"></i>
                                </div>
                            </div>
                        </div>
                        <div class="info-icon-cart" id="info-${id}">
                            <i data-id="${id}" class="bi bi-info-circle"></i> 
                            <div class="info-content-cart" id="content-${id}">
                                <p><strong>תוקף:</strong> ${shelfLife || "-"}</p>
                                <p><strong>אחסון:</strong> ${storage || "-"}</p>
                                <p><strong>כמות:</strong> ${volume || "-"}</p>
                            </div>
                        </div>
                        <div class="cart-item-total">
                            <h3 data-id="${id}">${item * search.price}₪</h3>
                        </div>
                    </div>     
            `;
            })
            .join(''); 

        // חיבור מאזינים אחרי יצירת האלמנטים
        document.querySelectorAll('.increment').forEach((btn) => {
            btn.addEventListener('click', (e) => increment(e.target.dataset.id));
        });

        document.querySelectorAll('.decrement').forEach((btn) => {
            btn.addEventListener('click', (e) => decrement(e.target.dataset.id));
        });

        document.querySelectorAll('.bi-x-lg').forEach((btn) => {
            btn.addEventListener('click', (e) => removeItem(e.target.dataset.id));
        });

        document.querySelectorAll(".bi-info-circle").forEach((btn) => {
            btn.addEventListener("click", (e) => toggleProductInfo(e.target.dataset.id));
        });

        let toggleProductInfo = (id) => {
            let content = document.getElementById(`content-${id}`);
            if (content) {
                content.style.display = content.style.display === "block" ? "none" : "block";
            }
        };

    } else {
        shoppingCart.innerHTML = ``;
        label.innerHTML = `
            <h2>סל הקניות ריק</h2>
            <a href="index.html">
                <button class="HomeBtn">חזרה למסך הבית</button>
            </a>
        `;
    }
    calculation();
};

// הוספה לסל
let increment = (id) => {
    let search = basket.find((item) => item.id === id);

    if (!search) {
        let product = shopItems.find((x) => x.id === id);

        if (!product) {
            console.error(`Product with ID ${id} not found in shopItems.`);
            return;
        }

        basket.push({
            id: product.id,
            item: 1,
            shelfLife: product.shelfLife || "לא הוגדר",
            storage: product.storage || "לא הוגדר",
            rating: product.rating || "לא הוגדר",
            volume: product.volume || "לא הוגדר",
            name: product.name || "לא הוגדר",
            price: product.price || 0,
        });
    } else {
        search.item++;
    }

    update(id);
    localStorage.setItem("data", JSON.stringify(basket));
    updateUserCart(); // עדכון עגלת המשתמש

    calculation();
    totalAmount();
};

// הפחתה ממספר הפריטים
let decrement = (id) => {
    let search = basket.find((item) => item.id === id);

    if (!search || search.item === 0) return;

    search.item--;

    if (search.item === 0) {
        removeItem(id);
        return;
    }

    update(id);
    localStorage.setItem("data", JSON.stringify(basket));
    updateUserCart(); // עדכון עגלת המשתמש

    calculation();
};

// עדכון כמות לאחר שינוי
let update = (id) => {
    let search = basket.find((x) => x.id === id);
    if (!search) return;
    document.getElementById(id).innerHTML = search.item;
    let itemPriceElement = document.querySelector(`.cart-item h3[data-id="${id}"]`);
    if (itemPriceElement) {
        let shopItem = shopItems.find((x) => x.id === id);
        itemPriceElement.innerHTML = `${search.item * shopItem.price}₪`;
    }
    calculation();
    totalAmount();
};

// הסרת פריט
let removeItem = (id) => {
    basket = basket.filter((x) => x.id !== id);
    generateCartItems();
    totalAmount();
    calculation();
    localStorage.setItem("data", JSON.stringify(basket));
    updateUserCart(); // עדכון עגלת המשתמש
};

// ניקוי הסל
let clearCart = () => {
    basket = [];
    generateCartItems();
    calculation();
    localStorage.setItem("data", JSON.stringify(basket));
    updateUserCart(); // עדכון עגלת המשתמש
};

// חישוב סך כל המחיר
let totalAmount = () => {
    if (basket.length !== 0) {
        let amount = basket.map((x) => {
            let { item, id } = x;
            let search = shopItems.find((y) => y.id === id) || [];
            return item * search.price;
        }).reduce((x, y) => x + y, 0);

        label.innerHTML = `
        <h2>מחיר כולל: ${amount}₪</h2>
        <button id="checkoutBtn" class="checkout">בצע הזמנה</button>
        <button id="clearCartBtn"  class="removeAll">הסרת כל הפריטים</button>
        `;
        document.getElementById("clearCartBtn").addEventListener("click", clearCart);
    } else {
        label.innerHTML = "<h2>סל הקניות ריק</h2>";
    }

    // קריאה לפונקציה שתציג את פריטי הסל
    generateCartItems();
};

totalAmount();



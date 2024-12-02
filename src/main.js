import { shopItems } from "./data.js";
let shop = document.getElementById('shop');
let basket = JSON.parse(localStorage.getItem("data"))|| [];
let generateShop = () => {
    shop.innerHTML = shopItems
        .map((x) => {

            let { id, name, price, desc, img, shelfLife, storage, rating, volume } = x;
            let search = basket.find((x) => x.id === id) || { item: 0 };
            return `
                <div id=product-id-${id} class="item">
                    <img width="235" src=${img} alt="">
                    <div class="details">
                        <div class="info-icon" id="info-${id}">
                            <i class="bi bi-info-circle"></i>
                            <div class="info-content" id="content-${id}">
                                ${shelfLife ? `<p><strong>תוקף:</strong> ${shelfLife}</p>` : `<p><strong>תוקף:</strong> -</p>`}
                                ${storage ? `<p><strong>אחסון:</strong> ${storage}</p>` : `<p><strong>אחסון:</strong> -</p>`}
                                ${volume ? `<p><strong>כמות:</strong> ${volume}</p>` : `<p><strong>נפח:</strong> -</p>`}
                            </div>
                        </div>
                        <h3>${name}</h3>
                        <p>${desc}</p>
                        <div class="price">
                            <h2>${price}₪</h2>
                            <div class="buttons">
                                <i class="bi bi-plus-lg increment" data-id="${id}"></i>
                                <div id="${id}" class="quantity">
                                    ${search.item === undefined ? 0 : search.item}
                                </div>
                                <i class="bi bi-dash-lg decrement" data-id="${id}"></i>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        })
        .join("");

    // הוספת מאזינים לאירועים לכפתורי הוספה והפחתה
    document.querySelectorAll(".increment").forEach((btn) => {
        btn.addEventListener("click", (e) => increment(e.target.dataset.id));
    });

    document.querySelectorAll(".decrement").forEach((btn) => {
        btn.addEventListener("click", (e) => decrement(e.target.dataset.id));
    });
};


generateShop()

let increment = (id) => {
    // חיפוש מוצר בסל
    let search = basket.find((item) => item.id === id);

    if (!search) {
        // אם המוצר לא נמצא, נוסיף אותו עם כמות ראשונית של 1
        basket.push({ id: id, item: 1 });
    } else {
        // אם המוצר כבר בסל, נגדיל את הכמות
        search.item++;
    }

    // עדכון הכמות ב-HTML
    update(id);

    // שמירה ל-localStorage
    localStorage.setItem("data", JSON.stringify(basket));
};
let decrement = (id) => {
    // חיפוש מוצר בסל
    let search = basket.find((item) => item.id === id);

    if (!search || search.item === 0) {
        // אם המוצר לא בסל או שהכמות שווה ל-0, לא נעשה דבר
        return;
    } else {
        // הקטנת הכמות
        search.item--;
    }

    // אם הכמות הפכה ל-0, נמחק את המוצר מהסל
    basket = basket.filter((item) => item.item !== 0);

    // עדכון הכמות ב-HTML
    update(id);

    // שמירה ל-localStorage
    localStorage.setItem("data", JSON.stringify(basket));
};
let update = (id) => {
    let search = basket.find((x) => x.id === id);
    let quantity = search ? search.item : 0; // בדיקה אם search מוגדר
    document.getElementById(id).innerHTML = quantity; 
    calculation();
    updateCartInfo();
};


let calculation = () => {
    let cartIcon = document.getElementById("cartAmount");
    cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0);
};
calculation();
document.querySelectorAll('.info-icon').forEach(icon => {
    icon.addEventListener('mouseenter', (e) => {
        let content = e.target.querySelector('.info-content');
        content.style.display = 'block'; // הצגת המידע
    });
    icon.addEventListener('mouseleave', (e) => {
        let content = e.target.querySelector('.info-content');
        content.style.display = 'none'; // הסתרת המידע
    });
});
// פונקציה שמעדכנת את המידע בעגלת הקניות
let updateCartInfo = () => {
    let cartInfoBox = document.getElementById('cart-info-box');
    if (basket.length === 0) {
        cartInfoBox.innerHTML = '';  // אם אין פריטים בעגלה, לא נציג כלום
        return;
    }
    
    // אם יש פריטים בעגלה, נבנה את התצוגה
    cartInfoBox.innerHTML = basket
        .map((item) => {
            let product = shopItems.find(product => product.id === item.id);
            if (!product) return '';

            // נוסיף מידע מקוצר של כל פריט
            return `
                <div class="cart-info-item">
                    <p><strong>${product.name}</strong></p>
                    <p>מחיר: ${product.price}₪</p>
                    <p>כמות: ${item.item}</p>
                    <p>סה"כ: ${product.price * item.item}₪</p>
                </div>
            `;
        })
        .join('');
};

// קריאה לפונקציה לעדכון המידע בעגלת הקניות
updateCartInfo();


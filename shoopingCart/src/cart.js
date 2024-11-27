import {shopItems} from './data.js'
let label = document.getElementById('label');
let shoppingCart = document.getElementById('shopping-cart');

let basket = JSON.parse(localStorage.getItem("data")) || [];

let calculation = () => {
    let cartIcon = document.getElementById("cartAmount");
    cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0);
};
calculation();
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
    if (basket.length !== 0){
        shoppingCart.innerHTML = basket
            .map((x) => {
                let {id, item, shelfLife, storage, volume} = x;
                let search = shopItems.find((y) => y.id === id) || [];
                return` 
                    <div class="cart-item">
                        <img width="100" src=${search.img} alt="" />
                        <div class="details">
                            <div class"title-price-x">
                                <h4 class="title-price">
                                    <p>${search.name}</p>
                                    <p class="cart-item-price">${search.price}₪</p>
                                </h4>
                                <i data-id="${id}" class=" bi-x-lg"></i>
                            
                                <div class="buttons">
                                    <i data-id="${id}" class="increment bi bi-plus-lg"></i>
                                    <div id=${id} class="quantity">${item}</div>
                                    <i data-id="${id}" class="decrement bi bi-dash-lg"></i>
                                </div>
                            </div>
                            <h3 data-id="${id}">${item * search.price}₪</h3>
                        </div>
                        <div class="info-icon-cart" id="info-${id}">
                            <i data-id="${id}" class="bi bi-info-circle"></i> 
                            <div class="info-content-cart" id="content-${id}">
                                <p><strong>תוקף:</strong> ${shelfLife || "-"}</p>
                                <p><strong>אחסון:</strong> ${storage || "-"}</p>
                                <p><strong>כמות:</strong> ${volume || "-"}</p>
                            </div>
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
        document.querySelectorAll(".bi bi-info-circle").forEach((btn) => {
            btn.addEventListener("click", (e) => toggleProductInfo(e.target.dataset.id));
        });
        let toggleProductInfo = (id) => {
            let content = document.getElementById(`content-${id}`);
            if (content) {
        // אם התוכן מוצג, נסגור אותו. אם לא, נפתח אותו.
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
};





generateCartItems();




let increment = (id) => {
    console.log("Increment called for ID:", id);

    // חיפוש מוצר בסל
    let search = basket.find((item) => item.id === id);

    if (!search) {
        // מציאת הפריט ב-shopItems
        let product = shopItems.find((x) => x.id === id);
        console.log("Product found in shopItems:", product);

        if (!product) {
            console.error(`Product with ID ${id} not found in shopItems.`);
            return; // עצירת הפונקציה אם המוצר לא קיים
        }

        // הוספת המוצר לסל
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
        console.log("Product added to basket:", basket);
    } else {
        // עדכון כמות המוצר
        search.item++;
        console.log("Updated item quantity in basket:", search);
    }

    // עדכון התצוגה
    update(id);

    // שמירת הסל ב-localStorage
    localStorage.setItem("data", JSON.stringify(basket));
    console.log("Basket saved to localStorage:", basket);

    // עדכון המידע הכולל
    calculation();
    totalAmount();
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
    if (search.item === 0){
        removeItem(id);
        return;
    }

    // עדכון הכמות ב-HTML
    update(id);

    // שמירה ל-localStorage
    localStorage.setItem("data", JSON.stringify(basket));
};
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
let removeItem = (id) => {
    basket = basket.filter((x) => x.id !== id);
    generateCartItems();
    totalAmount();
    calculation();
    localStorage.setItem("data", JSON.stringify(basket));


};
let clearCart = () => {
    basket = [];
    generateCartItems();
    calculation();
    localStorage.setItem("data", JSON.stringify(basket));

}
let totalAmount = () => {
    if(basket.length !== 0){
        let amount = basket.map((x) =>{
            let {item, id} = x;
            let search = shopItems.find((y) => y.id === id) || [];
            return item * search.price;

        }).reduce((x,y) => x + y, 0);
        label.innerHTML = `
        <h2>מחיר כולל: ${amount}₪</h2>
        <button id="checkoutBtn" class="checkout">בצע הזמנה</button>
        <button id="clearCartBtn"  class="removeAll">הסרת כל הפריטים</button>
        `;
        //document.getElementById("checkoutBtn").addEventListener("click", addToOreder)
        document.getElementById("clearCartBtn").addEventListener("click", clearCart);
    }
    else return;
};
totalAmount();
let showProductInfo = (id) => {
    let product = shopItems.find((x) => x.id === id);
    if (!product) return;

    // תיבת הודעה לדוגמה (אפשר לשפר באמצעות מודל או אלמנט HTML מותאם)
    alert(`
        שם המוצר: ${product.name}
        תיאור: ${product.desc}
        קטגוריה: ${product.category || "לא הוגדר"}
        נפח: ${product.volume || "לא הוגדר"}
        תוקף: ${product.shelfLife || "לא הוגדר"}
        אחסון: ${product.storege || "לא הוגדר"}
        הנחה: ${product.discountAmount || 0}₪
        דירוג: ${product.rating || "לא הוגדר"}
    `);
};
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

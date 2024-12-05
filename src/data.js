
export class Product {
    // בנאי ליצירת מוצרים
    constructor(id, name, price, image, description, category, volume, discountAmount, rating, shelfLife, storage) {
        this.id = id; 
        this.name = name;
        this.price = price;
        this.image = image;
        this.description = description;
        this.category = category || "מיצים 2 ליטר";
        this.volume = volume || "2 ליטר";
        this.discountAmount = discountAmount || 0; // ערך ברירת מחדל 0
        this.rating = rating || 0; // דירוג ברירת מחדל 0
        this.shelfLife = shelfLife|| "7-10 ימים";
        this.storage = storage || "מומלץ לשמור בקירור";
    }


    // פונקציה להוספת המוצר למערך shopItems
    addToShopItems() {
        shopItems.push({
            id: this.id,
            name: this.name,
            price: this.price,
            desc: this.description,
            img: this.image,
            category: this.category,
            volume: this.volume,
            discountAmount: this.discountAmount,
            rating: this.rating,
            shelfLife: this.shelfLife,
            storage: this.storage,
        });
    }
    static updateProduct(id, updatedFields) {
        let product = shopItems.find((item) => item.id === id);
        const notification = document.getElementById("notification");  
        // עדכון כל המאפיינים המתקבלים ב-updatedFields
        for (let key in updatedFields) {
            if (product.hasOwnProperty(key)) {
                product[key] = updatedFields[key];
            }
        }
    }
};


export let shopItems = [];

let orangeJuice = new Product(
    "orange_juice",
    "תפוזים",
    29,
    "תמונות/תפוזים.jpg",
    "מיץ תפוזים סחוט טבעי",
);
let lemonadeJuice = new Product(
    "lemonade_juice",
    "לימונדה",
    25,
    "תמונות/לימונדה.png",
    "מיץ לימונדה סחוט טבעי",

);
let appleJuice = new Product(
    "apple_juice",
    "תפוחים",
    32,
    "תמונות/תפוחים.png",
    "מיץ תפוחים טבעי",
);
let grapefruitJuice = new Product(
    "grapefruit_juice",
    "אשכוליות",
    29,
    "תמונות/אשכוליות.png",
    "מיץ אשכוליות טבעי",
);
let pomlem = new Product(
    "pomlem_juice",
    "רימונדה",
    32,
    "תמונות/רימונדה.webp",
    "מיץ רימונים לימונים",
)
let lemonJuice = new Product(
    "lemon_juice",
    "לימון",
    26,
    "תמונות/לימון.jpg",
    "מיץ לימון סחוט טבעי",
    "מיצים ליטר",
    "ליטר",
)
let pomegranateJuice = new Product(
    "pomegranate_juice",
    "רימונים",
    32,
    "תמונות/רימונים.webp",
    "מיץ רימונים (קפוא)",
    "מיצים ליטר",
    "ליטר",
)
let orange_juice1L = new Product(
    "orange_juice1L",
    "תפוזים ליטר",
    20,
    "תמונות/תפוז1.jpg",
    "מיץ תפוזים סחוט טבעי",
    "מיצים ליטר",
    "ליטר", 
)
let dates = new Product(
    "dates",
    "תמרים",
    80,
    "תמונות/תמרים.webp",
    "תמרים מג'הול ישר מהעץ!",
    "מוצרים נלווים",
    "2 קילו",
)
let honey = new Product(
    "honey",
    "דבש",
    50,
    "תמונות/דבש.jpg",
    "דבש טבעי ללא חימום מאיזור לכיש",
    "מוצרים נלווים",
    "קילו",
)
let soursoughBread = new Product(
    "bread",
    "לחם מחמצת",
    25,
    "תמונות/לחם.jpg",
    "לחם מחמצת",
    "מוצרים נלווים",
    "500 גרם?",
)
orangeJuice.addToShopItems();
lemonadeJuice.addToShopItems();
appleJuice.addToShopItems();
grapefruitJuice.addToShopItems();
pomlem.addToShopItems();
lemonJuice.addToShopItems();
pomegranateJuice.addToShopItems();
//Product.updateProduct("pomegranate_juice", {storage: "מומלץ לשמור בהקפאה"});
orange_juice1L.addToShopItems();
dates.addToShopItems();
//Product.updateProduct("dates", {shelfLife: "לפחות 6 חודשים, תלוי באחסון", storage: "מומלץ לשמור בהקפאה"});
honey.addToShopItems();
Product.updateProduct("honey", {storage: "מקום קריר ויבש", shelfLife: "כמעט לנצח"});
soursoughBread.addToShopItems();
Product.updateProduct("bread", {shelfLife: " 2-3 ימים", storage: "מקום קריר ויבש"});

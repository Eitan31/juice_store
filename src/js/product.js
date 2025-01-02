
export let shopItems = [];

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
        this.shelfLife = shelfLife || "7-10 ימים";
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
            shelfLife: this.shelfLife,
            storage: this.storage,
        });
    }

    // פונקציה לשליפת מוצרים ממסד הנתונים
    static async fetchProductsFromDB() {
        try {
            const [rows] = await connection.promise().query('SELECT * FROM Products');
            return rows.map(row => new Product(
                row.id,
                row.name,
                row.price,
                row.image,
                row.description,
                row.category,
                row.volume,
                row.shelfLife,
                row.storage
            ));
        } catch (err) {
            console.error('Error fetching products from database:', err);
        }
    }
}
const fs = require('fs');  // נדרש לעבודה עם קבצים

class Customer {
    constructor(name, phone, address, notes = "") {
        this.name = name;        // שם הלקוח
        this.phone = phone;      // טלפון
        this.address = address;  // כתובת
        this.notes = notes;      // הערות (ברירת מחדל היא סטרינג ריק)
    }

    // פונקציה להדפסת פרטי הלקוח
    printCustomerDetails() {
        console.log("שם: " + this.name);
        console.log("טלפון: " + this.phone);
        console.log("כתובת: " + this.address);
        console.log("הערות: " + (this.notes || "אין הערות"));
    }

    // פונקציה לעדכון פרטי הלקוח (ניתן לעדכן כל פרמטר בנפרד)
    updateCustomerDetails(key, value) {
        if (key && value !== undefined) {
            this[key] = value;  // עדכון המאפיין המתאים
            this.saveToFile();  // שמירה לקובץ לאחר עדכון
        }
    }

    // פונקציה להסרת הערות
    removeNotes() {
        this.notes = "";  // הערות ריקות
        this.saveToFile();  // שמירה לקובץ לאחר הסרה
    }

    // פונקציה להסרת הלקוח (מוחק את כל הנתונים)
    removeCustomer() {
        this.name = null;
        this.phone = null;
        this.address = null;
        this.notes = null;
        this.saveToFile();  // שמירה לקובץ לאחר הסרה
    }

    // פונקציה לשמירה לקובץ JSON חיצוני
    saveToFile() {
        const customerData = {
            name: this.name,
            phone: this.phone,
            address: this.address,
            notes: this.notes
        };
        
        // שמירה לקובץ "customer.json"
        fs.writeFileSync('customer.json', JSON.stringify(customerData, null, 2), 'utf8');
    }

    // פונקציה לקרוא את הנתונים מקובץ (כאשר יצרנו אובייקט חדש)
    static loadFromFile() {
        if (fs.existsSync('customer.json')) {
            const rawData = fs.readFileSync('customer.json');
            const customerData = JSON.parse(rawData);
            return new Customer(
                customerData.name,
                customerData.phone,
                customerData.address,
                customerData.notes
            );
        }
        return null;  // אם אין קובץ, לא נטען שום לקוח
    }

    // פונקציה לשמירה ב-localStorage
    static saveToLocalStorage() {
        const customerData = {
            name: this.name,
            phone: this.phone,
            address: this.address,
            notes: this.notes
        };

        localStorage.setItem('customer', JSON.stringify(customerData));
    }

    // פונקציה לטעינה מ-localStorage
    static loadFromLocalStorage() {
        const customerData = JSON.parse(localStorage.getItem('customer'));
        if (customerData) {
            return new Customer(
                customerData.name,
                customerData.phone,
                customerData.address,
                customerData.notes
            );
        }
        return null;
    }

    // פונקציה להתנתקות (הסרת נתונים מ-localStorage)
    static logout() {
        localStorage.removeItem('customer');
    }
}

// אם אתה רוצה להשתמש ב-`localStorage` במקביל לקבצים
if (typeof window !== "undefined" && window.localStorage) {
    // שומר את הנתונים ב-localStorage
    Customer.prototype.saveToFile = Customer.prototype.saveToLocalStorage;
    Customer.loadFromFile = Customer.loadFromLocalStorage;
}

module.exports = Customer;

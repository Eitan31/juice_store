const fs = require('fs'); // נדרוש את המודול fs לעבודה עם קבצים

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

    // פונקציה לעדכון פרטי הלקוח (כעת ניתן לעדכן ערך אחד)
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

    // פונקציה להסרת הלקוח
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
}
document.getElementById("loginChoiceBtn").addEventListener("click", function() {
    // הצגת טופס התחברות והסתרת טופס הרשמה
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("registerForm").style.display = "none";
    document.getElementById("authTitle").textContent = "התחברות";
});

document.getElementById("registerChoiceBtn").addEventListener("click", function() {
    // הצגת טופס הרשמה והסתרת טופס התחברות
    document.getElementById("registerForm").style.display = "block";
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("authTitle").textContent = "הרשמה";
});

// טיפול בהגשת טופס ההתחברות
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const phone = document.getElementById("loginPhone").value;
    const name = document.getElementById("loginName").value;

    // טוען את פרטי הלקוח מקובץ או LocalStorage
    let customer = Customer.loadFromFile();
    if (customer && customer.phone === phone && customer.name === name) {
        alert("ההתחברות הצליחה!");
        window.location.href = "index.html"; // העברה לדף הבית
    } else {
        alert("הפרטים שגויים. אנא נסה שוב.");
    }
});

// טיפול בהגשת טופס ההרשמה
document.getElementById("registerForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("registerName").value;
    const phone = document.getElementById("registerPhone").value;
    const address = document.getElementById("registerAddress").value;
    const notes = document.getElementById("registerNotes").value || ""; // אם לא הוזן, תישאר הערה ריקה

    // יצירת אובייקט לקוח חדש ושמירה
    let customer = new Customer(name, phone, address, notes);
    customer.saveToFile(); // שמירה לקובץ חיצוני

    alert("ההרשמה בוצעה בהצלחה!");
    window.location.href = "login.html"; // העברה לדף התחברות
});


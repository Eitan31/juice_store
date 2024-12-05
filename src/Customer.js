class Customer {
    constructor(id, firstName, lastName, phone, address, notes) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName || "";
        this.phone = phone;
        this.address = address;
        this.notes = notes || "";
      
    }

    // פונקציה להוספת פרטי לקוח (אם הם לא קיימים כבר)
    addCustomerToLocalStorage() {
        let customerData = JSON.parse(localStorage.getItem('customer')) || {};
        if (!customerData.id) {
            customerData = {
                id: this.id,
                firstName: this.firstName,
                lastName: this.lastName || "",
                phone: this.phone,
                address: this.address,
                notes: this.notes || "",
            };
            localStorage.setItem('customer', JSON.stringify(customerData));
        }
    }

    // פונקציה לעדכון פרטי לקוח
    updateCustomer(updatedFields) {
        let customerData = JSON.parse(localStorage.getItem('customer'));
        if (customerData) {
            for (let key in updatedFields) {
                if (customerData.hasOwnProperty(key)) {
                    customerData[key] = updatedFields[key];
                }
            }
            localStorage.setItem('customer', JSON.stringify(customerData));
        }
    }

    // פונקציה להצגת פרטי הלקוח
    displayCustomerInfo() {
        let customerData = JSON.parse(localStorage.getItem('customer'));
        if (customerData) {
            return `
                <p>שם: ${customerData.firstName} ${customerData.lastName}</p>
                <p>טלפון: ${customerData.phone}</p>
                <p>כתובת: ${customerData.address}</p>
                if (customerData.notes) {
                  infoHTML += `<p>הערות: ${customerData.notes}</p>`;
        }

            `;
        }
        return "לא נמצאו פרטי לקוח.";
    }

    // פונקציה להשגת פרטי הלקוח
    getCustomerInfo() {
        return JSON.parse(localStorage.getItem('customer'));
    }
}

// דוגמה לשימוש במחלקת לקוח
let customer1 = new Customer(
    1, 
    "ישראל", 
    "ישראלי", 
    "israel@example.com", 
    "052-0000000", 
    "תל אביב, רחוב דוד 10"
);

// הוספת לקוח ל-localStorage
customer1.addCustomerToLocalStorage();

// הצגת פרטי הלקוח
console.log(customer1.displayCustomerInfo());

// עדכון פרטי הלקוח
customer1.updateCustomer({ address: "תל אביב, רחוב ברוך 20" });
console.log(customer1.displayCustomerInfo());

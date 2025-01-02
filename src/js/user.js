class UserManager {
    constructor() {
        console.log("UserManager initialized");
        this.userContainer = document.getElementById("userContainer");
        this.loginButton = document.getElementById("loginButton");
        this.signupButton = document.getElementById("signupButton");
        this.logoutButton = document.getElementById("logoutButton");
        this.userGreeting = document.getElementById("userGreeting");
        
        this.loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        this.initializeEventListeners();
        this.checkAuthStatus();
    }

    initializeEventListeners() {
        console.log("Initializing event listeners");
        
        if (this.loginButton) {
            this.loginButton.addEventListener("click", () => {
                console.log("Login button clicked");
                this.createModal("login");
            });
        }
        
        if (this.signupButton) {
            this.signupButton.addEventListener("click", () => {
                console.log("Signup button clicked");
                this.createModal("register");
            });
        }

        // הוספת האזנה לכפתור העין
        document.addEventListener('click', (e) => {
            if (e.target.id === 'eyeIcon') {
                const passwordInput = document.getElementById('passwordInput');
                const eyeIcon = e.target;
                
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    eyeIcon.classList.remove('fa-eye');
                    eyeIcon.classList.add('fa-eye-slash');
                } else {
                    passwordInput.type = 'password';
                    eyeIcon.classList.remove('fa-eye-slash');
                    eyeIcon.classList.add('fa-eye');
                }
            }
        });
    }

    checkAuthStatus() {
        if (this.loggedInUser) {
            this.updateUIForLoggedInUser();
        }
    }

    updateUIForLoggedInUser() {
        this.userGreeting.textContent = `שלום ${this.loggedInUser.name}`;
        this.loginButton.style.display = "none";
        this.logoutButton.style.display = "inline-block";
    }

    async login(credentials) {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();
            if (!data.success) throw new Error(data.message);

            this.loggedInUser = data.user;
            localStorage.setItem("loggedInUser", JSON.stringify(this.loggedInUser));
            this.updateUIForLoggedInUser();
            return true;
        } catch (error) {
            console.error('שגיאת התחברות:', error);
            alert(error.message);
            return false;
        }
    }

    logout() {
        this.loggedInUser = null;
        localStorage.removeItem("loggedInUser");
        this.loginButton.style.display = "inline-block";
        this.userGreeting.textContent = '';
        this.logoutButton.style.display = "none";
    }

    createModal(type) {
        console.log("Creating modal for:", type);
        const modalHTML = type === "login" ? this.createLoginModal() : this.createRegisterModal();
        this.userContainer.innerHTML = modalHTML;
        
        const modal = this.userContainer.querySelector('.modal');
        if (modal) {
            modal.style.display = 'block';
        }

        const form = document.querySelector(type === "login" ? "#loginForm" : "#registerForm");
        const closeBtn = document.querySelector(".close");

        if (closeBtn) {
            closeBtn.addEventListener("click", () => {
                this.userContainer.innerHTML = '';
            });
        }

        if (form) {
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                this.handleRegister(form);
            });
        }

        console.log("Modal opened for registration");
    }

    createLoginModal() {
        return `
            <div class="modal">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h2>תחברות</h2>
                    <form id="loginForm">
                        <input type="tel" placeholder="מספר טלפון" required>
                        <input type="password" placeholder="סיסמה" required>
                        <button type="submit">התחברות</button>
                        <button type="button" id="forgotPasswordButton">שכחתי סיסמה</button>
                    </form>
                </div>
            </div>
        `;
    }

    createRegisterModal() {
        return `
            <div class="modal">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h2>הרשמה</h2>
                    <form id="registerForm">
                        <input type="text" 
                               id="nameInput"
                               name="name"
                               placeholder="שם" 
                               required
                               autocomplete="name">

                        <input type="text" 
                               id="phoneInput"
                               name="phone"
                               placeholder="פלאפון" 
                               autocomplete="tel">

                        <input type="email" 
                               name="email"
                               placeholder="מייל (לא חובה)"
                               autocomplete="email">
                        
                        <div class="password-container">
                            <input type="password" 
                                   id="passwordInput"
                                   name="password" 
                                   placeholder="סיסמה" 
                                   required
                                   autocomplete="new-password">
                            <i id="eyeIcon" class="fas fa-eye"></i>
                        </div>

                        <select name="city" required>
                            <option value="">בחר עיר</option>
                            <option value="עומר">עומר</option>
                            <option value="להבים">להבים</option>
                            <option value="מיתר">מיתר</option>
                            <option value="כרמים">כרמים</option>
                            <option value="באר שבע">באר שבע</option>
                            <option value="אחר">אחר</option>
                        </select>

                        <input type="text" 
                               id="addressInput"
                               name="address"
                               placeholder="כתובת" 
                               required>

                        <button type="submit">הירשם</button>
                    </form>
                </div>
            </div>
        `;
    }

    async handleRegister(form) {
        console.log('טופס נשלח');
    
        try {
            const inputs = {
                name: form.querySelector('#nameInput'),
                phone: form.querySelector('#phoneInput'),
                email: form.querySelector('input[name="email"]'),
                password: form.querySelector('#passwordInput'),
                city: form.querySelector('select[name="city"]'),
                address: form.querySelector('#addressInput')
            };

            // בדיקת כפילויות
            const existingUsers = await fetch('/api/getUsers');
            if (!existingUsers.ok) {
                throw new Error('שגיאה בקבלת משתמשים');
            }
            const usersData = await existingUsers.json();
            const duplicateUser = usersData.users.find(user => 
                user.name === inputs.name.value.trim() || 
                user.phone === inputs.phone.value.trim() || 
                user.address === inputs.address.value.trim()
            );

            if (duplicateUser) {
                const confirmMessage = `משתמש עם פרטים דומים קיים. האם ברצונך להמשיך?`;
                if (!confirm(confirmMessage)) {
                    return;
                }
            }

            // טיפול במספר טלפון
            let phoneNumber = inputs.phone.value.trim();
            console.log('מספר טלפון לפני עיבוד:', phoneNumber);
            
            // הסרת מקפים ורווחים
            phoneNumber = phoneNumber.replace(/[\s-]/g, '');
            
            // טיפול בקידומות בינלאומיות
            if (phoneNumber.startsWith('+972')) {
                phoneNumber = '0' + phoneNumber.substring(4);
            } else if (phoneNumber.startsWith('972')) {
                phoneNumber = '0' + phoneNumber.substring(3);
            } else if (!phoneNumber.startsWith('0') && phoneNumber) {
                phoneNumber = '0' + phoneNumber; // אם אין קידומת, הוסף 0
            }
    
            console.log('מספר טלפון לאחר עיבוד:', phoneNumber);
    
            const formData = {
                name: inputs.name.value.trim(),
                phone: phoneNumber || "",
                email: inputs.email ? inputs.email.value.trim() : '',
                password: inputs.password.value,
                city: inputs.city.value,
                address: inputs.address.value.trim()
            };
    
            console.log('נתוני הטופס:', formData);
    
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('שגיאה בהרשמה');
            }

            const data = await response.json();
            console.log('תשובה מהשרת:', data);
    
            if (data.success) {
                alert('נרשמת בהצלחה!');
                this.loggedInUser = data.user;
                localStorage.setItem("loggedInUser", JSON.stringify(this.loggedInUser));
                this.updateUIForLoggedInUser();
                this.userContainer.innerHTML = '';
            } else {
                throw new Error(data.message || 'שגיאה בהרשמה');
            }
        } catch (error) {
            console.error('שגיאת הרשמה:', error);
            alert(error.message || 'שגיאה בהרשמה');
        }
    }

    // הוספת מאזין לאירוע של ליחת הטוסס

    // פונקציה לטעינת Google Maps API
    loadGoogleMapsScript() {
        const script = document.createElement('script');
        script.src = "https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places&language=iw";
        script.async = true;
        script.defer = true;
        script.onload = () => this.initializeAutocomplete();
        document.head.appendChild(script);
    }

    // אתחול האוטוקומפליט
    initializeAutocomplete() {
        if (document.getElementById('addressInput')) {
            const addressInput = document.getElementById('addressInput');
            const autocomplete = new google.maps.places.Autocomplete(addressInput, {
                componentRestrictions: { country: "il" },
                fields: ["address_components", "formatted_address"],
                types: ["address"],
            });
        }
    }
}

// ידיקה שה-script נטען
console.log("User script loaded");

// יצירת מופע בטעינת הדף
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM Content Loaded");
    const userManager = new UserManager();
});







const createUser = (name, phone, email, password) => {
    const newUser = {
      name: name,
      phone: phone,
      email: email,
      password: password
    };
  
    // שליחה לשרת לעדכון הקובץ JSON
    fetch('/api/createUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newUser)
    })
    .then(response => response.json())
    .then(data => {
      console.log('המשתמש נוצר בהצלחה');
      // כאן אפשר לעדכן את הממשק אם צריך
    })
    .catch(error => {
      console.error('שגיאה ביצירת המשתמש:', error);
    });
  };
  

  // קריאה לקובץ JSON
  const getUsersData = () => {
    const filePath = path.join(__dirname, 'users.json');
    const fileData = fs.readFileSync(filePath);
    return JSON.parse(fileData);
  };
  
  // שמירה של נתונים לקובץ JSON
  const saveUsersData = (data) => {
    const filePath = path.join(__dirname, 'users.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  };
  
  // יצירת משתמש חד
  app.post('/api/createUser', (req, res) => {
    const newUser = req.body;
    const usersData = getUsersData();
    
    // הוספת המשתמש למערך
    usersData.users.push(newUser);
    
    // שמירה לקובץ
    saveUsersData(usersData);
    
    res.json({ message: 'המשתמש נוצר בהצלחה' });
  });

  




// משתנים לדוגמא, אתה תוכל לאחסן את המידע זה בשרת או ב-localStorage
let users = [
    { name: "יוסי", phone: "0500000000", city: "באר שבע", address: "רחוב 1", email: "yossi@mail.com" },
    { name: "מיכל", phone: "0501234567", city: "להבים", address: "רחוב 2", email: "michal@mail.com" },
    // נוסיף משתמשים נוספים...
];

// פונקציה להוסיף משתמש חדש
const addUser = (userData) => {
    users.push(userData);
    updateUserList();  // לעדכן את רשימת המשתמשים
};

// פונקציה לעדכון רשימת המשתמשים בעמוד
const updateUserList = () => {
    // כאן תוכל לעדכן את התצוגה של המשתמשים (לפי ערים או לפי פרמטרים אחרים)
    const userListContainer = document.getElementById("userListContainer");
    userListContainer.innerHTML = '';  // נקה את התצוגה הישנה

    users.forEach(user => {
        const userItem = document.createElement("div");
        userItem.innerHTML = `
            <p>שם: ${user.name}</p>
            <p>פלאפון: ${user.phone}</p>
            <p>עיר: ${user.city}</p>
            <p>כתובת: ${user.address}</p>
            <p>מייל: ${user.email}</p>
        `;
        userListContainer.appendChild(userItem);
    });
};





// הצת העגלה
const cart = JSON.parse(localStorage.getItem("cart")) || [];  // אם אין עגלה, יתחיל ריקה

// הוספת פריט לעגל
const addToCart = (item) => {
    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));  // שמירה ב-localStorage
};

// הצגת העגלה (במודאל הצגת פרטי המשתמש)
const displayCart = () => {
    const cartContainer = document.getElementById("cartContainer");
    cartContainer.innerHTML = '';

    cart.forEach(item => {
        const cartItem = document.createElement("div");
        cartItem.textContent = `${item.name} - ${item.quantity}`;
        cartContainer.appendChild(cartItem);
    });
};


document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.getElementById("loginButton");
    const logoutButton = document.getElementById("logoutButton"); // כפתור התנתקות
    const userGreeting = document.getElementById("userGreeting"); // מקום להצגת שלום ושם המשתמש

    // משתנים דמויים לשם משתמש ומצב התחברות
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")); // קראה מה-localStorage אם יש מידע על המשתמש

    // פנקציה להתחברות
    const login = (user) => {
        loggedInUser = user;
        localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser)); // שמירה ב-localStorage
        loginButton.style.display = "none"; // הסתרת כפתור התחברות
        userGreeting.textContent = `שלום ${user.name}`; // הצגת שם המשתמש
        logoutButton.style.display = "inline-block"; // הצגת כפתור התנתקות
    };

    // פונציה להתנתקות
    const logout = () => {
        loggedInUser = null;
        localStorage.removeItem("loggedInUser"); // הסרת המידע מה-localStorage
        loginButton.style.display = "inline-block"; // הצגת כפתור התחברות
        userGreeting.textContent = ''; // הסרת שם המשתמש
        logoutButton.style.display = "none"; // הסתרת כפתור התנתקות
    };

    // אם יש כבר משתמש מחובר, נבצע התחברות אוטומטית
    if (loggedInUser) {
        userGreeting.textContent = `שלום ${loggedInUser.name}`;
        loginButton.style.display = "none";
        logoutButton.style.display = "inline-block";
    }

    // כפתור התנתקות
    logoutButton.addEventListener("click", logout);

    // אם יש כפתור התחברות, נוודא ששנלחץ נפתח חון התחברות
    loginButton.addEventListener("click", () => createModal("login"));
});







const createUpdateProfileModal = () => {
    if (!loggedInUser) return;  // אם ל מחובר, אל תציג את המודאל

    userContainer.innerHTML = `
        <div class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>הצג פרטים</h2>
                <form id="updateProfileForm">
                    <label for="updateName">שם</label>
                    <input type="text" id="updateName" value="${loggedInUser.name}" required>

                    <label for="updatePhone">פלאפון</label>
                    <input type="tel" id="updatePhone" value="${loggedInUser.phone}" required>

                    <label for="updateEmail">מייל</label>
                    <input type="email" id="updateEmail" value="${loggedInUser.email}" required>

                    <!-- אפשרות לשנות סיסמה -->
                    <label for="updatePassword">סיסמה חדשה</label>
                    <input type="password" id="updatePassword" placeholder="הכנס סיסמה חדשה (אם תרצה לשנות)" >

                    <label for="confirmPassword">אשר סיסמה חדשה</label>
                    <input type="password" id="confirmPassword" placeholder="אשר סיסמה חדשה (אם תרצה לשנות)" >

                    <button type="submit">עדכן</button>
                </form>
            </div>
        </div>
    `;

    const modal = document.querySelector(".modal");
    const closeModal = document.querySelector(".close");

    modal.style.display = "block";

    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // עדכון פרטי המשתמש
    const updateProfileForm = document.getElementById("updateProfileForm");
    updateProfileForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const updatedName = document.getElementById("updateName").value;
        const updatedPhone = document.getElementById("updatePhone").value;
        const updatedEmail = document.getElementById("updateEmail").value;
        const updatedPassword = document.getElementById("updatePassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (updatedPassword && updatedPassword !== confirmPassword) {
            alert("הסיסמאות לא מתאמת!");
            return;
        }

        // עדכון המידע של המשתמש
        loggedInUser.name = updatedName;
        loggedInUser.phone = updatedPhone;
        loggedInUser.email = updatedEmail;

        // אם יש סיסמה חדשה, נשנה אותה
        if (updatedPassword) {
            loggedInUser.password = updatedPassword;
        }

        // עדכון ב-localStorage או בשרת
        localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

        alert("הפרטים עודכנו בהצלחה!");
        modal.style.display = "none";
    });
};

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  if (!app) {
    console.error('Element with id "app" not found.');
    return;
  }

  // ...existing code...
});


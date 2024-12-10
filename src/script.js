document.addEventListener("DOMContentLoaded", () => {
    const loginModal = document.getElementById("loginModal");
    const signupModal = document.getElementById("signupModal");
    const logoutButton = document.getElementById("logoutButton");

    const loginButton = document.getElementById("loginButton");
    const signupButton = document.getElementById("signupButton");
    const closeButtons = document.querySelectorAll(".close-modal");
    
    // טוען את כל המשתמשים
    let users = JSON.parse(localStorage.getItem("users")) || [];  
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // עדכון הממשק לפי מצב התחברות
    function updateUserInterface() {
        currentUser = JSON.parse(localStorage.getItem("currentUser"));
        cart = JSON.parse(localStorage.getItem("cart")) || [];

        if (currentUser) {
            loginButton.style.display = "none"; // הסתרת כפתור התחברות
            signupButton.style.display = "none"; // הסתרת כפתור הרשמה
            logoutButton.style.display = "inline-block"; // הצגת כפתור התנתקות
            document.getElementById("homeGreeting").textContent = `שלום, ${currentUser.username}`; // ברכת שלום עם שם המשתמש
            document.getElementById("cartTitle").textContent = `סל הקניות של ${currentUser.username}`; // כותרת סל הקניות
        } else {
            loginButton.style.display = "inline-block"; // הצגת כפתור התחברות
            signupButton.style.display = "inline-block"; // הצגת כפתור הרשמה
            logoutButton.style.display = "none"; // הסתרת כפתור התנתקות
            document.getElementById("homeGreeting").textContent = ''; // מנקה את שם המשתמש לאחר התנתקות
            document.getElementById("cartTitle").textContent = "סל הקניות שלי"; // כותרת ברירת מחדל לסל הקניות
        }
    }

    // פתיחת מודאל התחברות
    loginButton.addEventListener("click", () => {
        loginModal.style.display = "flex";
    });

    // פתיחת מודאל הרשמה
    signupButton.addEventListener("click", () => {
        signupModal.style.display = "flex";
    });

    // סגירת מודאל
    closeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            loginModal.style.display = "none";
            signupModal.style.display = "none";
        });
    });

    // סגירה בלחיצה מחוץ למודאל
    window.addEventListener("click", (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = "none";
        }
        if (e.target === signupModal) {
            signupModal.style.display = "none";
        }
    });

    // פונקציה להתחברות
    document.getElementById("submitLogin").addEventListener("click", () => {
        const usernameInput = document.querySelector("#loginModal input[type='text']");
        const passwordInput = document.querySelector("#loginModal input[type='password']");
        
        // בדיקה אם השדות קיימים
        if (!usernameInput || !passwordInput) {
            alert("שדות ההתחברות חסרים");
            return;
        }

        const username = usernameInput.value.trim(); // מסיר רווחים מיותרים
        const password = passwordInput.value.trim(); // מסיר רווחים מיותרים

        // חיפוש המשתמש
        const user = users.find(u => u.username === username && u.password === password);

        // אם המשתמש נמצא
        if (user) {
            localStorage.setItem("currentUser", JSON.stringify(user));  // שמירה של המשתמש המחובר
            alert("התחברת בהצלחה!");
            loginModal.style.display = "none";

            // עדכון הממשק לאחר ההתחברות
            setTimeout(() => {
                updateUserInterface(); // עדכון הממשק
            }, 100);  // 100ms השהיה

        } else {
            alert("שם משתמש או סיסמה שגויים");
        }
    });

    // פונקציה להרשמה
    document.getElementById("submitSignup").addEventListener("click", () => {
        const usernameInput = document.querySelector("#signupModal input[type='text']");
        const passwordInput = document.querySelector("#signupModal input[type='password']");
        const phoneInput = document.querySelector("#signupModal input[id='phone']");
        const addressInput = document.querySelector("#signupModal input[id='address']");

        // יצירת מערך לאחסון שדות חסרים
        let missingFields = [];

        // בדיקת כל שדה אם הוא חסר
        if (!usernameInput.value.trim()) {
            missingFields.push("שם משתמש");
        }
        if (!passwordInput.value.trim()) {
            missingFields.push("סיסמה");
        }
        if (!phoneInput.value.trim()) {
            missingFields.push("טלפון");
        }
        if (!addressInput.value.trim()) {
            missingFields.push("כתובת");
        }

        // אם יש שדות חסרים, הצגת הודעה
        if (missingFields.length > 0) {
            alert("חסרים השדות הבאים: " + missingFields.join(", "));
            return;
        }

        // בדיקת אם המשתמש כבר קיים
        const username = usernameInput.value.trim();
        if (users.some(u => u.username === username)) {
            alert("שם משתמש כבר קיים!");
            return;
        }

        const password = passwordInput.value.trim();
        const phone = phoneInput.value.trim();
        const address = addressInput.value.trim();

        const newUser = {
            username,
            password,
            phone,
            address,
            cart: [] // עגלה חדשה ריקה בהתחלה
        };

        // בדיקת אם יש משתמש עם אותו פלאפון או כתובת
        const existingUserByPhone = users.find(u => u.phone === phone);
        const existingUserByAddress = users.find(u => u.address === address);

        if (existingUserByPhone) {
            alert(`כבר קיים משתמש עם פלאפון זה:
            שם משתמש: ${existingUserByPhone.username}, כתובת: ${existingUserByPhone.address}, פלאפון: ${existingUserByPhone.phone}
            האם ברצונך להמשיך עם רישום על פלאפון זה?`);
            return;
        }

        if (existingUserByAddress) {
            alert(`כבר קיים משתמש עם כתובת זו:
            שם משתמש: ${existingUserByAddress.username}, כתובת: ${existingUserByAddress.address}, פלאפון: ${existingUserByAddress.phone}
            האם ברצונך להמשיך עם רישום על כתובת זו?`);
            return;
        }

        // שמירת המשתמש החדש ב-localStorage
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        // שמירת המשתמש החדש כמשתמש מחובר
        localStorage.setItem("currentUser", JSON.stringify(newUser));

        alert("ההרשמה בוצעה בהצלחה!");
        signupModal.style.display = "none";
        updateUserInterface(); // עדכון הממשק כך שהמשתמש יהיה מחובר מיד אחרי ההרשמה

        // שמירה בקובץ JSON
        saveUsersToFile(users);
    });

    // שמירת המשתמשים בקובץ JSON
    function saveUsersToFile(users) {
        const blob = new Blob([JSON.stringify(users, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'users.json';
        link.click();
    }

    // פונקציה להתנתקות
    logoutButton.addEventListener("click", () => {
        // מסיר את המשתמש המחובר מ-localStorage
        localStorage.removeItem("currentUser");
        updateUserInterface(); // עדכון הממשק לאחר ההתנתקות
    });

    // הצגת סיסמה בלחיצה על כפתור
    function togglePasswordVisibility(passwordInput, passButton) {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            passButton.textContent = "הסתר";
        } else {
            passwordInput.type = "password";
            passButton.textContent = "הצג";
        }
    }
    
    document.querySelectorAll('.password-toggle-btn').forEach(button => {
        button.addEventListener('click', () => {
            const passwordInput = button.previousElementSibling; // שדה הסיסמה
            togglePasswordVisibility(passwordInput, button);
        });
    });

    // עדכון הממשק עם המשתמש הנוכחי
    updateUserInterface(); // עדכון הממשק עם הטעינה של הדף
});



// הצגת טופס שינוי סיסמה כאשר המשתמש לוחץ על "שכחתי סיסמה"
document.getElementById("forgotPasswordButton").addEventListener("click", () => {
    // הצגת המודאל של שכחתי סיסמה
    document.getElementById("forgotPasswordModal").style.display = "block"; // הצגת המודאל
});

// כאשר המשתמש לוחץ על "שלח קוד" בטופס של שכחתי סיסמה
document.getElementById("submitForgotPassword").addEventListener("click", () => {
    const forgotUsername = document.getElementById("forgotUsername").value.trim();
    const forgotPhone = document.getElementById("forgotPhone").value.trim();

    // לוודא שהמשתמש הזין שם משתמש וטלפון
    if (!forgotUsername || !forgotPhone) {
        alert("אנא מלא את כל השדות.");
        return;
    }

    // חפש את המשתמש ב-localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.username === forgotUsername && u.phone === forgotPhone);

    if (user) {
        // הצג את המודאל לשינוי סיסמה
        document.getElementById("forgotPasswordModal").style.display = "none"; // סגור את המודאל של שכחתי סיסמה
        const changePasswordModal = document.getElementById("changePasswordModal");
        changePasswordModal.style.display = "block"; // הצג את המודאל של שינוי סיסמה

        // שמור את המשתמש שנמצא במשתנה גלובלי או תחום מקומי
        window.userToChange = user;
    } else {
        alert("לא נמצא משתמש עם הפרטים הללו");
    }
});

// שמירה ועדכון הסיסמה החדשה
document.getElementById("submitChangePassword").addEventListener("click", () => {
    const newPassword = document.getElementById("newPassword").value.trim();

    if (!newPassword) {
        alert("אנא הזן סיסמה חדשה");
        return;
    }

    // עדכון הסיסמה של המשתמש
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex(u => u.username === window.userToChange.username);

    if (userIndex !== -1) {
        // עדכון הסיסמה של המשתמש
        users[userIndex].password = newPassword;
        localStorage.setItem("users", JSON.stringify(users)); // שמירת המשתמשים לאחר העדכון

        // עדכון המשתמש המחובר אם הוא המשתמש שהתחבר
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (currentUser && currentUser.username === users[userIndex].username) {
            localStorage.setItem("currentUser", JSON.stringify(users[userIndex]));
        }

        alert("הסיסמה שונתה בהצלחה!");

        // סגור את המודאלים
        document.getElementById("changePasswordModal").style.display = "none";
        updateUserInterface(); // עדכון הממשק לאחר שינוי הסיסמה
    } else {
        alert("שגיאה בעדכון הסיסמה");
    }
    
});

document.addEventListener("DOMContentLoaded", () => {
    const loginModal = document.getElementById("loginModal");
    const forgotPasswordModal = document.getElementById("forgotPasswordModal");
    const changePasswordModal = document.getElementById("changePasswordModal");

    const loginButton = document.getElementById("loginButton");
    const forgotPasswordButton = document.getElementById("forgotPasswordButton");
    const changePasswordButton = document.getElementById("submitChangePassword");

    const closeButtons = document.querySelectorAll(".close-modal");

    // כפתור התחברות
    loginButton.addEventListener("click", () => {
        loginModal.style.display = "flex";
    });

    // כפתור "שכחתי סיסמה"
    forgotPasswordButton.addEventListener("click", () => {
        loginModal.style.display = "none"; // מסתיר את חלונית ההתחברות
        forgotPasswordModal.style.display = "block"; // מציג את חלונית "שכחתי סיסמה"
    });

    // סגירת מודאל על ידי לחיצה מחוץ לחלונית
    window.addEventListener("click", (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = "none";
        }
        if (e.target === forgotPasswordModal) {
            forgotPasswordModal.style.display = "none";
        }
        if (e.target === changePasswordModal) {
            changePasswordModal.style.display = "none";
        }
    });

    // סגירת המודאלים על ידי כפתור הסגירה
    closeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            loginModal.style.display = "none";
            forgotPasswordModal.style.display = "none";
            changePasswordModal.style.display = "none";
        });
    });

    // כפתור לשמירה של סיסמה חדשה
    changePasswordButton.addEventListener("click", () => {
        // כל הלוגיקה של שינוי סיסמה נשארת כאן...
    });
});


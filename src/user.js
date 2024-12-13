document.addEventListener("DOMContentLoaded", () => {
    const userContainer = document.getElementById("userContainer");
    const loginButton = document.getElementById("loginButton");
    const signupButton = document.getElementById("signupButton");

    // פונקציה ליצירת מודאל
    const createModal = (type) => {
        const title = type === "login" ? "התחברות" : "הרשמה";
        const formAction = type === "login" ? "/login" : "/register";

        // רשימה של ערים להוספה לרשימה נפתחת
        const cities = ["להבים", "עומר", "מיתר(כרמית)", "כרמים", "באר שבע", "אחר"];

        userContainer.innerHTML = `
            <div class="modal">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h2>${title}</h2>
                    <form action="${formAction}" method="POST">
                        ${type === "register" ? ` 
                            <label for="name"></label>
                            <input type="text" id="name" name="name" placeholder="שם" required>

                            <label for="phone"></label>
                            <input type="tel" id="phone" name="phone" placeholder="פלאפון" required>

                            <label for="city"></label>
                            <select id="city" name="city" required>
                                ${cities.map(city => `<option value="${city}">${city}</option>`).join('')}
                            </select>

                            <label for="address"></label>
                            <input type="text" id="address" name="address" placeholder="כתובת" required>

                            <label for="email"></label>
                            <input type="email" id="email" name="email" placeholder="(לא חובה)מייל">
                        ` : ` 
                            <label for="phoneOrName"></label>
                            <input type="text" id="phoneOrName" name="phoneOrName" placeholder="הכנס שם או פלאפון" required>
                        `}

                        <label for="password"></label>
                        <div style="position: relative;">
                            <input type="password" id="password" name="password" placeholder="סיסמה" required>
                            <i id="eyeIcon" class="fa-regular fa-eye"></i>
                        </div>

                        <button type="submit">${title}</button>
                    </form>

                    ${type === "login" ? `<button id="forgotPasswordButton">שכחתי סיסמה</button>` : ""}
                </div>
            </div>
        `;

        // הוספת התנהגות לסגירת המודאל
        const modal = document.querySelector(".modal");
        const closeModal = document.querySelector(".close");

        modal.style.display = "block";

        closeModal.addEventListener("click", () => {
            modal.style.display = "none";
        });

        // סגירת המודאל בלחיצה מחוץ לחלון
        window.addEventListener("click", (e) => {
            if (e.target === modal) {  // אם נלחץ מחוץ לחלון
                modal.style.display = "none";
            }
        });

        // טיפול בהצגת/הסתרת סיסמה
        const passwordField = document.getElementById("password");
        const eyeIcon = document.getElementById("eyeIcon");

        // פונקציה להסתיר ולהציג את הסיסמה
        // ודא שהאייקון מתחיל עם עין סגורה (בברירת מחדל)
        eyeIcon.classList.add("fa-regular", "fa-eye");

        // פונקציה להסתיר ולהציג את הסיסמה
        const togglePasswordVisibility = () => {
            if (passwordField.type === "password") {
                passwordField.type = "text";
                // הסרת מחלקות קודמות והוספת חדשות
                eyeIcon.classList.remove("fa-regular", "fa-eye");
                eyeIcon.classList.add("fa-solid", "fa-eye"); // עין פתוחה
            } else {
                passwordField.type = "password";
                // הסרת מחלקות קודמות והוספת חדשות
                eyeIcon.classList.remove("fa-solid", "fa-eye");
                eyeIcon.classList.add("fa-regular", "fa-eye"); // עין סגורה
            }
        };

        // הוספת ההתנהגות של העין להסתיר/להציג סיסמה
        eyeIcon.addEventListener("click", togglePasswordVisibility);

        
        

        // הוספת התנהגות לכפתור "שכחתי סיסמה"
        const forgotPasswordButton = document.getElementById("forgotPasswordButton");
        if (forgotPasswordButton) {
            forgotPasswordButton.addEventListener("click", () => {
                createForgotPasswordModal();
            });
        }
    };

    // יצירת מודאל של "שכחתי סיסמה"
    const createForgotPasswordModal = () => {
        userContainer.innerHTML = `
            <div class="modal">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h2>שחזור סיסמה</h2>
                    <form id="forgotPasswordForm">
                        <label for="forgotPhoneOrEmail">שם/מייל</label>
                        <input type="text" id="forgotPhoneOrEmail" name="forgotPhoneOrEmail" placeholder="הכנס שם או מייל" required>
                        <label for="forgotPhone">פלאפון</label>
                        <input type="tel" id="forgotPhone" name="forgotPhone" placeholder="הכנס פלאפון" required>
                        <button type="submit">שלח קוד לאיפוס סיסמה</button>
                    </form>
                </div>
            </div>
        `;

        // הוספת התנהגות לסגירת המודאל
        const modal = document.querySelector(".modal");
        const closeModal = document.querySelector(".close");

        modal.style.display = "block";

        closeModal.addEventListener("click", () => {
            modal.style.display = "none";
        });

        // סגירת המודאל בלחיצה מחוץ לחלון
        window.addEventListener("click", (e) => {
            if (e.target === modal) {  // אם נלחץ מחוץ לחלון
                modal.style.display = "none";
            }
        });

        // טיפול בשליחת פרטי שחזור סיסמה
        const forgotPasswordForm = document.getElementById("forgotPasswordForm");
        forgotPasswordForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const forgotPhoneOrEmail = document.getElementById("forgotPhoneOrEmail").value;
            const forgotPhone = document.getElementById("forgotPhone").value;

            // כאן תוכל לבצע קריאה לשרת כדי לבדוק אם הפרטים תואמים
            // אם כן, פתח את המודל להזנת סיסמה חדשה
            createResetPasswordModal();
        });
    };

    // יצירת מודאל להזנת סיסמה חדשה
    const createResetPasswordModal = () => {
        userContainer.innerHTML = `
            <div class="modal">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h2>הזן סיסמה חדשה</h2>
                    <form id="resetPasswordForm">
                        <label for="newPassword">סיסמה חדשה</label>
                        <input type="password" id="newPassword" name="newPassword" placeholder="הכנס סיסמה חדשה" required>
                        <label for="confirmPassword">אשר סיסמה חדשה</label>
                        <input type="password" id="confirmPassword" name="confirmPassword" placeholder="אשר סיסמה חדשה" required>
                        <button type="submit">עדכן סיסמה</button>
                    </form>
                </div>
            </div>
        `;

        // הוספת התנהגות לסגירת המודאל
        const modal = document.querySelector(".modal");
        const closeModal = document.querySelector(".close");

        modal.style.display = "block";

        closeModal.addEventListener("click", () => {
            modal.style.display = "none";
        });

        // סגירת המודאל בלחיצה מחוץ לחלון
        window.addEventListener("click", (e) => {
            if (e.target === modal) {  // אם נלחץ מחוץ לחלון
                modal.style.display = "none";
            }
        });

        // טיפול בהגדרת סיסמה חדשה
        const resetPasswordForm = document.getElementById("resetPasswordForm");
        resetPasswordForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const newPassword = document.getElementById("newPassword").value;
            const confirmPassword = document.getElementById("confirmPassword").value;

            if (newPassword === confirmPassword) {
                // כאן תוכל לעדכן את הסיסמה בשרת
                alert("הסיסמה עודכנה בהצלחה!");
                // סגור את המודל אחרי עדכון הסיסמה
                modal.style.display = "none";
            } else {
                alert("הסיסמאות לא תואמות!");
            }
        });
    };

    // אירועים לפתיחת מודאלים
    loginButton.addEventListener("click", () => createModal("login"));
    signupButton.addEventListener("click", () => createModal("register"));
});

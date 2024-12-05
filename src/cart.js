<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="src/style.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <title>סל קניות</title>
</head>
<body>
    <div class="navbar">
        <a href="index.html">
            <h2>סל הקניות שלי</h2>
        </a>
        <a href="cart.html">
            <div class="cart">
                <i class="bi bi-cart4"></i>
                <div id="cartAmount" class="cartAmount">0</div>
            </div>
        </a>

    </div>

    <div id="label" class="text-center"></div>
    <div id="shopping-cart" class="shopping-cart"></div>
</body>
<script type="module" src="src/data.js"></script>
<script type="module" src="src/cart.js"></script>
</html>

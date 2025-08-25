export const HASH_COST_FACTOR = 10;
export const JWT_EXPIRATION_TIME = '7d';
export const VERIFICATION_MAIL_TITLE = `MosaicHub – Підтвердження електронної пошти`;

export const VERIFICATION_CODE_PLACEHOLDER = `{code}`;

export const VERIFICATION_MAIL_TEXT = `
Вітаємо у MosaicHub!

Щоб підтвердити свою електронну адресу, використайте код нижче:

${VERIFICATION_CODE_PLACEHOLDER}

Скопіюйте цей код та вставте його у форму підтвердження на сайті.
Код дійсний протягом 10 хвилин.

Дякуємо, що обираєте MosaicHub!
`;

export const VERIFICATION_MAIL_HTML = `
<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <title>MosaicHub – Підтвердження електронної пошти</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f6f7fb;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 500px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        h1 {
            color: #2c3e50;
            font-size: 20px;
            margin-bottom: 20px;
        }
        p {
            color: #555;
            font-size: 15px;
            line-height: 1.5;
        }
        .code-box {
            background-color: #f0f4ff;
            color: #2c3e50;
            font-size: 28px;
            font-weight: bold;
            text-align: center;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            letter-spacing: 5px;
            user-select: all;
        }
        .footer {
            font-size: 13px;
            color: #999;
            text-align: center;
            margin-top: 30px;
        }
        .brand {
            color: #4a6cf7;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Підтвердження електронної пошти</h1>
        <p>Вітаємо у <span class="brand">MosaicHub</span>!<br>
        Щоб завершити реєстрацію, введіть цей код у формі підтвердження на сайті:</p>

        <div class="code-box">${VERIFICATION_CODE_PLACEHOLDER}</div>

        <p>Скопіюйте код та вставте його у відповідне поле.<br>
        Код дійсний протягом <strong>10 хвилин</strong>.</p>

        <p class="footer">Дякуємо, що обираєте <span class="brand">MosaicHub</span>!</p>
    </div>
</body>
</html>
`;

export const VERIFICATION_CODE_EXPIRATION_TIME_SECONDS = 600;
export const VERIFICATION_SESSION_EXPIRATION_TIME_DAYS = 90;
export const VERIFICATION_CODE_MIN_VALIDITY_THRESHOLD_SECONDS = 20;
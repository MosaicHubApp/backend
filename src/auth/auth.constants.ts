export const HASH_COST_FACTOR = 10;
export const JWT_EXPIRATION_TIME = '7d';
export const VERIFICATION_MAIL_TITLE = `MosaicHub – Підтвердження електронної пошти`;

export const VERIFICATION_CODE_PLACEHOLDER = `{code}`;
export const VERIFICATION_CODE_EXPIRATION_TIME_SECONDS = 600;

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
        Код дійсний протягом <strong>${VERIFICATION_CODE_EXPIRATION_TIME_SECONDS/60} хвилин</strong>.</p>

        <p class="footer">Дякуємо, що обираєте <span class="brand">MosaicHub</span>!</p>
    </div>
</body>
</html>
`;

export const VERIFICATION_SESSION_EXPIRATION_TIME_DAYS = 90;
export const VERIFICATION_CODE_MIN_VALIDITY_THRESHOLD_SECONDS = 20;
export const PASSWORD_RESET_MIN_VALIDITY_THRESHOLD_SECONDS = 60;
export const PASSWORD_RESET_LINK_PLACEHOLDER = `{link}`;
export const PASSWORD_RESET_MAIL_TITLE = `MosaicHub – Скидання пароля`;
export const PASSWORD_RESET_REQUEST_EXPIRATION_TIME_SECONDS = 15 * 60;
export const PASSWORD_RESET_TOKEN_PLACEHOLDER = `{token}`;


export const PASSWORD_RESET_MAIL_TEXT = `
Вітаємо!

Ми отримали запит на скидання пароля до вашого облікового запису MosaicHub.
Щоб встановити новий пароль, перейдіть за посиланням:

${PASSWORD_RESET_LINK_PLACEHOLDER}

Посилання дійсне протягом ${PASSWORD_RESET_REQUEST_EXPIRATION_TIME_SECONDS/60} хвилин. Якщо ви не надсилали цей запит — просто проігноруйте лист.

З повагою,
Команда MosaicHub
`;

export const PASSWORD_RESET_MAIL_HTML = `
<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8" />
  <title>MosaicHub – Скидання пароля</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body {
      margin: 0; padding: 0; background: #f6f7fb;
      font-family: Arial, sans-serif; color: #2c3e50;
    }
    .container {
      max-width: 560px; margin: 40px auto; background: #ffffff;
      border-radius: 12px; padding: 28px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }
    h1 {
      font-size: 20px; margin: 0 0 14px 0;
    }
    p {
      font-size: 15px; line-height: 1.6; margin: 12px 0;
      color: #555;
    }
    .btn {
      display: inline-block; text-decoration: none; text-align: center;
      padding: 14px 22px; border-radius: 10px; margin: 18px 0;
      font-weight: bold; font-size: 16px;
      background: #4a6cf7; color: #ffffff !important;
    }
    .muted {
      font-size: 13px; color: #9aa3b2;
    }
    .brand { color: #4a6cf7; font-weight: bold; }
    .link-box {
      background: #f0f4ff; padding: 12px; border-radius: 8px;
      word-break: break-all; user-select: all;
      font-family: monospace; font-size: 13px; color: #2c3e50;
      margin-top: 8px;
    }
    .divider {
      height: 1px; background: #eef0f5; margin: 22px 0;
    }
    .footer {
      text-align: center; margin-top: 18px; font-size: 12px; color: #9aa3b2;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Скидання пароля</h1>
    <p>Ми отримали запит на скидання пароля до вашого облікового запису <span class="brand">MosaicHub</span>.</p>
    <p>Щоб встановити новий пароль, натисніть кнопку нижче:</p>

    <p style="text-align:center;">
      <a class="btn" href="${PASSWORD_RESET_LINK_PLACEHOLDER}" target="_blank" rel="noopener">
        Скинути пароль
      </a>
    </p>

    <p class="muted">Посилання дійсне протягом <strong>${PASSWORD_RESET_REQUEST_EXPIRATION_TIME_SECONDS/60} хвилин</strong>.</p>

    <div class="divider"></div>

    <p>Якщо кнопка не працює, скопіюйте посилання вручну:</p>
    <div class="link-box">${PASSWORD_RESET_LINK_PLACEHOLDER}</div>

    <p class="footer">
      Якщо ви не надсилали цей запит — проігноруйте цей лист.
      <br/>Дякуємо, що обираєте <span class="brand">MosaicHub</span>!
    </p>
  </div>
</body>
</html>
`;
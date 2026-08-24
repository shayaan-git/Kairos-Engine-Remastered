export const verifyEmailHTMLTemplate = (LoginUrl) =>
   `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Email Verified</title>

        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          }

          body {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(90deg, #16222A, #3A6073);
            padding: 20px;
          }

          .card {
            background: #fff;
            width: 100%;
            max-width: 500px;
            padding: 40px;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
            animation: fadeIn 0.5s ease;
          }

          .icon {
            width: 90px;
            height: 90px;
            margin: 0 auto 20px;
            border-radius: 50%;
            background: #22c55e;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 42px;
            font-weight: bold;
          }

          h1 {
            color: #222;
            margin-bottom: 15px;
            font-size: 32px;
          }

          p {
            color: #666;
            line-height: 1.7;
            font-size: 17px;
            margin-bottom: 30px;
          }

          .btn {
            display: inline-block;
            text-decoration: none;
            background: linear-gradient(135deg, #0052D4, #4364F7, #6FB1FC);
            color: white;
            padding: 14px 34px;
            border-radius: 999px;
            font-weight: 600;
            font-size: 16px;
            transition: .25s ease;
            box-shadow: 0 8px 20px rgba(102,126,234,.35);
          }

          .btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 25px rgba(102,126,234,.45);
          }

          .footer {
            margin-top: 25px;
            color: #999;
            font-size: 14px;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        </style>
      </head>

      <body>
        <div class="card">
          <div class="icon">✓</div>

          <h1>Email Verified Successfully!</h1>

          <p>
            Congratulations! Your email address has been verified.
            Your account is now active and ready to use.
          </p>

          <a class="btn" href="${LoginUrl}">
            Continue to Login →
          </a>

          <div class="footer">
            Thank you for joining us ❤️
          </div>
        </div>
      </body>
      </html>
      `;

export const resendVerificationEmailHTMLTemplate = (
   userKaName,
   ReVerificationUrl,
) =>
   `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
        </head>

        <body style="margin:0;padding:0;background:#f4f7fb;font-family:Segoe UI,Arial,sans-serif;color:#333;">

          <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
            <tr>
              <td align="center">

                <table
                  width="600"
                  cellpadding="0"
                  cellspacing="0"
                  style="max-width:600px;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 10px 35px rgba(0,0,0,.08);"
                >

                  <tr>
                    <td
                      align="center"
                      style="background:linear-gradient(135deg,#667eea,#764ba2);padding:40px 30px;color:#fff;"
                    >
                      <h1 style="margin:0;font-size:32px;">
                        Verify Your Email
                      </h1>

                      <p style="margin:15px 0 0;font-size:17px;opacity:.9;">
                        KairosPX
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:45px 40px;">

                      <p style="font-size:18px;margin-top:0;">
                        Hi <strong>${userKaName}</strong>,
                      </p>

                      <p style="line-height:1.8;color:#555;font-size:16px;">
                        You requested a new email verification link for your
                        KairosPX account.
                      </p>

                      <div style="text-align:center;margin:40px 0;">

                        <a
                          href="${ReVerificationUrl}"
                          style="
                            display:inline-block;
                            padding:16px 34px;
                            background:#667eea;
                            color:#ffffff;
                            text-decoration:none;
                            font-weight:600;
                            border-radius:999px;
                            font-size:16px;
                          "
                        >
                          Verify Email
                        </a>

                      </div>

                      <p style="line-height:1.7;color:#666;font-size:15px;">
                        This verification link will expire in 15 minutes.
                      </p>

                      <p style="line-height:1.7;color:#666;font-size:15px;">
                        If you didn't request this email, you can safely ignore it.
                      </p>

                      <hr style="border:none;border-top:1px solid #eee;margin:35px 0;">

                      <p style="margin-top:35px;font-size:16px;">
                        Best regards,<br>
                        <strong>The KairosPX Team</strong>
                      </p>

                    </td>
                  </tr>

                </table>

              </td>
            </tr>
          </table>

        </body>
        </html>
      `;

export const registerUserHTMLTemplate = (username, verificationUrl) =>
   `
      <!DOCTYPE html>
      <html lang="en">
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
      </head>
         
      <body style="margin:0;padding:0;background:#f4f7fb;font-family:Segoe UI,Arial,sans-serif;color:#333;">
         
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
      <tr>
      <td align="center">
         
      <table width="600" cellpadding="0" cellspacing="0"
      style="max-width:600px;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 10px 35px rgba(0,0,0,.08);">
         
      <!-- Header -->
      <tr>
      <td align="center"
      style="background:linear-gradient(135deg,#667eea,#764ba2);padding:40px 30px;color:#fff;">
         
      <h1 style="margin:0;font-size:32px;">
      🎉 Welcome to KairosPX
      </h1>
         
      <p style="margin:15px 0 0;font-size:17px;opacity:.9;">
      We're excited to have you with us.
      </p>
         
      </td>
      </tr>
         
      <!-- Content -->
      <tr>
      <td style="padding:45px 40px;">
         
      <p style="font-size:18px;margin-top:0;">
      Hi <strong>${username}</strong>,
      </p>
         
      <p style="line-height:1.8;color:#555;font-size:16px;">
      Thank you for creating your KairosPX account.
      Before you can start using all features, please verify your email address.
      </p>
         
      <div style="text-align:center;margin:40px 0;">
      <a href="${verificationUrl}"
      style="
         display:inline-block;
         padding:16px 34px;
         background:#667eea;
         color:#ffffff;
         text-decoration:none;
         font-weight:600;
         border-radius:999px;
         font-size:16px;">
      Verify Email
      </a>
      </div>
         
      <p style="line-height:1.7;color:#666;font-size:15px;">
      If the button doesn't work, copy and paste this link into your browser:
      </p>
         
      <p style="word-break:break-all;">
         <a href="${verificationUrl}"
         style="color:#667eea;text-decoration:none;">
         ${verificationUrl}
         </a>
      </p>
         
      <hr style="border:none;border-top:1px solid #eee;margin:35px 0;">
         
      <p style="color:#666;line-height:1.7;font-size:15px;">
      If you didn't create a KairosPX account, you can safely ignore this email.
      No further action is required.
      </p>
         
      <p style="margin-top:35px;font-size:16px;">
      Best regards,<br>
      <strong>The KairosPX Team</strong>
      </p>
         
      </td>
      </tr>
         
      <!-- Footer -->
      <tr>
      <td align="center"
      style="padding:25px;background:#fafafa;color:#888;font-size:13px;">
         
      © ${new Date().getFullYear()} KairosPX. All rights reserved.
         
      </td>
      </tr>
         
      </table>
         
      </td>
      </tr>
      </table>
         
      </body>
      </html>
      `;

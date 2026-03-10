import smtplib
import random
import string
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# SMTP Configuration for Gmail
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_EMAIL = "pc8080159669@gmail.com"
APP_PASSWORD = "xnmd lydf bzbm rddu" 

def generate_otp(length=6):
    """Generates a random numeric OTP of specified length."""
    return ''.join(random.choices(string.digits, k=length))

def get_html_template(otp, recipient_email):
    """Returns the branded HTML email template."""
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            .container {{
                font-family: 'Inter', Helvetica, Arial, sans-serif;
                max-width: 600px;
                margin: 0 auto;
                background-color: #F5F5F0;
                padding: 40px;
                border-radius: 24px;
            }}
            .header {{
                text-align: center;
                margin-bottom: 30px;
            }}
            .logo {{
                color: #2D5A27;
                font-size: 28px;
                font-weight: bold;
                text-decoration: none;
            }}
            .card {{
                background-color: #ffffff;
                padding: 40px;
                border-radius: 20px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                text-align: center;
            }}
            .otp-code {{
                font-size: 48px;
                font-weight: 800;
                color: #2D5A27;
                letter-spacing: 8px;
                margin: 24px 0;
                padding: 16px;
                background-color: #F0F7EF;
                border-radius: 12px;
                display: inline-block;
            }}
            .expiry {{
                color: #D4A373;
                font-weight: bold;
                font-size: 14px;
                margin-bottom: 24px;
            }}
            .button {{
                display: inline-block;
                padding: 14px 28px;
                background-color: #2D5A27;
                color: #ffffff !important;
                text-decoration: none;
                border-radius: 12px;
                font-weight: bold;
                margin-top: 10px;
            }}
            .footer {{
                text-align: center;
                margin-top: 30px;
                color: #888888;
                font-size: 12px;
            }}
        </style>
    </head>
    <body style="background-color: #ffffff; margin: 0; padding: 20px;">
        <div class="container">
            <div class="header">
                <a href="#" class="logo">🌿 AgriPredict</a>
            </div>
            <div class="card">
                <h2 style="color: #333; margin-top: 0;">Verify Your Account</h2>
                <p style="color: #666; font-size: 16px;">Please use the following one-time password to complete your registration.</p>
                
                <div class="otp-code">{otp}</div>
                
                <p class="expiry">⚠️ This code expires in 2 minutes</p>
                
                <p style="margin-top: 25px;"><a href="http://127.0.0.1:5000" style="color: #2D5A27; font-size: 14px; font-weight: bold; text-decoration: none;">Return to AgriPredict</a></p>
            </div>
            <div class="footer">
                <p>© 2026 AgriPredict Inc. | Precision Farming for a Better Future</p>
                <p>If you didn't request this email, please ignore it.</p>
            </div>
        </div>
    </body>
    </html>
    """

def send_otp_email(recipient_email, otp):
    """
    Sends a branded HTML OTP email to the specified recipient.
    """
    try:
        message = MIMEMultipart("alternative")
        message["From"] = f"AgriPredict <{SENDER_EMAIL}>"
        message["To"] = recipient_email
        message["Subject"] = f"{otp} is your AgriPredict verification code"

        # Create plain-text and HTML versions
        text = f"Your AgriPredict OTP is: {otp}. It expires in 2 minutes."
        html = get_html_template(otp, recipient_email)

        message.attach(MIMEText(text, "plain"))
        message.attach(MIMEText(html, "html"))

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SENDER_EMAIL, APP_PASSWORD)
            server.send_message(message)
            
        print(f"Successfully sent branded OTP to {recipient_email}")
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

def send_reset_password_email(recipient_email, otp):
    """
    Sends a branded HTML password recovery email.
    """
    try:
        message = MIMEMultipart("alternative")
        message["From"] = f"AgriPredict <{SENDER_EMAIL}>"
        message["To"] = recipient_email
        message["Subject"] = f"{otp} is your account recovery code"

        text = f"Your AgriPredict account recovery code is: {otp}. It expires in 2 minutes."
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                .container {{ font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background-color: #F8F9FA; padding: 40px; border-radius: 24px; }}
                .header {{ text-align: center; margin-bottom: 30px; }}
                .logo {{ color: #2D5A27; font-size: 28px; font-weight: bold; text-decoration: none; }}
                .card {{ background-color: #ffffff; padding: 40px; border-radius: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); text-align: center; }}
                .otp-code {{ font-size: 48px; font-weight: 800; color: #D4A373; letter-spacing: 8px; margin: 24px 0; padding: 16px; background-color: #FCF8F4; border-radius: 12px; display: inline-block; }}
                .expiry {{ color: #CC3333; font-weight: bold; font-size: 14px; margin-bottom: 24px; }}
                .button {{ display: inline-block; padding: 14px 28px; background-color: #2D5A27; color: #ffffff !important; text-decoration: none; border-radius: 12px; font-weight: bold; }}
            </style>
        </head>
        <body style="margin: 0; padding: 20px;">
            <div class="container">
                <div class="header"><a href="#" class="logo">🌿 AgriPredict</a></div>
                <div class="card">
                    <h2 style="color: #333; margin-top: 0;">Account Recovery</h2>
                    <p style="color: #666;">We received a request to reset your password. Use the code below to proceed.</p>
                    <div class="otp-code">{otp}</div>
                    <p class="expiry">⚠️ Valid for 2 minutes only</p>
                    <p style="color: #888; font-size: 12px; margin-bottom: 20px;">If you didn't request this, you can safely ignore this email.</p>
                    <a href="http://127.0.0.1:5000" class="button">Return to Website</a>
                </div>
            </div>
        </body>
        </html>
        """

        message.attach(MIMEText(text, "plain"))
        message.attach(MIMEText(html, "html"))

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SENDER_EMAIL, APP_PASSWORD)
            server.send_message(message)
        return True
    except Exception as e:
        print(f"Error sending recovery email: {e}")
        return False

if __name__ == "__main__":
    test_email = "pc8080159669@gmail.com"
    test_otp = generate_otp()
    send_otp_email(test_email, test_otp)

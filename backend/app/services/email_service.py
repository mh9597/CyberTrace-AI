import smtplib
import random
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from backend.app.core.config import settings

logger = logging.getLogger(__name__)

# In-memory OTP storage for rapid verification: { email: { "otp": "123456", "expires_at": timestamp } }
otp_storage = {}

def generate_otp() -> str:
    return f"{random.randint(100000, 999999)}"

def send_verification_email(email: str, full_name: str, otp_code: str, purpose: str = "signup") -> dict:
    """
    Sends 6-digit verification OTP email to officer via SMTP.
    Falls back gracefully if SMTP is not configured or in test mode.
    """
    if purpose == "forgot_password":
        subject = f"CyberTrace AI - Password Reset Verification Code: {otp_code}"
        headline = "CyberTrace AI • Password Reset"
        desc = "To reset your officer credentials and establish a new access key, enter the 6-digit one-time verification passcode below:"
    else:
        subject = f"CyberTrace AI - Officer Identity Verification Code: {otp_code}"
        headline = "CyberTrace AI • Identity Verification"
        desc = "To complete your enrollment and activate your Google-linked badge credentials, enter the 6-digit one-time verification passcode below:"

    body_text = f"""
Dear Officer {full_name},

Your verification code for CyberTrace AI Law Enforcement Portal ({purpose.replace('_', ' ').title()}) is:

    ===========================
             {otp_code}
    ===========================

This code is valid for 10 minutes. 
If you did not request this verification, please alert your cyber cell administrator immediately.

CyberTrace AI Security Command
Authorized Law Enforcement Decision Support System
"""

    html_content = f"""
    <div style="font-family: Arial, sans-serif; background: #0f172a; color: #ffffff; padding: 30px; border-radius: 12px; max-width: 520px; margin: auto;">
        <div style="border-bottom: 1px solid #334155; padding-bottom: 15px; margin-bottom: 20px;">
            <h2 style="color: #60a5fa; margin: 0; font-size: 20px;">{headline}</h2>
            <p style="color: #94a3b8; font-size: 12px; margin: 4px 0 0 0;">Authorized Law Enforcement Portal Access</p>
        </div>
        <p style="color: #e2e8f0; font-size: 14px;">Greetings Officer <strong>{full_name}</strong>,</p>
        <p style="color: #94a3b8; font-size: 13px; line-height: 1.5;">
            {desc}
        </p>
        <div style="background: #1e293b; border: 1px solid #3b82f6; border-radius: 8px; text-align: center; padding: 18px; margin: 25px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #38bdf8; font-family: monospace;">{otp_code}</span>
        </div>
        <p style="color: #64748b; font-size: 11px; margin-top: 20px;">
            This security passcode expires in 10 minutes. Automated transmission — do not reply directly.
        </p>
    </div>
    """

    if settings.SMTP_ENABLED and settings.SMTP_USER and settings.SMTP_PASSWORD:
        try:
            from email.utils import formataddr, make_msgid, formatdate
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = formataddr(("CyberTrace AI Security", settings.SMTP_FROM_EMAIL))
            msg["To"] = email
            msg["Reply-To"] = settings.SMTP_FROM_EMAIL
            msg["Date"] = formatdate(localtime=True)
            msg["Message-ID"] = make_msgid(domain="cybertrace.ai")
            msg.attach(MIMEText(body_text, "plain"))
            msg.attach(MIMEText(html_content, "html"))

            # First try port 587 (STARTTLS), fallback to port 465 (SSL) if blocked
            sent = False
            send_error = None
            try:
                with smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT, timeout=12) as server:
                    server.starttls()
                    server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                    refusals = server.send_message(msg)
                    if refusals:
                        send_error = f"SMTP rejected recipients: {refusals}"
                    else:
                        sent = True
            except Exception as e_tls:
                logger.warning(f"SMTP TLS (port {settings.SMTP_PORT}) failed ({e_tls}). Attempting port 465 SSL fallback...")
                try:
                    with smtplib.SMTP_SSL(settings.SMTP_SERVER, 465, timeout=12) as ssl_server:
                        ssl_server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                        refusals = ssl_server.send_message(msg)
                        if refusals:
                            send_error = f"SMTP SSL rejected recipients: {refusals}"
                        else:
                            sent = True
                except Exception as e_ssl:
                    send_error = f"TLS error: {e_tls} | SSL error: {e_ssl}"

            if sent:
                print(f"[SMTP SUCCESS] Dispatched OTP {otp_code} to {email}")
                logger.info(f"Verification email successfully dispatched to {email}")
                return {"sent": True, "mode": "smtp"}
            else:
                print(f"[SMTP ERROR] Failed sending to {email}: {send_error}")
                logger.warning(f"SMTP dispatch failed: {send_error}. Logging OTP to console.")
                return {"sent": False, "mode": "fallback", "error": send_error, "dev_otp": otp_code}
        except Exception as e:
            print(f"[SMTP ERROR] Exception sending to {email}: {e}")
            logger.warning(f"SMTP dispatch failed: {e}. Logging OTP to console.")
            return {"sent": False, "mode": "fallback", "error": str(e), "dev_otp": otp_code}
    else:
        logger.info(f"[DEV MODE] SMTP not configured. OTP for {email} is: {otp_code}")
        return {"sent": True, "mode": "simulation", "dev_otp": otp_code}

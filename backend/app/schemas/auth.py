from typing import Optional
from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str = "investigator"
    badge_number: Optional[str] = None



class UserResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: str
    badge_number: Optional[str] = None
    is_active: bool

    class Config:
        from_attributes = True


class UserUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    role: Optional[str] = None
    badge_number: Optional[str] = None
    password: Optional[str] = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class GoogleAuthInitRequest(BaseModel):
    email: EmailStr
    full_name: Optional[str] = "Officer"
    google_id: Optional[str] = None


class GoogleVerifyOtpRequest(BaseModel):
    email: EmailStr
    otp: str


class GoogleCompleteRegistrationRequest(BaseModel):
    email: EmailStr
    full_name: str
    badge_number: str
    role: str
    otp: str
    department: Optional[str] = None


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp: str
    new_password: str


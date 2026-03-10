import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AuthenticationRoute from "@/components/auth/AuthenticationRoute";
import RegisterModal from "./RegisterModal";

interface FormErrors {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  password: string;
  accept: string;
}

const initialErrors: FormErrors = {
  first_name: "",
  last_name: "",
  phone: "",
  email: "",
  password: "",
  accept: "",
};

export default function RegisterTechnicianPage() {
  const { register, state, isAuthenticated } = useAuth();

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [accept, setAccept] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>(initialErrors);

  const [modalType, setModalType] = useState<"success" | "error" | null>(null);
  const [apiError, setApiError] = useState<string>("");


  // ฟังก์ชันตรวจสอบความถูกต้องของฟอร์ม

  const validate = (): boolean => {
    const newErrors: FormErrors = { ...initialErrors };
    let valid = true;

    const nameRegex = /^[A-Za-zก-๙\s'-]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!firstName.trim()) {
      newErrors.first_name = "โปรดกรอกชื่อ";
      valid = false;
    } else if (!nameRegex.test(firstName)) {
      newErrors.first_name = "ชื่อใช้ได้เฉพาะ A-Z a-z ภาษาไทย ' -";
      valid = false;
    }

    if (!lastName.trim()) {
      newErrors.last_name = "โปรดกรอกนามสกุล";
      valid = false;
    } else if (!nameRegex.test(lastName)) {
      newErrors.last_name = "นามสกุลใช้ได้เฉพาะ A-Z a-z ภาษาไทย ' -";
      valid = false;
    }

    if (!phone.trim()) {
      newErrors.phone = "โปรดกรอกเบอร์โทรศัพท์";
      valid = false;
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = "เบอร์โทรต้องเป็นตัวเลข 10 หลัก";
      valid = false;
    }

    if (!email.trim()) {
      newErrors.email = "โปรดกรอกอีเมล";
      valid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "รูปแบบอีเมลไม่ถูกต้อง";
      valid = false;
    }

    if (!password.trim()) {
      newErrors.password = "โปรดกรอกรหัสผ่าน";
      valid = false;
    } else if (password.length < 8) {
      newErrors.password = "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร";
      valid = false;
    }

    if (!accept) {
      newErrors.accept = "กรุณายอมรับ policy";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // ฟังก์ชั่นการลงทะเบียน

  const handleRegister = async (e: React.SyntheticEvent): Promise<void> => {
    e.preventDefault();
    if (state.loading) return;
    if (!validate()) return;

    const result = await register({
      first_name: firstName,
      last_name: lastName,
      phone,
      email,
      password,
    });

    if (result?.error) {
      setApiError(result.error);
      setModalType("error");
    } else {
      setModalType("success");
    }
  };

  const handleCloseModal = (): void => {
    setModalType(null);
    setApiError("");
  };

  // UI

  return (
    <AuthenticationRoute
      isLoading={state.getUserLoading}
      isAuthenticated={isAuthenticated}
    >
      {modalType && (
        <RegisterModal
          type={modalType}
          errorMessage={apiError}
          onClose={handleCloseModal}
        />
      )}

      <div className="min-h-screen bg-[#F6F7FB] flex justify-center px-4 py-10 sm:py-16">
        <div className="w-full max-w-105 bg-white border border-[#E4E7EC] rounded-md px-5 py-6 sm:px-8 sm:py-8">
          <h1 className="text-center text-[20px] sm:text-[24px] font-semibold text-[#101828] mb-6">
            ลงทะเบียนร่วมงานกับเรา
          </h1>

          <form className="space-y-4" onSubmit={handleRegister}>
            {/* FIRST NAME + LAST NAME */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-[14px] font-medium text-[#344054] mb-1">
                  ชื่อ<span className="text-[#D92D20]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="ชื่อ"
                  value={firstName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFirstName(e.target.value)
                  }
                  className="w-full h-11 px-3 text-[14px] border border-[#D0D5DD] rounded-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
                {errors.first_name && (
                  <p className="text-[12px] text-red-500 mt-1">
                    {errors.first_name}
                  </p>
                )}
              </div>

              <div className="flex-1">
                <label className="block text-[14px] font-medium text-[#344054] mb-1">
                  นามสกุล<span className="text-[#D92D20]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="นามสกุล"
                  value={lastName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setLastName(e.target.value)
                  }
                  className="w-full h-11 px-3 text-[14px] border border-[#D0D5DD] rounded-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
                {errors.last_name && (
                  <p className="text-[12px] text-red-500 mt-1">
                    {errors.last_name}
                  </p>
                )}
              </div>
            </div>

            {/* PHONE */}
            <div>
              <label className="block text-[14px] font-medium text-[#344054] mb-1">
                เบอร์โทรศัพท์<span className="text-[#D92D20]">*</span>
              </label>
              <input
                type="tel"
                placeholder="กรุณากรอกเบอร์โทรศัพท์"
                value={phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPhone(e.target.value)
                }
                className="w-full h-11 px-3 text-[14px] border border-[#D0D5DD] rounded-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
              {errors.phone && (
                <p className="text-[12px] text-red-500 mt-1">{errors.phone}</p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-[14px] font-medium text-[#344054] mb-1">
                อีเมล<span className="text-[#D92D20]">*</span>
              </label>
              <input
                type="email"
                placeholder="กรุณากรอกอีเมล"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                className="w-full h-11 px-3 text-[14px] border border-[#D0D5DD] rounded-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
              {errors.email && (
                <p className="text-[12px] text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-[14px] font-medium text-[#344054] mb-1">
                รหัสผ่าน<span className="text-[#D92D20]">*</span>
              </label>
              <input
                type="password"
                placeholder="กรุณากรอกรหัสผ่าน"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                className="w-full h-11 px-3 text-[14px] border border-[#D0D5DD] rounded-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
              {errors.password && (
                <p className="text-[12px] text-red-500 mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* CHECKBOX */}
            <div className="flex gap-2 text-[13px] text-[#667085]">
              <input
                type="checkbox"
                className="mt-1"
                checked={accept}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setAccept(e.target.checked)
                }
              />
              <span>
                ยอมรับ{" "}
                <span className="text-blue-600 underline cursor-pointer">
                  ข้อตกลงและเงื่อนไข
                </span>{" "}
                และ{" "}
                <span className="text-blue-600 underline cursor-pointer">
                  นโยบายความเป็นส่วนตัว
                </span>
              </span>
            </div>
            {errors.accept && (
              <p className="text-[12px] text-red-500">{errors.accept}</p>
            )}

            <button
              type="submit"
              disabled={state.loading ?? false}
              className="btn-primary w-full h-11"
            >
              {state.loading ? "กำลังสมัคร..." : "ลงทะเบียน"}
            </button>
          </form>

          <p className="text-center text-[13px] text-blue-600 underline mt-6">
            <Link href="/login-technician">กลับไปหน้าเข้าสู่ระบบ</Link>
          </p>
        </div>
      </div>
    </AuthenticationRoute>
  );
}

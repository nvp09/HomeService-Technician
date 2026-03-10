import Link from "next/link";
import { useState } from "react";
import type { ChangeEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AuthenticationRoute from "@/components/auth/AuthenticationRoute";
import LoginModal from "./LoginModal";

interface FormErrors {
  email: string;
  password: string;
}

const initialErrors: FormErrors = {
  email: "",
  password: "",
};

export default function LoginTechnicianPage() {
  const { login, state, isAuthenticated, logout, fetchUser } = useAuth();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>(initialErrors);

  const [modalType, setModalType] = useState<"success" | "error" | null>(null);
  const [apiError, setApiError] = useState<string>("");

  const validate = (): boolean => {
    const newErrors: FormErrors = { ...initialErrors };
    let valid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async (e: React.SyntheticEvent): Promise<void> => {
    e.preventDefault();
    if (state.loading) return;
    if (!validate()) return;

    const result = await login({ email, password });

    if (result?.error) {
      setApiError(result.error);
      setModalType("error");
    } else {
      // อ่าน role จาก result แทน state.user
      if (result?.role !== "technician") {
        localStorage.removeItem("token"); // ลบ token ทิ้งเพื่อป้องกันการใช้งานผิดประเภท
        await fetchUser(); // รีเฟรชข้อมูลผู้ใช้ใน context  
        setApiError("บัญชีผู้ใช้ของคุณไม่ได้รับสิทธิ์เข้าใช้งานระบบช่าง");
        setModalType("error");
        return;
      }
      setModalType("success");
    }
  };

  const handleCloseModal = (): void => {
    setModalType(null);
    setApiError("");
  };

  return (
    <AuthenticationRoute
      isLoading={state.getUserLoading}
      isAuthenticated={isAuthenticated}
      bypassRedirect={modalType !== null}
    >
      {modalType && (
        <LoginModal
          type={modalType}
          errorMessage={apiError}
          onClose={handleCloseModal}
        />
      )}

      <div className="min-h-screen bg-[#F6F7FB] flex items-center justify-center px-4">
        <div className="w-full max-w-110 bg-white border border-[#E4E7EC] rounded-xl px-6 py-8 sm:px-8 sm:py-10 shadow-sm">
          {/* HEADER */}
          <div className="text-center mb-8">
            <h1 className="text-[22px] sm:text-[26px] font-semibold text-[#101828]">
              เข้าสู่ระบบ
            </h1>
            <p className="text-[13px] text-[#667085] mt-3">
              สำหรับช่างผู้ให้บริการเท่านั้น
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            {/* EMAIL */}
            <div>
              <label className="block text-[14px] font-medium text-[#344054] mb-1">
                อีเมล<span className="text-[#D92D20]">*</span>
              </label>
              <input
                type="email"
                placeholder="กรุณากรอกอีเมล"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                className="w-full h-11 px-3 text-[14px] border border-[#D0D5DD] rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
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
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                className="w-full h-11 px-3 text-[14px] border border-[#D0D5DD] rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
              {errors.password && (
                <p className="text-[12px] text-red-500 mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* FORGOT PASSWORD */}
            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-[13px] text-blue-600 underline"
              >
                ลืมรหัสผ่าน?
              </Link>
            </div>

            <button
              type="submit"
              disabled={state.loading ?? false}
              className="btn-primary w-full h-11 text-[14px]"
            >
              {state.loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="border-t border-[#E4E7EC] mt-6 pt-5">
            <p className="text-center text-[13px] text-[#667085]">
              ยังไม่ได้ลงทะเบียนร่วมงานกับเรา?{" "}
              <Link
                href="/register-technician"
                className="text-blue-600 underline font-medium"
              >
                ลงทะเบียน
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthenticationRoute>
  );
}

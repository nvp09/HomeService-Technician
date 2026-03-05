import { useState } from "react";
import { RefreshCw } from "lucide-react";
import TechnicianLayout from "@/components/layout/TechnicianLayout";

// ตัวอย่างข้อมูลบริการทั้งหมด (ในระบบจริงอาจดึงมาจาก API)
const ALL_SERVICES = [
  { id: 1, name: "ล้างแอร์" },
  { id: 2, name: "ติดตั้งแอร์" },
  { id: 3, name: "ทำความสะอาดทั่วไป" },
  { id: 4, name: "ซ่อมแอร์" },
  { id: 5, name: "ซ่อมเครื่องซักผ้า" },
  { id: 6, name: "ติดตั้งเตาแก๊ส" },
  { id: 7, name: "ติดตั้งเครื่องดูดควัน" },
  { id: 8, name: "ติดตั้งซักโครก" },
  { id: 9, name: "ติดตั้งเครื่องทำน้ำอุ่น" },
];

const AccountSettingsPage = () => {
  const [firstName, setFirstName] = useState("สมาน");
  const [lastName, setLastName] = useState("เยี่ยมยอด");
  const [phone, setPhone] = useState("0890002345");
  const [location] = useState(
    "332 อาคารเดอะไนน์ทาวเวอร์ เสนานิคม จตุจักร กรุงเทพฯ",
  );
  const [isAvailable, setIsAvailable] = useState(true);
  const [selectedServices, setSelectedServices] = useState<number[]>([
    1, 2, 3, 4, 5, 7, 9,
  ]);

  const toggleService = (id: number) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const headerActions = (
    <>
      <button className="px-5 py-2 rounded-lg border border-blue-600 text-blue-600 text-[16px] font-medium hover:bg-blue-100 hover:border-blue-500 transition-colors cursor-pointer sm:px-6">
        ยกเลิก
      </button>
      <button className="px-5 py-2 rounded-lg bg-blue-600 text-white text-[16px] font-medium hover:bg-blue-700 transition-colors cursor-pointer sm:px-6">
        ยืนยัน
      </button>
    </>
  );

  return (
    <TechnicianLayout headerActions={headerActions}>
      <div className="w-full font-prompt overflow-hidden px-0">
        <div className="bg-white rounded-lg border border-gray-200">
          {/* ===== Section 1: รายละเอียดบัญชี ===== */}
          <div className="p-4 sm:p-8">
            <h2 className="text-[20px] font-medium text-black mb-6">
              รายละเอียดบัญชี
            </h2>

            {/* ใช้ flex-col gap-5 เพื่อเว้นระยะระหว่างแต่ละ row */}
            <div className="flex flex-col gap-7">
              {/* ชื่อ */}
              <div className="flex flex-row items-center gap-4">
                <label className="text-[16px] font-medium text-gray-700 w-22 shrink-0 sm:w-45">
                  ชื่อ<span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="flex-1 min-w-0 h-13 px-4 border border-gray-300 rounded-lg text-[16px] text-black outline-none focus:border-blue-500 transition-colors sm:max-w-xl"
                />
              </div>

              {/* นามสกุล */}
              <div className="flex flex-row items-center gap-4">
                <label className="text-[16px] font-medium text-gray-700 w-22 shrink-0 sm:w-45">
                  นามสกุล<span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="flex-1 min-w-0 h-13 px-4 border border-gray-300 rounded-lg text-[16px] text-black outline-none focus:border-blue-500 transition-colors sm:max-w-xl"
                />
              </div>

              {/* เบอร์ติดต่อ */}
              <div className="flex flex-row items-center gap-4">
                <label className="text-[16px] font-medium text-gray-700 w-22 shrink-0 sm:w-45">
                  เบอร์ติดต่อ<span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 min-w-0 h-13 px-4 border border-gray-300 rounded-lg text-[16px] text-black outline-none focus:border-blue-500 transition-colors sm:max-w-xl"
                />
              </div>

              {/* ตำแหน่งที่อยู่ปัจจุบัน */}
              {/* items-start + pt-2.5 บน label เพราะ value อาจขึ้นหลายบรรทัด */}
              <div className="flex flex-row items-start gap-6">
                <label className="text-[16px] font-medium text-gray-700 w-20 shrink-0 pt-2.5 sm:w-43">
                  ตำแหน่งที่อยู่ปัจจุบัน<span className="text-red-600">*</span>
                </label>
                <div className="flex-1 flex flex-col sm:flex-row gap-5 min-w-0">
                  <div className="flex-1 min-h-11 px-4 py-2.5 border border-gray-300 rounded-lg text-[16px] text-gray-500 leading-relaxed overflow-hidden sm:max-w-xl">
                    {location}
                  </div>
                  <button className="flex items-center justify-center gap-2 h-13 w-28 px-5 border border-blue-600 rounded-lg text-[16px] text-blue-600 hover:bg-gray-50 transition-colors cursor-pointer shrink-0 font-medium">
                    <RefreshCw size={17} />
                    รีเฟรช
                  </button>
                </div>
              </div>
              <hr className="border-t border-gray-300" />
            </div>
          </div>

          {/* ===== Section 2: สถานะบัญชี ===== */}
          <div className="px-4 py-2 sm:px-4 sm:py-4 sm:flex sm:items-start sm:gap-24">
            <h2 className="text-[20px] font-semibold text-black mb-4">
              สถานะบัญชี
            </h2>

            <div className="flex items-start gap-3">
              {/* Toggle switch */}
              <button
                onClick={() => setIsAvailable((v) => !v)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 mt-0.5 cursor-pointer ${
                  isAvailable ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                    isAvailable ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>

              {/* Label + คำอธิบาย */}
              <div className="mb-5">
                <p className="text-[18px] font-medium text-black">
                  พร้อมให้บริการ
                </p>
                <p className="text-[16px] text-black mt-0.5 font-light">
                  ระบบจะแสดงคำสั่งซ่อมในบริเวณใกล้เคียงตำแหน่งที่อยู่ปัจจุบัน
                  ให้สามารถเลือกรับงานได้
                </p>
              </div>
            </div>
          </div>

          <hr className="border-t border-gray-300 mx-4 sm:mx-8" />

          {/* ===== Section 3: บริการที่รับซ่อม ===== */}
          <div className="px-6 py-3 sm:p-8 sm:flex sm:gap-18">
            <h2 className="text-[20px] font-semibold text-black mb-4">
              บริการที่รับซ่อม
            </h2>

            <div className="flex flex-col gap-4">
              {ALL_SERVICES.map((service) => {
                const checked = selectedServices.includes(service.id);
                return (
                  <label
                    key={service.id}
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => toggleService(service.id)}
                  >
                    {/* Checkbox สี่เหลี่ยม ไม่มี rounded */}
                    <div
                      className={`w-5 h-5 border-2 flex items-center justify-center shrink-0 transition-colors ${
                        checked
                          ? "bg-blue-600 border-blue-600"
                          : "bg-white border-gray-400"
                      }`}
                    >
                      {checked && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="text-[16px] text-black select-none">
                      {service.name}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </TechnicianLayout>
  );
};

export default AccountSettingsPage;

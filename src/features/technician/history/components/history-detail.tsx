import { ChevronLeft, MapPin, Star } from "lucide-react";

interface HistoryDetailProps {
  onBack: () => void;
}

export default function HistoryDetail({ onBack }: HistoryDetailProps) {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ส่วน Header ย้อนกลับ */}
      <div className="bg-white px-6 py-4 border-b border-gray-200 flex items-center gap-4">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-800 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div>
          <div className="text-xs text-gray-400">ประวัติการซ่อม</div>
          <h1 className="text-lg font-bold text-gray-800">ล้างแอร์</h1>
        </div>
      </div>

      {/* ส่วน Card รายละเอียด */}
      <div className="p-6">
        <div className="bg-white rounded-lg p-8 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-8">ล้างแอร์</h2>

          <div className="space-y-6 text-sm">
            <div className="grid grid-cols-[200px_1fr] items-center">
              <span className="text-gray-500 font-medium">หมวดหมู่</span>
              <div>
                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
                  บริการทั่วไป
                </span>
              </div>
            </div>

            <div className="grid grid-cols-[200px_1fr]">
              <span className="text-gray-500 font-medium">รายการ</span>
              <span className="text-gray-800">ล้างแอร์ 9,000 - 18,000 BTU, ติดผนัง 2 เครื่อง</span>
            </div>

            <div className="grid grid-cols-[200px_1fr]">
              <span className="text-gray-500 font-medium">วันเวลาดำเนินการ</span>
              <span className="text-gray-800">25/04/2563 เวลา 13.00 น.</span>
            </div>

            <div className="grid grid-cols-[200px_1fr]">
              <span className="text-gray-500 font-medium">สถานที่</span>
              <div className="text-gray-800">
                <p>444/4 คอนโดศุภาลัย เสนานิคม จตุจักร กรุงเทพฯ</p>
                <a href="#" className="text-blue-500 hover:underline flex items-center gap-1 mt-1 font-medium">
                  <MapPin size={16} />
                  ดูแผนที่
                </a>
              </div>
            </div>

            <div className="grid grid-cols-[200px_1fr]">
              <span className="text-gray-500 font-medium">รหัสคำสั่งซ่อม</span>
              <span className="text-gray-800">AD04071205</span>
            </div>

            <div className="grid grid-cols-[200px_1fr]">
              <span className="text-gray-500 font-medium">ราคารวม</span>
              <span className="text-gray-800">1,550.00 ฿</span>
            </div>

            <div className="grid grid-cols-[200px_1fr]">
              <span className="text-gray-500 font-medium">ผู้รับบริการ</span>
              <span className="text-gray-800">สมศรี จันทร์อังคารพุธ</span>
            </div>

            <div className="grid grid-cols-[200px_1fr]">
              <span className="text-gray-500 font-medium">เบอร์ติดต่อ</span>
              <span className="text-gray-800">080 000 1233</span>
            </div>

            <hr className="my-6 border-gray-100" />

            {/* ส่วนรีวิวและคะแนน */}
            <div className="grid grid-cols-[200px_1fr] items-center">
              <span className="text-gray-500 font-medium">คะแนนความพึงพอใจ</span>
              <div className="flex text-blue-500">
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} className="text-gray-300" /> {/* ดาวว่าง */}
              </div>
            </div>

            <div className="grid grid-cols-[200px_1fr]">
              <span className="text-gray-500 font-medium">ความคิดเห็นจากผู้รับบริการ</span>
              <span className="text-gray-800">เก็บงานเรียบร้อยมาก เสร็จไว มาตรงตามเวลานัดเลยค่ะ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
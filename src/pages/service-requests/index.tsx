import { useState } from "react";
import { MapPin, RefreshCw, Bell } from "lucide-react";
import TechnicianLayout from "@/components/TechnicianLayout";
import ServiceRequestCard, {
  ServiceRequest,
} from "@/components/service-requests-page/ServiceRequestCard";
import AcceptModal from "@/components/service-requests-page/AcceptModal";

// ============================================================
// Mock Data
// ============================================================
const MOCK_REQUESTS: ServiceRequest[] = [
  {
    id: 1,
    serviceName: "ล้างแอร์",
    date: "25/04/2563",
    time: "13.00 น.",
    items: "ล้างแอร์ 9,000 - 18,000 BTU, ติดผนัง 2 เครื่อง",
    orderCode: "AD04071205",
    totalPrice: "1,550.00 ฿",
    address: "444/4 คอนโดสุภาลัย เสนานิคม จตุจักร กรุงเทพฯ",
  },
  {
    id: 2,
    serviceName: "ล้างแอร์",
    date: "26/04/2563",
    time: "10.00 น.",
    items: "ล้างแอร์ 9,000 - 18,000 BTU, ติดผนัง 2 เครื่อง",
    orderCode: "AD04071205",
    totalPrice: "1,550.00 ฿",
    address: "444/4 คอนโดสุภาลัย เสนานิคม จตุจักร กรุงเทพฯ",
  },
  {
    id: 3,
    serviceName: "ล้างแอร์",
    date: "25/04/2563",
    time: "13.00 น.",
    items: "ล้างแอร์ 9,000 - 18,000 BTU, ติดผนัง 2 เครื่อง",
    orderCode: "AD04071205",
    totalPrice: "1,550.00 ฿",
    address: "444/4 คอนโดสุภาลัย เสนานิคม จตุจักร กรุงเทพฯ",
  },
];

// ============================================================
// Main Page
// ============================================================
const ServiceRequests = () => {
  // "available" = เปิดรับงาน, "unavailable" = ปิดรับงาน
  const [status, setStatus] = useState<"available" | "unavailable">(
    "available",
  );
  const [requests, setRequests] = useState<ServiceRequest[]>(MOCK_REQUESTS);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(
    null,
  );

  // กดรับงาน → เปิด modal
  const handleAccept = (request: ServiceRequest) => {
    setSelectedRequest(request);
  };

  // ยืนยันรับงาน → ลบออกจากรายการ + ปิด modal
  const handleConfirmAccept = () => {
    if (!selectedRequest) return;
    setRequests((prev) => prev.filter((r) => r.id !== selectedRequest.id));
    setSelectedRequest(null);
  };

  // ปฏิเสธงาน → ลบออกจากรายการ
  const handleReject = (id: number) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <TechnicianLayout>
      <div className="font-prompt space-y-4 w-full">
        {/* Location Banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <MapPin size={18} className="text-blue-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-[12px] text-blue-400 mb-0.5">
                ตำแหน่งที่อยู่ปัจจุบัน
              </p>
              <p className="text-[14px] text-blue-700 font-medium">
                332 อาคารเดอะไนน์ทาวเวอร์ เสนานิคม จตุจักร กรุงเทพฯ
              </p>
            </div>
          </div>
          <button className="flex items-center gap-2 border border-gray-300 bg-white text-gray-700 text-[13px] font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shrink-0 cursor-pointer">
            <RefreshCw size={14} />
            รีเฟรช
          </button>
        </div>

        {/* Status: Available → แสดงรายการงาน */}
        {status === "available" ? (
          <div className="space-y-4">
            {requests.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 py-16 flex flex-col items-center justify-center gap-3 text-center">
                <Bell size={40} className="text-gray-300" />
                <p className="text-gray-400 text-[15px]">
                  ไม่มีคำขอบริการในขณะนี้
                </p>
              </div>
            ) : (
              requests.map((request) => (
                <ServiceRequestCard
                  key={request.id}
                  request={request}
                  onAccept={handleAccept}
                  onReject={handleReject}
                />
              ))
            )}
          </div>
        ) : (
          /* Status: Unavailable → แสดงหน้าแจ้งเตือน */
          <div className="bg-white rounded-xl border border-gray-200 py-16 flex flex-col items-center justify-center gap-4 text-center px-6">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <Bell size={32} className="text-blue-500" />
            </div>
            <div>
              <h3 className="text-[16px] font-semibold text-gray-900 mb-2">
                ต้องการรับแจ้งเตือนคำขอบริการสั่งซ่อม?
              </h3>
              <p className="text-[13px] text-gray-500 max-w-xs mx-auto">
                เปิดใช้งานสถานะพร้อมให้บริการเพื่อแสดงรายการและรับงานซ่อมในบริเวณตำแหน่งที่คุณอยู่
              </p>
            </div>
            <button
              onClick={() => setStatus("available")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-medium px-6 py-3 rounded-xl transition-colors cursor-pointer"
            >
              <span className="w-5 h-5 bg-orange-400 rounded-full flex items-center justify-center text-[11px] font-bold">
                6
              </span>
              เปลี่ยนสถานะเป็นพร้อมให้บริการ
            </button>
          </div>
        )}

        {/* Dev Toggle — ลบออกเมื่อ connect API จริง */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => setStatus("available")}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${
              status === "available"
                ? "bg-green-100 border-green-400 text-green-700"
                : "bg-gray-100 border-gray-300 text-gray-500"
            }`}
          >
            Status: Available
          </button>
          <button
            onClick={() => setStatus("unavailable")}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${
              status === "unavailable"
                ? "bg-red-100 border-red-400 text-red-700"
                : "bg-gray-100 border-gray-300 text-gray-500"
            }`}
          >
            Status: Unavailable
          </button>
        </div>
      </div>

      {/* Accept Modal */}
      {selectedRequest && (
        <AcceptModal
          request={selectedRequest}
          onConfirm={handleConfirmAccept}
          onCancel={() => setSelectedRequest(null)}
        />
      )}
    </TechnicianLayout>
  );
};

export default ServiceRequests;

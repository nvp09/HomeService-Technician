import { useState, useEffect } from "react";
import { MapPin, Bell } from "lucide-react";
import TechnicianLayout from "@/components/layout/TechnicianLayout";
import ServiceRequestCard, { ServiceRequest } from "./ServiceRequestCard";
import AcceptModal from "./AcceptModal";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useLocation } from "@/hooks/useLocation";
import { Spinner } from "@/components/ui/spinner";
import axios from "axios";
import { toast } from "sonner";
import RejectModal from "./RejecModal";
import dynamic from "next/dynamic";
const MapModal = dynamic(() => import("./MapModal"), { ssr: false });

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// ฟังก์ชั่นช่วยแปลงวันที่/เวลาเป็นรูปแบบไทย เช่น "01/09/2566" และ "14.30 น."
const formatThaiDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const d = String(date.getUTCDate()).padStart(2, "0");
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const y = date.getUTCFullYear() + 543;
  return `${d}/${m}/${y}`;
};

// ฟังก์ชั่นช่วยแปลงเวลาเป็นรูปแบบไทย เช่น "14.30 น."
const formatThaiTime = (timeStr: string): string => {
  const [h, m] = timeStr.split(":");
  return `${h}.${m} น.`;
};

// ฟังก์ชั่นช่วยแปลงข้อมูลดิบจาก API เป็นรูปแบบที่ ServiceRequestCard ต้องการ
const mapToServiceRequest = (raw: any): ServiceRequest => ({
  ...raw,
  serviceName: raw.service_names?.join(", ") ?? "-",
  date: raw.appointment_date ? formatThaiDate(raw.appointment_date) : "-",
  time: raw.appointment_time ? formatThaiTime(raw.appointment_time) : "-",
  items: raw.item_names?.join(", ") ?? "-",
  orderCode: raw.order_code,
  totalPrice: `${Number(raw.net_price).toLocaleString("th-TH", { minimumFractionDigits: 2 })} ฿`,
});

const ServiceRequests = () => {
  const { state, isAuthenticated } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null); // null = กำลังโหลด
  const [isLoading, setIsLoading] = useState(true);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(
    null,
  );
  const [isConfirming, setIsConfirming] = useState(false);
  const [selectedRejectRequest, setSelectedRejectRequest] =
    useState<ServiceRequest | null>(null);
  const [isRejecting, setIsRejecting] = useState(false);
  const [mapRequest, setMapRequest] = useState<ServiceRequest | null>(null);

  // fetchOrders ประกาศก่อน handleRefreshed เพื่อไม่ให้ hoisting error เพราะ handleRefreshed เรียกใช้ fetchOrders อยู่ข้างใน
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `${API_URL}/api/technician-orders/orders/available`,
      );
      setRequests(data.map(mapToServiceRequest));
    } catch {
      toast.error("ไม่สามารถโหลดรายการงานได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  // หลังได้ตำแหน่งใหม่ → อัปเดต DB → fetchOrders ใหม่
  const handleRefreshed = async (lat: number, lng: number) => {
    try {
      await axios.patch(`${API_URL}/api/technician-profile/location`, {
        latitude: lat,
        longitude: lng,
      });
      await fetchOrders();
    } catch {
      toast.error("ไม่สามารถอัปเดตตำแหน่งได้");
    }
  };

  const {
    locationText,
    isRefreshing,
    refreshLocation,
    initLocation,
    latitude: techLat,
    longitude: techLng,
  } = useLocation(handleRefreshed);

  // โหลดครั้งแรก: ดึง profile เพื่อรู้ is_available + lat/lng
  useEffect(() => {
    const init = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/api/technician-profile/profile`,
        );
        setIsAvailable(data.is_available);

        // แสดงตำแหน่งจาก DB ทันที ไม่ต้องรอกด GPS
        await initLocation(
          data.latitude ? Number(data.latitude) : null,
          data.longitude ? Number(data.longitude) : null,
        );

        // โหลดรายการงานเฉพาะตอนที่พร้อมให้บริการ
        if (data.is_available) {
          await fetchOrders();
        } else {
          setIsLoading(false);
        }
      } catch {
        toast.error("ไม่สามารถโหลดข้อมูลได้");
        setIsLoading(false);
      }
    };
    init();
  }, []);

  // กดปุ่ม "เปลี่ยนสถานะเป็นพร้อมให้บริการ" จากหน้า unavailable
  const handleToggleAvailable = async () => {
    setIsTogglingStatus(true);
    try {
      await axios.patch(`${API_URL}/api/technician-profile/availability`, {
        is_available: true,
      });
      setIsAvailable(true);
      await fetchOrders(); // โหลดรายการงานทันที
    } catch {
      toast.error("ไม่สามารถเปลี่ยนสถานะได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsTogglingStatus(false);
    }
  };

  const handleAccept = (request: ServiceRequest) => setSelectedRequest(request);

  // ฟังก์ชั่นยืนยันรับงาน → POST /orders/{id}/accept → ถ้า 409 แปลว่ามีคนรับไปแล้ว ให้ลบงานนี้ออกจากรายการและแจ้งเตือน
  const handleConfirmAccept = async () => {
    if (!selectedRequest) return;
    setIsConfirming(true);
    try {
      await axios.post(
        `${API_URL}/api/technician-orders/orders/${selectedRequest.id}/accept`,
      );
      toast.success("รับงานเรียบร้อยแล้ว");
      setRequests((prev) => prev.filter((r) => r.id !== selectedRequest.id));
      setSelectedRequest(null);
    } catch (err: any) {
      if (err.response?.status === 409) {
        toast.error("งานนี้ถูกรับไปแล้ว");
        setRequests((prev) => prev.filter((r) => r.id !== selectedRequest.id));
        setSelectedRequest(null);
      } else {
        toast.error("ไม่สามารถรับงานได้ กรุณาลองใหม่อีกครั้ง");
      }
    } finally {
      setIsConfirming(false);
    }
  };

  const handleReject = (request: ServiceRequest) => {
    setSelectedRejectRequest(request);
  };

  const handleConfirmReject = async () => {
    if (!selectedRejectRequest) return;
    setIsRejecting(true);
    try {
      await axios.post(
        `${API_URL}/api/technician-orders/orders/${selectedRejectRequest.id}/reject`,
      );
      setRequests((prev) =>
        prev.filter((r) => r.id !== selectedRejectRequest.id),
      );
      setSelectedRejectRequest(null);
    } catch {
      toast.error("ไม่สามารถปฏิเสธงานได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsRejecting(false);
    }
  };

  const handleViewMap = (request: ServiceRequest) => {
    setMapRequest(request);
  };

  return (
    <ProtectedRoute
      isLoading={state.getUserLoading}
      isAuthenticated={isAuthenticated}
      userRole={state.user?.role ?? null}
      requiredRole="technician"
    >
      <TechnicianLayout>
        <div className="font-prompt space-y-4 w-full">
          {/* Location Banner — แสดงเสมอ */}
          <div className="bg-blue-100 border border-blue-300 rounded-xl px-5 py-4 flex items-center gap-4">
            <MapPin size={22} className="text-blue-600 shrink-0" />
            <div className="flex-1">
              <p className="text-[14px] text-blue-800 font-normal">
                ตำแหน่งที่อยู่ปัจจุบัน
              </p>
              <p className="text-[16px] text-blue-600 font-normal">
                {locationText || "ยังไม่มีข้อมูลตำแหน่ง"}
              </p>
            </div>
            <button
              onClick={refreshLocation}
              disabled={isRefreshing}
              className="border border-blue-600 bg-blue-100 text-blue-600 text-[16px] font-medium px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors shrink-0 cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {isRefreshing ? (
                <Spinner className="w-4 h-4 text-blue-600" />
              ) : (
                "รีเฟรช"
              )}
            </button>
          </div>

          {/* กำลังโหลด */}
          {isLoading || isAvailable === null ? (
            <div className="flex justify-center py-16">
              <Spinner className="w-8 h-8 text-blue-600" />
            </div>
          ) : !isAvailable ? (
            /* ปิดรับงาน → แสดงหน้า unavailable ตาม Figma */
            <div className="bg-white rounded-xl border border-gray-300 py-16 flex flex-col items-center justify-center gap-4 text-center px-6">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <Bell size={32} className="text-blue-500" />
              </div>
              <div>
                <h3 className="text-[20px] font-semibold text-gray-900 mb-2">
                  ต้องการรับแจ้งเตือนคำขอบริการสั่งซ่อม?
                </h3>
                <p className="text-[16px] text-gray-700 font-light mx-auto">
                  เปิดใช้งานสถานะพร้อมให้บริการ
                  เพื่อแสดงรายการและรับงานซ่อมในบริเวณตำแหน่งที่คุณอยู่
                </p>
              </div>
              <button
                onClick={handleToggleAvailable}
                disabled={isTogglingStatus}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-[16px] font-medium px-6 py-3 rounded-xl transition-colors cursor-pointer mt-5 disabled:opacity-70 min-w-60 justify-center"
              >
                {isTogglingStatus ? (
                  <Spinner className="w-5 h-5 text-white" />
                ) : (
                  "เปลี่ยนสถานะเป็นพร้อมให้บริการ"
                )}
              </button>
            </div>
          ) : requests.length === 0 ? (
            /* พร้อมรับงาน แต่ไม่มีงานในพื้นที่ */
            <div className="bg-white rounded-xl border border-gray-200 py-16 flex flex-col items-center justify-center gap-3 text-center">
              <Bell size={40} className="text-gray-300" />
              <p className="text-gray-400 text-[15px]">
                ไม่มีคำขอบริการในขณะนี้
              </p>
            </div>
          ) : (
            /* พร้อมรับงาน + มีงาน → แสดงรายการ */
            <div className="space-y-4">
              {requests.map((request) => (
                <ServiceRequestCard
                  key={request.id}
                  request={request}
                  onAccept={handleAccept}
                  onReject={handleReject}
                  onViewMap={handleViewMap}
                />
              ))}
            </div>
          )}
        </div>

        {selectedRequest && (
          <AcceptModal
            request={selectedRequest}
            onConfirm={handleConfirmAccept}
            onCancel={() => setSelectedRequest(null)}
            isConfirming={isConfirming}
          />
        )}

        {selectedRejectRequest && (
          <RejectModal
            request={selectedRejectRequest}
            onConfirm={handleConfirmReject}
            onCancel={() => setSelectedRejectRequest(null)}
            isRejecting={isRejecting}
          />
        )}

        {mapRequest && techLat && techLng && (
          <MapModal
            customerLat={mapRequest.customer_lat!}
            customerLng={mapRequest.customer_lng!}
            technicianLat={techLat}
            technicianLng={techLng}
            distanceKm={mapRequest.distance_km}
            customerName={mapRequest.customer_name}
            onClose={() => setMapRequest(null)}
          />
        )}
      </TechnicianLayout>
    </ProtectedRoute>
  );
};

export default ServiceRequests;
// ```

// ---

// ## สรุป Flow ทั้งหมด
// ```
// โหลดหน้า
//   → GET /profile
//       → is_available = false → แสดงหน้า "ต้องการรับแจ้งเตือน..."  (ไม่ fetchOrders)
//       → is_available = true  → fetchOrders() → แสดงรายการงาน

// กดปุ่ม "เปลี่ยนสถานะเป็นพร้อมให้บริการ"
//   → PATCH /availability { is_available: true }
//   → setIsAvailable(true)
//   → fetchOrders() → แสดงรายการงานทันที

// AccountSettings กด toggle ปิด → กดยืนยัน
//   → PUT /profile { is_available: false, ... }
//   → บันทึกลง DB

// reload หน้า ServiceRequests
//   → GET /profile → is_available = false → แสดงหน้า unavailable ✅

import { useState } from "react";
import TechnicianLayout from "@/components/TechnicianLayout";
import HistoryHeader from "@/features/technician/history/components/history-header";
import HistoryTable from "@/features/technician/history/components/history-table";
import HistoryDetail from "@/features/technician/history/components/history-detail";

export default function TechnicianHistoryPage() {
  const [search, setSearch] = useState<string>("");
  const [service, setService] = useState<string>("ทั้งหมด");
  
  // State สำหรับเก็บ ID ของรายการที่ถูกคลิก ถ้าเป็น null คืออยู่หน้าตาราง
  const [selectedHistoryId, setSelectedHistoryId] = useState<number | null>(null);

  return (
    <TechnicianLayout>
      <div className="bg-white min-h-screen rounded-lg shadow-sm border border-gray-200">
        {selectedHistoryId === null ? (
          // หน้าแสดงตาราง
          <>
            <HistoryHeader
              search={search}
              setSearch={setSearch}
              service={service}
              setService={setService}
            />
            <HistoryTable
              search={search}
              service={service}
              onRowClick={(id) => setSelectedHistoryId(id)}
            />
          </>
        ) : (
          // หน้ารายละเอียด (เมื่อกดคลิกที่แถวในตาราง)
          <HistoryDetail onBack={() => setSelectedHistoryId(null)} />
        )}
      </div>
    </TechnicianLayout>
  );
}
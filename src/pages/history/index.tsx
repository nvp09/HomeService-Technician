import React, { useState } from "react";
import TechnicianLayout from "@/components/layout/TechnicianLayout";
import HistoryList, { HistoryOrder } from "./HistoryList";
import HistoryDetail, { HistoryDetailData } from "./HistoryDetail";

const mockDetails: Record<string, HistoryDetailData> = {
  "AD04071205": {
    orderId: "AD04071205",
    service: "ล้างแอร์",
    category: "บริการทั่วไป",
    items: "ล้างแอร์ 9,000 - 18,000 BTU, ติดผนัง 2 เครื่อง",
    date: "25/04/2563 เวลา 13.00 น.",
    location: "444/4 คอนโดศุภาลัย เสนานิคม จตุจักร กรุงเทพฯ",
    price: "1,550.00 ฿",
    customerName: "สมศรี จันทร์อังคารพุธ",
    phone: "080 000 1233",
    rating: 4,
    feedback: "เก็บงานเรียบร้อยมาก เสร็จไว มาตรงตามเวลานัดเลยค่ะ"
  }
};

const HistoryPage = () => {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const selectedOrder = selectedOrderId ? mockDetails[selectedOrderId] : null;

  return (
    <TechnicianLayout>
      {selectedOrderId === null ? (
        <HistoryList onViewDetail={(id) => setSelectedOrderId(id)} />
      ) : (
        selectedOrder && (
          <HistoryDetail 
            order={selectedOrder} 
            onBack={() => setSelectedOrderId(null)} 
          />
        )
      )}
    </TechnicianLayout>
  );
};

export default HistoryPage;

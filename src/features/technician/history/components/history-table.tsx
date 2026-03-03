interface HistoryTableProps {
  search: string;
  service: string;
  onRowClick: (id: number) => void;
}

// ข้อมูล Mockup
const mockData = [
  { id: 1, serviceName: "ล้างแอร์", date: "25/04/2563 เวลา 13.00 น.", orderId: "AD04071205", price: "1,550.00 ฿" },
  { id: 2, serviceName: "ทำความสะอาดทั่วไป", date: "25/04/2563 เวลา 13.00 น.", orderId: "AD04071205", price: "1,550.00 ฿" },
  { id: 3, serviceName: "ติดตั้งเครื่องดูดควัน", date: "25/04/2563 เวลา 13.00 น.", orderId: "AD04071205", price: "1,550.00 ฿" },
  { id: 4, serviceName: "ล้างแอร์", date: "25/04/2563 เวลา 13.00 น.", orderId: "AD04071205", price: "1,550.00 ฿" },
  { id: 5, serviceName: "ล้างแอร์", date: "25/04/2563 เวลา 13.00 น.", orderId: "AD04071205", price: "1,550.00 ฿" },
  { id: 6, serviceName: "ติดตั้งเครื่องทำน้ำอุ่น", date: "25/04/2563 เวลา 13.00 น.", orderId: "AD04071205", price: "1,550.00 ฿" },
];

export default function HistoryTable({ search, service, onRowClick }: HistoryTableProps) {
  const filteredData = mockData.filter((item) => {
    const matchService = service === "ทั้งหมด" || item.serviceName === service;
    const matchSearch = item.orderId.includes(search) || item.serviceName.includes(search);
    return matchService && matchSearch;
  });

  return (
    <div className="px-6 pb-6">
      <div className="overflow-hidden rounded-lg border border-gray-100">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-500">
            <tr>
              <th className="px-6 py-4 font-medium">ชื่อบริการ</th>
              <th className="px-6 py-4 font-medium">วันเวลาดำเนินการ</th>
              <th className="px-6 py-4 font-medium">รหัสคำสั่งซ่อม</th>
              <th className="px-6 py-4 font-medium">ราคารวม</th>
              {/* ลบ Action ออกตามที่ขอ */}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filteredData.map((row) => (
              <tr 
                key={row.id} 
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onRowClick(row.id)} // เพิ่มการคลิกที่แถว
              >
                <td className="px-6 py-4 text-gray-800">{row.serviceName}</td>
                <td className="px-6 py-4 text-gray-600">{row.date}</td>
                <td className="px-6 py-4 text-gray-600">{row.orderId}</td>
                <td className="px-6 py-4 text-gray-800">{row.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
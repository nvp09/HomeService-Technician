import { MapPin } from "lucide-react";

export interface ServiceRequest {
  id: number;
  serviceName: string;
  date: string;
  time: string;
  items: string;
  orderCode: string;
  totalPrice: string;
  address: string;
}

interface ServiceRequestCardProps {
  request: ServiceRequest;
  onAccept: (request: ServiceRequest) => void;
  onReject: (id: number) => void;
}

const ServiceRequestCard = ({
  request,
  onAccept,
  onReject,
}: ServiceRequestCardProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-300 p-5 font-prompt overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-4">
        <h3 className="text-[20px] font-medium text-black mb-2">
          {request.serviceName}
        </h3>
        <p className="headline-5 text-gray-700">
          วันเวลาดำเนินการ
        </p>
        <p className="headline-5 text-blue-600">
          {request.date} เวลา {request.time}
        </p>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-[14px] mb-4">
        <span className="headline-5 text-gray-700">รายการ</span>
        <span className="text-[16px] text-utility-black font-normal">{request.items}</span>

        <span className="headline-5 text-gray-700">รหัสคำสั่งซ่อม</span>
        <span className="text-[16px] text-utility-black font-normal">{request.orderCode}</span>

        <span className="headline-5 text-gray-700">ราคารวม</span>
        <span className="text-[16px] text-utility-black font-normal">{request.totalPrice}</span>

        <span className="headline-5 text-gray-700">สถานที่</span>
        <div>
          <p className="text-[16px] text-utility-black font-normal">{request.address}</p>
          <button className="flex items-center gap-1 text-blue-600 text-[16px] font-semibold mt-1 hover:underline">
            <MapPin size={16}/>
            ดูแผนที่
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => onReject(request.id)}
          className="px-6 py-2 rounded-lg border border-blue-600 text-blue-600 text-[14px] font-medium hover:bg-gray-50 transition-colors cursor-pointer w-full"
        >
          ปฏิเสธ
        </button>
        <button
          onClick={() => onAccept(request)}
          className="px-6 py-2 rounded-lg bg-blue-600 text-white text-[14px] font-medium hover:bg-blue-700 transition-colors cursor-pointer w-full"
        >
          รับงาน
        </button>
      </div>
    </div>
  );
};

export default ServiceRequestCard;

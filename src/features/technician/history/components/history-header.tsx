import { Search } from "lucide-react"; 

interface HistoryHeaderProps {
  search: string;
  setSearch: (val: string) => void;
  service: string;
  setService: (val: string) => void;
}

export default function HistoryHeader({
  search,
  setSearch,
  service,
  setService,
}: HistoryHeaderProps) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
        <h1 className="text-xl font-bold text-gray-800">ประวัติการซ่อม</h1>
        
        <div className="relative w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหารายการคำสั่งซ่อม"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-gray-600 text-sm font-medium">บริการ</label>
        <select
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 w-48"
        >
          {/* อัปเดตรายการให้ครบตามรูป */}
          <option value="ทั้งหมด">ทั้งหมด</option>
          <option value="ล้างแอร์">ล้างแอร์</option>
          <option value="ติดตั้งแอร์">ติดตั้งแอร์</option>
          <option value="ทำความสะอาดทั่วไป">ทำความสะอาดทั่วไป</option>
          <option value="ซ่อมแอร์">ซ่อมแอร์</option>
          <option value="ซ่อมเครื่องซักผ้า">ซ่อมเครื่องซักผ้า</option>
          <option value="ติดตั้งเครื่องดูดควัน">ติดตั้งเครื่องดูดควัน</option>
          <option value="ติดตั้งเครื่องทำน้ำอุ่น">ติดตั้งเครื่องทำน้ำอุ่น</option>
        </select>
      </div>
    </div>
  );
}
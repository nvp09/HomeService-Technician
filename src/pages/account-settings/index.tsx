import TechnicianLayout from "@/components/layout/TechnicianLayout";

const index = () => {
  return (
    <TechnicianLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">ตั้งค่าบัญชี</h1>
        <p>
          นี่คือหน้าตั้งค่าบัญชีของช่างเทคนิค คุณสามารถแก้ไขข้อมูลส่วนตัว
          เปลี่ยนรหัสผ่าน และตั้งค่าการแจ้งเตือนได้ที่นี่
        </p>
      </div>
    </TechnicianLayout>
  );
};

export default index;

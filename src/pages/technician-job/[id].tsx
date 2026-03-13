import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TechnicianLayout from "@/components/layout/TechnicianLayout";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { acceptJob, completeJob } from "@/features/technician/pending/services/pending.api";

export default function TechnicianJobDetail() {

  const router = useRouter();
  const { id } = router.query;

  const [job, setJob] = useState<any>(null);



  /* =========================================================
     FETCH JOB DETAIL
     ดึงข้อมูล job จาก backend ตาม id
  ========================================================= */

  useEffect(() => {

    // Next.js render แรก router.query ยังว่าง
    if (!id) return;

    // id อาจเป็น string[] ได้ใน Next.js
    const orderId = Array.isArray(id) ? id[0] : id;

    let isMounted = true;

    const fetchJob = async () => {

      try {

        const res = await api.get(`/technician-pending/job/${orderId}`);

        const data = res.data;

        // แปลงข้อมูล backend → frontend
        const formatted = {
          id: data.id,
          service: data.services?.[0] || "-",
          appointment_date: new Date(data.created_at).toLocaleString("th-TH"),
          order_code: `AD${String(data.id).padStart(8, "0")}`,
          price: data.total_price,
          status: data.status,
          address: "-",
          customer_name: "-",
          phone: "-"
        };

        if (isMounted) {
          setJob(formatted);
        }

      } catch (error) {

        console.error("Error fetching job:", error);
        toast.error("ไม่สามารถโหลดข้อมูลงานได้");

      }

    };

    fetchJob();

    return () => {
      isMounted = false;
    };

  }, [id]);



  /* =========================================================
     LOADING STATE
  ========================================================= */

  if (!job) {
    return (
      <TechnicianLayout>
        <div className="p-6">กำลังโหลด...</div>
      </TechnicianLayout>
    );
  }



  /* =========================================================
     ACCEPT JOB
     เปลี่ยนสถานะ pending → in_progress
  ========================================================= */

  const handleAcceptJob = async () => {

    try {

      await acceptJob(Number(job.id));

      toast.success("รับงานสำเร็จ");

      router.push("/technician-in-progress");

    } catch (error) {

      console.error("Accept job error:", error);
      toast.error("เกิดข้อผิดพลาด");

    }

  };



  /* =========================================================
     COMPLETE JOB
     เปลี่ยนสถานะ in_progress → completed
  ========================================================= */

  const handleCompleteJob = async () => {

    try {

      await completeJob(Number(job.id));

      toast.success("งานเสร็จสิ้น");

      router.push("/history");

    } catch (error) {

      console.error("Complete job error:", error);
      toast.error("เกิดข้อผิดพลาด");

    }

  };



  return (
    <TechnicianLayout>

      <div className="p-6">

        {/* =========================================================
            BACK BUTTON
        ========================================================= */}
        <button
          onClick={() => router.back()}
          className="mb-4 text-sm text-gray-500 hover:text-black"
        >
          ← ย้อนกลับ
        </button>


        {/* =========================================================
            TITLE
        ========================================================= */}
        <h1 className="text-xl font-semibold mb-6">
          {job.service}
        </h1>


        {/* =========================================================
            JOB DETAIL CARD
        ========================================================= */}
        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">

          <Row label="หมวดหมู่" value="บริการซ่อม" />
          <Row label="รายการ" value={job.service} />
          <Row label="วันนัดหมาย" value={job.appointment_date} />
          <Row label="สถานที่" value={job.address} />
          <Row label="รหัสคำสั่งซ่อม" value={job.order_code} />
          <Row label="ราคารวม" value={`${job.price} ฿`} />
          <Row label="ผู้รับบริการ" value={job.customer_name} />
          <Row label="เบอร์ติดต่อ" value={job.phone} />

        </div>



        {/* =========================================================
            ACTION BUTTONS
        ========================================================= */}

        <div className="mt-6 flex justify-end gap-3">

          {/* ปุ่มรับงาน */}
          {job.status === "pending" && (
            <button
              onClick={handleAcceptJob}
              className="
                bg-[#336DF2]
                text-white
                px-6 py-3
                rounded-lg
                hover:bg-blue-700
                transition
              "
            >
              รับงาน
            </button>
          )}


          {/* ปุ่มเสร็จงาน */}
          {job.status === "in_progress" && (
            <button
              onClick={handleCompleteJob}
              className="
                bg-green-600
                text-white
                px-6 py-3
                rounded-lg
                hover:bg-green-700
                transition
              "
            >
              เสร็จงาน
            </button>
          )}

        </div>

      </div>

    </TechnicianLayout>
  );
}



/* =========================================================
   ROW COMPONENT
   ใช้สำหรับแสดง label + value
========================================================= */

function Row({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="text-gray-500">{label}</div>
      <div className="col-span-2 font-medium">
        {value}
      </div>
    </div>
  );
}
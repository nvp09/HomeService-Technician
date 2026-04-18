import { useEffect, useRef } from "react";
import type { RealtimePostgresInsertPayload } from "@supabase/supabase-js";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

type TechnicianNotification = {
  id: number;
  technician_id: number;
  order_id: number;
  type: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

type UseTechnicianNotificationParams = {
  technicianId: number | null;
  enabled: boolean;
  onNewNotification?: (notification: TechnicianNotification) => void;
};

export default function useTechnicianNotification({
  technicianId,
  enabled,
  onNewNotification,
}: UseTechnicianNotificationParams) {
  const onNewNotificationRef = useRef(onNewNotification);
  onNewNotificationRef.current = onNewNotification;

  useEffect(() => {
    if (!technicianId || !enabled) return;
    if (!("channel" in supabase) || !("removeChannel" in supabase)) return;
    const realtimeSupabase = supabase as {
      channel: typeof supabase.channel;
      removeChannel: typeof supabase.removeChannel;
    };

    const channel = realtimeSupabase
      .channel(`technician-notification:${technicianId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "technician_notifications",
          filter: `technician_id=eq.${technicianId}`,
        },
        (payload: RealtimePostgresInsertPayload<TechnicianNotification>) => {
          const newNotification = payload.new;
          toast.success(newNotification.message || "มีงานใหม่เข้ามา");
          onNewNotificationRef.current?.(newNotification);
        }
      )
      .subscribe();

    return () => {
      realtimeSupabase.removeChannel(channel);
    };
  }, [enabled, technicianId]);
}

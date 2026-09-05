"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export function useUnreadCounts() {
  return useQuery({
    queryKey: ["unread-counts"],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("unread_counts");
      if (error) throw error;
      const row = Array.isArray(data) ? data[0] : data;
      return {
        messages: Number(row?.messages ?? 0),
        notifications: Number(row?.notifications ?? 0),
      };
    },
    refetchInterval: 20_000,
  });
}

// services/sectionService.ts
import { supabase } from "@/lib/supabase";

export interface SectionOrder {
  id: number;
  section_key: string;
  label: string;
  sort_order: number;
  is_active: boolean;
}

export const sectionService = {
  async getSectionOrder(): Promise<SectionOrder[]> {
    const { data, error } = await supabase
      .from("section_order")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
       console.log("data-11", data);
        console.log("error-12", error);
    if (error) throw error;
    return data;
  },

//   async updateSectionOrder(updates: { id: number; sort_order: number }[]) {
//     // bulk update using upsert
//     const {data, error } = await supabase
//       .from("section_order")
//       .upsert(updates, { onConflict: "id" });
//         console.log("data", data);
//         console.log("error", error);
//     if (error) throw error;
//     return true;
//   },
// };
async updateSectionOrder(updates: { id: number; sort_order: number }[]) {
  for (const item of updates) {
    const { error } = await supabase
      .from("section_order")
      .update({
        sort_order: item.sort_order,
      })
      .eq("id", item.id);

    if (error) throw error;
  }

  return true;
}
};
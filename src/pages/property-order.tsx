// // pages/admin/PropertyOrderPage.tsx
// import { useEffect, useState } from "react";
// import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
// import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
// import { GripVertical, ArrowLeft, Save } from "lucide-react";
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { useNavigate } from "react-router-dom";
// import { sectionService, SectionOrder } from "@/services/sectionService";
// import { useToast } from "@/hooks/use-toast";

// function SortableRow({ section }: { section: SectionOrder }) {
//   const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
//     useSortable({ id: section.id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     opacity: isDragging ? 0.5 : 1,
//   };

//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       className="flex items-center justify-between p-3 mb-2 bg-white border border-slate-200 rounded-lg shadow-sm"
//     >
//       <span className="font-medium text-slate-700">{section.label}</span>
//       <button
//         {...attributes}
//         {...listeners}
//         className="cursor-grab active:cursor-grabbing p-1 text-slate-400 hover:text-slate-600"
//       >
//         <GripVertical className="h-5 w-5" />
//       </button>
//     </div>
//   );
// }

// export default function PropertyOrderPage() {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [sections, setSections] = useState<SectionOrder[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const sensors = useSensors(useSensor(PointerSensor));

//   useEffect(() => {
//     sectionService
//       .getSectionOrder()
//       .then(setSections)
//       .finally(() => setLoading(false));
//   }, []);

//   const handleDragEnd = (event: DragEndEvent) => {
//     const { active, over } = event;
//     if (!over || active.id === over.id) return;

//     setSections((prev) => {
//       const oldIndex = prev.findIndex((s) => s.id === active.id);
//       const newIndex = prev.findIndex((s) => s.id === over.id);
//       return arrayMove(prev, oldIndex, newIndex);
//     });
//   };

//   const handleSave = async () => {
//     setSaving(true);
//     try {
//       const updates = sections.map((s, idx) => ({ id: s.id, sort_order: idx + 1 }));
//       await sectionService.updateSectionOrder(updates);
//       toast({ title: "Order updated", description: "Property category order saved successfully." });
//     } catch (err) {
//       toast({ title: "Error", description: "Failed to save order.", variant: "destructive" });
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6">
//       <Button variant="ghost" className="mb-4" onClick={() => navigate("/admin")}>
//         <ArrowLeft className="h-4 w-4 mr-2" />
//         Back to Dashboard
//       </Button>

//       <Card className="border-2 border-slate-300">
//         <CardHeader>
//           <CardTitle className="text-lg">Property Category Order</CardTitle>
//           <CardDescription>
//             Drag and drop to reorder how property categories appear on the homepage.
//           </CardDescription>
//         </CardHeader>

//         <CardContent>
//           {loading ? (
//             <p className="text-slate-500 text-sm">Loading...</p>
//           ) : (
//             <>
//               <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
//                 <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
//                   {sections.map((section) => (
//                     <SortableRow key={section.id} section={section} />
//                   ))}
//                 </SortableContext>
//               </DndContext>

//               <Button
//                 className="w-full mt-4 bg-slate-600 hover:bg-slate-700"
//                 onClick={handleSave}
//                 disabled={saving}
//               >
//                 <Save className="h-4 w-4 mr-2" />
//                 {saving ? "Saving..." : "Save Order"}
//               </Button>
//             </>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// pages/admin/PropertyOrderPage.tsx
// import { useEffect, useState } from "react";
// import { ArrowLeft, Save, ChevronUp, ChevronDown, GripHorizontal } from "lucide-react";
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { useNavigate } from "react-router-dom";
// import { sectionService, SectionOrder } from "@/services/sectionService";
// import { useToast } from "@/hooks/use-toast";

// export default function PropertyOrderPage() {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [sections, setSections] = useState<SectionOrder[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [hasChanges, setHasChanges] = useState(false);

//   useEffect(() => {
//     sectionService
//       .getSectionOrder()
//       .then(setSections)
//       .finally(() => setLoading(false));
//   }, []);

//   const moveUp = (index: number) => {
//     if (index === 0) return;
//     const newSections = [...sections];
//     [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
//     setSections(newSections);
//     setHasChanges(true);
//   };

//   const moveDown = (index: number) => {
//     if (index === sections.length - 1) return;
//     const newSections = [...sections];
//     [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
//     setSections(newSections);
//     setHasChanges(true);
//   };

//   const handleSave = async () => {
//     setSaving(true);
//     try {
//       const updates = sections.map((s, idx) => ({ id: s.id, sort_order: idx + 1 }));
//       await sectionService.updateSectionOrder(updates);
//       setHasChanges(false);
//       toast({ title: "Order updated", description: "Property category order saved successfully." });
//     } catch (err) {
//       toast({ title: "Error", description: "Failed to save order.", variant: "destructive" });
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6">
//       <Button variant="ghost" className="mb-4" onClick={() => navigate("/admin")}>
//         <ArrowLeft className="h-4 w-4 mr-2" />
//         Back to Dashboard
//       </Button>

//       <Card className="border-2 border-slate-300">
//         <CardHeader>
//           <div className="flex items-center space-x-2">
//             <GripHorizontal className="h-6 w-6 text-slate-600" />
//             <CardTitle className="text-lg">Property Category Order</CardTitle>
//           </div>
//           <CardDescription>
//             Use the arrow buttons to move categories up or down. The order here matches the homepage.
//           </CardDescription>
//         </CardHeader>

//         <CardContent>
//           {loading ? (
//             <p className="text-slate-500 text-sm py-4">Loading...</p>
//           ) : (
//             <>
//               <div className="space-y-2">
//                 {sections.map((section, index) => (
//                   <div
//                     key={section.id}
//                     className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-slate-300 transition-colors"
//                   >
//                     <div className="flex items-center gap-3">
//                       <span className="flex items-center justify-center h-7 w-7 rounded-full bg-slate-100 text-slate-600 text-sm font-semibold">
//                         {index + 1}
//                       </span>
//                       <span className="font-medium text-slate-700">{section.label}</span>
//                     </div>

//                     <div className="flex items-center gap-1">
//                       <Button
//                         variant="outline"
//                         size="icon"
//                         className="h-8 w-8"
//                         onClick={() => moveUp(index)}
//                         disabled={index === 0}
//                       >
//                         <ChevronUp className="h-4 w-4" />
//                       </Button>
//                       <Button
//                         variant="outline"
//                         size="icon"
//                         className="h-8 w-8"
//                         onClick={() => moveDown(index)}
//                         disabled={index === sections.length - 1}
//                       >
//                         <ChevronDown className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <Button
//                 className="w-full mt-6 bg-slate-600 hover:bg-slate-700"
//                 onClick={handleSave}
//                 disabled={saving || !hasChanges}
//               >
//                 <Save className="h-4 w-4 mr-2" />
//                 {saving ? "Saving..." : hasChanges ? "Save Order" : "No Changes"}
//               </Button>
//             </>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }



// pages/admin/PropertyOrderPage.tsx
import { useEffect, useState } from "react";
import { ArrowLeft, Save, ChevronUp, ChevronDown } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { sectionService, SectionOrder } from "@/services/sectionService";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/layout/AdminLayout";
export default function PropertyOrderPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sections, setSections] = useState<SectionOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    sectionService
      .getSectionOrder()
      .then(setSections)
      .finally(() => setLoading(false));
  }, []);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newSections = [...sections];
    [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
    setSections(newSections);
    setHasChanges(true);
  };

  const moveDown = (index: number) => {
    if (index === sections.length - 1) return;
    const newSections = [...sections];
    [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
    setSections(newSections);
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = sections.map((s, idx) => ({ id: s.id, sort_order: idx + 1 }));
      await sectionService.updateSectionOrder(updates);
      setHasChanges(false);
      toast({ title: "Order updated", description: "Property category order saved successfully." });
    } catch (err) {
      toast({ title: "Error", description: "Failed to save order.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
    <div className="max-w-2xl mx-auto p-6">
      <Button variant="ghost" className="mb-4" onClick={() => navigate("/admin")}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>

      <Card className="border-2 border-slate-300">
        <CardHeader>
          <CardTitle className="text-lg">Property Category Order</CardTitle>
          <CardDescription>
            Use the arrows to move categories up or down. This order is reflected on the homepage.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-slate-500 text-sm py-4">Loading...</p>
          ) : (
            <>
              <div className="space-y-2">
                {sections.map((section, index) => (
                  <div
                    key={section.id}
                    className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-slate-300 transition-colors"
                  >
                    <span className="font-medium text-slate-700">{section.label}</span>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => moveUp(index)}
                        disabled={index === 0}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => moveDown(index)}
                        disabled={index === sections.length - 1}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                className="w-full mt-6 bg-slate-600 hover:bg-slate-700"
                onClick={handleSave}
                disabled={saving || !hasChanges}
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : hasChanges ? "Save Order" : "No Changes"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
    </AdminLayout>
  );
}
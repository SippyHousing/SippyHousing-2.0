
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
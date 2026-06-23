import React, { useState } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, Video } from "lucide-react";

interface VideoLinksInputProps<T extends FieldValues> {
  control: Control<T>;
}

export function VideoLinksInput<T extends FieldValues>({ control }: VideoLinksInputProps<T>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          Video Links
        </CardTitle>
        <CardDescription>
          Add video URLs for this property. You can add multiple video links.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Controller
          name={'video_links' as Path<T>}
          control={control}
          render={({ field }) => {
            const videoLinks = (field.value as string[]) || [];
            const [newVideoUrl, setNewVideoUrl] = useState('');

            const addVideoLink = () => {
              if (newVideoUrl.trim()) {
                const url = newVideoUrl.trim();
                // Basic URL validation
                if (url.startsWith('http://') || url.startsWith('https://')) {
                  field.onChange([...videoLinks, url]);
                  setNewVideoUrl('');
                } else {
                  // Auto-add https:// if missing
                  field.onChange([...videoLinks, `https://${url}`]);
                  setNewVideoUrl('');
                }
              }
            };

            const removeVideoLink = (index: number) => {
              field.onChange(videoLinks.filter((_, i) => i !== index));
            };

            return (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="url"
                    placeholder="https://youtube.com/watch?v=..."
                    value={newVideoUrl}
                    onChange={(e) => setNewVideoUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addVideoLink();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={addVideoLink}
                    disabled={!newVideoUrl.trim()}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>

                {videoLinks.length > 0 && (
                  <div className="space-y-2">
                    <Label>Added Video Links ({videoLinks.length})</Label>
                    <div className="space-y-2">
                      {videoLinks.map((url, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 bg-accent rounded-md"
                        >
                          <Video className="h-4 w-4 text-muted-foreground" />
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 text-sm text-primary hover:underline truncate"
                          >
                            {url}
                          </a>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeVideoLink(index)}
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {videoLinks.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No video links added yet. Add a video URL above.
                  </p>
                )}
              </div>
            );
          }}
        />
      </CardContent>
    </Card>
  );
}

import { useState, useRef } from "react";
import { Plus, Smile, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Person } from "@/types";
import { uid } from "@/lib/utils";

// 常用表情符号列表
const COMMON_EMOJIS = ["💞", "❤️", "😊", "🌹", "🌟", "🌈", "🎁", "🍀", "🌸", "🌺", "🌻", "🌼", "🍓", "🍒", "🍎", "🍰"];

interface AddPersonProps {
  onAdd: (person: Person) => void;
}

export function AddPerson({ onAdd }: AddPersonProps) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("💞");
  const [birthday, setBirthday] = useState("");
  const [since, setSince] = useState("");
  const [open, setOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (!name.trim()) return;
    
    onAdd({
      id: uid(),
      name: name.trim(),
      emoji: photoUrl || emoji || "💞",
      birthday: birthday || undefined,
      togetherSince: since || undefined,
      links: [],
      preferences: [],
      events: []
    });
    
    setName("");
    setEmoji("💞");
    setPhotoUrl("");
    setBirthday("");
    setSince("");
    setOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoUrl(event.target?.result as string);
        setEmoji(""); // 清空表情符号，使用照片
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1">
          <Plus className="h-4 w-4" />添加
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>添加一个人</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid grid-cols-4 gap-2 items-center">
            <Label className="col-span-1">姓名</Label>
            <Input 
              className="col-span-3" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="小艾" 
            />
          </div>
          <div className="grid grid-cols-4 gap-2 items-center">
            <Label className="col-span-1">表情符号</Label>
            <div className="col-span-3 flex gap-2">
              <div className="flex-1 relative">
                <Input 
                  value={emoji} 
                  onChange={(e) => {
                    setEmoji(e.target.value);
                    setPhotoUrl(""); // 清空照片URL
                  }} 
                  placeholder="💞" 
                  className={photoUrl ? "opacity-50" : ""}
                  disabled={!!photoUrl}
                />
                {photoUrl && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img 
                      src={photoUrl} 
                      alt="照片" 
                      className="h-8 w-8 object-cover rounded-full"
                    />
                  </div>
                )}
              </div>
              <Button 
                type="button" 
                variant="outline" 
                size="icon"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <Smile className="h-4 w-4" />
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="icon"
                onClick={() => fileInputRef.current?.click()}
              >
                <Image className="h-4 w-4" />
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
            </div>
          </div>
          {showEmojiPicker && (
            <div className="col-start-2 col-span-3 grid grid-cols-8 gap-2 p-2 bg-white/50 dark:bg-black/20 rounded-md">
              {COMMON_EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  className="text-xl h-8 w-8 flex items-center justify-center rounded-md hover:bg-white/80 dark:hover:bg-white/10"
                  onClick={() => {
                    setEmoji(e);
                    setPhotoUrl(""); // 清空照片URL
                    setShowEmojiPicker(false);
                  }}
                >
                  {e}
                </button>
              ))}
            </div>
          )}
          <div className="grid grid-cols-4 gap-2 items-center">
            <Label className="col-span-1">生日</Label>
            <Input 
              className="col-span-3" 
              type="date" 
              value={birthday} 
              onChange={(e) => setBirthday(e.target.value)} 
            />
          </div>
          <div className="grid grid-cols-4 gap-2 items-center">
            <Label className="col-span-1">在一起日期</Label>
            <Input 
              className="col-span-3" 
              type="date" 
              value={since} 
              onChange={(e) => setSince(e.target.value)} 
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>取消</Button>
            <Button onClick={handleSubmit}>保存</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
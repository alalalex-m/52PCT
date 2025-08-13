import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { BookMarked, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Person } from "@/types";
import { uid, formatDateTime } from "@/lib/utils";

interface MemoriesProps {
  active: Person;
  onUpdate: (patch: Partial<Person> | ((prev: Person) => Partial<Person>)) => void;
}

export function Memories({ active, onUpdate }: MemoriesProps) {
  const [note, setNote] = useState("");

  // 筛选记忆和里程碑类型的事件
  const memos = useMemo(
    () => active.events
      .filter((e) => e.type === "memory" || e.type === "milestone")
      .sort((a, b) => new Date(b.when).getTime() - new Date(a.when).getTime()),
    [active.events]
  );

  const handleSaveNote = () => {
    if (!note.trim()) return;
    
    onUpdate((p) => ({
      events: [
        { 
          id: uid(), 
          type: "memory", 
          title: note.split("\n")[0].slice(0, 50) || "记忆", 
          when: new Date().toISOString(), 
          note 
        },
        ...p.events,
      ],
    }));
    
    setNote("");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">温暖记忆</h3>
        <Button
          className="gap-1 sparkle-button"
          onClick={handleSaveNote}
        >
          <BookMarked className="h-4 w-4" />保存记忆
        </Button>
      </div>
      <Textarea 
        rows={5} 
        value={note} 
        onChange={(e) => setNote(e.target.value)} 
        placeholder="记录一些在自然交流中了解到的甜蜜细节..." 
        className="resize-none"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {memos.length === 0 ? (
          <Card className="bg-white/60 dark:bg-white/5 border-white/40 dark:border-white/10">
            <CardContent className="py-8 text-center text-sm opacity-70">
              还没有记忆。写下一些记忆开始记录 ✨
            </CardContent>
          </Card>
        ) : (
          memos.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="rounded-2xl p-4 bg-gradient-to-br from-white/70 to-white/40 dark:from-white/10 dark:to-white/5 border border-white/40 dark:border-white/10 relative overflow-hidden card-hover"
            >
              <div className="absolute inset-0 pointer-events-none fancy-shine" />
              <div className="text-xs opacity-60">{formatDateTime(m.when)}</div>
              <div className="mt-1 font-semibold">{m.title}</div>
              {m.note && <div className="mt-2 text-sm whitespace-pre-wrap">{m.note}</div>}
              <div className="mt-3 flex justify-end">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => onUpdate((p) => ({ 
                    events: p.events.filter((x) => x.id !== m.id) 
                  }))}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
} 
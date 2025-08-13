import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Heart, Gift, BookMarked, CalendarDays, 
  Cake, Trash2, ChevronRight, MapPin 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Person, EVENT_TYPES, EventType } from "@/types";
import { uid, formatDateTime } from "@/lib/utils";

interface EventsProps {
  active: Person;
  onUpdate: (patch: Partial<Person> | ((prev: Person) => Partial<Person>)) => void;
}

// 图标映射
const ICON_MAP = {
  Heart,
  Gift,
  BookMarked,
  CalendarDays,
  Cake
};

export function Events({ active, onUpdate }: EventsProps) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ 
    type: "date" as EventType, 
    title: "", 
    when: new Date().toISOString().slice(0, 16), 
    place: "", 
    note: "" 
  });

  // 按日期排序的事件
  const sorted = useMemo(
    () => [...active.events].sort((a, b) => new Date(b.when).getTime() - new Date(a.when).getTime()), 
    [active.events]
  );

  // 获取图标组件
  const getIcon = (iconName: string) => {
    return ICON_MAP[iconName as keyof typeof ICON_MAP] || BookMarked;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">事件和时刻</h3>
        <Button onClick={() => setAdding(true)} className="gap-1">
          <Plus className="h-4 w-4" />添加
        </Button>
      </div>

      <AnimatePresence>
        {adding && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="rounded-2xl p-4 bg-gradient-to-br from-white/70 to-white/40 dark:from-white/10 dark:to-white/5 border border-white/40 dark:border-white/10"
          >
            <div className="grid gap-3 md:grid-cols-4">
              <div>
                <Label>类型</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between mt-1">
                      {EVENT_TYPES.find((t) => t.id === form.type)?.label}
                      <ChevronRight className="h-4 w-4 opacity-60" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {EVENT_TYPES.map((t) => (
                      <DropdownMenuItem key={t.id} onClick={() => setForm({ ...form, type: t.id })}>
                        {t.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="md:col-span-3">
                <Label>标题</Label>
                <Input
                  className="mt-1"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="例如：第一次约会"
                />
                <div className="grid md:grid-cols-3 gap-2 mt-2">
                  <div>
                    <Label>时间</Label>
                    <Input 
                      type="datetime-local" 
                      className="mt-1" 
                      value={form.when} 
                      onChange={(e) => setForm({ ...form, when: e.target.value })} 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>地点</Label>
                    <Input 
                      className="mt-1" 
                      value={form.place} 
                      onChange={(e) => setForm({ ...form, place: e.target.value })} 
                      placeholder="例如：城市公园" 
                    />
                  </div>
                </div>
                <Textarea 
                  className="mt-2" 
                  rows={3} 
                  value={form.note} 
                  onChange={(e) => setForm({ ...form, note: e.target.value })} 
                  placeholder="自然交流中了解到的细节..." 
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-3">
              <Button variant="ghost" onClick={() => setAdding(false)}>
                取消
              </Button>
              <Button
                onClick={() => {
                  if (!form.title.trim()) return;
                  onUpdate((p) => ({ 
                    events: [
                      { id: uid(), ...form, title: form.title.trim() }, 
                      ...p.events
                    ] 
                  }));
                  setForm({ 
                    type: "date", 
                    title: "", 
                    when: new Date().toISOString().slice(0, 16), 
                    place: "", 
                    note: "" 
                  });
                  setAdding(false);
                }}
              >
                保存
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 时间线 */}
      <div className="space-y-4">
        {sorted.map((e) => {
          const EventIcon = getIcon(EVENT_TYPES.find(t => t.id === e.type)?.icon || "BookMarked");
          
          return (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl p-4 bg-gradient-to-br from-white/70 to-white/40 dark:from-white/10 dark:to-white/5 border border-white/40 dark:border-white/10 card-hover"
            >
              <div className="flex items-start gap-3">
                <EventIcon className="h-5 w-5 mt-1" />
                <div className="flex-1">
                  <div className="font-semibold leading-tight">{e.title}</div>
                  <div className="text-xs opacity-70 flex flex-wrap gap-2 mt-1">
                    <span>{formatDateTime(e.when)}</span>
                    {e.place && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {e.place}
                      </span>
                    )}
                  </div>
                  {e.note && <div className="text-sm mt-2 whitespace-pre-wrap">{e.note}</div>}
                </div>
                <div className="flex gap-1">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => onUpdate((p) => ({ 
                      events: p.events.filter((x) => x.id !== e.id) 
                    }))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
        
        {sorted.length === 0 && (
          <p className="text-center py-8 opacity-70">
            还没有记录事件。添加一个事件来开始记录美好时刻 ✨
          </p>
        )}
      </div>
    </div>
  );
} 
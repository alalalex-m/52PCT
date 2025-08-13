import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Star, Trash2, ChevronRight, Coffee, Wine, CandyCane, 
  Shirt, Music, Dumbbell, MapPin, Sparkles, Film, BookOpen, Palette 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Person, PREFERENCE_CATEGORIES, PreferenceCategory } from "@/types";
import { uid } from "@/lib/utils";

interface PreferencesProps {
  active: Person;
  onUpdate: (patch: Partial<Person> | ((prev: Person) => Partial<Person>)) => void;
}

// 图标映射
const ICON_MAP = {
  Coffee,
  Wine,
  CandyCane,
  Shirt,
  Star,
  Music,
  Dumbbell,
  MapPin,
  Film,
  BookOpen,
  Palette,
  Sparkles
};

export function Preferences({ active, onUpdate }: PreferencesProps) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ 
    category: "food" as PreferenceCategory, 
    label: "", 
    note: "", 
    importance: 3 
  });

  const grouped = useMemo(() => {
    const groups: Record<string, typeof active.preferences> = {};
    for (const c of PREFERENCE_CATEGORIES) groups[c.id] = [];
    for (const p of active.preferences) groups[p.category]?.push(p);
    return groups;
  }, [active.preferences]);

  // 获取图标组件
  const getIcon = (iconName: string) => {
    return ICON_MAP[iconName as keyof typeof ICON_MAP] || Star;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">个人偏好</h3>
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
                <Label>类别</Label>
                <div className="mt-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        {PREFERENCE_CATEGORIES.find((c) => c.id === form.category)?.label}
                        <ChevronRight className="h-4 w-4 opacity-60" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="max-h-64 overflow-auto">
                      {PREFERENCE_CATEGORIES.map((c) => (
                        <DropdownMenuItem key={c.id} onClick={() => setForm({ ...form, category: c.id })}>
                          {c.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="md:col-span-3">
                <Label>喜好内容</Label>
                <Input
                  className="mt-1"
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  placeholder="例如：麻辣火锅"
                />
                <Textarea
                  className="mt-2"
                  rows={2}
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder="可选备注，记录自然交流中获得的信息..."
                />
              </div>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <Label className="text-sm">重要程度</Label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => setForm({ ...form, importance: n })}
                      className={`h-8 w-8 rounded-full grid place-items-center border transition ${
                        form.importance >= n
                          ? "bg-rose-500/20 border-rose-400"
                          : "border-white/40 dark:border-white/10 hover:bg-white/30"
                      }`}
                    >
                      <Star className={`h-4 w-4 ${form.importance >= n ? "fill-rose-500 text-rose-500" : "opacity-60"}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setAdding(false)}>
                  取消
                </Button>
                <Button
                  onClick={() => {
                    if (!form.label.trim()) return;
                    onUpdate((p) => ({ 
                      preferences: [...p.preferences, { id: uid(), ...form, label: form.label.trim() }] 
                    }));
                    setForm({ category: "food", label: "", note: "", importance: 3 });
                    setAdding(false);
                  }}
                >
                  保存
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PREFERENCE_CATEGORIES.map((cat) => {
          const IconComponent = getIcon(cat.icon);
          
          return (
            <Card key={cat.id} className="bg-white/60 dark:bg-white/5 border-white/40 dark:border-white/10 card-hover">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <IconComponent className="h-4 w-4" />
                  {cat.label}
                </CardTitle>
                <Badge variant="outline">{grouped[cat.id]?.length || 0}</Badge>
              </CardHeader>
              <CardContent className="space-y-2">
                {grouped[cat.id]?.length ? (
                  grouped[cat.id].map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 rounded-xl p-3 bg-gradient-to-br from-white/70 to-white/40 dark:from-white/10 dark:to-white/5 border border-white/40 dark:border-white/10"
                    >
                      <div className="mt-1">
                        <Star className="h-4 w-4 opacity-60" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium leading-tight">{item.label}</div>
                        {item.note && (
                          <div className="text-sm opacity-80 whitespace-pre-wrap">{item.note}</div>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => onUpdate((p) => ({ 
                            preferences: p.preferences.filter((x) => x.id !== item.id) 
                          }))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm opacity-60">尚未保存{cat.label}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
} 
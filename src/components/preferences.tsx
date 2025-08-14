import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Star, Trash2, ChevronRight, Coffee, Wine, CandyCane, 
  Shirt, Music, Dumbbell, MapPin, Sparkles, Film, BookOpen, Palette, Store,
  ThumbsUp, ThumbsDown
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
import { PreferenceSlider } from "@/components/preference-slider";

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
  Store,
  Sparkles
};

export function Preferences({ active, onUpdate }: PreferencesProps) {
  const [adding, setAdding] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [form, setForm] = useState({ 
    category: "food" as PreferenceCategory, 
    label: "", 
    note: "", 
    importance: 3,
    liked: true
  });
  
  // 确保组件只在客户端渲染
  useEffect(() => {
    setIsClient(true);
  }, []);

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
            <div className="flex flex-col gap-3 mt-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label className="text-sm">喜欢/不喜欢</Label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setForm({ ...form, liked: true })}
                      className={`h-8 px-3 rounded-full flex items-center gap-1 border transition ${
                        form.liked
                          ? "bg-emerald-500/20 border-emerald-400"
                          : "border-white/40 dark:border-white/10 hover:bg-white/30"
                      }`}
                    >
                      <ThumbsUp className={`h-4 w-4 ${form.liked ? "text-emerald-500" : "opacity-60"}`} />
                      <span className={`text-xs ${form.liked ? "text-emerald-500" : "opacity-60"}`}>喜欢</span>
                    </button>
                    <button
                      onClick={() => setForm({ ...form, liked: false })}
                      className={`h-8 px-3 rounded-full flex items-center gap-1 border transition ${
                        !form.liked
                          ? "bg-rose-500/20 border-rose-400"
                          : "border-white/40 dark:border-white/10 hover:bg-white/30"
                      }`}
                    >
                      <ThumbsDown className={`h-4 w-4 ${!form.liked ? "text-rose-500" : "opacity-60"}`} />
                      <span className={`text-xs ${!form.liked ? "text-rose-500" : "opacity-60"}`}>不喜欢</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
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
                      setForm({ category: "food", label: "", note: "", importance: 3, liked: true });
                      setAdding(false);
                    }}
                  >
                    保存
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isClient ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <CardContent className="space-y-2 max-h-[300px] overflow-y-auto">
                  {grouped[cat.id]?.length ? (
                    grouped[cat.id].map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-start gap-3 rounded-xl p-3 ${
                          item.liked 
                            ? "bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/20" 
                            : "bg-gradient-to-r from-rose-50 to-rose-100 dark:from-rose-950/30 dark:to-rose-900/20"
                        } border-l-4 ${
                          item.liked 
                            ? "border-emerald-500" 
                            : "border-rose-500"
                        }`}
                      >
                        <div className="mt-1">
                          {item.liked ? (
                            <ThumbsUp className="h-5 w-5 text-emerald-600 fill-emerald-500" />
                          ) : (
                            <ThumbsDown className="h-5 w-5 text-rose-600 fill-rose-500" />
                          )}
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
      ) : (
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-sm opacity-60">加载中...</p>
        </div>
      )}
    </div>
  );
} 
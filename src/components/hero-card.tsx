import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit3, LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Person } from "@/types";
import { daysTogether, formatDate } from "@/lib/utils";

interface HeroCardProps {
  active: Person;
  onUpdate: (patch: Partial<Person>) => void;
}

export function HeroCard({ active, onUpdate }: HeroCardProps) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(active.name);
  const [emoji, setEmoji] = useState(active.emoji || "💗");

  useEffect(() => {
    setName(active.name);
    setEmoji(active.emoji || "💗");
  }, [active]);

  return (
    <Card className="relative overflow-hidden border-white/40 dark:border-white/10 bg-gradient-to-br from-white/70 to-white/40 dark:from-white/10 dark:to-white/5 card-hover">
      <div className="absolute inset-0 pointer-events-none fancy-shine" />
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0.9, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 12 }}
            className="text-3xl"
          >
            {emoji}
          </motion.div>
          {!editing ? (
            <div className="flex-1">
              <div className="text-2xl font-semibold tracking-tight flex items-center gap-2">
                {active.name}
                {active.togetherSince && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge className="cursor-default" variant="secondary">
                          {daysTogether(active.togetherSince)} 天
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        自 {active.togetherSince ? formatDate(active.togetherSince) : "未知"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              {active.links?.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-2">
                  {active.links.map((l, i) => (
                    <a
                      key={i}
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/70 dark:bg-white/10 border border-white/40 dark:border-white/10 hover:translate-y-[-1px] transition"
                    >
                      <LinkIcon className="h-3 w-3" />
                      {l.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 grid sm:grid-cols-2 gap-2">
              <Input value={name} onChange={(e) => setName(e.target.value)} />
              <Input value={emoji} onChange={(e) => setEmoji(e.target.value)} />
            </div>
          )}

          <div className="ml-auto flex items-center gap-2">
            {!editing ? (
              <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="gap-1">
                <Edit3 className="h-4 w-4" />编辑
              </Button>
            ) : (
              <>
                <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
                  取消
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    onUpdate({ name, emoji });
                    setEditing(false);
                  }}
                >
                  保存
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 
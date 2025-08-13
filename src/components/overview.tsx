import { useMemo } from "react";
import { CalendarDays, BookMarked, MapPin, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Person } from "@/types";
import { formatDate, getZodiacSign, getChineseZodiac, calculateAge, daysBetween } from "@/lib/utils";

interface OverviewProps {
  active: Person;
  onUpdate: (patch: Partial<Person> | ((prev: Person) => Partial<Person>)) => void;
}

export function Overview({ active }: OverviewProps) {
  // 最近的记忆
  const recentMemories = useMemo(() => {
    return active.events
      .filter(e => e.type === "memory")
      .sort((a, b) => new Date(b.when).getTime() - new Date(a.when).getTime())
      .slice(0, 3);
  }, [active.events]);

  // 即将到来的事件
  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return active.events
      .map((e) => ({ ...e, d: new Date(e.when) }))
      .filter((e) => e.d >= now)
      .sort((a, b) => a.d.getTime() - b.d.getTime())
      .slice(0, 3);
  }, [active.events]);

  // 过去的事件
  const pastEvents = useMemo(() => {
    const now = new Date();
    return active.events
      .map((e) => ({ 
        ...e, 
        d: new Date(e.when),
        daysAgo: daysBetween(e.when, now.toISOString())
      }))
      .filter((e) => e.d < now && e.type !== "memory") // 排除记忆类型
      .sort((a, b) => b.d.getTime() - a.d.getTime()) // 最近的排在前面
      .slice(0, 3);
  }, [active.events]);

  // 个人信息
  const personalInfo = useMemo(() => {
    const info = [];
    
    if (active.birthday) {
      const zodiac = getZodiacSign(active.birthday);
      const chineseZodiac = getChineseZodiac(active.birthday);
      const age = calculateAge(active.birthday);
      
      info.push({ label: "生日", value: formatDate(active.birthday) });
      info.push({ label: "年龄", value: `${age}岁` });
      info.push({ label: "星座", value: zodiac });
      info.push({ label: "生肖", value: chineseZodiac });
    }
    
    if (active.togetherSince) {
      info.push({ label: "在一起日期", value: formatDate(active.togetherSince) });
    }
    
    return info;
  }, [active.birthday, active.togetherSince]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-white/60 dark:bg-white/5 border-white/40 dark:border-white/10 card-hover md:col-span-2">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BookMarked className="h-4 w-4" />最近的记忆
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentMemories.length === 0 ? (
                          <p className="text-sm opacity-70">
                还没有记录记忆。前往&ldquo;记忆&rdquo;标签页记录一些温暖的细节 ✨
              </p>
          ) : (
            <div className="space-y-3">
              {recentMemories.map((memory) => (
                <div key={memory.id} className="rounded-lg p-3 bg-white/40 dark:bg-white/5">
                  <div className="text-xs opacity-70">{formatDate(memory.when)}</div>
                  <div className="font-medium mt-1">{memory.title}</div>
                  {memory.note && (
                    <div className="text-sm mt-1 line-clamp-2 opacity-80">{memory.note}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white/60 dark:bg-white/5 border-white/40 dark:border-white/10 card-hover">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />即将到来
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingEvents.length === 0 ? (
            <p className="text-sm opacity-70">
              没有即将到来的事件。添加约会和里程碑来保持期待感 ✨
            </p>
          ) : (
            <ul className="space-y-2">
              {upcomingEvents.map((e) => (
                <li key={e.id} className="flex items-center gap-3">
                  <Badge variant="secondary" className="shrink-0">
                    {formatDate(e.when)}
                  </Badge>
                  <div className="font-medium">{e.title}</div>
                  {e.place && (
                    <div className="text-sm opacity-70">@ {e.place}</div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white/60 dark:bg-white/5 border-white/40 dark:border-white/10 card-hover md:col-span-3">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" />过去的事件
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pastEvents.length === 0 ? (
            <p className="text-sm opacity-70">
              还没有过去的事件记录。随着时间推移，这里会显示您记录的事件 ✨
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {pastEvents.map((e) => (
                <div key={e.id} className="rounded-lg p-3 bg-white/40 dark:bg-white/5">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{formatDate(e.when)}</Badge>
                    <Badge>{e.daysAgo}天前</Badge>
                  </div>
                  <div className="font-medium mt-2">{e.title}</div>
                  {e.place && (
                    <div className="text-xs opacity-70 flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {e.place}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {personalInfo.length > 0 && (
        <Card className="bg-white/60 dark:bg-white/5 border-white/40 dark:border-white/10 md:col-span-3 card-hover">
          <CardHeader>
            <CardTitle className="text-base">个人信息</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {personalInfo.map((info, index) => (
                <div key={index} className="text-center p-3 rounded-lg bg-white/40 dark:bg-white/5">
                  <div className="text-xs opacity-70">{info.label}</div>
                  <div className="font-medium mt-1">{info.value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 
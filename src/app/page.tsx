"use client";

import { useState, useMemo, useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { ErrorBoundary } from "@/components/error-boundary";
import { Starfield } from "@/components/starfield";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AddPerson } from "@/components/add-person";
import { HeroCard } from "@/components/hero-card";
import { Overview } from "@/components/overview";
import { Preferences } from "@/components/preferences";
import { Events } from "@/components/events";
import { Memories } from "@/components/memories";
import { EmptyState } from "@/components/empty-state";

import { DB, demoData } from "@/types";

export default function Home() {
  // 使用错误边界包装应用程序
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}

function App() {
  // 使用useState初始化，避免水合错误
  const [isClient, setIsClient] = useState(false);
  const [initialDb] = useState(demoData);
  
  // 本地存储数据
  const [db, setDb] = useLocalStorage<DB>("52pct-db-v1", initialDb);
  const [activePersonId, setActivePersonId] = useLocalStorage<string | undefined>(
    "52pct-active",
    () => db.people?.[0]?.id
  );
  const [query, setQuery] = useState("");
  const [showSparkles, setShowSparkles] = useLocalStorage("52pct-sparkles", true);

  // 确保客户端渲染
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 当前选中的人物
  const active = useMemo(
    () => db.people.find((p) => p.id === activePersonId) || db.people[0],
    [db.people, activePersonId]
  );

  // 确保总是有一个活动的人物
  useEffect(() => {
    if (!active && db.people[0]) setActivePersonId(db.people[0].id);
  }, [active, db.people, setActivePersonId]);

  // 更新人物信息
  const updatePerson = (id: string, patch: Partial<typeof active> | ((prev: typeof active) => Partial<typeof active>)) => {
    setDb((prev) => ({
      ...prev,
      people: prev.people.map((p) =>
        p.id === id ? { ...p, ...(typeof patch === "function" ? patch(p) : patch) } : p
      ),
    }));
  };

  // 添加人物
  const addPerson = (person: typeof active) =>
    setDb((prev) => ({ ...prev, people: [...prev.people, person] }));
  
  // 删除人物
  const removePerson = (id: string) =>
    setDb((prev) => ({ ...prev, people: prev.people.filter((p) => p.id !== id) }));

  // 搜索结果
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || !active) return [];
    
    const prefHits = active.preferences
      .filter((x) => [x.label, x.note, x.category].join(" ").toLowerCase().includes(q))
      .map((x) => ({ kind: "preference", ...x }));
    
    const eventHits = active.events
      .filter((e) =>
        [e.title, e.note, e.place, e.type].filter(Boolean).join(" ").toLowerCase().includes(q)
      )
      .map((e) => ({ kind: "event", ...e }));
    
    return [...prefHits, ...eventHits];
  }, [query, active]);

  return (
    <TooltipProvider>
      <div className="relative min-h-screen w-full overflow-hidden gradient-bg text-slate-900 dark:text-slate-100">
        <Starfield enabled={showSparkles} />
        
        <Header 
          query={query} 
          setQuery={setQuery} 
          showSparkles={showSparkles} 
          setShowSparkles={setShowSparkles} 
        />

        <main className="mx-auto max-w-7xl px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 侧边栏：人物列表 */}
          <aside className="lg:col-span-3">
            <Card className="backdrop-blur bg-white/60 dark:bg-white/5 border-white/40 dark:border-white/10 card-hover">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">重要的人</CardTitle>
                <AddPerson onAdd={addPerson} />
              </CardHeader>
              <CardContent className="space-y-2">
                {!isClient ? (
                  <p className="text-sm opacity-70">加载中...</p>
                ) : db.people.length === 0 ? (
                  <p className="text-sm opacity-70">添加你的第一个人物开始记录 ✨</p>
                ) : (
                  <div className="space-y-1 max-h-[60vh] overflow-auto pr-1">
                    {db.people.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => setActivePersonId(p.id)}
                        className={`w-full group flex items-center gap-3 rounded-2xl px-3 py-2 transition cursor-pointer ${
                          active?.id === p.id
                            ? "bg-rose-500/10 ring-1 ring-rose-500/40"
                            : "hover:bg-rose-500/5"
                        }`}
                      >
                        <span className="text-xl">{p.emoji || "🧑"}</span>
                        <div className="flex-1 text-left">
                          <div className="font-medium leading-tight flex items-center gap-2">
                            {p.name}
                            {active?.id === p.id && <Badge className="h-4">当前</Badge>}
                          </div>
                          {p.togetherSince && (
                            <div className="text-[11px] opacity-70">
                              在一起 {p.togetherSince.slice(0, 10)}
                            </div>
                          )}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost" className="opacity-60 hover:opacity-100">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>操作</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setActivePersonId(p.id)}>
                              打开
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                navigator.clipboard.writeText(JSON.stringify(p, null, 2))
                              }
                            >
                              复制JSON
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-rose-600"
                              onClick={() => {
                                if (window.confirm(`确定要删除 ${p.name} 吗？`)) {
                                  removePerson(p.id);
                                  if (active?.id === p.id && db.people.length > 1) {
                                    const otherPerson = db.people.find(other => other.id !== p.id);
                                    if (otherPerson) setActivePersonId(otherPerson.id);
                                  }
                                }
                              }}
                            >
                              删除
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </aside>

          {/* 主内容：当前选中的人物 */}
          <section className="lg:col-span-9 space-y-6">
            {!isClient ? (
              <p className="text-center py-8">加载中...</p>
            ) : active ? (
              <>
                <HeroCard active={active} onUpdate={(patch) => updatePerson(active.id, patch)} />

                {query && (
                  <Card className="bg-white/60 dark:bg-white/5 border-white/40 dark:border-white/10">
                    <CardHeader>
                      <CardTitle className="text-base">搜索结果：&ldquo;{query}&rdquo;</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {searchResults.length === 0 ? (
                        <p className="text-sm opacity-70">没有找到匹配项。</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {searchResults.map((hit) => (
                            <div
                              key={hit.id}
                              className="rounded-2xl p-3 bg-gradient-to-br from-white/70 to-white/40 dark:from-white/10 dark:to-white/5 border border-white/40 dark:border-white/10"
                            >
                              <div className="text-xs uppercase opacity-60 mb-1">
                                {hit.kind === "preference" ? "偏好" : "事件"}
                              </div>
                              <div className="font-medium">
                                {"label" in hit ? hit.label : hit.title}
                              </div>
                              {hit.note && <div className="text-sm opacity-80">{hit.note}</div>}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="overview">概览</TabsTrigger>
                    <TabsTrigger value="preferences">偏好</TabsTrigger>
                    <TabsTrigger value="events">事件</TabsTrigger>
                    <TabsTrigger value="memories">记忆</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6 mt-6">
                    <Overview active={active} onUpdate={(patch) => updatePerson(active.id, patch)} />
                  </TabsContent>

                  <TabsContent value="preferences" className="space-y-6 mt-6">
                    <Preferences active={active} onUpdate={(patch) => updatePerson(active.id, patch)} />
                  </TabsContent>

                  <TabsContent value="events" className="space-y-6 mt-6">
                    <Events active={active} onUpdate={(patch) => updatePerson(active.id, patch)} />
                  </TabsContent>

                  <TabsContent value="memories" className="space-y-6 mt-6">
                    <Memories active={active} onUpdate={(patch) => updatePerson(active.id, patch)} />
                  </TabsContent>
                </Tabs>
              </>
            ) : (
              <EmptyState />
            )}
          </section>
        </main>

        <Footer />
      </div>
    </TooltipProvider>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EmptyState() {
  return (
    <div className="col-span-9">
      <Card className="bg-white/60 dark:bg-white/5 border-white/40 dark:border-white/10 card-hover">
        <CardHeader>
          <CardTitle>从一个特别的人开始</CardTitle>
        </CardHeader>
        <CardContent className="text-sm opacity-80">
          在左侧添加一个人，开始记录温暖的细节。随着时间的推移，这些细节会变成珍贵的回忆。
        </CardContent>
      </Card>
    </div>
  );
} 
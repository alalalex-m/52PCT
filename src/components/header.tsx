import { Sparkles, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface HeaderProps {
  query: string;
  setQuery: (query: string) => void;
  showSparkles: boolean;
  setShowSparkles: (show: boolean) => void;
}

export function Header({ query, setQuery, showSparkles, setShowSparkles }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/40 dark:supports-[backdrop-filter]:bg-black/20 border-b border-white/30 dark:border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
        <Sparkles className="h-6 w-6 text-rose-500" />
        <h1 className="text-xl font-bold tracking-tight">52%</h1>
        {/* <Badge variant="secondary" className="ml-1">
          温暖的关系记忆
        </Badge> */}
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索记忆和偏好..."
              className="w-[320px]"
            />
            <Search className="h-4 w-4 -ml-8 opacity-60" />
          </div>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center gap-2">
            <Label htmlFor="sparkles" className="text-xs opacity-80">
              星光效果
            </Label>
            <Switch
              id="sparkles"
              checked={showSparkles}
              onCheckedChange={setShowSparkles}
            />
          </div>
        </div>
      </div>
    </header>
  );
} 
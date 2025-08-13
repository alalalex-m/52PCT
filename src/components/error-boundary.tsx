import React from "react";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
  info: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null, info: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[52%] 捕获到错误: ", error, info);
    this.setState({ info });
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen gradient-bg text-slate-900 dark:text-slate-100">
          <div className="max-w-2xl mx-auto p-6">
            <Card className="mt-10 border-white/40 dark:border-white/10 bg-white/70 dark:bg-white/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <XCircle className="h-5 w-5 text-rose-600" />
                  出现了一些问题
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>
                  应用程序捕获到一个错误，但您的数据是安全的。请尝试刷新页面或返回首页。
                </p>
                <details className="opacity-70">
                  <summary>技术细节</summary>
                  <pre className="text-xs whitespace-pre-wrap mt-2">
                    {String(this.state.error?.message || this.state.error)}
                  </pre>
                </details>
                <div className="flex gap-2 pt-2">
                  <Button onClick={() => (window.location.href = window.location.href)}>
                    刷新页面
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
} 
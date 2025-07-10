import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-400 dark:text-gray-600 mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-2">页面未找到</h2>
          <p className="text-gray-600 dark:text-gray-300">
            抱歉，您访问的页面不存在或已被移除。
          </p>
        </div>
        <div className="space-x-4">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回上一页
          </Button>
          <Button
            onClick={() => setLocation('/')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Home className="h-4 w-4 mr-2" />
            返回首页
          </Button>
        </div>
      </div>
    </div>
  );
}
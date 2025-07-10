import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Theater } from "lucide-react";

export default function Login() {
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode.trim()) {
      toast({
        title: "错误",
        description: "请输入验证码",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    
    try {
      // 这里可以添加验证码验证逻辑
      // 暂时直接重定向到登录
      window.location.href = '/api/login';
    } catch (error) {
      toast({
        title: "验证失败",
        description: "请检查验证码是否正确",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Theater className="h-8 w-8 text-purple-600 mr-2" />
            <CardTitle className="text-2xl">互动剧场</CardTitle>
          </div>
          <CardDescription>
            输入验证码即可进入剧场世界
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verification-code">验证码</Label>
              <Input
                id="verification-code"
                type="text"
                placeholder="请输入验证码"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="text-center text-lg tracking-widest"
                maxLength={6}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              disabled={isVerifying}
            >
              {isVerifying ? "验证中..." : "进入剧场"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { useLocation } from "wouter";
import { Theater as TheaterIcon, Users, BookOpen, Play, LogOut } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import React from "react";

export default function Theater() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <TheaterIcon className="h-8 w-8 text-purple-600 mr-3" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              互动剧场
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {user && typeof user === "object" && (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  欢迎, {user.firstName || user.email}
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  退出
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Featured Play */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">第十二夜</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              威廉·莎士比亚的经典喜剧，讲述了关于爱情、身份和命运的故事。
              现在你可以与剧中角色直接对话，体验不同的故事发展。
            </p>
          </div>

          <Card className="max-w-4xl mx-auto overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">第十二夜</h3>
                  <p className="text-purple-100">莎士比亚经典喜剧</p>
                </div>
                <Badge variant="secondary" className="bg-white text-purple-600">
                  现已开放
                </Badge>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">剧情简介</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    薇奥拉因船难流落伊利里亚，女扮男装为奥西诺公爵服务，却意外卷入了一场复杂的爱情纠葛。
                    奥西诺爱着奥丽维亚，奥丽维亚却爱上了化名塞巴斯蒂安的薇奥拉，而薇奥拉暗恋着奥西诺...
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">主要角色</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>薇奥拉</span>
                      <span className="text-gray-500">女主角</span>
                    </div>
                    <div className="flex justify-between">
                      <span>奥西诺公爵</span>
                      <span className="text-gray-500">男主角</span>
                    </div>
                    <div className="flex justify-between">
                      <span>奥丽维亚</span>
                      <span className="text-gray-500">女伯爵</span>
                    </div>
                    <div className="flex justify-between">
                      <span>马伏里奥</span>
                      <span className="text-gray-500">管家</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t">
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  onClick={() => setLocation('/characters')}
                >
                  选择角色开始对话
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation('/characters')}>
            <CardHeader className="text-center">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <CardTitle>角色对话</CardTitle>
              <CardDescription>与《第十二夜》中的角色互动</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                选择你喜欢的角色，开始一段独特的对话体验。每个角色都有自己的性格和故事。
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation('/scripts')}>
            <CardHeader className="text-center">
              <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <CardTitle>剧本创作</CardTitle>
              <CardDescription>创作属于你的戏剧剧本</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                使用AI助手创作原创剧本，或者基于经典剧目进行改编创作。
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation('/rehearsals')}>
            <CardHeader className="text-center">
              <Play className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <CardTitle>排练室</CardTitle>
              <CardDescription>练习和完善你的表演</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                在虚拟排练室中练习台词，记录排练笔记，提升表演技巧。
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Coming Soon */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold mb-4">即将上线</h3>
          <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <Card className="opacity-60">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">《哈姆雷特》</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  探索这部莎士比亚最著名的悲剧
                </p>
              </CardContent>
            </Card>
            <Card className="opacity-60">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">《罗密欧与朱丽叶》</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  体验永恒的爱情故事
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
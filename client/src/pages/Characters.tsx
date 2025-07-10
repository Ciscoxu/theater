import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, MessageCircle, Heart, Crown, Home } from "lucide-react";
import type { Character } from "@shared/schema";

export default function Characters() {
  const [, setLocation] = useLocation();
  const [selectedPlay] = useState("第十二夜");

  const { data: characters, isLoading, error } = useQuery<Character[]>({
    queryKey: ['/api/characters', selectedPlay],
    queryFn: async () => {
      const response = await fetch(`/api/characters?play=${encodeURIComponent(selectedPlay)}`);
      if (!response.ok) throw new Error('Failed to fetch characters');
      return response.json();
    },
  });

  const getCharacterIcon = (characterName: string) => {
    switch (characterName) {
      case "薇奥拉":
        return <Heart className="h-5 w-5" />;
      case "奥西诺公爵":
        return <Crown className="h-5 w-5" />;
      case "奥丽维亚":
        return <Crown className="h-5 w-5" />;
      case "马伏里奥":
        return <Home className="h-5 w-5" />;
      default:
        return <MessageCircle className="h-5 w-5" />;
    }
  };

  const getCharacterColor = (characterName: string) => {
    switch (characterName) {
      case "薇奥拉":
        return "bg-gradient-to-br from-pink-500 to-purple-600";
      case "奥西诺公爵":
        return "bg-gradient-to-br from-blue-500 to-purple-600";
      case "奥丽维亚":
        return "bg-gradient-to-br from-purple-500 to-pink-600";
      case "马伏里奥":
        return "bg-gradient-to-br from-gray-500 to-blue-600";
      default:
        return "bg-gradient-to-br from-gray-500 to-gray-600";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-80 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">加载角色失败</p>
          <Button onClick={() => setLocation('/theater')}>返回剧场</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => setLocation('/theater')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回剧场
              </Button>
              <div>
                <h1 className="text-2xl font-bold">选择角色</h1>
                <p className="text-gray-600 dark:text-gray-300">在《{selectedPlay}》中选择你想对话的角色</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              {selectedPlay}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Characters Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters?.map((character) => (
            <Card
              key={character.id}
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-purple-300 dark:hover:border-purple-600"
              onClick={() => setLocation(`/chat/${character.id}`)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${getCharacterColor(character.name)} text-white`}>
                      {getCharacterIcon(character.name)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{character.name}</CardTitle>
                      <CardDescription className="text-sm">{character.playName}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">角色描述</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {character.description}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm mb-2">性格特点</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {character.personality}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm mb-2">背景故事</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {character.background}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t">
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 group-hover:shadow-lg transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLocation(`/chat/${character.id}`);
                    }}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    开始对话
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {characters?.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">暂无角色</h3>
            <p className="text-gray-600 dark:text-gray-300">
              《{selectedPlay}》中的角色正在准备中，敬请期待！
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
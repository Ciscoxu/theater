import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Send, 
  Heart, 
  Smile, 
  Frown, 
  Zap, 
  MessageCircle,
  Crown,
  Home,
  User
} from "lucide-react";
import type { Character, Conversation } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";

interface Message {
  id: string;
  sender: 'user' | 'character';
  content: string;
  timestamp: Date;
  emotion?: 'happy' | 'sad' | 'angry' | 'surprised' | 'neutral';
}

export default function Chat() {
  const { characterId } = useParams<{ characterId: string }>();
  const [, setLocation] = useLocation();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedEmotion, setSelectedEmotion] = useState<Message['emotion']>('neutral');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch character data
  const { data: character, isLoading: characterLoading } = useQuery<Character>({
    queryKey: ['/api/characters', characterId],
    queryFn: async () => {
      const response = await fetch(`/api/characters/${characterId}`);
      if (!response.ok) throw new Error('Failed to fetch character');
      return response.json();
    },
  });

  // Fetch existing conversation
  const { data: conversation, isLoading: conversationLoading } = useQuery<Conversation>({
    queryKey: ['/api/conversations', characterId],
    queryFn: async () => {
      const response = await fetch(`/api/conversations?characterId=${characterId}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to fetch conversation');
      }
      return response.json();
    },
    enabled: !!user,
  });

  // Create conversation mutation
  const createConversation = useMutation({
    mutationFn: async (newConversation: { characterId: number; messages: Message[] }) => {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConversation),
      });
      if (!response.ok) throw new Error('Failed to create conversation');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/conversations', characterId] });
    },
  });

  // Update conversation mutation
  const updateConversation = useMutation({
    mutationFn: async ({ id, messages }: { id: number; messages: Message[] }) => {
      const response = await fetch(`/api/conversations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });
      if (!response.ok) throw new Error('Failed to update conversation');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/conversations', characterId] });
    },
  });

  // Load existing messages
  useEffect(() => {
    if (conversation?.messages) {
      setMessages(conversation.messages as Message[]);
    }
  }, [conversation]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getCharacterIcon = (characterName: string) => {
    switch (characterName) {
      case "薇奥拉":
        return <Heart className="h-4 w-4" />;
      case "奥西诺公爵":
        return <Crown className="h-4 w-4" />;
      case "奥丽维亚":
        return <Crown className="h-4 w-4" />;
      case "马伏里奥":
        return <Home className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getEmotionIcon = (emotion: Message['emotion']) => {
    switch (emotion) {
      case 'happy':
        return <Smile className="h-4 w-4" />;
      case 'sad':
        return <Frown className="h-4 w-4" />;
      case 'angry':
        return <Zap className="h-4 w-4" />;
      case 'surprised':
        return <Zap className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getEmotionColor = (emotion: Message['emotion']) => {
    switch (emotion) {
      case 'happy':
        return 'text-green-600';
      case 'sad':
        return 'text-blue-600';
      case 'angry':
        return 'text-red-600';
      case 'surprised':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !character || !user) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: message.trim(),
      timestamp: new Date(),
      emotion: selectedEmotion,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setMessage("");

    // Simulate character response
    setTimeout(() => {
      const characterResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'character',
        content: generateCharacterResponse(character, userMessage.content),
        timestamp: new Date(),
        emotion: 'neutral',
      };
      
      const updatedMessages = [...newMessages, characterResponse];
      setMessages(updatedMessages);
      
      // Save to backend
      if (conversation) {
        updateConversation.mutate({
          id: conversation.id,
          messages: updatedMessages,
        });
      } else {
        createConversation.mutate({
          characterId: parseInt(characterId!),
          messages: updatedMessages,
        });
      }
    }, 1000 + Math.random() * 2000);
  };

  const generateCharacterResponse = (character: Character, userMessage: string): string => {
    const responses = {
      "薇奥拉": [
        "我以塞巴斯蒂安的身份为奥西诺公爵服务，但内心却有着复杂的情感...",
        "这场船难改变了我的命运，但也让我学会了坚强。",
        "有时候，隐藏真实的自己是为了保护那些我们爱的人。",
        "爱情总是让人迷失，不是吗？",
      ],
      "奥西诺公爵": [
        "我的心完全被奥丽维亚占据，她的美貌如星辰般闪耀。",
        "作为公爵，我习惯了得到我想要的一切，但爱情却是例外。",
        "塞巴斯蒂安，你总是能理解我的心情。",
        "音乐是爱情的食粮，让我们继续这甜蜜的旋律。",
      ],
      "奥丽维亚": [
        "我为兄长守孝，但内心深处渴望着真正的爱情。",
        "那个名叫塞巴斯蒂安的年轻人，让我的心产生了微妙的变化。",
        "作为女伯爵，我必须保持优雅，但爱情让我变得脆弱。",
        "有时候，我们以为自己想要的和真正需要的是不同的。",
      ],
      "马伏里奥": [
        "作为奥丽维亚小姐的忠实管家，我尽职尽责地管理着这个家。",
        "我梦想着有一天能够飞黄腾达，成为真正的贵族。",
        "那些小丑们总是在嘲笑我，但我知道自己的价值。",
        "严肃和秩序是这个家庭的基石，我不会让任何人破坏它。",
      ],
    };

    const characterResponses = responses[character.name as keyof typeof responses] || [
      "很高兴与你对话。",
      "请告诉我更多关于你的想法。",
      "这是个有趣的话题。",
    ];

    return characterResponses[Math.floor(Math.random() * characterResponses.length)];
  };

  if (characterLoading || conversationLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Skeleton className="h-96 lg:col-span-1" />
            <Skeleton className="h-96 lg:col-span-3" />
          </div>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">角色未找到</p>
          <Button onClick={() => setLocation('/characters')}>返回角色选择</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => setLocation('/characters')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回角色选择
              </Button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
                  {getCharacterIcon(character.name)}
                </div>
                <div>
                  <h1 className="text-xl font-bold">{character.name}</h1>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{character.playName}</p>
                </div>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-200">
              在线
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Character Info Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">角色信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2">描述</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {character.description}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">性格</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {character.personality}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">背景</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {character.background}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b">
                <CardTitle className="text-lg">对话</CardTitle>
              </CardHeader>
              
              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>开始与{character.name}的对话吧！</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.sender === 'user'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          {msg.sender === 'user' ? (
                            <User className="h-3 w-3" />
                          ) : (
                            getCharacterIcon(character.name)
                          )}
                          <span className="text-xs font-medium">
                            {msg.sender === 'user' ? '你' : character.name}
                          </span>
                          {msg.emotion && (
                            <span className={`text-xs ${getEmotionColor(msg.emotion)}`}>
                              {getEmotionIcon(msg.emotion)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </CardContent>

              {/* Message Input */}
              <div className="border-t p-4">
                {/* Emotion Selector */}
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-sm text-gray-600 dark:text-gray-300">情绪:</span>
                  <div className="flex space-x-2">
                    {[
                      { key: 'neutral', icon: MessageCircle, label: '平静' },
                      { key: 'happy', icon: Smile, label: '开心' },
                      { key: 'sad', icon: Frown, label: '伤心' },
                      { key: 'angry', icon: Zap, label: '愤怒' },
                      { key: 'surprised', icon: Zap, label: '惊讶' },
                    ].map((emotion) => (
                      <Button
                        key={emotion.key}
                        variant={selectedEmotion === emotion.key ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedEmotion(emotion.key as Message['emotion'])}
                        className="h-8"
                      >
                        <emotion.icon className="h-3 w-3" />
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Message Form */}
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={`与${character.name}对话...`}
                    className="flex-1"
                    maxLength={500}
                  />
                  <Button type="submit" disabled={!message.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
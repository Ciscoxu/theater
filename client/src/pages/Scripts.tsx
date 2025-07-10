import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  ArrowLeft, 
  Plus, 
  BookOpen, 
  Edit, 
  Trash2,
  Calendar,
  Tag,
  User
} from "lucide-react";
import type { Script } from "@shared/schema";
import { insertScriptSchema } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";

const scriptFormSchema = insertScriptSchema.omit({ userId: true }).extend({
  title: z.string().min(1, "标题不能为空").max(200, "标题过长"),
  description: z.string().max(1000, "描述过长").optional(),
  content: z.string().min(1, "内容不能为空"),
  genre: z.string().min(1, "请选择类型"),
});

type ScriptFormData = z.infer<typeof scriptFormSchema>;

export default function Scripts() {
  const [, setLocation] = useLocation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingScript, setEditingScript] = useState<Script | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const form = useForm<ScriptFormData>({
    resolver: zodResolver(scriptFormSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      genre: "",
    },
  });

  // Fetch scripts
  const { data: scripts, isLoading, error } = useQuery<Script[]>({
    queryKey: ['/api/scripts'],
    queryFn: async () => {
      const response = await fetch('/api/scripts');
      if (!response.ok) throw new Error('Failed to fetch scripts');
      return response.json();
    },
    enabled: !!user,
  });

  // Create script mutation
  const createScript = useMutation({
    mutationFn: async (scriptData: ScriptFormData) => {
      const response = await fetch('/api/scripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scriptData),
      });
      if (!response.ok) throw new Error('Failed to create script');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/scripts'] });
      setIsCreateDialogOpen(false);
      form.reset();
      toast({
        title: "成功",
        description: "剧本创建成功",
      });
    },
    onError: (error) => {
      toast({
        title: "错误",
        description: "创建剧本失败",
        variant: "destructive",
      });
    },
  });

  // Update script mutation
  const updateScript = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<ScriptFormData> }) => {
      const response = await fetch(`/api/scripts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update script');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/scripts'] });
      setEditingScript(null);
      form.reset();
      toast({
        title: "成功",
        description: "剧本更新成功",
      });
    },
    onError: (error) => {
      toast({
        title: "错误",
        description: "更新剧本失败",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: ScriptFormData) => {
    if (editingScript) {
      updateScript.mutate({ id: editingScript.id, data });
    } else {
      createScript.mutate(data);
    }
  };

  const handleEdit = (script: Script) => {
    setEditingScript(script);
    form.reset({
      title: script.title,
      description: script.description || "",
      content: script.content || "",
      genre: script.genre || "",
    });
    setIsCreateDialogOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingScript(null);
    form.reset();
    setIsCreateDialogOpen(false);
  };

  const getGenreColor = (genre: string) => {
    switch (genre) {
      case '喜剧': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case '悲剧': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case '历史剧': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case '浪漫剧': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
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
              <Button variant="ghost" size="sm" onClick={() => setLocation('/theater')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回剧场
              </Button>
              <div>
                <h1 className="text-2xl font-bold">剧本创作</h1>
                <p className="text-gray-600 dark:text-gray-300">创作和管理你的戏剧剧本</p>
              </div>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  创建剧本
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingScript ? '编辑剧本' : '创建新剧本'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>标题</FormLabel>
                            <FormControl>
                              <Input placeholder="剧本标题" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="genre"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>类型</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="选择类型" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="喜剧">喜剧</SelectItem>
                                <SelectItem value="悲剧">悲剧</SelectItem>
                                <SelectItem value="历史剧">历史剧</SelectItem>
                                <SelectItem value="浪漫剧">浪漫剧</SelectItem>
                                <SelectItem value="其他">其他</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>简介</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="剧本简介..." 
                              className="min-h-20"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>剧本内容</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="开始写你的剧本..." 
                              className="min-h-48"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end space-x-3">
                      <Button type="button" variant="outline" onClick={handleCancelEdit}>
                        取消
                      </Button>
                      <Button 
                        type="submit"
                        disabled={createScript.isPending || updateScript.isPending}
                      >
                        {editingScript ? '更新' : '创建'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Scripts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scripts?.map((script) => (
            <Card key={script.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{script.title}</CardTitle>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getGenreColor(script.genre || '')}>
                        <Tag className="h-3 w-3 mr-1" />
                        {script.genre}
                      </Badge>
                      <Badge variant="outline">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(script.createdAt!).toLocaleDateString()}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(script)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {script.description || "暂无描述"}
                </CardDescription>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <p className="line-clamp-3">
                    {script.content ? script.content.substring(0, 150) + '...' : '暂无内容'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {scripts?.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">还没有剧本</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              创作你的第一个剧本，开始你的戏剧创作之旅
            </p>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              创建第一个剧本
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
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
  Play, 
  Edit, 
  Calendar,
  FileText,
  Users,
  Clock
} from "lucide-react";
import type { Script, Rehearsal } from "@shared/schema";
import { insertRehearsalSchema } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";

const rehearsalFormSchema = insertRehearsalSchema.omit({ userId: true }).extend({
  scriptId: z.number().min(1, "请选择剧本"),
  notes: z.string().optional(),
});

type RehearsalFormData = z.infer<typeof rehearsalFormSchema>;

export default function Rehearsals() {
  const [, setLocation] = useLocation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingRehearsal, setEditingRehearsal] = useState<Rehearsal | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const form = useForm<RehearsalFormData>({
    resolver: zodResolver(rehearsalFormSchema),
    defaultValues: {
      scriptId: 0,
      notes: "",
    },
  });

  // Fetch rehearsals
  const { data: rehearsals, isLoading: rehearsalsLoading } = useQuery<Rehearsal[]>({
    queryKey: ['/api/rehearsals'],
    queryFn: async () => {
      const response = await fetch('/api/rehearsals');
      if (!response.ok) throw new Error('Failed to fetch rehearsals');
      return response.json();
    },
    enabled: !!user,
  });

  // Fetch scripts for selection
  const { data: scripts, isLoading: scriptsLoading } = useQuery<Script[]>({
    queryKey: ['/api/scripts'],
    queryFn: async () => {
      const response = await fetch('/api/scripts');
      if (!response.ok) throw new Error('Failed to fetch scripts');
      return response.json();
    },
    enabled: !!user,
  });

  // Create rehearsal mutation
  const createRehearsal = useMutation({
    mutationFn: async (rehearsalData: RehearsalFormData) => {
      const response = await fetch('/api/rehearsals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rehearsalData),
      });
      if (!response.ok) throw new Error('Failed to create rehearsal');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/rehearsals'] });
      setIsCreateDialogOpen(false);
      form.reset();
      toast({
        title: "成功",
        description: "排练记录创建成功",
      });
    },
    onError: () => {
      toast({
        title: "错误",
        description: "创建排练记录失败",
        variant: "destructive",
      });
    },
  });

  // Update rehearsal mutation
  const updateRehearsal = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<RehearsalFormData> }) => {
      const response = await fetch(`/api/rehearsals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update rehearsal');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/rehearsals'] });
      setEditingRehearsal(null);
      form.reset();
      toast({
        title: "成功",
        description: "排练记录更新成功",
      });
    },
    onError: () => {
      toast({
        title: "错误",
        description: "更新排练记录失败",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: RehearsalFormData) => {
    if (editingRehearsal) {
      updateRehearsal.mutate({ id: editingRehearsal.id, data });
    } else {
      createRehearsal.mutate(data);
    }
  };

  const handleEdit = (rehearsal: Rehearsal) => {
    setEditingRehearsal(rehearsal);
    form.reset({
      scriptId: rehearsal.scriptId || 0,
      notes: rehearsal.notes || "",
    });
    setIsCreateDialogOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingRehearsal(null);
    form.reset();
    setIsCreateDialogOpen(false);
  };

  const getScriptTitle = (scriptId: number) => {
    const script = scripts?.find(s => s.id === scriptId);
    return script?.title || "未知剧本";
  };

  if (rehearsalsLoading || scriptsLoading) {
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
                <h1 className="text-2xl font-bold">排练室</h1>
                <p className="text-gray-600 dark:text-gray-300">管理你的排练记录和表演笔记</p>
              </div>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  新建排练
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingRehearsal ? '编辑排练记录' : '新建排练记录'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="scriptId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>选择剧本</FormLabel>
                          <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="选择要排练的剧本" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {scripts?.map((script) => (
                                <SelectItem key={script.id} value={script.id.toString()}>
                                  {script.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>排练笔记</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="记录排练过程中的想法、改进点、表演技巧等..." 
                              className="min-h-32"
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
                        disabled={createRehearsal.isPending || updateRehearsal.isPending}
                      >
                        {editingRehearsal ? '更新' : '创建'}
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
        {/* Statistics Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">总排练次数</CardTitle>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rehearsals?.length || 0}</div>
              <p className="text-xs text-muted-foreground">已完成的排练</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">涉及剧本</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(rehearsals?.map(r => r.scriptId)).size || 0}
              </div>
              <p className="text-xs text-muted-foreground">不同的剧本</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">本周排练</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {rehearsals?.filter(r => {
                  const oneWeekAgo = new Date();
                  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                  return new Date(r.createdAt!) > oneWeekAgo;
                }).length || 0}
              </div>
              <p className="text-xs text-muted-foreground">过去7天</p>
            </CardContent>
          </Card>
        </div>

        {/* Rehearsals Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rehearsals?.map((rehearsal) => (
            <Card key={rehearsal.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">
                      {getScriptTitle(rehearsal.scriptId || 0)}
                    </CardTitle>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(rehearsal.createdAt!).toLocaleDateString()}
                      </Badge>
                      <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(rehearsal.createdAt!).toLocaleTimeString()}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(rehearsal)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">排练笔记</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-4">
                      {rehearsal.notes || "暂无笔记"}
                    </p>
                  </div>
                  {rehearsal.performance && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2">表演数据</h4>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        包含表演记录和分析
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {rehearsals?.length === 0 && (
          <div className="text-center py-12">
            <Play className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">还没有排练记录</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              开始你的第一次排练，记录学习和表演的过程
            </p>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              开始第一次排练
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
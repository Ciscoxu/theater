## System Architecture

### Frontend Architecture
- **框架**: React SPA (单页应用)
- **路由**: Wouter for client-side routing
- **状态管理**: TanStack Query for server state management
- **UI组件**: Shadcn/UI components with Tailwind CSS
- **表单处理**: React Hook Form with Zod validation
- **主题**: 支持深色/浅色主题切换

### Project Structure
```
workspace/
├── package.json              # 项目依赖和脚本
├── client/                   # 前端应用
│   ├── src/
│   │   ├── pages/           # 页面组件
│   │   │   ├── Landing.tsx  # 首页
│   │   │   ├── Theater.tsx  # 剧场主页
│   │   │   ├── Characters.tsx # 角色选择页
│   │   │   ├── Chat.tsx     # 角色对话页
│   │   │   ├── Scripts.tsx  # 剧本创作页
│   │   │   └── Rehearsals.tsx # 排练室页面
│   │   ├── components/      # 可重用组件
│   │   ├── hooks/          # 自定义Hook
│   │   └── lib/            # 工具函数
│   └── dist/               # 构建输出
└── shared/                 # 共享类型定义
    └── schema.js           # 数据模型定义
```

## Key Features

### 1. 用户体验路径
- **剧场主页**: 登录后进入《第十二夜》剧场
- **角色选择**: 浏览和选择对话角色
- **角色对话**: 与选定角色进行互动对话
- **剧本创作**: 创作和管理戏剧剧本
- **排练室**: 记录排练过程和笔记


### 2. 对话系统
- **智能回复**: 基于角色性格的对话生成
- **情绪表达**: 支持多种情绪状态的消息发送
- **对话历史**: 保存和恢复对话记录
- **实时响应**: 模拟角色思考和回复过程

### 3. 剧本创作
- **可视化编辑**: 简洁的剧本编辑界面
- **分类管理**: 支持喜剧、悲剧、历史剧等分类
- **云端保存**: 剧本自动保存到服务器

### 4. 排练室
- **排练记录**: 记录每次排练的详细信息
- **笔记系统**: 支持添加排练笔记和改进建议
- **统计分析**: 显示排练频率和进度统计

## Technical Implementation

### API Endpoints
- `GET /api/auth/user` - 获取用户信息
- `GET /api/characters` - 获取角色列表
- `GET /api/characters/:id` - 获取特定角色信息
- `GET /api/conversations` - 获取对话记录
- `POST /api/conversations` - 创建新对话
- `PUT /api/conversations/:id` - 更新对话记录
- `GET /api/scripts` - 获取剧本列表
- `POST /api/scripts` - 创建新剧本
- `PUT /api/scripts/:id` - 更新剧本
- `GET /api/rehearsals` - 获取排练记录
- `POST /api/rehearsals` - 创建排练记录
- `PUT /api/rehearsals/:id` - 更新排练记录

### Data Models
- **User**: 用户信息
- **Character**: 角色信息（姓名、描述、性格、背景）
- **Conversation**: 对话记录（用户ID、角色ID、消息历史）
- **Script**: 剧本信息（标题、内容、类型、描述）
- **Rehearsal**: 排练记录（剧本ID、笔记、表演数据）

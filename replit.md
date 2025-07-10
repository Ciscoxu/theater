# Replit.md

## Overview

互动剧场应用 - 一个基于Node.js的全栈Web应用，允许用户与《第十二夜》中的角色进行对话，创作剧本，并管理排练记录。当前已完成基础架构搭建和核心功能开发。

## User Preferences

用户偏好沟通风格：简单、日常的语言。

## System Architecture

### Frontend Architecture
- **框架**: React SPA (单页应用)
- **路由**: Wouter for client-side routing
- **状态管理**: TanStack Query for server state management
- **UI组件**: Shadcn/UI components with Tailwind CSS
- **表单处理**: React Hook Form with Zod validation
- **主题**: 支持深色/浅色主题切换

### Backend Architecture
- **运行时**: Node.js with Express
- **数据存储**: 内存存储 (MemStorage) for development
- **认证**: 模拟认证系统 (开发环境)
- **API**: RESTful API endpoints

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
├── server/                  # 后端服务
│   ├── app.js              # 主服务器文件
│   ├── storage.js          # 数据存储层
│   └── db.js               # 数据库连接配置
└── shared/                 # 共享类型定义
    └── schema.js           # 数据模型定义
```

## Key Features

### 1. 用户体验路径
- **首页**: 未登录用户看到应用介绍和登录入口
- **剧场主页**: 登录后进入《第十二夜》剧场
- **角色选择**: 浏览和选择对话角色
- **角色对话**: 与选定角色进行互动对话
- **剧本创作**: 创作和管理戏剧剧本
- **排练室**: 记录排练过程和笔记

### 2. 角色系统
- **薇奥拉**: 聪明机智的女主角，女扮男装为奥西诺公爵服务
- **奥西诺公爵**: 伊利里亚的统治者，深情的贵族
- **奥丽维亚**: 美丽的女伯爵，为兄长守孝
- **马伏里奥**: 奥丽维亚的管家，自负且严肃

### 3. 对话系统
- **智能回复**: 基于角色性格的对话生成
- **情绪表达**: 支持多种情绪状态的消息发送
- **对话历史**: 保存和恢复对话记录
- **实时响应**: 模拟角色思考和回复过程

### 4. 剧本创作
- **可视化编辑**: 简洁的剧本编辑界面
- **分类管理**: 支持喜剧、悲剧、历史剧等分类
- **云端保存**: 剧本自动保存到服务器

### 5. 排练室
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

## Current Status

### 已完成功能
✅ 基础项目架构搭建
✅ 前端页面结构和路由
✅ 后端API接口设计
✅ 数据模型定义
✅ 角色对话系统基础功能
✅ 剧本创作页面
✅ 排练室页面
✅ 响应式设计和主题支持

### 技术问题
❌ 服务器启动遇到Express路由解析问题
❌ 需要解决path-to-regexp包兼容性问题
❌ 前端构建系统需要配置

### 下一步计划
1. 解决服务器启动问题
2. 配置前端构建系统
3. 实现前后端联调
4. 添加AI对话生成功能
5. 完善用户认证系统
6. 部署到生产环境

## Recent Changes (July 10, 2025)

- 创建了完整的前端React应用结构
- 实现了5个主要页面：Landing, Theater, Characters, Chat, Scripts, Rehearsals
- 设计了RESTful API接口
- 创建了内存存储系统用于开发测试
- 添加了《第十二夜》角色数据
- 实现了角色对话的基础UI和交互逻辑
- 配置了Tailwind CSS和组件库
- 遇到Express服务器启动问题需要解决
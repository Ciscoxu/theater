// import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import Landing from './pages/Landing';
import Login from './pages/Login';
import Characters from './pages/Characters';
import Chat from './pages/Chat';
import ScriptPage from './pages/Script';

// 创建 QueryClient 实例
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/characters" element={<Characters />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/script" element={<ScriptPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

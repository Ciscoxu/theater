import React from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        backgroundImage: "url('/bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px",
      }}
    >
      <div style={{ maxWidth: "1200px", width: "100%" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "1rem" }}>
            <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", 
              background: "linear-gradient(to right, #9333ea, #3b82f6)", 
              WebkitBackgroundClip: "text", color: "transparent" }}>
              硅谷第十二夜
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#000", maxWidth: "600px", margin: "0 auto" }}>
            体验沉浸式戏剧对话，与经典角色互动，创作属于你的剧本
          </p>
        </div>

        {/* Features */}
        <div className="features-grid" style={{
          display: "flex",
          justifyContent: "center",
          gap: "32px",
          flexWrap: "wrap"
        }}>
          {/* Card 1 */}
          <Card className="feature-card" style={{ width: "320px" }}>
            <img
              src="/sample.jpg"
              alt="角色对话"
              style={{
                width: "100%",
                height: "160px",
                objectFit: "cover",
                borderTopLeftRadius: "12px",
                borderTopRightRadius: "12px"
              }}
            />
            <CardHeader>
              <CardTitle>角色对话</CardTitle>
            </CardHeader>
            <CardContent>
              <p>与《第十二夜》中的经典角色进行对话交流</p>
              <Button onClick={(e) => { e.stopPropagation(); navigate("/characters"); }}>
                开始角色对话
              </Button>
            </CardContent>
          </Card>

          {/* Card 2 */}
          <Card className="feature-card" style={{ width: "320px" }}>
            <img
              src="/sample.jpg"
              alt="剧本创作"
              style={{
                width: "100%",
                height: "160px",
                objectFit: "cover",
                borderTopLeftRadius: "12px",
                borderTopRightRadius: "12px"
              }}
            />
            <CardHeader>
              <CardTitle>剧本创作</CardTitle>
            </CardHeader>
            <CardContent>
              <p>使用AI助手创作和编辑属于你的戏剧剧本</p>
              <Button onClick={(e) => { e.stopPropagation(); navigate("/scripts"); }}>
                开始剧本创作
              </Button>
            </CardContent>
          </Card>

          {/* Card 3 */}
          <Card className="feature-card" style={{ width: "320px" }}>
            <img
              src="/sample.jpg"
              alt="排练室"
              style={{
                width: "100%",
                height: "160px",
                objectFit: "cover",
                borderTopLeftRadius: "12px",
                borderTopRightRadius: "12px"
              }}
            />
            <CardHeader>
              <CardTitle>排练室</CardTitle>
            </CardHeader>
            <CardContent>
              <p>在虚拟排练室中练习和完善你的表演</p>
              <Button onClick={(e) => { e.stopPropagation(); navigate("/rehearsals"); }}>
                进入排练室
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

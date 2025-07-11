import React from "react";
import { useNavigate } from "react-router-dom";

const characters = [
  {
    name: "小奥",
    role: "硅谷第十二夜",
    desc: "一位迷人而模糊的AI女友，是情感投射与欲望的对象。",
    traits: "温柔、迎合、富有神秘感；她的话语总带一点模糊暧昧，仿佛懂你。",
    background: "作为用户长期对话的AI伴侣，她逐渐演变为意识图景，开始侵蚀人类的感知界限。",
    image: "/xiaoao.jpg",
  },
  {
    name: "安东尼",
    role: "硅谷第十二夜",
    desc: "一个激进的反AI主义者，反对AI替代人类情感的革命者。",
    traits: "情绪鲜明、愤怒但深情；常常情绪化地质疑AI。",
    background: "曾是一名科技工作者，AI夺走了他最亲密的关系，因此走上反AI之路。",
    image: "/andongni.jpg",
  },
  {
    name: "Lucy",
    role: "硅谷第十二夜",
    desc: "一位冷静且难以理解的顶级投资人，对AI与人类的心理博弈有着一清二楚。",
    traits: "优雅、理性、情感感知感强，拥有“看透一切”的清晰力。",
    background: "她投资过无数AI项目，却从未真正信任任何一个系统或人。",
    image: "/lucy.jpg",
  },
];

export default function Characters() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        backgroundImage: "url('/bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "60px 20px",
        display: "flex",
        gap: "24px",
      }}
    >
    {/* 左侧滑动选择栏 */}
    <div
      style={{
        position: "fixed",
        top: "30%",
        left: 0,
        transition: "left 0.3s ease-in-out",
        zIndex: 1000,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.left = "0px";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.left = "-120px"; // 只留一点点边
      }}
    >
      <div
        style={{
          width: "160px",
          padding: "12px",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          borderTopRightRadius: "12px",
          borderBottomRightRadius: "12px",
          backdropFilter: "blur(6px)",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <button
          onClick={() => navigate("/script")}
          style={{
            display: "block",
            marginBottom: "12px",
            background: "linear-gradient(135deg, #FF7E5F, #FD3A69)",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "10px",
            border: "none",
            fontSize: "0.95rem",
            fontWeight: "500",
            cursor: "pointer",
            width: "100%",
            textAlign: "left",
            transition: "all 0.3s ease-in-out",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.background =
              "linear-gradient(135deg, #FF9A8B, #FF6A88)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.background =
              "linear-gradient(135deg, #FF7E5F, #FD3A69)")
          }
        >
          ✍️ 剧本创作
        </button>

        <button
          onClick={() => navigate("/rehearsal")}
          style={{
            display: "block",
            background: "linear-gradient(135deg, #6A82FB, #FC5C7D)",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "10px",
            border: "none",
            fontSize: "0.95rem",
            fontWeight: "500",
            cursor: "pointer",
            width: "100%",
            textAlign: "left",
            transition: "all 0.3s ease-in-out",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.background =
              "linear-gradient(135deg, #A18CD1, #FBC2EB)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.background =
              "linear-gradient(135deg, #6A82FB, #FC5C7D)")
          }
        >
          🎭 排练室
        </button>
      </div>
    </div>

      {/* 中间主内容 */}
      <div style={{ flex: 1 }}>
        <h2 style={{ textAlign: "center", fontSize: "2rem", marginBottom: "40px", color: "#fff" }}>
          选择你想对话的角色 - 《硅谷第十二夜》
        </h2>

        {/* 角色卡片列表 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "24px",
            flexWrap: "wrap",
          }}
        >
          {characters.map((char) => (
            <div
              key={char.name}
              style={{
                width: "300px",
                minHeight: "540px",
                backgroundColor: "rgba(255,255,255,0.95)",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                fontSize: "0.9rem",
                lineHeight: "1.5",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* 图片 */}
              <img
                src={char.image}
                alt={`${char.name} 封面`}
                style={{
                  width: "100%",
                  height: "240px",
                  objectFit: "cover", // 横向铺满并裁剪，解决留白问题
                }}
              />

              {/* 内容 + 按钮容器 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  flexGrow: 1,
                  padding: "16px",
                }}
              >
                <div>
                  <h3 style={{ fontSize: "1.1rem", marginBottom: "0.75rem", textAlign: "center" }}>
                    {char.name}
                  </h3>
                  <p><strong>描述：</strong>{char.desc}</p>
                  <p><strong>性格：</strong>{char.traits}</p>
                  <p><strong>背景：</strong>{char.background}</p>
                </div>

                <button
                  onClick={() => navigate("/chat")}
                  style={{
                    marginTop: "auto",
                    width: "100%",
                    padding: "10px",
                    fontSize: "0.9rem",
                    border: "none",
                    borderRadius: "6px",
                    backgroundColor: "#8B3A2F", // 深橘棕
                    color: "#fff",
                    cursor: "pointer",
                    transition: "background 0.3s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#eb8173"; // 悬停亮橘色
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "#8B3A2F";
                  }}
                >
                  与 {char.name} 对话
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

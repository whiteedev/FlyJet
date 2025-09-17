import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, Gift, Settings, Info, User } from "lucide-react";
import RocketGame from "./components/RocketGame";
import Prizes from "./components/Prizes";
import SettingsPage from "./components/SettingsPage";

// Звездный фон
function StarsBackground() {
  const canvasRef = useRef(null);
  const stars = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const numStars = 150;
    stars.current = Array.from({ length: numStars }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 0.5 + 0.2,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      stars.current.forEach((star) => {
        star.y -= star.speed;
        if (star.y < 0) star.y = height;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        background: "#000",
      }}
    />
  );
}

export default function App() {
  const [step, setStep] = useState("loading");
  const [activeTab, setActiveTab] = useState("game");
  const [showTour, setShowTour] = useState(true);

  const menuItems = [
    { Icon: Gamepad2, label: "Играть" },
    { Icon: Gift, label: "Выигрывать" },
    { Icon: Info, label: "Как играть" },
  ];

  const bottomMenu = [
    { Icon: Gamepad2, id: "game" },
    { Icon: Gift, id: "prizes" },
    { Icon: Settings, id: "settings" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setStep("welcome"), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Рендер контента в зависимости от activeTab
  const renderActiveTab = () => {
    switch (activeTab) {
      case "game":
        return <RocketGame key="game" />;
      case "prizes":
        return <Prizes key="prizes" />;
      case "settings":
        return <SettingsPage key="settings" />;
      default:
        return <RocketGame key="game" />;
    }    
  };

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        width: "100vw",
        color: "rgba(255,255,255,0.87)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <StarsBackground />

      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          position: "relative",
          zIndex: 1,
        }}
      >
        <AnimatePresence mode="wait">
          {step === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "radial-gradient(circle at 30% 30%, #646cff, #1a1a1a)",
                  boxShadow: "0 0 30px #646cff, 0 0 60px #646cff50",
                  marginBottom: 20,
                  animation: "pulse 1.5s infinite ease-in-out",
                }}
              />
              <p style={{ color: "#aaa" }}>Загрузка...</p>
            </motion.div>
          )}

          {step === "welcome" && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                maxWidth: 400,
                padding: "30px 20px",
                textAlign: "center",
                background: "rgba(20,20,20,0.5)",
                backdropFilter: "blur(15px)",
                borderRadius: 20,
                boxShadow: "0 0 20px rgba(100, 108, 255, 0.3)",
              }}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "#535bf2",
                  marginBottom: 15,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 15px #646cff50",
                }}
              >
                <User color="#fff" size={40} />
              </motion.div>

              <h2>Привет, игрок!</h2>

              <p style={{ marginBottom: 20, color: "#ccc", lineHeight: 1.5 }}>
                Здесь вы можете играть и выигрывать NFT подарки.
              </p>

              <div style={{ display: "flex", gap: 25, marginBottom: 30 }}>
                {menuItems.map(({ Icon, label }, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
                  >
                    <Icon color="#646cff" size={32} />
                    <span style={{ marginTop: 5, fontSize: 12, color: "#aaa" }}>{label}</span>
                  </motion.div>
                ))}
              </div>

              <motion.button
                onClick={() => {
                  setStep("game");
                  setShowTour(false);
                }}
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px #646cff" }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: "12px 28px",
                  fontSize: 16,
                  fontWeight: 500,
                  borderRadius: 12,
                  background: "linear-gradient(90deg, #646cff, #535bf2)",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Далее
              </motion.button>

              {showTour && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{ marginTop: 20, fontSize: 14, color: "#ccc" }}
                >
                  Нажмите на кнопку «Далее», чтобы начать игру! 🎮
                </motion.div>
              )}
            </motion.div>
          )}

          {step === "game" && renderActiveTab()}
        </AnimatePresence>
      </div>

      {/* Нижнее меню */}
      {step === "game" && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120 }}
          style={{
            position: "absolute",
            bottom: 20,
            left: 0,
            right: 0,
            margin: "0 auto",
            padding: "15px 30px",
            borderRadius: 25,
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(15px)",
            display: "flex",
            justifyContent: "space-around",
            width: "90%",
            maxWidth: 400,
            boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
            zIndex: 2,
          }}
        >
          {bottomMenu.map(({ Icon, id }, i) => (
            <motion.button
              key={i}
              onClick={() => setActiveTab(id)}
              whileTap={{ scale: 0.9 }}
              style={{
                width: 60,
                height: 60,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 15,
                background: activeTab === id ? "#646cff" : "transparent",
                border: activeTab === id ? "none" : "1px solid #646cff",
                cursor: "pointer",
              }}
            >
              <motion.div
                animate={activeTab === id ? { y: [-5, 0, -5] } : {}}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <Icon color={activeTab === id ? "#fff" : "#646cff"} size={28} />
              </motion.div>
            </motion.button>
          ))}
        </motion.div>
      )}

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 0.7; }
        }

        button:focus {
          outline: none;
        }

        @media (max-width: 500px) {
          div[style*="maxWidth: 400px"] { max-width: 90%; }
          button { padding: 10px 20px; font-size: 14px; }
        }
      `}</style>
    </div>
  );
}

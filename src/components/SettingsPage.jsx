import { motion } from "framer-motion";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  const settingsOptions = [
    { label: "Звук", type: "toggle" },
    { label: "Музыка", type: "toggle" },
    { label: "Язык", type: "select", options: ["RU", "EN"] },
  ];

  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 50,
        color: "#fff",
      }}
    >
      <h2 style={{ marginBottom: 30, fontSize: 28 }}>⚙️ Настройки</h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          width: "90%",
          maxWidth: 400,
        }}
      >
        {settingsOptions.map((opt, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02 }}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 20px",
              borderRadius: 15,
              background: "rgba(20,20,20,0.5)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 0 15px rgba(100,108,255,0.3)",
              cursor: "pointer",
            }}
          >
            <span>{opt.label}</span>
            {opt.type === "toggle" && (
              <div
                style={{
                  width: 40,
                  height: 20,
                  borderRadius: 10,
                  background: "#646cff",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "#fff",
                    position: "absolute",
                    top: 1,
                    left: 1,
                  }}
                />
              </div>
            )}
            {opt.type === "select" && (
              <select
                style={{
                  background: "rgba(0,0,0,0.3)",
                  color: "#fff",
                  border: "none",
                  padding: "4px 8px",
                  borderRadius: 8,
                }}
              >
                {opt.options.map((o, j) => (
                  <option key={j} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

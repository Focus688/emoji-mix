"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Sparkles,
  Download,
  X,
  ChefHat,
  Shuffle,
} from "lucide-react";
import { emojiCategories, allEmojis } from "@/lib/emojis";

export default function Home() {
  const [slot1, setSlot1] = useState("🐢");
  const [slot2, setSlot2] = useState("🐝");
  const [activeSlot, setActiveSlot] = useState<1 | 2>(1);
  const [activeCategory, setActiveCategory] = useState(0);
  const [search, setSearch] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);

  const filteredEmojis = useMemo(() => {
    if (search.trim()) {
      return allEmojis.filter((e) => e.includes(search.trim()));
    }
    return emojiCategories[activeCategory].emojis;
  }, [search, activeCategory]);

  const selectEmoji = useCallback(
    (emoji: string) => {
      if (activeSlot === 1) {
        setSlot1(emoji);
        setActiveSlot(2);
      } else {
        setSlot2(emoji);
        setActiveSlot(1);
      }
    },
    [activeSlot]
  );

  const randomize = useCallback(() => {
    setSlot1(allEmojis[Math.floor(Math.random() * allEmojis.length)]);
    setSlot2(allEmojis[Math.floor(Math.random() * allEmojis.length)]);
  }, []);

  const tryLoadImage = useCallback(
    (e1: string, e2: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img.src);
        img.onerror = () => reject();
        img.src = `https://emojik.vercel.app/s/${encodeURIComponent(e1)}_${encodeURIComponent(e2)}?size=512`;
      });
    },
    []
  );

  const generate = useCallback(async () => {
    setIsGenerating(true);
    setError(false);
    try {
      let url = "";
      try {
        url = await tryLoadImage(slot1, slot2);
      } catch {
        url = await tryLoadImage(slot2, slot1);
      }
      setResultUrl(url);
    } catch {
      setError(true);
      setTimeout(() => setError(false), 2500);
    } finally {
      setIsGenerating(false);
    }
  }, [slot1, slot2, tryLoadImage]);

  const downloadImage = useCallback(async () => {
    if (!resultUrl) return;
    try {
      const res = await fetch(resultUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `emoji-mix-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // fallback: open in new tab
      window.open(resultUrl, "_blank");
    }
  }, [resultUrl]);

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-6 md:py-10 max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <ChefHat className="w-7 h-7 text-violet-400" />
          <h1 className="text-3xl md:text-4xl font-bold gradient-text">
            Emoji 组合器
          </h1>
        </div>
        <p className="text-sm md:text-base text-white/50">
          选择两个表情，碰撞出奇妙火花
        </p>
      </motion.div>

      {/* Slots */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-4 mb-5"
      >
        {/* Slot 1 */}
        <button
          onClick={() => setActiveSlot(1)}
          className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center text-4xl md:text-5xl cursor-pointer transition-all duration-200 bg-white/5 border-2 ${
            activeSlot === 1
              ? "slot-active border-violet-500/50"
              : "border-white/10 hover:border-white/20"
          }`}
        >
          {slot1}
        </button>

        {/* Plus */}
        <div className="text-white/30 text-2xl font-light">+</div>

        {/* Slot 2 */}
        <button
          onClick={() => setActiveSlot(2)}
          className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center text-4xl md:text-5xl cursor-pointer transition-all duration-200 bg-white/5 border-2 ${
            activeSlot === 2
              ? "slot-active border-violet-500/50"
              : "border-white/10 hover:border-white/20"
          }`}
        >
          {slot2}
        </button>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-3 mb-6"
      >
        <button
          onClick={randomize}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all text-sm"
        >
          <Shuffle className="w-4 h-4" />
          随机
        </button>
        <button
          onClick={generate}
          disabled={isGenerating}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-medium text-sm generate-glow hover:from-indigo-400 hover:to-violet-400 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {isGenerating ? "烹饪中..." : "✨ 生成组合 ✨"}
        </button>
      </motion.div>

      {/* Error toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-sm"
          >
            这对组合暂不支持，换两个试试吧！
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="relative w-full mb-4"
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索表情..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 transition-colors"
        />
      </motion.div>

      {/* Category tabs */}
      {!search.trim() && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-2 mb-4 overflow-x-auto w-full pb-1 no-scrollbar"
        >
          {emojiCategories.map((cat, i) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(i)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm whitespace-nowrap border cat-tab ${
                activeCategory === i
                  ? "cat-tab-active text-white"
                  : "bg-white/5 border-white/10 text-white/50"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </motion.div>
      )}

      {/* Emoji grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="w-full grid grid-cols-7 sm:grid-cols-8 gap-2"
      >
        <AnimatePresence mode="popLayout">
          {filteredEmojis.map((emoji, i) => (
            <motion.button
              key={`${emoji}-${i}`}
              layout
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ delay: i * 0.005 }}
              onClick={() => selectEmoji(emoji)}
              className="emoji-btn aspect-square rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-2xl sm:text-3xl cursor-pointer"
            >
              {emoji}
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Result Modal */}
      <AnimatePresence>
        {resultUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop bg-black/60 p-4"
            onClick={() => setResultUrl(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setResultUrl(null)}
                className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white/50" />
              </button>

              <div className="text-center mb-4">
                <p className="text-lg mb-1">
                  {slot1} + {slot2} =
                </p>
                <p className="text-xs text-white/40">Emoji Kitchen 合成结果</p>
              </div>

              <div className="flex justify-center mb-5">
                <motion.img
                  ref={imgRef}
                  src={resultUrl}
                  alt="Mixed emoji"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 15 }}
                  className="w-48 h-48 object-contain drop-shadow-2xl"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={downloadImage}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-medium hover:from-indigo-400 hover:to-violet-400 transition-all"
                >
                  <Download className="w-4 h-4" />
                  下载图片
                </button>
                <button
                  onClick={() => {
                    setResultUrl(null);
                    setTimeout(generate, 300);
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all text-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  再来一次
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-white/20">
        Powered by Google Emoji Kitchen · Made with 💜
      </div>
    </main>
  );
}

"use client";

import { useRef, useState, useEffect } from "react";
import { Play, Pause, Download, Volume2, SkipBack, SkipForward } from "lucide-react";
import AIDisclaimer from "./AIDisclaimer";

interface AudioPlayerProps {
  src: string; // URL to MP3/WAV
  title: string;
  resourceTitle: string;
  organisation?: string;
  duration?: number; // seconds, if known
}

function formatTime(s: number): string {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function AudioPlayer({
  src,
  title,
  resourceTitle,
  organisation,
  duration: knownDuration,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(knownDuration || 0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration);
    const onEnd = () => setPlaying(false);

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnd);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnd);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
    setPlaying(!playing);
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const t = parseFloat(e.target.value);
    audio.currentTime = t;
    setCurrentTime(t);
  };

  const skip = (delta: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(audio.currentTime + delta, duration));
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="space-y-4">
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* AI Disclaimer */}
      <AIDisclaimer
        documentName={resourceTitle}
        organisation={organisation}
        formatLabel="audio summary"
      />

      {/* Player Card */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        {/* Title */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-700/30">
            <Volume2 className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{title}</h3>
            <p className="text-xs text-gray-500">Audio Summary</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={seek}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-gray-700
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-400"
            style={{
              background: `linear-gradient(to right, #34d399 ${progress}%, #374151 ${progress}%)`,
            }}
          />
          <div className="flex justify-between text-[10px] text-gray-500 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button onClick={() => skip(-15)} className="p-2 text-gray-400 hover:text-white transition" title="Back 15s">
            <SkipBack className="w-5 h-5" />
          </button>
          <button
            onClick={togglePlay}
            className="p-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white transition"
          >
            {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
          </button>
          <button onClick={() => skip(15)} className="p-2 text-gray-400 hover:text-white transition" title="Forward 15s">
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Download */}
        <div className="flex justify-center mt-4">
          <a
            href={src}
            download
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-emerald-400 transition"
          >
            <Download className="w-3.5 h-3.5" /> Download Audio
          </a>
        </div>
      </div>
    </div>
  );
}

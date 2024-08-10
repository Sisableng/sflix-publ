"use client";
import { useEffect, useRef } from "react";
import Artplayer from "artplayer";
import Hls from "hls.js";
import artplayerPluginHlsQuality from "artplayer-plugin-hls-quality";
import { cn } from "@/lib/utils";
import { useArtPlayer } from "./store/useArtPlayerStore";
import { Open_Sans } from "next/font/google";

const openSans = Open_Sans({
  subsets: ["latin"],
});

interface ArtPlayerProps {
  url: string;
  poster: string;
  getInstance?: (art: Artplayer) => void;
  className?: string;
}

export default function ArtPlayer({
  url,
  poster,
  getInstance,
  className,
}: ArtPlayerProps) {
  const artRef = useRef<HTMLDivElement>(null);
  const { setArtState } = useArtPlayer();

  /* eslint-disable*/
  useEffect(() => {
    const option: Artplayer["Option"] = {
      container: artRef.current!,
      url,
      theme: "#4F46E5",
      poster: poster,
      setting: true,
      hotkey: true,
      lock: true,
      aspectRatio: false,
      autoSize: false,
      fullscreen: true,
      autoOrientation: true,
      miniProgressBar: true,
      subtitle: {
        style: {
          fontFamily: openSans.style.fontFamily,
          // fontWeight: '400',
        },
        escape: false,
      },
      settings: [
        {
          name: "subtitle",
          html: "Subtitle",
          selector: [
            {
              html: "Off",
              url: "",
            },
          ],
          onSelect: function (item, $dom, event) {
            if (item.html === "Off") {
              art.subtitle.show = false;
            } else {
              art.subtitle.show = true;
              art.subtitle.url = item.url;
            }
            return item.html;
          },
        },
      ],
      controls: [
        // {
        //   name: "backward",
        //   index: 1,
        //   position: "right",
        //   html: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevrons-left"><path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/></svg>`,
        //   tooltip: "-10s",
        //   click: function (...args) {
        //     if (art.currentTime !== 0) {
        //       const seeking = art.currentTime - 10;
        //       art.seek = seeking;
        //     }
        //   },
        // },
        // {
        //   name: "forward",
        //   index: 2,
        //   position: "right",
        //   html: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevrons-right"><path d="m6 17 5-5-5-5"/><path d="m13 17 5-5-5-5"/></svg>`,
        //   tooltip: "+10s",
        //   click: function (...args) {
        //     const seeking = art.currentTime + 10;
        //     art.seek = seeking;
        //   },
        // },
      ],
      plugins: [
        artplayerPluginHlsQuality({
          control: false,
          setting: true,
          getResolution: (level) => level.height + "P",
          title: "Quality",
          auto: "Auto",
        }),
      ],
      customType: {
        m3u8: function playM3u8(video, url, art) {
          if (Hls.isSupported()) {
            if (art.hls) art.hls.destroy();
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
            art.hls = hls;
            art.on("destroy", () => hls.destroy());
          } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = url;
          } else {
            art.notice.show = "Unsupported playback format: m3u8";
          }
        },
      },
    };

    const art = new Artplayer(option);
    setArtState(art);

    if (getInstance) {
      getInstance(art);
    }

    art.on("subtitleLoad", () => {
      art.notice.show = "Subtitle loaded.";
    });

    return () => {
      if (art && art.destroy) {
        art.destroy(false);
        setArtState(null);
      }
    };
  }, []);
  /* eslint-disable*/

  return (
    <div
      ref={artRef}
      className={cn("h-96 w-full md:h-[34rem]", className)}
    ></div>
  );
}

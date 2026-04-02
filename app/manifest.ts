import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "W8: stuck together",
    short_name: "W8",
    description:
      "Лёгкий дневник ожидания: одна активная сессия, короткая запись и несколько похожих ожиданий рядом.",
    start_url: "/",
    display: "standalone",
    background_color: "#fcf7f1",
    theme_color: "#fcf7f1",
    orientation: "portrait",
    lang: "ru-RU",
    categories: ["lifestyle", "social"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any"
      },
      {
        src: "/icon-maskable.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable"
      }
    ]
  };
}

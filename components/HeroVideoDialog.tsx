import { useEffect, useState } from "react";
import HeroVideoDialog from "./magicui/HeroVideoDialog";

export function HeroVideoDialogDemo() {
  const [videoSrc, setVideoSrc] = useState("");
  const [videoPreviewSrc, setVideoPreviewSrc] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://cms.flowautomate.io/api/homepage?populate[Hero_Section]=*",
        );
        const data = await response.json();

        const videoSrc = data?.data?.attributes?.Hero_Section?.Hero_Video_Link;
        const videoPreviewSrc =
          data?.data?.attributes?.Hero_Section?.Video_Preview_Link;

        if (videoSrc) {
          setVideoSrc(videoSrc);
        }
        if (videoPreviewSrc) {
          setVideoPreviewSrc(videoPreviewSrc);
        }
      } catch (error) {
        console.error("Error fetching video data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="relative mx-auto max-w-7xl">
      <HeroVideoDialog
        animationStyle="from-center"
        videoSrc={videoSrc}
        videoPreviewSrc={videoPreviewSrc}
        thumbnailAlt="Hero Video"
      />
    </div>
  );
}

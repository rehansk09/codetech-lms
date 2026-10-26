import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import api from "../../utils/api";

export const Room = () => {
  const { roomID: meetingId } = useParams();
  const containerRef = useRef(null);
  const zegoRef = useRef(null);
  const [error, setError] = useState("");
  const [joining, setJoining] = useState(true);

  useEffect(() => {
    let active = true;
    const join = async () => {
      try {
        const { data } = await api.get(`/api/meetings/${meetingId}/join`);
        if (!active || !containerRef.current) return;
        const zego = ZegoUIKitPrebuilt.create(data.kitToken);
        zegoRef.current = zego;
        zego.joinRoom({ container: containerRef.current, scenario: { mode: ZegoUIKitPrebuilt.OneONoneCall }, showScreenSharingButton: true });
      } catch (requestError) {
        if (active) setError(requestError.response?.data?.message || "Unable to join this meeting.");
      } finally { if (active) setJoining(false); }
    };
    join();
    return () => { active = false; zegoRef.current?.destroy(); };
  }, [meetingId]);

  if (error) return <main className="min-h-screen grid place-items-center p-6"><p className="text-red-600">{error}</p></main>;
  return <main className="min-h-screen">{joining && <p className="p-6">Joining secure meeting...</p>}<div ref={containerRef} className="h-screen w-full" /></main>;
};

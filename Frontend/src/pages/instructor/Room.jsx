import { useEffect, useRef, useState } from "react";
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

    const getDeviceErrorMessage = (deviceError) => {
      if (!window.isSecureContext) {
        return "Camera and microphone access requires HTTPS. Open the meeting from the secure site URL and try again.";
      }

      if (deviceError.name === "NotAllowedError" || deviceError.name === "SecurityError") {
        return "Camera and microphone access is blocked. Allow both permissions in your browser's site settings, then reload this page.";
      }

      if (deviceError.name === "NotFoundError" || deviceError.name === "DevicesNotFoundError") {
        return "No camera or microphone was found. Connect a device, then reload this page.";
      }

      if (deviceError.name === "NotReadableError" || deviceError.name === "TrackStartError") {
        return "Your camera or microphone is being used by another application. Close that application and reload this page.";
      }

      return "We could not access your camera or microphone. Check your device connection and browser permissions, then reload this page.";
    };

    const checkDevices = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Your browser does not support camera and microphone access. Use a current Chrome, Edge, Safari, or Firefox browser.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      stream.getTracks().forEach((track) => track.stop());
    };

    const join = async () => {
      try {
        await checkDevices();
        const { data } = await api.get(`/api/meetings/${meetingId}/join`);
        if (!active || !containerRef.current) return;
        const zego = ZegoUIKitPrebuilt.create(data.kitToken);
        zegoRef.current = zego;
        zego.joinRoom({
          container: containerRef.current,
          scenario: { mode: ZegoUIKitPrebuilt.OneONoneCall },
          showPreJoinView: true,
          showScreenSharingButton: true,
        });
      } catch (requestError) {
        if (!active) return;
        setError(
          requestError.response?.data?.message
            || (requestError.name === "NotAllowedError"
              || requestError.name === "SecurityError"
              || requestError.name === "NotFoundError"
              || requestError.name === "DevicesNotFoundError"
              || requestError.name === "NotReadableError"
              || requestError.name === "TrackStartError"
              ? getDeviceErrorMessage(requestError)
              : requestError.message)
            || "Unable to join this meeting.",
        );
      } finally { if (active) setJoining(false); }
    };
    join();
    return () => { active = false; zegoRef.current?.destroy(); };
  }, [meetingId]);

  if (error) return <main className="min-h-screen grid place-items-center p-6"><p className="text-red-600">{error}</p></main>;
  return <main className="min-h-screen">{joining && <p className="p-6">Joining secure meeting...</p>}<div ref={containerRef} className="h-screen w-full" /></main>;
};

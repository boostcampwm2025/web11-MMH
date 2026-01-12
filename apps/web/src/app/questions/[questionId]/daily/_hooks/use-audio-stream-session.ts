import createAudioStreamer, { AudioStreamerHandle } from "@/lib/audio-streamer";
import * as React from "react";
import {
  AUDIO_CONFIG,
  WAVEFORM_CONFIG,
} from "../_constants/audio-config-constant";
import useSocket from "@/hooks/use-socket";
import {
  finalizeAudioSession,
  startAudioSession,
} from "../_lib/audio-session-api";

function useAudioStreamSession() {
  const [isRecording, setIsRecording] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [sessionId, setSessionId] = React.useState<string | null>(null);

  const streamerRef = React.useRef<AudioStreamerHandle | null>(null);
  const lastUpdateTimeRef = React.useRef<number>(0);
  const historyRef = React.useRef<number[]>([]);
  const seqRef = React.useRef(0);

  const { socketRef } = useSocket();

  // AudioStreamer 초기화 (한 번만 실행)
  React.useEffect(() => {
    const streamer = createAudioStreamer({
      sampleRate: AUDIO_CONFIG.sampleRate,
      channels: AUDIO_CONFIG.channels,
      bitsPerSample: AUDIO_CONFIG.bitsPerSample,
    });

    streamerRef.current = streamer;

    return () => {
      streamer.stop();
      streamerRef.current = null;
    };
  }, []);

  // sessionId 변경 시 onAudioChunk 콜백 업데이트
  React.useEffect(() => {
    if (!streamerRef.current) return;

    streamerRef.current.setOnAudioChunk(({ wave, buffer }) => {
      // Socket.io를 통해 오디오 청크 전송
      if (socketRef.current && sessionId) {
        const bytes = Buffer.from(buffer);
        const seq = seqRef.current++;

        socketRef.current.emit("audio.chunk", {
          sessionId,
          seq,
          bytes,
        });
      }

      const now = Date.now();

      // 일정 간격이 지나지 않았으면 스킵
      if (now - lastUpdateTimeRef.current < WAVEFORM_CONFIG.updateIntervalMs) {
        return;
      }

      lastUpdateTimeRef.current = now;

      // RMS(Root Mean Square) 값 계산
      let sum = 0;
      for (let i = 0; i < wave.length; i++) {
        sum += wave[i] * wave[i];
      }
      const rms = Math.sqrt(sum / wave.length);
      historyRef.current.push(rms);

      if (historyRef.current.length > WAVEFORM_CONFIG.maxBars) {
        historyRef.current.shift();
      }
    });
  }, [socketRef, sessionId]);

  const startRecording = React.useCallback(async () => {
    if (!socketRef.current) {
      console.warn("Socket is not connected");
      return;
    }

    try {
      setIsLoading(true);
      // 1. 세션 시작
      const { sessionId: newSessionId } = await startAudioSession({
        codec: AUDIO_CONFIG.codec,
        sampleRate: AUDIO_CONFIG.sampleRate,
        channels: AUDIO_CONFIG.channels,
      });

      seqRef.current = 0;

      // 2. 오디오 스트리머 시작
      socketRef.current.connect();
      await streamerRef.current?.start();

      setIsLoading(false);
      setSessionId(newSessionId);
      setIsRecording(true);
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  }, [socketRef]);

  const stopRecording = React.useCallback(async () => {
    await streamerRef.current?.stop();

    if (!sessionId) {
      return;
    }

    try {
      setIsRecording(false);
      setIsLoading(true);

      // 세션 종료
      await finalizeAudioSession({
        sessionId,
      });

      setIsLoading(false);

      socketRef.current?.disconnect();
    } catch (error) {
      console.error("Failed to stop recording:", error);
    }
  }, [socketRef, sessionId]);

  // 다시 시도 핸들러
  const retryRecording = React.useCallback(() => {
    setSessionId(null);
    historyRef.current = [];
    startRecording();
  }, [startRecording]);

  return {
    socketRef,
    streamerRef,
    historyRef,

    sessionId,

    isLoading,
    isRecording,

    startRecording,
    stopRecording,
    retryRecording,
  };
}

export default useAudioStreamSession;

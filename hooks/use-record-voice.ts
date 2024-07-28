import { useEffect, useState, useRef } from 'react';
import { blobToBase64 } from '@/utils/blobToBase64';

export const useRecordVoice = (botId: string) => {
  const [text, setText] = useState('');
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [recording, setRecording] = useState(false);
  const isRecording = useRef(false);
  const chunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    if (!mediaRecorder) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true
        });
        const mediaRecorderInstance = new MediaRecorder(stream, {
          mimeType: 'audio/webm' // Use 'audio/webm' for better quality
        });

        mediaRecorderInstance.onstart = () => {
          chunks.current = [];
        };

        mediaRecorderInstance.ondataavailable = (ev: BlobEvent) => {
          chunks.current.push(ev.data);
        };

        mediaRecorderInstance.onstop = async () => {
          const audioBlob = new Blob(chunks.current, { type: 'audio/webm' });
          try {
            const base64data = await blobToBase64(audioBlob);
            getText(base64data);
          } catch (error) {
            console.error('Error converting blob to base64:', error);
          }
        };

        setMediaRecorder(mediaRecorderInstance);
        isRecording.current = true;
        mediaRecorderInstance.start();
        setRecording(true);
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    } else {
      isRecording.current = true;
      mediaRecorder.start();
      setRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      isRecording.current = false;
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const getText = async (base64data: string) => {
    try {
      const response = await fetch(`/api/chatbot/${botId}/transcribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ audio: base64data })
      }).then((res) => res.json());
      const { transcription } = response;
      setText(transcription);
    } catch (error) {
      console.error('Error transcribing audio:', error);
    }
  };

  return { recording, startRecording, stopRecording, text };
};

'use client';

import {
  ChangeEvent,
  ChangeEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Observable, from, map } from 'rxjs';

import { ajax } from 'rxjs/ajax';

const audioCtx = new AudioContext();
const analyser = audioCtx.createAnalyser();
analyser.fftSize = 2048;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
// analyser.connect(distortion);
// distortion.connect(audioCtx.destination);

export const Recorder: React.FC = () => {
  const [data, setData] = useState(0);

  const onStartRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
    });
  };

  const onStopRecording = () => {
    analyser.getByteFrequencyData(dataArray);
    new Blob().arrayBuffer;
    console.log(dataArray);
    // console.log(streamRef.current);
  };

  // useEffect(() => {
  //   if (mediaRecorder) {
  //     mediaRecorder.ondataavailable = (e) => {
  //       console.log(e);
  //       setData(e.data.size);
  //     };
  //   }
  // }, [mediaRecorder]);

  return (
    <div>
      <div>data: {data}</div>
      <button onClick={onStartRecording}>Start Recording</button>
      <button onClick={onStopRecording}>Stop Recording</button>
    </div>
  );
};

import { createContext } from "preact";
import { useContext, useState, useRef, useEffect } from "preact/hooks";
import type { ComponentChildren } from "preact";
import * as tmPose from "@teachablemachine/pose";

interface Prediction {
  className: string;
  probability: number;
}

export const CANVAS_WIDTH = 500;
export const CANVAS_HEIGHT = 500;

interface TeachableContextType {
  predictions: Prediction[];
  loading: boolean;
  canvasRef: preact.RefObject<HTMLCanvasElement>;
  cameraBlocked: boolean;
}

const TeachableContext = createContext<TeachableContextType | null>(null);

const TEACHABLE_MODEL_URL = import.meta.env.VITE_TEACHABLE_MODEL_URL as string;
const MODEL_URL = `${TEACHABLE_MODEL_URL}model.json`;
const METADATA_URL = `${TEACHABLE_MODEL_URL}metadata.json`;

export const TeachableProvider = ({
  children,
}: {
  children: ComponentChildren;
}) => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [cameraBlocked, setCameraBlocked] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const webcamRef = useRef<tmPose.Webcam | null>(null);

  const loop = async (model: tmPose.CustomPoseNet, webcam: tmPose.Webcam) => {
    webcam.update();

    const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
    const results = await model.predict(posenetOutput);
    setPredictions(results);

    const ctx = canvasRef.current?.getContext("2d");
    if (ctx && pose) {
      ctx.drawImage(webcam.canvas, 0, 0);
      tmPose.drawKeypoints(pose.keypoints, 0.5, ctx);
      tmPose.drawSkeleton(pose.keypoints, 0.5, ctx);
    }

    requestAnimationFrame(() => loop(model, webcam));
  };

  const init = async () => {
    try {
      const permission = await navigator.permissions.query({
        name: "camera" as PermissionName,
      });

      if (permission.state === "denied") {
        setLoading(false);
        setCameraBlocked(true);
        return;
      }

      const model = await tmPose.load(MODEL_URL, METADATA_URL);

      const webcam = new tmPose.Webcam(CANVAS_WIDTH, CANVAS_HEIGHT, true);
      await webcam.setup();
      await webcam.play();
      webcamRef.current = webcam;

      if (canvasRef.current) {
        canvasRef.current.width = CANVAS_WIDTH;
        canvasRef.current.height = CANVAS_HEIGHT;
      }

      setLoading(false);

      loop(model, webcam);
    } catch (error) {
      console.log("Error initializing webcam or model", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    init();
    return () => webcamRef.current?.stop();
  }, []);

  return (
    <TeachableContext.Provider
      value={{ predictions, loading, canvasRef, cameraBlocked }}
    >
      {children}
    </TeachableContext.Provider>
  );
};

export const useTeachable = () => {
  const ctx = useContext(TeachableContext);
  if (!ctx)
    throw new Error("useTeachable must be used within TeachableProvider");
  return ctx;
};

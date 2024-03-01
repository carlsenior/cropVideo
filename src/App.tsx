import VideoController from "./code/VideoController";
import "./styles.css";
import { KonvaProvider } from "./code/store/KonvaProvider";

export default function App() {
  return (
    <KonvaProvider>
      <div className="App">
        <VideoController />
      </div>
    </KonvaProvider>
  );
}

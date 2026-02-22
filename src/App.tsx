import { useFont } from "@react-three/drei";
import Experience from "./components/Experience";
import { Canvas } from '@react-three/fiber';
import Button from "./components/Button";
import { useState } from "react";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

function App() {
  const [currentPage, setCurrentPage] = useState("intro");

  return (
    <>
      <Button currentPage={currentPage} setCurrentPage={setCurrentPage}/>
      <Canvas shadows camera={{ position: [5, 2, 20], fov: 42 }}>
        <color attach={"background"} args={["#171720"]} />
        
        <Experience currentPage={currentPage} setCurrentPage={setCurrentPage}/>
        <EffectComposer >
          <Bloom mipmapBlur intensity={1.2} />
        </EffectComposer>
      </Canvas>
    </>
  )

}

export default App;

useFont.preload("./fonts/Roboto-Black.ttf");
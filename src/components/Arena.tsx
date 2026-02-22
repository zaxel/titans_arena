import * as THREE from 'three';

const Arena = ({ scene }: { scene: THREE.Group }) => {
    return <primitive object={scene} />;
};

export default Arena;

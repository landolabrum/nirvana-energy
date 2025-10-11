// // Relative Path: ./ThreeSun.tsx
// import React, { useEffect, useRef } from 'react';
// import * as THREE from 'three';
// import styles from './ThreeSun.scss';

// const ThreeSun: React.FC = () => {
//   const mountRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     // 1. Setup Scene
//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//     const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     mountRef.current?.appendChild(renderer.domElement);

//     // 2. Create Lava Texture
//     const createLavaTexture = () => {
//       const canvas = document.createElement('canvas');
//       canvas.width = 1024;
//       canvas.height = 1024;
//       const ctx = canvas.getContext('2d')!;
      
//       // Base gradient
//       const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
//       gradient.addColorStop(0, '#ff3a00');
//       gradient.addColorStop(0.2, '#ffffff');
//       gradient.addColorStop(0.5, '#ff9900');
//       gradient.addColorStop(0.8, '#ff5500');
//       gradient.addColorStop(1, '#000000');
      
//       ctx.fillStyle = gradient;
//       ctx.fillRect(0, 0, canvas.width, canvas.height);
      
//       // Add turbulent details
//       const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//       const data = imageData.data;
      
//       for (let i = 0; i < data.length; i += 4) {
//         const turbulence = Math.random() * .5;
//         data[i] = Math.min(255, data[i] + turbulence);     // R
//         data[i + 1] = Math.min(255, data[i + 1] + turbulence * 0.6); // G
//         data[i + 2] = Math.max(50, data[i + 2] - turbulence * 0.3);  // B
//       }
      
//       ctx.putImageData(imageData, 0, 0);
      
//       const texture = new THREE.CanvasTexture(canvas);
//       texture.wrapS = THREE.RepeatWrapping;
//       texture.wrapT = THREE.RepeatWrapping;
//       return texture;
//     };

//     const lavaTexture = createLavaTexture();
//     const bumpTexture = lavaTexture.clone();

//     // 3. Create Sun Sphere
//     const geometry = new THREE.SphereGeometry(15, 128, 128);
//     const material = new THREE.MeshStandardMaterial({
//       map: lavaTexture,
//       bumpMap: bumpTexture,
//       bumpScale: 0.8,
//       emissive: 0xff5500,
//       emissiveIntensity: 1.5,
//       roughness: 0.4,
//       metalness: 0.2
//     });

//     const sphere = new THREE.Mesh(geometry, material);
//     scene.add(sphere);

//     // 4. Lighting Setup
//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
//     scene.add(ambientLight);

//     const pointLight1 = new THREE.PointLight(0xff6600, 2, 100);
//     pointLight1.position.set(30, 30, 30);
//     scene.add(pointLight1);

//     const pointLight2 = new THREE.PointLight(0xff9900, 1.5, 100);
//     pointLight2.position.set(-30, -30, -30);
//     scene.add(pointLight2);

//     camera.position.z = 50;

//     // 5. Animation Loop
//     const clock = new THREE.Clock();
//     const animate = () => {
//       requestAnimationFrame(animate);
//       const elapsedTime = clock.getElapsedTime();

//       // Left-to-right rotation
//       sphere.rotation.y = -elapsedTime * 0.3; // Negative for left-to-right

//       // Animate lava texture
//       material.map.offset.x = elapsedTime * 0.1;
//       material.bumpMap.offset.x = elapsedTime * 0.08;
//       material.map.offset.y = Math.sin(elapsedTime * 0.2) * 0.1;
//       material.bumpMap.offset.y = Math.cos(elapsedTime * 0.15) * 0.1;

//       renderer.render(scene, camera);
//     };

//     animate();

//     // Handle resize
//     const handleResize = () => {
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(window.innerWidth, window.innerHeight);
//     };

//     window.addEventListener('resize', handleResize);

//     return () => {
//       window.removeEventListener('resize', handleResize);
//       mountRef.current?.removeChild(renderer.domElement);
//     };
//   }, []);

//   return (
//     <>
//       <div ref={mountRef} className={styles.sunContainer} />
//       <style jsx>{styles}</style>
//     </>
//   );
// };

// export default ThreeSun;
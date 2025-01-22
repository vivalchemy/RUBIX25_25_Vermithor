import React, { useEffect } from 'react';

const ARScene = () => {
  useEffect(() => {
    // Ensure scripts are loaded once
    if (!document.querySelector("script[src='https://aframe.io/releases/0.8.2/aframe.min.js']")) {
      const aframeScript = document.createElement('script');
      aframeScript.src = 'https://aframe.io/releases/0.8.2/aframe.min.js';
      aframeScript.async = true;
      document.head.appendChild(aframeScript);
    }

    if (!document.querySelector("script[src='https://cdn.jsdelivr.net/gh/jeromeetienne/ar.js/aframe/build/aframe-ar.min.js']")) {
      const arjsScript = document.createElement('script');
      arjsScript.src = 'https://cdn.jsdelivr.net/gh/jeromeetienne/ar.js/aframe/build/aframe-ar.min.js';
      arjsScript.async = true;
      document.head.appendChild(arjsScript);
    }
  }, []);

  return (
    <a-scene embedded arjs>
      <a-marker preset="hiro">
        <a-box position="0 0.5 0" material="color: red;">
          <a-animation
            attribute="rotation"
            dur="3000"
            to="360 360 0"
            easing="linear"
            repeat="indefinite"
          ></a-animation>
        </a-box>
      </a-marker>
      <a-entity camera></a-entity>
    </a-scene>
  );
};

export default ARScene;

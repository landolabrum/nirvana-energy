import React, { useEffect, useState } from "react";

const GUACAMOLE_URL = "https://remote.tiktok.soy"; // Adjust as needed

const RemoteAccessViewer: React.FC = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Optionally check if the remote service is available
    fetch(GUACAMOLE_URL, { method: "HEAD" })
      .then(() => setIsReady(true))
      .catch(() => setIsReady(false));
  }, []);

  return (
    <div className="w-full h-[80vh] rounded-lg shadow-md border overflow-hidden bg-black">
      {isReady ? (
        <iframe
          src={GUACAMOLE_URL}
          className="w-full h-full"
          allow="clipboard-read; clipboard-write"
          allowFullScreen
          sandbox="allow-same-origin allow-scripts allow-forms allow-modals allow-popups"
        />
      ) : (
        <div className="text-white flex items-center justify-center h-full text-lg">
          Connecting to remote desktop...
        </div>
      )}
    </div>
  );
};

export default RemoteAccessViewer;

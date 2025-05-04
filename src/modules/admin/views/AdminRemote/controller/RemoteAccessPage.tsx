import React from "react";
import RemoteAccessViewer from "../views/RemoteAccessViewer";

const RemoteAccessPage: React.FC = () => {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Remote Computer Viewer</h1>
      <RemoteAccessViewer />
    </div>
  );
};

export default RemoteAccessPage;

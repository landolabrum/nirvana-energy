// Relative Path: ./Social.tsx
import React from 'react';
import styles from './Social.scss';
import Twitch from '../views/twitch/controller/Twitch';
import { useUser } from '~/src/core/authentication/hooks/useUser';

// Remember to create a sibling SCSS file with the same name as this component

const Social: React.FC = () => {
  const user = useUser();
  return (
    <>
      <style jsx>{styles}</style>
      <div className='social'>
  // Social.tsx (or wherever you render it)
<Twitch user={user ?? {}} />

      </div>
    </>
  );
};

export default Social;

// // Relative Path: ./Social.tsx
// import React, { useMemo } from "react";
// import styles from "./Social.scss";
// import UiLoader from "@webstack/components/UiLoader/view/UiLoader";
// import Instagram from "../views/instagram/controller/Instagram";
// import { useRouter } from "next/router";
// import capitalize from "@webstack/helpers/Capitalize";
// import { useUser } from "~/src/core/authentication/hooks/useUser";

// type SocialProps = {
//   platform?: string; // e.g., "instagram"
//   user?: any;
//   title?: string;
// };

// const DefaultSocial: React.FC<{ user?: any }> = ({ user }) => (
//   <div className="defaultWrap">
//     <div className="title">
//       {user?.name
//         ? `${capitalize(user.name)}, Social Automation.`
//         : "Social Automation"}
//     </div>
//     <div className="subtitle">Choose a platform to get started.</div>
//   </div>
// );

// const Social: React.FC<SocialProps> = ({ platform, user: user, title }) => {
//   const router = useRouter();
//   const routePlatform = router?.query?.platform;
//   const qp = Array.isArray(routePlatform) ? routePlatform[0] : routePlatform;
//   // Fallback order: prop → query param → undefined
//   const resolvedPlatform = (platform || qp || "")
//     .toString()
//     .trim()
//     .toLowerCase() || undefined;

//   const pageTitle = useMemo(
//     () =>
//       title ??
//       (resolvedPlatform ? `Social · ${capitalize(resolvedPlatform)}` : "Social"),
//     [title, resolvedPlatform]
//   );

//   if (!user) return <UiLoader />;

//   let view: React.ReactNode;
//   switch (resolvedPlatform) {
//     case "instagram":
//       view = <Instagram user={user} />;
//       break;
//     default:
//       view = <DefaultSocial user={user} />;
//       break;
//   }

//   return (
//     <>
//       <style jsx>{styles}</style>
//       <div className="social" data-title={pageTitle}>
//         {/* {view}
//          */}
         
// {/* <Instagram user={user} /> */}
//       </div>
//     </>
//   );
// };

// export default Social;

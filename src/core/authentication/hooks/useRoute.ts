import { useEffect, useState } from "react";
import { useUser } from "./useUser";
import UserContext from "~/src/models/UserContext";
import { useRouter } from "next/router";
import { useHeader } from "@webstack/components/Header/controller/Header";
import { IRoute } from "@shared/components/Navbar/data/routes";
import environment from "~/src/environment";

const AUTHED_LANDING = "/account";
const UNAUTHED_LANDING = "/"
const VERIFICATION_LANDING = '/verify'
const LOGOUT_LANDING = '/authentication/[function]';
// useRoute component handles the paths users are allowed and not allowed to navigate

export default function useRoute(handleSideNav?: () => void) {
  const userResponse = useUser();
  const [user, setUser] = useState<UserContext | null>(null);
  const [header, setHeader] = useHeader();
  // const userAgentData = useUserAgent();
  const router = useRouter();

  const handleRoute =
    (option: IRoute) => {
      if (
        option.items ||
        option.active === false
      ) return;
      else if(option.href )router.push(option.href, undefined, { shallow: false });
      handleSideNav && handleSideNav();
    }

  const current = router.pathname.substring(1);
  const isCurrent = current == header?.title;
  const handleHeader: any = () => {
    let context: any = {
      title: isCurrent ? environment.merchant.name : current == '' ? environment.merchant.name : current,
      breadcrumbs: [{ label: isCurrent ? environment.merchant.name : current }]
    }
    setHeader(context);
  }

  const handleUser = async () => {
    if (userResponse) {
      // console.log("[ RT2 ]", user);
      userResponse && setUser(userResponse);
      [UNAUTHED_LANDING, "/", VERIFICATION_LANDING].includes(router.pathname) && handleRoute({ href: AUTHED_LANDING });
    }
    else if (!userResponse && ![VERIFICATION_LANDING, UNAUTHED_LANDING].includes(router.pathname)) {
      setUser(null);
      setHeader(null);
      if (router.pathname.includes(LOGOUT_LANDING)) {
        // SIGN OUT
        router.push('/');
      } else if (!router.pathname.includes(VERIFICATION_LANDING)) {
        // handleRoute({href:UNAUTHED_LANDING});
        // console.log("[ RT ]",);
      }
    } else {
      // console.log('[ FAIl ]');
      return;
    }
  }

  useEffect(() => {
    handleUser().then(handleHeader);
  }, [userResponse, router.pathname]);

  if (typeof user !== "string" && handleSideNav)
    return [user, router.pathname, handleRoute];
  return [];
}

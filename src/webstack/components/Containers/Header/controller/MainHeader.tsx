import React, { useState, useEffect, useContext, createContext, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import Navbar from "@shared/components/Navbar/controller/Navbar";
import styles from "./MainHeader.scss";
import useWindow from "@webstack/hooks/window/useWindow";
import environment from "~/src/core/environment";
import { UiIcon } from "@webstack/components/UiIcon/controller/UiIcon";
import { debounce, head } from "lodash";
import keyStringConverter from "@webstack/helpers/keyStringConverter";
import useRoute from "~/src/core/authentication/hooks/useRoute";
import UiHeader from "../views/UiHeader/UiHeader";


export type HeaderProps = {
  title?: string;
  right?: React.ReactElement | React.ReactFragment | string;
  subheader?: React.ReactElement | React.ReactFragment | string;
  onClick?: (e: any) => void;
} | null

const HeaderContext = createContext<[HeaderProps | null, (header: HeaderProps) => any]>([
  null,
  () => { },
]);
export const useHeader = () => useContext(HeaderContext);
const merchantName = environment.merchant.name;
export const HeaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname: pathname } = useRouter();
  const [headerState, setHeaderState] = useState<HeaderProps | null>(null);
  const pathBase = pathname.replaceAll("/", '');
  const pathClass = pathBase?.length && pathBase.replaceAll("/", '') || 'index';
  return (
    <>
      <style jsx>{styles}</style>
      <HeaderContext.Provider value={[headerState, setHeaderState]}>
        <div id="header-container" className={`header__container ${merchantName}--${pathClass}`}
        >
          <Navbar />
          {/* <Header /> */}
        </div>
        {children}
      </HeaderContext.Provider>
    </>
  );
};
const Header: React.FC = () => {
  const merchantName = environment.merchant.name;
  const [context, setContext] = useContext(HeaderContext);
  const [headerState, setHeaderState] = useState<HeaderProps | null>(null);
  const [route, setRoute] = useState<string | null>(null);
  const router = useRouter();
  const { selectedUser, pathname, explicitRouter, routeTitle } = useRoute();
  const [show, setShow] = useState(false);
  const width = useWindow()?.width;
  const debounceShow = useCallback(
    debounce(() => {
      setShow(show ? false : true)
    }, 1000),
    [setShow]
  );

  const titleRef = useRef<any>();

  const handleHeaderState = () => {
    const currentRoute = context !== null ? context : { title: keyStringConverter(`${merchantName}`, { dashed: false }) }

    setHeaderState(routeTitle && { title: routeTitle } || currentRoute);
    setRoute(router.asPath);
  }
  const handleTitleSize = () => {
    if (!titleRef?.current || !merchantName || width > 1100) return;

    const headerTitleWidth = titleRef.current.offsetWidth;
    const titleLength = headerState?.title && headerState?.title.length + 2 || false;
    if (!titleLength) return;


    const nfz = headerTitleWidth / titleLength;
    const ratio = 1 / 5;
    let fontNum = Number((nfz * Number(1 - ratio)).toFixed(2));
    if (fontNum > 50) fontNum = 50;
    const fontSize = `${fontNum}px`;
    const spacingDim = Number((nfz * ratio).toFixed(2))
    const spacing = `${spacingDim}px`;
    const headTitleEl = titleRef?.current;
    headTitleEl.style.fontSize = fontSize;
    headTitleEl.style.letterSpacing = spacing;
    headTitleEl.style.gap = `${spacingDim * .88}px`;
    const brandLogo: HTMLElement = headTitleEl.children[0];
    if (brandLogo) brandLogo.style.minWidth = fontSize;
  };

  useEffect(() => {
    handleTitleSize();
  }, [width]);

  useEffect(() => {
    handleHeaderState();
    if (router.asPath !== route) {
      setContext(null);
      setRoute(router.asPath);
    }
  }, []);
  return (
    <>
      <style jsx>{styles}</style>
      <>
        <div
          onClick={debounceShow}
          onMouseLeave={() => setShow(false)}
          className={`header ${merchantName}`}
        >
          <div className={`header-content ${show ? ' header-content__show' : ""}`}>
            <div className="header-left">
              <UiHeader 
                title={headerState?.title}
                subTitle={headerState?.title}
              />
            </div>
            {headerState?.right && (
              <div className="header-right">{headerState?.right}</div>
            )}
          </div>
          {headerState?.subheader && (
            <div className="subheader">
              <div className="subheader-content">{headerState?.subheader}</div>
            </div>
          )}
        </div>
      </>
      {/* } */}
    </>
  );
};

export default Header;
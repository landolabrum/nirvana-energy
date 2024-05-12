import { useEffect, useState } from "react";
import LoginView from "../views/Login/views/LoginView/LoginView";
import styles from "./Authentication.scss";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import SignUp from "../views/SignUp/SignUp";
import keyStringConverter from "@webstack/helpers/keyStringConverter";
import { useRouter } from "next/router";
import UiButton from "@webstack/components/UiButton/UiButton";
import Link from "next/link";
import environment from "~/src/environment";
import { useModal } from "@webstack/components/modal/contexts/modalContext";
import { useNotification } from "@webstack/components/Notification/Notification";



const Authentication: React.FC<any> = (props: any) => {
  const [newCustomerEmail, setNewCustomerEmail] = useState<string | undefined>();
  const [view, setView] = useState<string>(props?.view || "sign-in");
  const [hover, setHover] = useState<boolean>(false);
  const router = useRouter();
  const query = router.query;
  const { openModal, closeModal } = useModal();

  const handleView = () => {
    switch (view) {
      case "sign-in":
        setView("sign-up")
        break;
      case "sign-up":
        setView("sign-in")
        break;
      case "customer-created":
        setView("sign-in")
        break;
      case "existing":
        setView("sign-in")
        break;
      default:
        setView("sign-up")
    }
  }
  const handleSignup = (response: any) => {
    const status = response?.status;
    if (!status) {
      alert("lando, handle this! 212");
      return;
    }

    let label = "404, an error occured signing up. "
    switch (status) {
      case 'created':
        label = `email: ${response?.email}, successfully created.`
        break;
      case 'existing':
        label = `email: ${response?.email}, exists.`
        break;

      default:
        break;
    }
    setNotification({ active: true, list: [{ 'label': label, message:"Sign in to continue." }] });

    setView('sign-in');
    setNewCustomerEmail(response.email)
  }
  const handleSignIn = (user: any) => {
    if (user?.id) {
      const WelcomeModalContent = ({ user, onProfileClick, onClose }: any) => (
        <>      <style jsx>{styles}</style>
          <div className='authentication__welcome-modal'>
            <h1>Welcome, {user.name}</h1>
            <UiButton onClick={onProfileClick}>Go to account</UiButton>
            <UiButton onClick={onClose}>Close</UiButton>
          </div>
        </>
      );

      // Usage within a component
      openModal({
        title: 'User Details',
        children: <WelcomeModalContent user={user} onProfileClick={() => router.push('/profile')} onClose={closeModal} />
      });
    }
    console.log('[handleSignIn]:', user);
  };

  const [notif, setNotification] = useNotification();
  useEffect(() => {

    if (query && query.verify) {
      setView('verify');
      console.log('[router]', router)
    }

    if (newCustomerEmail != undefined) setView("sign-in");
  }, [handleSignup, handleSignIn, setView])

  return (
    <>
      <style jsx>{styles}</style>
      <div className={`authentication ${view == 'sign-in' ? ' authentication__sign-in' : ''}`}>
        <div className='authentication__view-header'>
          <div className="authentication__logo">
            <UiIcon icon={`${environment.merchant.name}-logo`} />
          </div>
          <div className='authentication__view-name'>
            {keyStringConverter(view)}
          </div>
        </div>
        {view.includes("@") && <div className='authentication__email-verify'>
          An email has been sent to
          <Link onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={hover ? { color: 'var(--primary' } : undefined} href={`mailto://${view}`}>{' ' + view + ', '}</Link> click the link in the email to continue.
        </div>}
        {view == 'sign-in' && <LoginView email={newCustomerEmail} onSuccess={handleSignIn} />}
        {view == 'sign-up' && <SignUp onSuccess={handleSignup} />}
        <div className="authentication__view-action">
          <div className="authentication__view-label">
            {view == 'sign-in' && "no account?"}
            {view == 'sign-up' && "already have an account?"}
          </div>

          <UiButton
            onClick={handleView}
            variant="link"
          >
            {view == 'sign-in' && "Sign Up"}
            {view == 'sign-up' && "Login"}
          </UiButton>
        </div>
      </div>
    </>
  );
};

export default Authentication;
import SocialService from "~/src/core/services/SocialService/SocialService";
import { useUser } from "~/src/core/authentication/hooks/useUser";
import UiForm from "@webstack/components/UiForm/controller/UiForm";
import type { IFormField } from "@webstack/components/UiForm/models/IFormModel";
import { useModal } from "@webstack/components/Containers/modal/contexts/modalContext";
import { useNotification } from "@webstack/components/Notification/Notification";
import { useMemo } from "react";
import UiButton from "@webstack/components/UiForm/views/UiButton/UiButton";

function ConnectInstagramButton() {
  const { openModal, closeModal } = useModal();
  const [, setNotif] = useNotification();
  const user = useUser();
  const social = useMemo(() => new SocialService(), []);

  // derive stripe_id strictly from the signed-in user
  const stripeId =
    (user as any)?.metadata?.user?.stripeId ||
    (user as any)?.id ||
    (user as any)?.user?.id || "";

  const notify = (label: string, message: string, variant?: "danger" | "info" | "success") =>
    setNotif?.({
      active: true, dismissable: true, persistence: 2000, list: [{ label, message }],
      ...(variant === "danger" ? { transparent: false } : {}),
    });

  const openIgAuth = () => {
    const fields: IFormField[] = [
      { name: "email",    label: "Instagram Email",    type: "text", value: "" , required: true },
      { name: "username", label: "Instagram Username", type: "text", value: "" , required: true },
      { name: "password", label: "Instagram Password", type: "text", value: "", required: true, traits: { type: "password" } },
    ];

    openModal({
      title: "Connect Instagram",
      variant: "popup",
      dismissable: true,
      children: (
        <UiForm
          variant="popup"
          fields={fields}
          submitText="Authenticate"
          onSubmit={async (fs) => {
            if (!stripeId) {
              notify("Not signed in", "Missing stripe_id for this user.", "danger");
              return;
            }
            const v = (name: string) => String(fs.find((f: IFormField) => f.name === name)?.value ?? "").trim();
            const email = v("email");
            const username = v("username");
            const password = v("password");
            if (!email || !username || !password) {
              notify("Missing info", "Email, username, and password are required.", "danger");
              return;
            }
            try {
              const res = await social.instagramAuthenticate({ email, username, ig_password: password, stripe_id: String(stripeId) });
              if (res?.status === "ok") {
                notify("Instagram connected", `Saved session for @${username}.`, "success");
                closeModal();
              // } else if (res?.status === "challenge") {

                            } else if (res?.status === "error") {

                notify("Instagram challenge", "Verification required. Check your email/SMS/app.", "info");
                // optionally open a "Enter Code" modal here and call /instagram/challenge
              } else {
                const msg = res?.data?.[0]?.error || "Authentication failed.";
                notify("Instagram auth", msg, "danger");
              }
            } catch (e: any) {
              notify("Instagram auth", e?.message || "Authentication error.", "danger");
            }
          }}
        />
      ),
    });
  };

  return (
    <UiButton onClick={openIgAuth}>
      <i className="fa-brands fa-instagram mr-2" />
      Connect Instagram
    </UiButton>
  );
}

export default ConnectInstagramButton;

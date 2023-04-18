import { useRouter } from "next/router";
import Link from "next/link";
import { Icon, Message, Divider } from "semantic-ui-react";

export const HeaderMessage = () => {
  const router = useRouter();

  const signUpRoute = router.pathname === "signup";

  return (
    <Message
      color="teal"
      attached
      header={signUpRoute ? "Get Started" : "Welcome Back"}
      icon={signUpRoute ? "settings" : "privacy"}
      content={
        signUpRoute ? "Create new account" : "Login with email and password"
      }
    />
  );
};

export const FooterMessage = () => {
  const router = useRouter();

  const signUpRoute = router.pathname === "signup";

  return (
    <>
      {signUpRoute ? (
        <>
          <Message attached="bottom" warning>
            <Icon name="help" />
            Existing User ? <Link href="/login">Login Here Instead</Link>
          </Message>
          <Divider hidden />
        </>
      ) : (
        <>
          <Message attached="bottom" info>
            <Icon name="lock" />
            Existing User ?<Link href="/reset">Forgot password?</Link>
          </Message>

          <Message attached="bottom" warning>
            <Icon name="help" />
            New User ?<Link href="/signup">Signup Here</Link>
          </Message>
        </>
      )}
    </>
  );
};

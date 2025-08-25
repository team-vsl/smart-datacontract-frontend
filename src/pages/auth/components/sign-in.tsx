import {
  Alert,
  Form,
  Link,
  SpaceBetween,
  Button,
  Container,
  Header,
  FormField,
  Input,
  Checkbox,
} from "@cloudscape-design/components";

// Import hooks
import {useAuth} from "@/hooks/use-auth";
import {useStateManager} from "@/hooks/use-state-manager";

// Import states
import {SignInFormStateManager} from "./state";

// Import types
import type {FormEvent} from "react";

export default function SignIn() {
  const [state, stateFns] = useStateManager(
    SignInFormStateManager.getInitialState(),
    SignInFormStateManager.buildStateModifiers
  );

  const {signInMutation} = useAuth();

  const handleSubmitForm = function (e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    let username = form["username"].value;
    let password = form["password"].value;

    signInMutation.mutate({
      username,
      password,
    });
  };

  return (
    <div className="w-full h-[100dvh] flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-[640px]">
        <Alert className="mb-3" statusIconAriaLabel="Info" header="About">
          Chào mừng bạn đến với trang demo của giải pháp cho Challenge #23 của
          VP Hackathon, được phát triển bởi team VSL, thông tin thêm tại:{" "}
          <Link href="https://github.com/team-vsl" target="_blank">
            https://github.com/team-vsl
          </Link>
        </Alert>

        <form className="w-full" onSubmit={handleSubmitForm}>
          <Form
            actions={
              <SpaceBetween direction="horizontal" size="m">
                <Button disabled={signInMutation.isPending} variant="primary">
                  Sign in
                </Button>
              </SpaceBetween>
            }
            errorText={
              signInMutation.error && (signInMutation.error as any)?.response.data.error.message
            }
          >
            <Container
              header={<Header variant="h2">Sign In</Header>}
              media={{
                content: <img src="/vite.png" alt="placeholder" />,
                position: "side",
                width: "40%",
              }}
            >
              <SpaceBetween className="mb-3" direction="vertical" size="l">
                <FormField label="Username">
                  <Input
                    disabled={signInMutation.isPending}
                    name="username"
                    value={state.username || ""}
                    onChange={(e) => stateFns.setUsername(e.detail.value)}
                  />
                </FormField>
                <FormField label="Password">
                  <Input
                    disabled={signInMutation.isPending}
                    className="w-full mb-3"
                    name="password"
                    value={state.password || ""}
                    onChange={(e) => stateFns.setPassword(e.detail.value)}
                    type={state.canSeePassword ? "text" : "password"}
                  />
                  <Checkbox
                    onChange={({detail}) =>
                      stateFns.setCanSeePassword(detail.checked)
                    }
                    checked={state.canSeePassword}
                  >
                    Show password
                  </Checkbox>
                </FormField>
              </SpaceBetween>
            </Container>
          </Form>
        </form>
      </div>
    </div>
  );
}

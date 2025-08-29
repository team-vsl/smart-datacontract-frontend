import { useMemo } from "react";

// Import components
import { Alert } from "@cloudscape-design/components";

// Import hooks
import { useAuth } from "@/hooks/use-auth";

// Import types
import type { PropsWithChildren } from "react";

export type TProtectorProps = {
  msg?: string;
  allowedTeams: Array<string>;
} & PropsWithChildren;

/**
 * Render a protect component to prevent non-allowed team user
 * access.
 *
 * @param props - properties of Protector
 *
 * @returns
 */
export default function Protector(props: TProtectorProps) {
  const { user } = useAuth();
  const isAllowed = useMemo(() => {
    if (props.allowedTeams.length === 0) return false;

    if (!user) return false;

    for (const team of props.allowedTeams) {
      if (user?.team === team) return true;
    }

    return false;
  }, [props.allowedTeams.length, user]);

  if (!isAllowed) {
    let msg = props.msg
      ? props.msg
      : "You don't have permission to do this action.";

    return (
      <Alert type="error" header="Access Denied">
        {msg}
      </Alert>
    );
  }

  return <>{props.children}</>;
}

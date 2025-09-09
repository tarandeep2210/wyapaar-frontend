import { UserProfile } from "@clerk/nextjs";

export default function Page() {
  return <UserProfile routing="hash" />; // Render the Clerk UserProfile component
}

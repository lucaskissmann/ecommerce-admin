import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs/app-beta";

const SetupPage = () => {
    return (
      <div className="p-4">
        <UserButton afterSignOutUrl="/"/>
      </div>
    )
  }

  export default SetupPage;
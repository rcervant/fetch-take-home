import Navbar from "@/components/Navbar";
import getCurrentUser from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";
import { SIGN_IN_PATH } from "@/lib/constants";

interface SearchLayoutProps {
  children: React.ReactNode;
}

const SearchLayout = async ({ children }: SearchLayoutProps) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return redirect(SIGN_IN_PATH);
  }

  return (
    <div>
      <Navbar currentUser={currentUser} />
      <div className="pb-20 pt-28">{children}</div>
    </div>
  );
};

export default SearchLayout;
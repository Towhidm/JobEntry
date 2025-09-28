
import Link from "next/link";
import {auth} from "@/auth"
import HeadAuth from "@/components/headauth";
import Bellicon from "./Bellicon";

const HeaderPage = async() => {
  const session = await auth()
  const role = session?.user?.role
  return (
    <>
      <nav className="flex justify-between items-center bg-[#f5f5f5] w-full h-22 px-8">
  {/* Logo */}
  <h1 className="flex font-bold text-5xl">
    <p className="text-[#059669]">Job</p>Entry
  </h1>

  {/* Navigation links */}
  <div className="flex items-center gap-6 font-medium text-[20px]">
    <Link className="hover:text-[#059669] duration-200" href="/home">
      Home
    </Link>
     <Link
          className="hover:text-[#059669] duration-200"
          href="/dashboard/employer/JobBoard"
        >
          JobBoard
        </Link>

    {role === "JOBSEEKER" && (
      <>
        
        <Link
          className="hover:text-[#059669] duration-200"
          href="/Bookmarked"
        >
          Bookmarked
        </Link>
      </>
    )}

    {role === "EMPLOYER" && (
      <>
       
        <Link
          className="hover:text-[#059669] duration-200"
          href="/dashboard/employer/Post/MyPosts"
        >
          MyPosts
        </Link>
      </>
    )}
  </div>

  {/* Right side */}
  <div className="flex items-center gap-6">
    {role === "JOBSEEKER" && <Bellicon />}
    <HeadAuth />
  </div>
</nav>

    </>
  );
};
export default HeaderPage;

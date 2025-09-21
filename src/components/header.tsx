
import Link from "next/link";
import HeadAuth from "@/components/headauth";
const HeaderPage = async() => {
  return (
    <>
      <nav className=" flex justify-around items-center bg-[#f5f5f5] w-full h-22">
        <h1 className=" flex font-bold text-5xl">
          <p className="text-[#059669] ">Job</p>Entry
        </h1>
        <div className="flex justify-between items-center font-medium w-72 text-[20px]">
          <Link className="hover:text-[#059669] duration-200" href="/">
            Home
          </Link>
          <Link className="hover:text-[#059669] duration-200" href="/findjobs">
            FindJobs
          </Link>
          <Link className="hover:text-[#059669] duration-200" href="/savedjobs">
            SavedJObs
          </Link>
        </div>
        <div className="flex justify-between items-center w-45">
         <HeadAuth/>
        </div>
      </nav>
    </>
  );
};
export default HeaderPage;


import Image from "next/image";
import Link from "next/link";
import {Button} from "@/components/ui/button"
import GetUserRole from "@/actions/getuserrole";

export default async function Home() {
  await GetUserRole();
  
  return (
    <>
    <div className="flex justify-around w-full h-screen">
      <div className="flex flex-col  justify-start h-full">
        <h2 className ="font-bold text-7xl mb-100px pb-12 pt-26">Your Dream</h2>
        <h2 className="text-[#059669] font-bold text-7xl pb-10">Job is Waiting </h2>
        <p className="text-6xl font-mediumn pb-10">5000+ Jobs</p>
        <Link href="/findjobs"><Button className="p-8 w-[70%] bg-[#34d399] text-2xl">Search Your Desired Job</Button></Link>
      </div>
      <div className="flex flex-cols items-center justify-center  h-full">
         <Image 
        src="/3dman.png"   // put your image inside /public
        alt="JobEntryImage"
        width={350}
        height={350}
      />
      </div>
    </div>
    </>
  );
}

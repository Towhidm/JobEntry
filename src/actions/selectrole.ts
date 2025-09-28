"use server"
import { prisma } from "@/lib";
import { Role } from "@prisma/client";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const SelectRolePage = async(formdata:FormData) =>{
     const session = await auth();
const role = formdata.get("role") as Role
const user = session?.user
const userid = user?.id
  await prisma.user.update({
    where: { id: userid },
    data: { role },
  });
  redirect("/home");
}
export default SelectRolePage;
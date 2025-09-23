
import { prisma } from "@/lib";
import { Role } from "@prisma/client";

const SelectRolePage = async(formdata:FormData) =>{
const role = formdata.get("role") as Role
await prisma.user.create({
    data:{
        role
    }
})
}
export default SelectRolePage;
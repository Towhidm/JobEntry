"use server"

import { auth } from "@/auth";
import { prisma } from "@/lib";
import { NextResponse } from "next/server";

export async function GET(){
    const session = await auth();
    if(!session?.user?.id){
        return NextResponse.json({applications:0,bookmarked:0})
    }
    const applications = await prisma.application.count({
        where:{
                userId:session.user.id,
        }
    })
    const bookmarked = await prisma.bookmark.count({
        where:{
            userId:session.user.id,
        }
    })
    return NextResponse.json({applications,bookmarked})
}
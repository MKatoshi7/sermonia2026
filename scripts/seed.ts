import "dotenv/config"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import bcrypt from "bcryptjs"

async function main() {
    const email = "admin@sermonia.com"
    const password = "123"
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            name: "Admin User",
            password: hashedPassword,
            role: "ADMIN",
        },
    })

    console.log({ user })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

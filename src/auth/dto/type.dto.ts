import { Prisma, ROLE } from "@prisma/client";
import { createZodDto } from "nestjs-zod";
import { RoleEnum } from "src/config/contants";
import { z } from "zod";

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
})

export class LoginDto extends createZodDto(LoginSchema) {}

const PayloadSchema = z.object({
    sub: z.number(),
    role: z.nativeEnum(ROLE)
})

export class PayloadDto extends createZodDto(PayloadSchema) {}
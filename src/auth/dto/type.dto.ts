import { ApiProperty } from "@nestjs/swagger";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const LoginSchema = z.object({
    email: z.string().describe('dynann@gmail.com'),
    password: z.string().describe('hashedpassword'),
})

export class LoginDto extends createZodDto(LoginSchema) {}

export class LoginProperty {

    @ApiProperty({ example: 'dynann@gmail.com' })
    email: string;

    @ApiProperty({ example: 'hashedpassword' })
    password: string;
}
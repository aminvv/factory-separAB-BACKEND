import { applyDecorators } from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";



export function pagination() {
    return applyDecorators(
        ApiQuery({ name: "page", example: 1, required: false, type: "integer" }),
        ApiQuery({ name: "limit", example: 1, required: false, type: "integer" })
    )
}
import { z } from "zod";

const orderItemSchema = z.object({
    sku: z
        .string()
        .regex(
            /^[A-Z0-9_-]{3,20}$/,
            "Invalid SKU"
        ),

    quantity: z
        .number()
        .positive(
            "Quantity must be greater than 0"
        ),

    price: z
        .number()
        .positive(
            "Price must be greater than 0"
        )
});

export const orderSchema = z.object({

    id: z.number(),

    customerEmail: z.email("Invalid Email"),

    deliveryType: z.enum(["STANDARD", "EXPRESS", "SAME_DAY"]),

    items: z
        .array(orderItemSchema)
        .min(1)
});


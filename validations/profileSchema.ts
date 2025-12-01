import { z } from "zod";

// Edit Profile schema ---------------------------------------------------------
export const editProfileSchema = z.object({
    firstName: z.string()
        .min(3, "First name must be atleast 3 characters")
        .min(3, "First can't exceed 20 characters")
        .regex(/^[A-Za-z ]+$/, "Name can only contain letters"),

    lastName: z.string()
        .min(3, "Last name must be atleast 3 characters")
        .min(3, "Last can't exceed 20 characters")
        .regex(/^[A-Za-z ]+$/, "Name can only contain letters"),
    phone: z.string()
        .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number"),
})

export type EditProfileSchemaType = z.infer<typeof editProfileSchema>;



// Change password schema -----------------------------------------------------
export const changePasswordSchema = z
    .object({
        currentPassword: z
            .string()
            .min(8, "Current password must be at least 8 characters")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/\d/, "Password must contain at least one number")
            .regex(/[@$!%*?&#]/, "Password must contain at least one special character"),

        newPassword: z
            .string()
            .min(8, "New password must be at least 8 characters")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/\d/, "Password must contain at least one number")
            .regex(/[@$!%*?&#]/, "Password must contain at least one special character"),

        reEnterNewPassword: z.string(),
    })
    .refine(
        (data) => data.newPassword === data.reEnterNewPassword,
        {
            message: "Passwords do not match",
            path: ["reEnterNewPassword"],
        }
    );

export type ChangePasswordSchemaType = z.infer<typeof changePasswordSchema>;
namespace NodeJS {
    interface ProcessEnv {
        //APPLICATION
        PORT: number


        //DATABASE
        DB_PORT: number
        DB_HOST: string
        DB_NAME: string
        DB_USERNAME: string
        DB_PASSWORD: string


        //SECRET TOKEN
        JWT_SECRET: string
        JWT_EXPIRES_IN: string
        REFRESH_TOKEN_SECRET: string
        REFRESH_EXPIRES_IN: string
        OTP_TOKEN_SECRET: string
        OTP_EXPIRES_IN: string



        // //SECRET CLOUDINARY
        // CLOUDINARY_NAME: string
        // CLOUDINARY_API_KEY: string
        // CLOUDINARY_API_SECRET: string
        // CLOUDINARY_URL: string



        // SECRET CLOUDINARY
        CLOUDINARY_CLOUD_NAME: string
        CLOUDINARY_API_KEY: string
        CLOUDINARY_API_SECRET: string

    }


}
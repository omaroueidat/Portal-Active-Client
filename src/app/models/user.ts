// Interface for the User Response when we login or register in the API
export interface User{
    username: string;
    displayName: string;
    token: string;
    image?: string;
}

// User Form Values that we will send from both Login and Register
export interface UserFormValues{
    email: string;
    password: string;
    displayName?: string;  // Exclusive for Register
    username?: string;     // Exclusive for Register
}
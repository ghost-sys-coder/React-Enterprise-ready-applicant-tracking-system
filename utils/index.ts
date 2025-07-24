export const generateRandomId = (): string => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 25);
}

export const generateUUID = (): string => crypto.randomUUID();
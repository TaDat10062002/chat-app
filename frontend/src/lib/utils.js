import CryptoJS from "crypto-js";

export const formatVietNamTimeZone = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    })
}


export const decodedMessage = (message) => {
    const bytes = CryptoJS.AES.decrypt(message, 'mysecretcryptojs');
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
}
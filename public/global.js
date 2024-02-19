const socket = io();

function getCookieValue(cookieName) {
    const cookieArray = document.cookie.split(';');
    for (let cookie of cookieArray) {
        const [name, value] = cookie.trim().split('=');
        if (name === cookieName) {
            return decodeURIComponent(value);
        }
    }
    return null;
}
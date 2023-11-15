interface Address {
    id: number;
    number: number;
    streetName: string;
    postCode: string;
    cityName: string;
    complement: string | null;
}

export function formatAddress(address: Address): string {
    const { number, streetName, postCode, cityName, complement } = address;

    const addressParts = [number, streetName, postCode, cityName].filter(part => part !== undefined);

    let formattedAddress = addressParts.join(' ');

    if (complement !== null && complement !== undefined) {
        formattedAddress += `, ${complement}`;
    }

    return formattedAddress;
}

export function formatDate(dateString: string): string {
    const optionsDate: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    };

    const optionsTime: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    };

    const datePart = new Date(dateString).toLocaleDateString('fr-FR', optionsDate);
    const timePart = new Date(dateString).toLocaleTimeString(undefined, optionsTime);

    return `${datePart}\n${timePart}`;
}

export function formatNumberToTime(number: number) {
    const hours = Math.floor(number / 60);
    const minutes = number % 60;

    const formattedHours = hours > 0 ? `${hours}h` : '';
    const formattedMinutes =`${minutes}m`;

    return hours > 0 && minutes > 0 ? `${formattedHours}${formattedMinutes}` : formattedHours || formattedMinutes
}
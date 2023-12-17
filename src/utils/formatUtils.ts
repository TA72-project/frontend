import { IAddress } from "./interfaces";

export function formatAddress(address: IAddress): string {
  const {
    number: num,
    street_name: street,
    postcode: code,
    city_name: city,
    complement: comp,
  } = address as IAddress;
  const number = num;
  const streetName = street;
  const postCode = code;
  const cityName = city;
  const complement = comp;

  const addressParts = [number, streetName, postCode, cityName].filter(
    (part) => part !== undefined && part !== null,
  );

  let formattedAddress = addressParts.join(" ");

  if (complement) {
    formattedAddress += `, ${complement}`;
  }

  return formattedAddress;
}


export function formatDate(dateString: string): string {
  const optionsDate: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  const optionsTime: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  const datePart = new Date(dateString).toLocaleDateString(
    "fr-FR",
    optionsDate,
  );
  const timePart = new Date(dateString).toLocaleTimeString(
    undefined,
    optionsTime,
  );

  return `${datePart}\n${timePart}`;
}

export function formatNumberToTime(number: number) {
  const hours = Math.floor(number / 60);
  const minutes = number % 60;

  const formattedHours = hours > 0 ? `${hours}h` : "";
  const formattedMinutes = `${minutes}m`;

  return hours > 0 && minutes > 0
    ? `${formattedHours}${formattedMinutes}`
    : formattedHours || formattedMinutes;
}

export function formatDateToSave(date: Date): string {
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const seconds = ("0" + date.getSeconds()).slice(-2);

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

export function formatDateForTable(date: Date): string {
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const seconds = ("0" + date.getSeconds()).slice(-2);

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function generateRandomString(): string {
  const length = Math.floor(Math.random() * 6) + 10;
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";//!@#$%^&*()-_=+";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

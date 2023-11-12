export function formatPositiveInt(value: string | number) : number {
    const intValue = typeof value === 'string' ? parseInt(value) : value;

    if (Number.isNaN(intValue) || intValue <= 0) {
        return 0;
    }

    return intValue;
}
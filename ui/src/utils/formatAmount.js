let intlFormat = null;

const getIntlFormat = () => {
    if (!intlFormat) {
        const locale = typeof navigator !== "undefined" ? navigator.language : "en-US";
        intlFormat = new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 12 });
    }
    return intlFormat;
};

export const formatAmount = (value) => {
    return getIntlFormat().format(value);
};

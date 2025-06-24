const rules = {
    // is empty or non-negative number
    number: (value) => !value || /^\d+$/.test(value) || "Invalid number", //TODO i18n

    // is empty or valid mmx address
    address: (value) => !value || validateAddress(value) || "Invalid address", //TODO i18n

    // is non empty
    required: (value) => !isEmpty(value) || "Field is required", //TODO i18n

    amount: (value) => {
        //if (value && value.length && value.match(/^(\d+([.,]\d*)?)$/)) {
        return isEmpty(value) || (typeof value === "number" && value > 0) || "Invalid amount"; //TODO i18n
    },

    memo: (value) => {
        if (value && value.length > 64) {
            return "Maximum length is 64"; //TODO i18n
        }
        return true;
    },

    password: (value) => {
        if (value.length < 12) {
            return "Password must be at least 12 characters long"; //TODO i18n
        }
        if (!/\d/.test(value)) {
            return "Password must contain at least one digit"; //TODO i18n
        }
        if (!/[a-z]/.test(value)) {
            return "Password must contain at least one lowercase letter"; //TODO i18n
        }
        if (!/[A-Z]/.test(value)) {
            return "Password must contain at least one uppercase letter"; //TODO i18n
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
            return "Password must contain at least one special character"; //TODO i18n
        }
        return true;
    },
};

export default rules;

import i18n from "@/plugins/i18n";

const rules = {
    // is empty or non-negative number
    number: (value) => !value || /^\d+$/.test(value) || i18n.global.t("validation.invalid_number"),

    // is empty or valid mmx address
    address: (value) => !value || validateAddress(value) || i18n.global.t("validation.invalid_address"),

    // is non empty
    required: (value) => !isEmpty(value) || i18n.global.t("validation.required"),

    amount: (value) => {
        //if (value && value.length && value.match(/^(\d+([.,]\d*)?)$/)) {
        return isEmpty(value) || (typeof value === "number" && value > 0) || i18n.global.t("validation.invalid_amount");
    },

    memo: (value) => {
        if (value && value.length > 64) {
            return i18n.global.t("validation.max_length_64");
        }
        return true;
    },
};

export default rules;

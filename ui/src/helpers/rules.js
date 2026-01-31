import i18n from "@/plugins/i18n";

const { t } = i18n.global;

const rules = {
    // is empty or non-negative number
    number: (value) => !value || /^\d+$/.test(value) || t("validation.invalid_number"),

    // is empty or valid mmx address
    address: (value) => !value || validateAddress(value) || t("validation.invalid_address"),

    // is non empty
    required: (value) => !isEmpty(value) || t("validation.field_required"),

    amount: (value) => {
        //if (value && value.length && value.match(/^(\d+([.,]\d*)?)$/)) {
        return isEmpty(value) || (typeof value === "number" && value > 0) || t("validation.invalid_amount");
    },

    memo: (value) => {
        if (value && value.length > 64) {
            return t("validation.max_length", { max: 64 });
        }
        return true;
    },
};

export default rules;

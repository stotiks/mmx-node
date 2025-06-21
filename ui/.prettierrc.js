/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
    trailingComma: "es5",
    tabWidth: 4,
    useTabs: false,
    singleQuote: false,
    overrides: [
        {
            files: "package.json",
            options: {
                tabWidth: 2,
            },
        },
    ],
};

export default config;

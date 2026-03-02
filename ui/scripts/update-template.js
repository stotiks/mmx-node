import fs from "fs";

const en = JSON.parse(fs.readFileSync("src/locales/en-US.json", "utf8"));

// Recursively replace all string values with empty strings
function createTemplate(obj) {
    const result = {};
    for (const key of Object.keys(obj)) {
        const value = obj[key];
        if (typeof value === "string") {
            result[key] = "";
        } else if (typeof value === "object" && value !== null) {
            result[key] = createTemplate(value);
        }
    }
    return result;
}

const template = createTemplate(en);
fs.writeFileSync("src/locales/template._json", JSON.stringify(template, null, 4) + "\n");
console.log("Template updated successfully");

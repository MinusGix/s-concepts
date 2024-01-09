import scrape, { Concept } from "./scrape";
import fs from "fs";

const SCRAPE_PATH = "./scrape.json"
const HTML_TEMPLATE_PATH = "./template.html";
const HTML_OUTPUT_PATH = "./index.html";
const REPLACE_TARGET = "<!-- REPLACE -->";

async function saveScrape(): Promise<Concept[]> {
    let res = await scrape();

    fs.writeFileSync(SCRAPE_PATH, JSON.stringify(res));
    
    return res;
}

async function main() {
    let concepts: Concept[];
    if (process.argv[2] === "scrape" || !fs.existsSync(SCRAPE_PATH)) {
        console.log("Scraping...");
        concepts = await saveScrape();
    } else {
        console.log("Loading...");
        concepts = JSON.parse(fs.readFileSync(SCRAPE_PATH).toString());
    }

    console.log("# Concepts:", concepts.length);

    constructHTML(concepts);
}

main();


function constructHTML(concepts: Concept[]) {
    let template = fs.readFileSync(HTML_TEMPLATE_PATH).toString();

    let js = "let concepts = {";

    let res = `<div class="concept-list-component" style="width: 100%">\n`;
    // skipping sorting options and copy-toast for now
    // TODO: filtering
    res += `\t<div id="concept-results" style="display: flex; flex-direction: row; flex-wrap: wrap; gap: 10px">\n`;
    for (let concept of concepts) {
        res += `\t\t\t<div class="item" concept-id=${concept.id} style="position: relative">\n\t\t\t\t<div class="image" style="background-image: url(${concept.image})"></div>\n<div class="overlay"><div class="concept-name">${escapeHTML(concept.name)}</div><div class="concept-type">${escapeHTML(concept.type || "")}</div></div>\n</div>`;

        js += `${concept.id}: {\nname: "${concept.name}",image: "${concept.image}", \ntype: "${escapeHTML(concept.type || "")}",\nsource: "${escapeHTML(concept.source || "")}",\ntriggers: [${concept.triggers.map(t => `"${escapeHTML(t)}"`).join(", ")}],\ndesc: \`${concept.desc}\`\n},\n`;
    }

    js += "};";

    res += `\t</div>\n</div>\n`;

    res = `<script>${js}</script>\n${res}`;

    template = template.replace(REPLACE_TARGET, res);

    fs.writeFileSync(HTML_OUTPUT_PATH, template);
}

function escapeHTML(str: string): string {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
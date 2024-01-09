import fetch from "node-fetch";
import * as cheerio from "cheerio";

const DEFAULT_URL = "https://cloud.graydient.ai/concepts/raw";

export interface Concept {
    id: number;
    name: string;
    type?: string,
    image?: string;
    tags: string[];
    nsfw: boolean;
    source?: string;
    token?: string;
    triggers: string[];
    desc: string;
}

export default async function scrape(url = DEFAULT_URL) : Promise<Concept[]>{
    const response = await fetch(url);
    const html = await response.text();

    const $ = cheerio.load(html);
    const tbody = $("#recipes-list div table tbody");
    
    let children = tbody.children();

    let concepts: Concept[] = [];
    for (let i = 0; i < children.length; i += 2) {
        // skip opening rows
        if (i <= 1) continue;

        const row = $(children[i]);
        let rowc = row.children();

        let id = parseInt($(rowc[0]).text());
        let name = $(rowc[1]).text();
        let type: string | undefined = $(rowc[2]).text();
        if (type === "") type = undefined;
        if (type === ".") type = 'base-model';

        let image;
        let imageElem = $(rowc[3]).find("a");
        if (imageElem.length > 0) {
            image = imageElem.attr("href");
        }

        let tags = $(rowc[4]).text().trim().split("\n");
        if (tags.length === 1 && tags[0] === "") {
            tags = [];
        }
        
        let nsfw = $(rowc[5]).text().trim() === "👍";

        let sourceElem = $(rowc[6]).find("a");
        let source = sourceElem.attr("href") || undefined;

        let token = $(rowc[7]).text().trim(); 

        let triggers = $(rowc[8]).text().trim().split("\n");
        if (triggers.length === 1 && (triggers[0] === "" || triggers[0] === "(none)")) {
            triggers = [];
        } else {
            // skip past the trigger count and a space
            triggers = triggers.slice(2);
        }

        let nextRow = $(children[i + 1]);
        let descElem = nextRow.find("textarea");
        let desc = descElem.text().trim();
        if (desc.startsWith("__html__")) {
            desc = desc.slice("__html__".length);
        }

        let concept: Concept = {
            id,
            name,
            type,
            image,
            tags,
            nsfw,
            source,
            token,
            triggers,
            desc,
        };

        concepts.push(concept);
    }

    return concepts;
}
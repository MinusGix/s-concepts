document.addEventListener('DOMContentLoaded', function () {
    let elements = document.getElementsByClassName('item');
    for (let i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', openItemModal);
    }

    let toggles = document.getElementsByClassName('toggle');
    for (let i = 0; i < toggles.length; i++) {
        toggles[i].addEventListener('click', function () {
            // Get the child input element
            let input = this.getElementsByTagName('input')[0];
            // Toggle the checked property
            input.checked = !input.checked;
            // Trigger the change event manually
            input.dispatchEvent(new Event('change'));
        });
    }

    let nsfw = document.getElementById("nsfw");
    nsfw.addEventListener("change", function () {
        updateFiltering();
        localStorage.setItem("nsfw", nsfw.checked);
    });

    let nsfw_previews = document.getElementById("nsfw-previews");
    nsfw_previews.addEventListener("change", function () {
        updateFiltering();
        localStorage.setItem("nsfw-previews", nsfw_previews.checked);
    });


    if (localStorage.getItem("nsfw") === "false") {
        nsfw.checked = false;
    } else {
        nsfw.checked = true;
    }

    if (localStorage.getItem("nsfw-previews") === "false") {
        nsfw_previews.checked = false;
    } else {
        nsfw_previews.checked = true;
    }

    updateFiltering();
});

MicroModal.init();
function openItemModal() {
    let id = this.getAttribute('concept-id');
    let concept = concepts[id];
    console.log(concept);

    document.getElementById("concept-modal-title").innerText = concept.name;

    let content = document.getElementById("concept-modal-content");
    // clear children
    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }

    let image = document.createElement("img");
    image.src = concept.image;

    let namePre = document.createElement("b");
    namePre.innerText = "Tag: ";
    let name = document.createElement("span");
    name.innerText = concept.name;

    // let tags = document.createElement("b");
    // tags.innerText = "Tags: ";
    // let tagsContent = document.createElement("span");
    // tagsContent.innerText = concept.tags;
    let desc = document.createElement("p");
    desc.innerHTML = concept.desc;

    let triggers = document.createElement("b");
    triggers.innerText = "Triggers: ";
    let triggersContent = document.createElement("span");
    triggersContent.innerText = concept.triggers.join(", ");

    let source = document.createElement("a");
    source.href = concept.source;
    source.innerText = "Source";

    content.appendChild(image);
    content.appendChild(document.createElement("br"));
    content.appendChild(namePre);
    content.appendChild(name);
    content.appendChild(document.createElement("br"));
    // content.appendChild(tags);
    // content.appendChild(tagsContent);
    if (concept.triggers.length > 0) {
        content.appendChild(triggers);
        content.appendChild(triggersContent);
        content.appendChild(document.createElement("br"));
    }
    content.appendChild(desc);
    content.appendChild(document.createElement("br"));
    content.appendChild(source);



    MicroModal.show('concept-modal');
}

function updateFiltering() {
    let nsfw = document.getElementById("nsfw").checked;
    let nsfw_previews = document.getElementById("nsfw-previews").checked;
    let ITEMS = document.getElementsByClassName('item');

    console.log("update filtering, nsfw:", nsfw, "nsfw_previews:", nsfw_previews, "#items:", ITEMS.length);
    for (let i = 0; i < ITEMS.length; i++) {
        let item = ITEMS[i];
        let id = item.getAttribute('concept-id');
        let concept = concepts[id];
        if (concept.nsfw && !nsfw) {
            item.classList.add("hidden");
        } else if (concept.nsfw && nsfw && !nsfw_previews) {
            item.classList.add("hidden");
            item.classList.add("blur");
        } else {
            item.classList.remove("hidden");
            item.classList.remove("blur");
        }
    }
}
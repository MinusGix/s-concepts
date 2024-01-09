document.addEventListener('DOMContentLoaded', function () {
    let elements = document.getElementsByClassName('item');
    for (let i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', openItemModal);
    }
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
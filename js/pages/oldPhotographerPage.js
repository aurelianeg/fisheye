// ============================== DOM ELEMENTS ==============================

const pageTitle = document.querySelector(".page_title");
const mainWrapper = document.querySelector(".main");

const presentation = document.querySelector(".presentation");
const gallery = document.querySelector(".gallery");
const galleryElement = document.querySelector(".gallery_element");
const bottomBar = document.querySelector(".bottom_bar");

const sortingInput = document.querySelector(".sorting_input");
const sortingButtonText = document.querySelector(".sorting_button_text");
const sortingListChoices = document.querySelectorAll(".sorting_menu_list_choice");

const contactButton = document.querySelector(".presentation_contact");
const contactModalBackground = document.querySelector(".contact_background");
const contactModalContent = document.querySelector(".contact_content");
const contactModalCloseCross = document.querySelector(".contact_close");
const contactModalPhotographerName = document.querySelector(".contact_text_photographer");
const contactModalSubmitButton = document.querySelector(".contact_submit");

const lightboxModalBackground = document.querySelector(".lightbox_background");
const lightboxModalContent = document.querySelector(".lightbox_content");
const lightboxModalCloseCross = document.querySelector(".lightbox_close");
const lightboxModalPreviousButton = document.querySelector(".lightbox_previousbutton");
const lightboxModalNextButton = document.querySelector(".lightbox_nextbutton");
const lightboxPicture = document.querySelector(".lightbox_container_picture");
const lightboxTitle = document.querySelector(".lightbox_container_title");


// ============================== FUNCTIONS ==============================

/**
 * Apply the data taken from the JSON file to the HTML elements on the photographer page
 * @param {array} photographer 
 * @param {DOMElement} presentation
 * @param {DOMElement} bottomBar
 * @param {array} media
 * @param {DOMElement} contactModalPhotographerName
 */
function applyDataToPhotographerPage(photographer, media) {

    // Get all HTML children
    let photographerPresentation, photographerProfilePicture, photographerName, photographerLocation, photographerDescription, photographerTags, photographerLikes, photographerPrice, photographerTotalLikes;
    photographerPresentation = presentation.children[0];
    photographerProfilePicture = presentation.children[2];
    [photographerName, photographerLocation, photographerDescription, photographerTags] = photographerPresentation.children;
    
    [photographerLikes, photographerPrice] = bottomBar.children;
    photographerTotalLikes = photographerLikes.children[0];

    // Change text in HTML by data in JSON
    photographerProfilePicture.src = "assets/pictures/photographers/" + photographer.portrait;
    photographerProfilePicture.ariaLabel = photographer.name;
    photographerName.innerHTML = photographer.name;
    contactModalPhotographerName.innerHTML = photographer.name;
    pageTitle.innerHTML += " - " + photographer.name;
    photographerLocation.innerHTML = photographer.city + ", " + photographer.country;
    photographerDescription.innerHTML = photographer.tagline;
    photographerPrice.innerHTML = photographer.price + " € / jour";
    // Empty tags
    photographerTags.innerHTML = "";
    for (let j = 0; j < photographer.tags.length; j++) {
        // Create a new span for each tag
        const photographerCardTag = document.createElement("span");
        photographerCardTag.classList.add("tag");
        photographerCardTag.innerHTML = "#" + photographer.tags[j];
        photographerCardTag.title = photographer.tags[j];
        photographerTags.appendChild(photographerCardTag);
    }

    const photographerId = photographer.id;
    let photographerSumLikes = 0;
    let photographerMedias = [];
    for (let k = 0; k < media.length; k++) {
        if (media[k].photographerId == photographerId) {
            // Pictures
            photographerMedias.push(media[k]);
            // Total likes
            photographerSumLikes += media[k].likes;
        }
    }
    photographerTotalLikes.innerHTML = photographerSumLikes;

    // Get photographer pictures in HTML
    for (let l = 0; l < photographerMedias.length; l++) {

        let photographerMedia = photographerMedias[l];

        // Create a clone of the original gallery element
        if (l != 0) {
            let galleryElementNew = galleryElement.cloneNode(true);
            gallery.appendChild(galleryElementNew);
        }

        // Get last gallery element created
        const galleryElements = document.querySelectorAll(".gallery_element");

        // Get all HTML children
        let galleryElementPicture, galleryElementLegend, galleryElementDate, galleryElementLegendTitle, galleryElementLegendLikesNumber;
        [galleryElementPicture, galleryElementLegend, galleryElementDate] = galleryElements[l].children;
        galleryElementLegendTitle = galleryElementLegend.children[0];
        galleryElementLegendLikesNumber = galleryElementLegend.children[1].children[0];

        // Change text in HTML by data in JSON
        galleryElementLegendTitle.innerHTML = photographerMedia.title;
        galleryElementLegendLikesNumber.innerHTML = photographerMedia.likes;
        galleryElementDate.innerHTML = photographerMedia.date.replace(/-/g, "");

        const folderName = (photographer.name).split(" ")[0].replace(/-/g, " ");
        // Check if video or image
        if (l != 0) {       // Remove child cloned with the element
            galleryElementPicture.removeChild(galleryElementPicture.lastChild);
        }
        if (photographerMedia.image != undefined) {
            const galleryElementPictureImage = document.createElement("img");
            galleryElementPicture.appendChild(galleryElementPictureImage);
            galleryElementPictureImage.src = "assets/pictures/photographs/" + folderName + "/" + photographerMedia.image;
            galleryElementPictureImage.alt = photographerMedia.altText;
        }
        else {
            const galleryElementPictureVideo = document.createElement("video");
            galleryElementPicture.appendChild(galleryElementPictureVideo);
            const galleryElementPictureVideoSource = document.createElement("source");
            galleryElementPictureVideo.appendChild(galleryElementPictureVideoSource);
            galleryElementPictureVideoSource.src = "assets/pictures/photographs/" + folderName + "/" + photographerMedia.video + "#t=0.5";
            galleryElementPictureVideo.ariaLabel = photographerMedia.altText;
        }
    }

    // Add a blank div for rendering pictures (not multiple of 3) on wide screens
    if (window.screen.width > 1439) {
        if (photographerMedias.length % 3 == 2) {
            let blankDiv = document.createElement("div");
            gallery.appendChild(blankDiv);
            blankDiv.style.width = "390px";
            blankDiv.style.order = photographerMedias.length;
        }
    }
}


// Get data from JSON file

let jsonUrl = "data/data.json";

fetch(jsonUrl)
    .then(function(response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function(value) {
        window.data = value;    // Get data as global variable
    })
    .catch(function(error) {
        console.log("Error:" + error.message);
    });


// Save global variables after fetch operation

setTimeout(function() {

    let photographers = window.data.photographers;
    let media = window.data.media;
    
    //console.log("photographers", photographers);
    //console.log("media", media);

    // Get photographer ID from URL and search for the right data in JSON
    const id = new URLSearchParams(window.location.search).get("id");
    
    for (let i = 0; i < photographers.length; i++) {
        if (photographers[i].id == id) {
            window.photographer = photographers[i];
        }    
    }

    const photographer = window.photographer;

    applyDataToPhotographerPage(photographer, media);

    console.log("All done for the photographer page!");

}, 300);


// ============================== EVENTS ==============================

/**
 * Sort gallery elements by a chosen category (popularity, date or title)
 * @param {DOMElement} elements 
 * @param {DOMElement} categoryElements 
 * @param {string} category 
 */
function sortGalleryByCategory(elements, categoryElements, category) {

    // Create array with text from HTML category elements
    let categoryElementsText = [];
    for (let i = 0; i < categoryElements.length; i++) {
        let categoryElementText;
        if (category == "popularity" || category == "date") {
            categoryElementText = parseFloat(categoryElements[i].innerHTML);
        }
        if (category == "title") {
            categoryElementText = categoryElements[i].innerHTML;
        }
        categoryElementsText.push(categoryElementText);
    }

    // Clone array to sort it
    let sortedCategoryElementsText = [...categoryElementsText];
    if (category == "popularity" || category == "date") {       // Descending order
        sortedCategoryElementsText.sort(function(a, b) {
            return b - a;
        });
    }
    if (category == "title") {                                  // Ascending order
        sortedCategoryElementsText.sort();
    }

    // Remove order to allow future sortings (otherwise "if (!element.style.order)" condition is always entered)
    for (let k = 0; k < elements.length; k++) {
        elements[k].style.order = "";
    }

    // Go through sorted array
    for (let i = 0; i < sortedCategoryElementsText.length; i++) {
        let sortedCategoryElementText = sortedCategoryElementsText[i];

        // Go through HTML card elements
        for (let j = 0; j < elements.length; j++) {
            let element = elements[j];
            let categoryElementText = categoryElementsText[j];

            // If HTML category element is similar to sorted array element, reorder HTML card element
            if (categoryElementText == sortedCategoryElementText) {
                if (!element.style.order) {     // Only if element hasn't already an order
                    element.style.order = i;
                    break;     // To avoid same order for different elements
                }
            }
        }
    }
}

/**
 * Sort gallery elements, pictures and titles, by order of appearance on screen (sorting)
 * @param {DOMElement} elements 
 * @param {DOMElement} elementsPictures 
 * @param {DOMElement} elementsTitles 
 * @returns {array}
 */
function getSortedElementsPicturesAndTitles(elements, elementsPictures, elementsTitles) {

    let sortedElements = new Array(elements.length);
    let sortedElementsPictures = new Array(elements.length);
    let sortedElementsTitles = new Array(elements.length);

    for (let i = 0; i < elements.length; i++) {
        let sortedIndex = elements[i].style.getPropertyValue("order");
        sortedElements[sortedIndex] = elements[i];
        sortedElementsPictures[sortedIndex] = elementsPictures[i];
        sortedElementsTitles[sortedIndex] = elementsTitles[i];
    }

    return [sortedElements, sortedElementsPictures, sortedElementsTitles];
}

/**
 * Sort gallery by popularity (default option)
 */
function defaultGallerySorting() {

    setTimeout(function() {
        const galleryElements = document.querySelectorAll(".gallery_element");
        const galleryElementsLikesNumbers = document.querySelectorAll(".gallery_element_legend_likes_number");
        sortGalleryByCategory(galleryElements, galleryElementsLikesNumbers, "popularity");

        // Get sorted elements, pictures and titles
        const galleryElementsPictures = document.querySelectorAll(".gallery_element_picture");
        const galleryElementsTitles = document.querySelectorAll(".gallery_element_legend_title");
        [sortedGalleryElements, sortedGalleryElementsPictures, sortedGalleryElementsTitles] = getSortedElementsPicturesAndTitles(galleryElements, galleryElementsPictures, galleryElementsTitles);
    }, 300);
}

// Sort gallery by default option on page loading

let sortedGalleryElements;
let sortedGalleryElementsPictures;
let sortedGalleryElementsTitles;
window.addEventListener("load", defaultGallerySorting);

// Sort gallery by categories when choosing a sorting option

setTimeout(function() {

    sortingListChoices.forEach((sortingListChoice) => sortingListChoice.addEventListener("click", function() {

        const galleryElements = document.querySelectorAll(".gallery_element");
        const sortingSelectedChoice = sortingListChoice.id;
        sortingButtonText.innerHTML = sortingListChoice.innerHTML;

        // Get HTML elements based on sorting option (likes numbers, dates, or picture titles)
        let galleryElementsCategory = "";
        if (sortingSelectedChoice == "popularity") {
            galleryElementsCategory = document.querySelectorAll(".gallery_element_legend_likes_number");
        }
        if (sortingSelectedChoice == "date") {
            galleryElementsCategory = document.querySelectorAll(".gallery_element_date");
        }
        if (sortingSelectedChoice == "title") {
            galleryElementsCategory = document.querySelectorAll(".gallery_element_legend_title");
        }

        // Hide sorting options
        sortingInput.checked = false;

        // Sort gallery elements by chosen option
        sortGalleryByCategory(galleryElements, galleryElementsCategory, sortingSelectedChoice);

        // Get sorted elements, pictures and titles
        const galleryElementsPictures = document.querySelectorAll(".gallery_element_picture");
        const galleryElementsTitles = document.querySelectorAll(".gallery_element_legend_title");
        [sortedGalleryElements, sortedGalleryElementsPictures, sortedGalleryElementsTitles] = getSortedElementsPicturesAndTitles(galleryElements, galleryElementsPictures, galleryElementsTitles);
    }))

}, 500);


// ------------------------------------------------------------

// Increase the number of likes (on the picture and total)
// if the user likes a picture

setTimeout(function() {

    const galleryElementLikesHearts = document.querySelectorAll(".gallery_element_legend_likes_heart");
    const photographerTotalLikes = document.querySelector(".bottom_bar_likes_number");

    galleryElementLikesHearts.forEach((heart) => heart.addEventListener("click", function() {
        // Get likes number for the picture and increase it
        const likesNumber = heart.parentNode.children[0];
        likesNumber.innerHTML = parseInt(likesNumber.innerHTML) + 1;
        // Increase total number of likes
        photographerTotalLikes.innerHTML = parseInt(photographerTotalLikes.innerHTML) + 1;
    }))

}, 500);


// ------------------------------------------------------------

/**
 * Launch contact modal
 */
function launchContactModal() {
    contactModalBackground.style.display = "block";
    contactModalContent.setAttribute("aria-hidden", "false");
    mainWrapper.setAttribute("aria-hidden", "true");
    contactModalCloseCross.focus();
}
  
/**
 * Close contact modal (with animation)
 */
function closeContactModal() {
    contactModalContent.classList.add("isClosed");
    setTimeout(function() {
        contactModalContent.classList.remove("isClosed");
        contactModalBackground.style.display = "none";
        contactModalContent.setAttribute("aria-hidden", "true");
        mainWrapper.setAttribute("aria-hidden", "false");
    }, 300);
}

/**
 * Show error message if input not valid
 * @param {DOMElement} input - The given input
 * @param {string} message - The error message
 */
function showErrorMessage(input, message) {
    const contactForm = input.parentElement;
    input.setAttribute("aria-invalid", "true");
    contactForm.className = "contact_form error";
    const errorMessage = contactForm.querySelector(".contact_form_error");
    errorMessage.innerHTML = message;
    input.focus();
}
  
/**
 * Hide error message if input was not valid
 * @param {DOMElement} input 
 */
function showSuccess(input) {
    const contactForm = input.parentElement;
    input.setAttribute("aria-invalid", "false");
    contactForm.className = "contact_form success";
    const errorMessage = contactForm.querySelector(".contact_form_error");
    errorMessage.innerHTML = "";
}
  
/**
 * Check if all form inputs are valid
 * @param {DOMElement} inputs
 * @returns {Boolean}
 */
function checkFormValidation(inputs) {

    let fields = {firstName: false, lastName: false, email: false, message: false};
    const regexAsciiLetters = /[a-zA-Z]/;
    const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    let firstNameInput, lastNameInput, emailInput, messageInput;
    [firstNameInput, lastNameInput, emailInput, messageInput] = inputs;
    // First name input
    if (firstNameInput.value.length == 0) {
        showErrorMessage(firstNameInput, "Veuillez saisir votre prénom.");
    }
    else if (regexAsciiLetters.test(firstNameInput.value) == false) {
        showErrorMessage(firstNameInput, "Veuillez entrer des caractères de A à Z (sans accents).");
    }
    else {
        showSuccess(firstNameInput);
        fields.firstName = true;
    }

    // Last name input
    if (lastNameInput.value.length == 0) {
        showErrorMessage(lastNameInput, "Veuillez saisir votre nom.");
    }
    else if (regexAsciiLetters.test(lastNameInput.value) == false) {
        showErrorMessage(lastNameInput, "Veuillez entrer des caractères de A à Z (sans accents).");
    }
    else {
        showSuccess(lastNameInput);
        fields.lastName = true;
    }

    // Email input
    if (emailInput.value.length == 0) {
        showErrorMessage(emailInput, "Veuillez saisir votre adresse e-mail.");
    }
    else if (regexEmail.test(emailInput.value) == false) {
        showErrorMessage(emailInput, "Veuillez saisir un format d'adresse e-mail valide.");
    }
    else {
        showSuccess(emailInput);
        fields.email = true;
    }

    // Email input
    if (messageInput.value.length == 0) {
        showErrorMessage(messageInput, "Veuillez saisir votre message.");
    }
    else {
        showSuccess(messageInput);
        fields.message = true;
    }

    // Submit form if all fields are valid
    let fieldsValues = Object.values(fields);
    if (fieldsValues.includes(false) == true) {
        return false;
    }
    if (fieldsValues.includes(false) == false) {
        return true;
    }
}
  

// Contact modal opening, closing with cross, and closing with submit button

setTimeout(function() {

    // - Opening -
    contactButton.addEventListener("click", launchContactModal);

    // - Closing with cross -
    contactModalCloseCross.addEventListener("click", closeContactModal);

    // - Closing with escape key -
    window.addEventListener("keydown", function(event) {
        if (contactModalContent.getAttribute("aria-hidden") == "false" && event.key == "Escape") {
            closeContactModal();
        }
    });

    // - Closing with submit button -
    const contactFormInputs = document.querySelectorAll(".contact_form_input");
    contactModalSubmitButton.addEventListener("click", function(event) {
        event.preventDefault();     // Keep form informations if not valid
        if (checkFormValidation(contactFormInputs)) {
            // Print contact form inputs in console logs and close contact modal
            for (let i = 0; i < contactFormInputs.length; i++) {
                console.log(contactFormInputs[i].value);
            }
            closeContactModal();
        }
    
    });

}, 500);


// ------------------------------------------------------------

/**
 * Launch lightbox modal
 */
function launchLightboxModal() {
    lightboxModalBackground.style.display = "block";
    lightboxModalContent.setAttribute("aria-hidden", "false");
    mainWrapper.setAttribute("aria-hidden", "true");
    lightboxModalCloseCross.focus();
}
  
/**
 * Close lightbox modal (with animation)
 */
function closeLightboxModal() {
    lightboxModalContent.classList.add("isClosed");
    setTimeout(function() {
        lightboxModalContent.classList.remove("isClosed");
        lightboxModalBackground.style.display = "none";
        lightboxModalContent.setAttribute("aria-hidden", "true");
        mainWrapper.setAttribute("aria-hidden", "false");
    }, 300);
}

/**
 * Get information in clicked HTML gallery element and apply it to the lightbox
 * @param {DOMElement} picture 
 * @param {DOMElement} title 
 * @param {boolean} firstpicture 
 * @param {boolean} lastpicture 
 */
function applyPictureAndTitleToLightbox(picture, title, firstpicture, lastpicture) {

    // Get photographer page information
    const pictureContent = picture.children[0];

    // Apply information to lightbox content
    while (lightboxPicture.lastElementChild) {  // Reset at each opening: empty it if it already has a child
        lightboxPicture.removeChild(lightboxPicture.lastElementChild);
    }
    const lightboxPictureContent = pictureContent.cloneNode(true);
    // Remove the miniature image and get video controls
    if (lightboxPictureContent.nodeName == "VIDEO") {
        const lightboxPictureVideoSource = lightboxPictureContent.children[0];
        lightboxPictureVideoSource.src = lightboxPictureVideoSource.src.split("#")[0];
        // Show controls on hover
        lightboxPictureContent.addEventListener("mouseover", function() {
            lightboxPictureContent.setAttribute("controls", "controls");
        })
        // Hide controls if not hover
        lightboxPictureContent.addEventListener("mouseleave", function() {
            lightboxPictureContent.removeAttribute("controls");
        })
    }
    lightboxPicture.appendChild(lightboxPictureContent);    // Put the new picture as child
    lightboxTitle.innerHTML = title.innerHTML;

    // Lightbox layout once the picture is displayed
    setTimeout(function() {

        // Reset at each lightbox opening
        lightboxTitle.style.width = "auto";
        lightboxPicture.style.height = "100%";

        if (lightboxPictureContent.nodeName != "VIDEO") {
            // Align the title with the displayed picture (center if it is a video because natural dimensions are 0)
            let titleWidth = (lightboxPictureContent.naturalWidth * lightboxPictureContent.height) / lightboxPictureContent.naturalHeight;  
            if (titleWidth > lightboxPictureContent.width) {
                titleWidth = lightboxPictureContent.width;
            }
            lightboxTitle.style.width = titleWidth + "px";

            // If picture is in landscape, bring title closer to the picture
            if (lightboxPictureContent.naturalWidth > lightboxPictureContent.naturalHeight) {
                let pictureHeight = (lightboxPictureContent.naturalHeight * titleWidth) / lightboxPictureContent.naturalWidth;
                if (pictureHeight > lightboxPictureContent.height) {
                    pictureHeight = lightboxPictureContent.height;
                }
                lightboxPicture.style.height = pictureHeight + "px";
            }
        }
    }, 50);

    // Partially hide the previous button if the picture is the first
    if (firstpicture) {
        lightboxModalContent.classList.add("boundary_firstelement");
    }
    // Partially hide the next button if the picture is the last
    else if (lastpicture) {
        lightboxModalContent.classList.add("boundary_lastelement");
    }
    else
    {
        lightboxModalContent.classList.remove("boundary_firstelement");
        lightboxModalContent.classList.remove("boundary_lastelement");
    }
}

/**
 * Get image or video source (from a video thumbnail if needed with boolean "fromimage")
 * @param {DOMElement} content 
 * @param {boolean} fromimage 
 * @returns {DOMElement}
 */
function getContentSource(content, fromimage) {

    let contentSource;
    if (content.nodeName != "VIDEO") {
        contentSource = content.src;
    }
    else
    {
        if (!fromimage) {
            contentSource = content.children[0].src;
        }
        else {
            contentSource = content.children[0].src.split("#")[0];
        }
    }
    return contentSource;
}

/**
 * Get previous gallery element in lightbox
 * @param {DOMElement} lightboxPicture 
 * @param {DOMElement} sortedGalleryElements 
 * @param {DOMElement} sortedGalleryElementsPictures 
 * @param {DOMElement} sortedGalleryElementsTitles 
 */
function getPreviousGalleryElement(lightboxPicture, sortedGalleryElements, sortedGalleryElementsPictures, sortedGalleryElementsTitles) {

    let lightboxPictureContentSource = getContentSource(lightboxPicture.children[0], false);

    for (let i = 0; i < sortedGalleryElements.length; i++) {
        // Compare source name in lightbox with corresponding gallery source
        let sortedElementPictureSource = getContentSource(sortedGalleryElementsPictures[i].children[0], true);
        if (lightboxPictureContentSource == sortedElementPictureSource) {
            // Display lightbox previous and next buttons if it is the first or the last picture
            if (i == 1) {
                applyPictureAndTitleToLightbox(sortedGalleryElementsPictures[i-1], sortedGalleryElementsTitles[i-1], true, false);
            }
            else if (i == 0) {
                console.log("You've reached the first picture.");
            }
            else {
                applyPictureAndTitleToLightbox(sortedGalleryElementsPictures[i-1], sortedGalleryElementsTitles[i-1], false, false);
            }
        }
    }
}

/**
 * Get next gallery element in lightbox
 * @param {DOMElement} lightboxPicture 
 * @param {DOMElement} sortedGalleryElements 
 * @param {DOMElement} sortedGalleryElementsPictures 
 * @param {DOMElement} sortedGalleryElementsTitles 
 */
function getNextGalleryElement(lightboxPicture, sortedGalleryElements, sortedGalleryElementsPictures, sortedGalleryElementsTitles) {

    let lightboxPictureContentSource = getContentSource(lightboxPicture.children[0], false);

    for (let i = 0; i < sortedGalleryElements.length; i++) {
        // Compare source name in lightbox with corresponding gallery source
        let sortedElementPictureSource = getContentSource(sortedGalleryElementsPictures[i].children[0], true);
        if (lightboxPictureContentSource == sortedElementPictureSource) {
            // Display lightbox previous and next buttons if it is the first or the last picture
            if (i == sortedGalleryElements.length - 2) {
                applyPictureAndTitleToLightbox(sortedGalleryElementsPictures[i+1], sortedGalleryElementsTitles[i+1], false, true);
            }
            else if (i == sortedGalleryElements.length - 1) {
                console.log("You've reached the last picture.");
            }
            else {
                applyPictureAndTitleToLightbox(sortedGalleryElementsPictures[i+1], sortedGalleryElementsTitles[i+1], false, false);
            }
        }
    }
}

// Lightbox modal opening, navigation, closing with cross and closing with empty areas

setTimeout(function() {

    // - Opening -
    // !!!!!!!!!! IMPOSSIBLE DE RÉCUPÉRER L'ORDRE DE CLASSEMENT DES ÉLÉMENTS...!
    /*const galleryElements = document.querySelectorAll(".gallery_element");
    const galleryElementsPictures = document.querySelectorAll(".gallery_element_picture");
    const galleryElementsTitles = document.querySelectorAll(".gallery_element_legend_title");
    [sortedGalleryElements, sortedGalleryElementsPictures, sortedGalleryElementsTitles] = getSortedElementsPicturesAndTitles(galleryElements, galleryElementsPictures, galleryElementsTitles);
    */
    for (let i = 0; i < sortedGalleryElements.length; i++) {
        const sortedGalleryElementPicture = sortedGalleryElementsPictures[i];
        const sortedGalleryElementTitle = sortedGalleryElementsTitles[i];

        sortedGalleryElementPicture.addEventListener("click", function() {
            applyPictureAndTitleToLightbox(sortedGalleryElementPicture, sortedGalleryElementTitle, false, false);
            // Display lightbox previous and next buttons if it is the first or the last picture
            /*console.log("i", i);
            console.log("sortedGalleryElementPicture.style.order", sortedGalleryElements[i].style.order);
            if (sortedGalleryElements[i].style.order == 0) {
                applyPictureAndTitleToLightbox(sortedGalleryElementPicture, sortedGalleryElementTitle, true, false);
            }
            else if (sortedGalleryElements[i].style.order == sortedGalleryElements.length - 1) {
                applyPictureAndTitleToLightbox(sortedGalleryElementPicture, sortedGalleryElementTitle, false, true);
            }
            else {
                applyPictureAndTitleToLightbox(sortedGalleryElementPicture, sortedGalleryElementTitle, false, false);
            }*/
            launchLightboxModal();
        });
    }

    // - Navigation between gallery pictures -
    lightboxModalPreviousButton.addEventListener("click", function() {
        getPreviousGalleryElement(lightboxPicture, sortedGalleryElements, sortedGalleryElementsPictures, sortedGalleryElementsTitles);
    });
    lightboxModalNextButton.addEventListener("click", function() {
        getNextGalleryElement(lightboxPicture, sortedGalleryElements, sortedGalleryElementsPictures, sortedGalleryElementsTitles);
    });
    window.addEventListener("keydown", function(event) {
        if (lightboxModalContent.getAttribute("aria-hidden") == "false" && event.key == "ArrowLeft") {
            getPreviousGalleryElement(lightboxPicture, sortedGalleryElements, sortedGalleryElementsPictures, sortedGalleryElementsTitles);
        }
        if (lightboxModalContent.getAttribute("aria-hidden") == "false" && event.key == "ArrowRight") {
            getNextGalleryElement(lightboxPicture, sortedGalleryElements, sortedGalleryElementsPictures, sortedGalleryElementsTitles);
        }
    });

    // - Closing with cross -
    lightboxModalCloseCross.addEventListener("click", closeLightboxModal);

    // - Closing with escape key -
    window.addEventListener("keydown", function(event) {
        if (lightboxModalContent.getAttribute("aria-hidden") == "false" && event.key == "Escape") {
            closeLightboxModal();
        }
    });

    // - Closing on empty areas -
    lightboxModalBackground.addEventListener("click", function(event) {
        var clickedElement = event.target;
        let isClickedEmpty = true;
        // Not closing on picture content
        if (clickedElement.nodeName == "VIDEO" || clickedElement.nodeName == "IMG") {
            isClickedEmpty = false;
        }
        // Not closing on filled elements
        else {
            const lightboxNotEmptyClasses = ["lightbox_close", "lightbox_previousbutton",
                                             "lightbox_nextbutton", "lightbox_container",
                                             "lightbox_container_picture", "lightbox_container_title"];
            for (let i = 0; i < lightboxNotEmptyClasses.length; i++) {
                if (clickedElement.className == lightboxNotEmptyClasses[i]) {
                    isClickedEmpty = false;
                }
            }
        }
        if (isClickedEmpty) {
            closeLightboxModal();
        }
    });

}, 1000);
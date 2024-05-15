'use strict';


// make new string method
String.prototype.contains = function (characters) {

    let str = this.valueOf();

    for (let character of characters) {

        for (let element of str) {

            if (element == character) {
                return true;
            }
        }
    }

    return false;
}



class Candidate {

    static candidates = [];
    static submitted = 0;
    static baseWidth;
    static selectedCandidate;

    constructor(candidateElements) {

        this.completed = false;

        this.supress = false;

        this.candidateElements = candidateElements;

        this.candidateInfo = {
            firstName: '',
            lastName:  '',
            grade:     '',
            position:  '',
            message:   '',
            image:     ''
        };

        // this will be a dictionary of all of the html inputs that coorespond to each type of candidate data
        this.inputReferences = {
            firstNameInput: candidateElements.firstNameInputBox, 
            lastNameInput:  candidateElements.lastNameInputBox, 
            gradeInput:     candidateElements.gradeInputBox, 
            positionInput:  candidateElements.positionInputBox,
            messageInput:   candidateElements.messageInputBox,
            imageInput:     candidateElements.imageInputBox
        };

        // add candidate to class candidate array
        Candidate.candidates.push(this);
    }



    // this will be the function that will verify and adjust the inputted data
    verifyData() {

        console.log('Data is being verified and re-formatted.');

        // remove whitespace in first & last name input fields
        this.inputReferences.firstNameInput.value = this.inputReferences.firstNameInput.value.trim();
        this.inputReferences.lastNameInput.value = this.inputReferences.lastNameInput.value.trim();

        // uppercase the first letter and lowercase the rest of each input
        this.inputReferences.firstNameInput.value = this.inputReferences.firstNameInput.value.substring(0, 1).toUpperCase() + this.inputReferences.firstNameInput.value.substring(1, this.inputReferences.firstNameInput.value.length).toLowerCase();
        this.inputReferences.lastNameInput.value = this.inputReferences.lastNameInput.value.substring(0, 1).toUpperCase() + this.inputReferences.lastNameInput.value.substring(1, this.inputReferences.lastNameInput.value.length).toLowerCase();

        let sentenceTerminators = '!.?';

        let newSentence = '';

        let previousIsTerminator = false;

        // do stuff here to reformat the inputted sentence
        for (let character of this.inputReferences.messageInput.value.trim()) {

            if (previousIsTerminator && !character.contains(sentenceTerminators)) {
                if (character === ' ' || character === '\n') {
                    continue;

                } else {
                    newSentence += '\n' + character.toUpperCase();
                    previousIsTerminator = false;
                }
            
            } else if (previousIsTerminator && character.contains(sentenceTerminators)) {
                newSentence += character;

            } else if (character.contains(sentenceTerminators)) {
                previousIsTerminator = true;
                newSentence += character;

            } else {
                newSentence += character;
            }
        }

        // make sure there is a sentence terminator at the end
        if (!(newSentence.substring(newSentence.length - 1, newSentence.length).contains(sentenceTerminators))) {
            newSentence += '.';
        }



        let fullSentence = newSentence.substring(0, 1).toUpperCase() + newSentence.substring(1, newSentence.length);
        this.candidateElements.messageContainer.innerText = fullSentence;
        this.inputReferences.messageInput.value = fullSentence;
        return;
    }



    // this function will check for any errors in the inputted data and display error text accordingly
    putErrorMessage() {

        let errorFound = false;

        // check to make sure all fields are inputted
        for (let input of Object.values(this.inputReferences)) {

            if (input.value == '' || (input.type == 'select' && input.value == 'null')) {

                this.candidateElements[input.name].innerHTML = 'Please fill out this field.';
                this.candidateElements[input.name].style.left = input.offsetLeft + 'px';
                this.candidateElements[input.name].style.display = 'initial';

                errorFound = true;

            } else {
                this.candidateElements[input.name].style.display = 'none';
            }
        }

        // check to see if there are any special characters in the first & last name inputs
        for (let character of '!@#$%^&*()_=+[]{}\\|;:,<>/?') {

            if (this.inputReferences.firstNameInput.value != '' && this.inputReferences.firstNameInput.value.indexOf(character) != -1) {

                this.candidateElements['firstNameError'].innerHTML = 'First name cannot contain special characters.';
                this.candidateElements[input.name].style.left = input.offsetLeft + 'px';
                this.candidateElements['firstNameError'].style.display = 'initial';

                this.inputReferences.firstNameInput.value = '';

                errorFound = true;
            }

            if (this.inputReferences.lastNameInput.value != '' && this.inputReferences.lastNameInput.value.indexOf(character) != -1) {

                this.candidateElements['lastNameError'].innerHTML = 'Last name cannot contain special characters.';
                this.candidateElements[input.name].style.left = input.offsetLeft + 'px';
                this.candidateElements['lastNameError'].style.display = 'initial';

                this.inputReferences.lastNameInput.value = '';

                errorFound = true;
            }
        }

        // check for mismatching grade number in the grade input and the position input (i.e. a grade 9 student can't be the grade 12 rep)
        if (
            (this.inputReferences.positionInput.value === 'Grade 10 Representative' && this.inputReferences.gradeInput.value != 'null' && this.inputReferences.gradeInput.value != '10') ||
            (this.inputReferences.positionInput.value === 'Grade 11 Representative' && this.inputReferences.gradeInput.value != 'null' && this.inputReferences.gradeInput.value != '11') ||
            (this.inputReferences.positionInput.value === 'Grade 12 Representative' && this.inputReferences.gradeInput.value != 'null' && this.inputReferences.gradeInput.value != '12')
        ) {

            this.candidateElements['gradeError'].innerHTML = 'Mismatching grade with positon input.';
            this.candidateElements['gradeError'].style.left = input.offsetLeft + 'px';
            this.candidateElements['gradeError'].style.display = 'initial';

            this.candidateElements['positionError'].innerHTML = 'Mismatching grade with grade input.';
            this.candidateElements['positionError'].style.left = input.offsetLeft + 'px';
            this.candidateElements['positionError'].style.display = 'initial';

            errorFound = true;
        }

        return errorFound;
    }



    // this will be the function that is called when the user submits data
    submitData() {

        // check to see if there are any errors in the inputs
        if (this.putErrorMessage()) {return true;}

        // reformat the inputted data
        this.verifyData();

        // update input box information and submission state image
        this.candidateElements.divHeaderSpan.innerHTML = this.candidateElements.divHeaderSpan.innerHTML.replaceAll('Not Submitted', (this.inputReferences.lastNameInput.value + ', ' + this.inputReferences.firstNameInput.value));
        this.candidateElements.submissionStateImage.setAttribute('src', 'assets/checkmark.png');
        
        // change buttons that are visible
        this.candidateElements.submitButton.style.display = 'none';
        this.candidateElements.editButton.style.display = 'inline-block';

        // save information
        let candidateInfoKeys = Object.keys(this.candidateInfo);
        let inputReferenceKeys = Object.keys(this.inputReferences);

        for (let i = 0; i < candidateInfoKeys.length; i++) {

            if (candidateInfoKeys[i] == 'image') {
                this.candidateInfo[candidateInfoKeys[i]] = this.inputReferences[inputReferenceKeys[i]].files[0];
                continue;
            }

            this.candidateInfo[candidateInfoKeys[i]] = this.inputReferences[inputReferenceKeys[i]].value;
        }

        // update info display
        let candidateTextKeys = Object.keys(this.candidateElements.displayText);

        for (let i = 0; i < candidateInfoKeys.length; i++) {

            if (candidateInfoKeys[i] == 'message') {
                this.candidateElements.messageContainer.style.display = 'block';
                continue;
            }

            this.candidateElements.displayText[candidateTextKeys[i]].innerHTML += this.candidateInfo[candidateInfoKeys[i]];
        }

        // hide input boxes
        for (let key of Object.keys(this.inputReferences)) {

            this.inputReferences[key].style.display = 'none';
        }

        // set full name attribute
        this.candidateInfo.fullName = this.candidateInfo.lastName + ', ' + this.candidateInfo.firstName;

        // update variable so that the candidate is considered completed
        this.completed = true;
        Candidate.submitted++;

        // update the information on the info bar
        Candidate.updateInfoBar();

        // adjust the size of the candidate divs
        this.adjustDivs();

        // update input field size
        this.candidateElements.inputDiv.style.width = this.candidateElements.inputDiv.scrollWidth + 'px';
        this.candidateElements.candidateDiv.style.width = this.candidateElements.inputDiv.scrollWidth + 'px';
        this.candidateElements.inputDiv.style.maxHeight = this.candidateElements.inputDiv.scrollHeight + 'px';

        return false;
    }



    // this function will be called when the user wants to edit the inputted data
    editData() {

        // reset prompt text
        let candidateInfoKeys = Object.keys(this.candidateInfo);
        let candidateTextKeys = Object.keys(this.candidateElements.displayText);

        // reset header text
        let endIndex = this.candidateElements.divHeaderSpan.innerHTML.lastIndexOf('>') + 1;
        this.candidateElements.divHeaderSpan.innerHTML = this.candidateElements.divHeaderSpan.innerHTML.substring(0, endIndex) + 'Not Submitted';

        for (let i = 0; i < candidateInfoKeys.length; i++) {

            if (candidateInfoKeys[i] == 'message') {
                this.candidateElements.messageContainer.style.display = 'none';
                continue;
            }

            this.candidateElements.displayText[candidateTextKeys[i]].innerHTML = '';
        }

        // put input boxes back on screen
        for (let key of Object.keys(this.inputReferences)) {

            this.inputReferences[key].style.display = 'initial';
        }

        
        
        // update variable to show that the candidate is not complete
        this.completed = false;
        Candidate.submitted--;

        // update the information on the info bar
        Candidate.updateInfoBar();

        // update submission state image to show that the candidate is not complete
        this.candidateElements.submissionStateImage.setAttribute('src', 'assets/crossmark.png');

        // update variable to prevent the user from closing this input box until they are done editing
        this.supress = true;

        // update input field size
        this.candidateElements.inputDiv.style.maxHeight = this.candidateElements.inputDiv.scrollHeight + 'px';
        this.candidateElements.candidateDiv.style.width = this.initialWidth - 16 + 'px';
        
        // remove 'edit' button and display 'save' and 'cancel' buttons
        this.candidateElements.editButton.style.display = 'none';
        this.candidateElements.saveButton.style.display = 'inline-block';
        this.candidateElements.cancelButton.style.display = 'inline-block';
    }



    // this function will be called when the user saves the edited data
    saveData() {

        // call 'submitData' function
        if (this.submitData()) {return;}

        // hide buttons
        this.candidateElements.saveButton.style.display = 'none';
        this.candidateElements.cancelButton.style.display = 'none';

        // update variable to allow the user to open or close this input box
        this.supress = false;
    }



    // this function will be called when the user cancels the info edit they are making
    cancelDataEdit() {

        // put original text in prompt text, and hide input boxes
        let candidateInfoKeys = Object.keys(this.candidateInfo);
        let inputReferenceKeys = Object.keys(this.inputReferences);
        let candidateTextKeys = Object.keys(this.candidateElements.displayText);

        for (let i = 0; i < candidateInfoKeys.length; i++) {

            if (candidateInfoKeys[i] == 'message') {
                this.candidateElements.messageContainer.style.display = 'initial';
                this.inputReferences[inputReferenceKeys[i]].style.display = 'none';
                continue;
            }

            this.candidateElements.displayText[candidateTextKeys[i]].innerHTML = this.candidateInfo[candidateInfoKeys[i]];
            this.inputReferences[inputReferenceKeys[i]].style.display = 'none';
        }

        // remove 'save' and 'cancel' buttons and add 'edit' button
        this.candidateElements.saveButton.style.display = 'none';
        this.candidateElements.cancelButton.style.display = 'none';
        this.candidateElements.editButton.style.display = 'inline-block';

        // update input field size
        this.candidateElements.inputDiv.style.maxHeight = this.candidateElements.inputDiv.scrollHeight + 'px';

        // update variable to allow the user to open or close this input box
        this.supress = false;

        // update variable to show that the candidate is complete
        this.completed = true;
        Candidate.submitted++;

        // update the information on the info bar
        Candidate.updateInfoBar();

        // update input box information and submission state image
        this.candidateElements.divHeaderSpan.innerHTML = this.candidateElements.divHeaderSpan.innerHTML.replaceAll('Not Submitted', (this.inputReferences.lastNameInput.value + ', ' + this.inputReferences.firstNameInput.value));
        this.candidateElements.submissionStateImage.setAttribute('src', 'assets/checkmark.png');

        // run submit function to format stuff
        this.submitData();
    }



    // function that will create the candidate input page
    static createInputPage() {

        let master = document.getElementById('input-master-div');

        // make 10 boxes
        for (let i = 0; i < 10; i++) {

            // create candidate group
            let candidateItems = {

                candidateDiv: document.createElement('div'), // create candidate div

                headerDiv: document.createElement('div'), // create div for header

                ddArrow: document.createElement('img'),              // drop down arrow
                submissionStateImage: document.createElement('img'), // submission state image
                divHeaderSpan: document.createElement('span'),       // div header span


                inputDiv: document.createElement('div'), // div to hold all of the input stuff

                firstNameDiv: document.createElement('div'),        // div to hold this input group
                firstNamePrompt: document.createElement('span'),    // first name input prompt
                firstNameContainer: document.createElement('span'), // span to hold the first name text
                firstNameInputBox: document.createElement('input'), // first name input box
                'firstNameError': document.createElement('span'),   // span for error message

                lastNameDiv: document.createElement('div'),        // div to hold this input group
                lastNamePrompt: document.createElement('span'),    // last name input prompt
                lastNameContainer: document.createElement('span'), // span to hold the last name text
                lastNameInputBox: document.createElement('input'), // last name input box
                'lastNameError': document.createElement('span'),   // span for error message

                gradeDiv: document.createElement('div'),         // div to hold this input group
                gradePrompt: document.createElement('span'),     // grade input prompt
                gradeContainer: document.createElement('span'),  // span to hold the grade text
                gradeInputBox: document.createElement('select'), // grade input box
                'gradeError': document.createElement('span'),    // span for error message

                positionDiv: document.createElement('div'),         // div to hold this input group
                positionPrompt: document.createElement('span'),     // position input prompt
                positionContainer: document.createElement('span'),  // span to hold the position text
                positionInputBox: document.createElement('select'), // position input box
                'positionError': document.createElement('span'),    // span for error message

                messageDiv: document.createElement('div'),        // div to hold this input group
                messagePrompt: document.createElement('span'),    // message input prompt
                messageContainer: document.createElement('p'),    // paragraph to hold the message text
                messageInputBox: document.createElement('input'), // message input box
                'messageError': document.createElement('span'),   // span for error message

                imageDiv: document.createElement('div'),              // div to hold this input group
                imagePrompt: document.createElement('span'),          // image input prompt
                imageContainer: document.createElement('span'),       // span to hold the image text
                imageInputBox: document.createElement('input'),       // image input box
                imagePreviewDiv: document.createElement('div'),       // div for image preview
                imagePreview: document.createElement('img'),          // image preview 
                imageSubmitPreviewDiv: document.createElement('div'), // another image prompt for the submitted data
                imageSubmitPreview: document.createElement('img'),    // image preview
                'imageError': document.createElement('span'),         // span for error message

                buttonDiv: document.createElement('div'),       // div to hold the buttons
                submitButton: document.createElement('button'), // submit button
                editButton: document.createElement('button'),   // edit button
                saveButton: document.createElement('button'),   // save edits button
                cancelButton: document.createElement('button'), // cancel edits button
            };

            candidateItems.displayText = { // dicitonary to hold the input prompts
                firstName: candidateItems.firstNameContainer,
                lastName: candidateItems.lastNameContainer,
                grade: candidateItems.gradeContainer,
                position: candidateItems.positionContainer,
                message: candidateItems.messageContainer,
                image: candidateItems.imageContainer
            };

            candidateItems.inputContainers = {
                firstName: candidateItems.firstNameDiv,
                lastName: candidateItems.lastNameDiv,
                grade: candidateItems.gradeDiv,
                position: candidateItems.positionDiv,
                message: candidateItems.messageDiv,
                image: candidateItems.imageDiv
            };


            // set attributes of header elements
            candidateItems.candidateDiv.setAttribute('class', 'candidate-div');

            candidateItems.headerDiv.setAttribute('class', 'header-div');


            candidateItems.ddArrow.setAttribute('src', 'assets/ddarrow closed.png');
            candidateItems.ddArrow.setAttribute('class', 'dd-arrow');

            candidateItems.submissionStateImage.setAttribute('src', 'assets/crossmark.png');
            candidateItems.submissionStateImage.setAttribute('class', 'submission-state-image');

            candidateItems.divHeaderSpan.setAttribute('class', 'div-header-text');
            candidateItems.divHeaderSpan.innerHTML = '<b>Candidate ' + (i+1) + ': </b>Not Submitted';


            // set attribute for input div
            candidateItems.inputDiv.setAttribute('class', 'input-div hidden-on-load');

            // set attribute for button div
            candidateItems.buttonDiv.setAttribute('class', 'button-div');


            // set attributes for the individual divs that hold the input info
            candidateItems.firstNameDiv.setAttribute('class', 'input-group');
            candidateItems.lastNameDiv.setAttribute('class', 'input-group');
            candidateItems.gradeDiv.setAttribute('class', 'input-group');
            candidateItems.positionDiv.setAttribute('class', 'input-group');
            candidateItems.messageDiv.setAttribute('class', 'input-group');
            candidateItems.imageDiv.setAttribute('class', 'input-group');
            
            // set attributes for first name input
            candidateItems.firstNamePrompt.setAttribute('class', 'input-prompt');
            candidateItems.firstNamePrompt.innerHTML = '<b>First Name: </b>';

            candidateItems.firstNameContainer.setAttribute('class', 'input-container');

            candidateItems.firstNameInputBox.setAttribute('class', 'input-box');
            candidateItems.firstNameInputBox.setAttribute('type', 'text');
            candidateItems.firstNameInputBox.setAttribute('name', 'firstNameError');
            candidateItems.firstNameInputBox.setAttribute('maxlength', '50');
            candidateItems.firstNameInputBox.setAttribute('required', 'required');

            candidateItems['firstNameError'].setAttribute('class', 'error-message');
            candidateItems['firstNameError'].innerHTML = 'Please fill out this field.';



            // set attributes for last name input
            candidateItems.lastNamePrompt.setAttribute('class', 'input-prompt');
            candidateItems.lastNamePrompt.innerHTML = '<b>Last Name: </b>';

            candidateItems.lastNameContainer.setAttribute('class', 'input-container');

            candidateItems.lastNameInputBox.setAttribute('class', 'input-box');
            candidateItems.lastNameInputBox.setAttribute('type', 'text');
            candidateItems.lastNameInputBox.setAttribute('name', 'lastNameError');
            candidateItems.lastNameInputBox.setAttribute('maxlength', '50');
            candidateItems.lastNameInputBox.setAttribute('required', 'required');

            candidateItems['lastNameError'].setAttribute('class', 'error-message');
            candidateItems['lastNameError'].innerHTML = 'Please fill out this field.';


            // set attributes for grade input
            candidateItems.gradePrompt.setAttribute('class', 'input-prompt');
            candidateItems.gradePrompt.innerHTML = '<b>Grade: </b>';

            candidateItems.gradeContainer.setAttribute('class', 'input-container');
            
            candidateItems.gradeInputBox.setAttribute('class', 'input-box');
            candidateItems.gradeInputBox.setAttribute('name', 'gradeError');
            candidateItems.gradeInputBox.setAttribute('required', 'required');
            candidateItems.gradeInputBox.innerHTML = (
                '<option value="">Choose an option</option>' +
                '<option value="9">9</option>' + 
                '<option value="10">10</option>' +
                '<option value="11">11</option>' +
                '<option value="12">12</option>'
            );

            candidateItems['gradeError'].setAttribute('class', 'error-message');
            candidateItems['gradeError'].innerHTML = 'Please fill out this field.';


            // set attributes for position input
            candidateItems.positionPrompt.setAttribute('class', 'input-prompt');
            candidateItems.positionPrompt.innerHTML = '<b>Position: </b>';

            candidateItems.positionContainer.setAttribute('class', 'input-container');

            candidateItems.positionInputBox.setAttribute('class', 'input-box');
            candidateItems.positionInputBox.setAttribute('name', 'positionError');
            candidateItems.positionInputBox.setAttribute('required', 'required');
            candidateItems.positionInputBox.innerHTML = (
                '<option value="">Choose an option</option>' +
                '<option value="Grade 10 Representative">Grade 10 Representative</option>' +
                '<option value="Grade 11 Representative">Grade 11 Representative</option>' +
                '<option value="Grade 12 Representative">Grade 12 Representative</option>' +
                '<option value="Social Media Manager Apprentice">Social Media Manager Apprentice</option>' +
                '<option value="Physical Artist Apprentice">Physical Artist Apprentice</option>' +
                '<option value="Videographer Apprentice">Videographer Apprentice</option>'
            );

            candidateItems['positionError'].setAttribute('class', 'error-message');
            candidateItems['positionError'].innerHTML = 'Please fill out this field.';


            // set attributes for message input
            candidateItems.messagePrompt.setAttribute('class', 'input-prompt');
            candidateItems.messagePrompt.innerHTML = '<b>Message: </b>';

            candidateItems.messageContainer.setAttribute('class', 'paragraph-container hidden-on-load');

            candidateItems.messageInputBox.setAttribute('class', 'input-box');
            candidateItems.messageInputBox.setAttribute('type', 'text');
            candidateItems.messageInputBox.setAttribute('name', 'messageError');
            candidateItems.messageInputBox.setAttribute('maxlength', '200');
            candidateItems.messageInputBox.setAttribute('required', 'required');

            candidateItems['messageError'].setAttribute('class', 'error-message');
            candidateItems['messageError'].innerHTML = 'Please fill out this field.';


            // set attributes for image input
            candidateItems.imagePrompt.setAttribute('class', 'input-prompt');
            candidateItems.imagePrompt.innerHTML = '<b>Image: </b>';

            candidateItems.imageContainer.setAttribute('class', 'input-container image-container');

            candidateItems.imageInputBox.setAttribute('class', 'input-box image-input');
            candidateItems.imageInputBox.setAttribute('type', 'file');
            candidateItems.imageInputBox.setAttribute('name', 'imageError');
            candidateItems.imageInputBox.setAttribute('accept', 'image/*');
            candidateItems.imageInputBox.setAttribute('required', 'required');

            candidateItems.imagePreviewDiv.setAttribute('class', 'preview-div hidden-on-load');
            candidateItems.imagePreview.setAttribute('class', 'preview-image');
            candidateItems.imagePreview.setAttribute('alt', 'Image Preveiw');

            candidateItems.imageSubmitPreviewDiv.setAttribute('class', 'preview-div hidden-on-load');
            candidateItems.imageSubmitPreview.setAttribute('class', 'preview-image');

            candidateItems['imageError'].setAttribute('class', 'error-message');
            candidateItems['imageError'].innerHTML = 'Please fill out this field.';


            // set attributes for buttons
            candidateItems.submitButton.setAttribute('class', 'submission-button');
            let submitButtonFunction = 'Candidate.candidates[' + i + '].submitData();';
            candidateItems.submitButton.setAttribute('onclick', submitButtonFunction);
            candidateItems.submitButton.innerHTML = 'Submit';

            candidateItems.editButton.setAttribute('class', 'submission-button hidden-on-load');
            let editButtonFunction = 'Candidate.candidates[' + i + '].editData();';
            candidateItems.editButton.setAttribute('onclick', editButtonFunction);
            candidateItems.editButton.innerHTML = 'Edit';
            
            candidateItems.saveButton.setAttribute('class', 'submission-button hidden-on-load');
            let saveButtonFunction = 'Candidate.candidates[' + i + '].saveData();';
            candidateItems.saveButton.setAttribute('onclick', saveButtonFunction);
            candidateItems.saveButton.innerHTML = 'Save';

            candidateItems.cancelButton.setAttribute('class', 'submission-button hidden-on-load');
            let cancelButtonFunction = 'Candidate.candidates[' + i + '].cancelDataEdit();'; 
            candidateItems.cancelButton.setAttribute('onclick', cancelButtonFunction);
            candidateItems.cancelButton.innerHTML = 'Cancel';



            // piece all of the elements together
            master.appendChild(candidateItems.candidateDiv);

            candidateItems.candidateDiv.appendChild(candidateItems.headerDiv);
            candidateItems.candidateDiv.appendChild(candidateItems.inputDiv);

            candidateItems.headerDiv.appendChild(candidateItems.ddArrow);
            candidateItems.headerDiv.appendChild(candidateItems.submissionStateImage);
            candidateItems.headerDiv.appendChild(candidateItems.divHeaderSpan);
            
            candidateItems.inputDiv.appendChild(candidateItems.firstNameDiv);
            candidateItems.inputDiv.appendChild(candidateItems.lastNameDiv);
            candidateItems.inputDiv.appendChild(candidateItems.gradeDiv);
            candidateItems.inputDiv.appendChild(candidateItems.positionDiv);
            candidateItems.inputDiv.appendChild(candidateItems.messageDiv);
            candidateItems.inputDiv.appendChild(candidateItems.imageDiv);
            candidateItems.inputDiv.appendChild(candidateItems.buttonDiv);

            candidateItems.firstNameDiv.appendChild(candidateItems.firstNamePrompt);
            candidateItems.firstNamePrompt.appendChild(candidateItems.firstNameContainer);
            candidateItems.firstNameDiv.appendChild(candidateItems.firstNameInputBox);
            candidateItems.firstNameDiv.appendChild(candidateItems['firstNameError']);

            candidateItems.lastNameDiv.appendChild(candidateItems.lastNamePrompt);
            candidateItems.lastNamePrompt.appendChild(candidateItems.lastNameContainer);
            candidateItems.lastNameDiv.appendChild(candidateItems.lastNameInputBox);
            candidateItems.lastNameDiv.appendChild(candidateItems['lastNameError']);

            candidateItems.gradeDiv.appendChild(candidateItems.gradePrompt);
            candidateItems.gradePrompt.appendChild(candidateItems.gradeContainer);
            candidateItems.gradeDiv.appendChild(candidateItems.gradeInputBox);
            candidateItems.gradeDiv.appendChild(candidateItems['gradeError']);

            candidateItems.positionDiv.appendChild(candidateItems.positionPrompt);
            candidateItems.positionPrompt.appendChild(candidateItems.positionContainer);
            candidateItems.positionDiv.appendChild(candidateItems.positionInputBox);
            candidateItems.positionDiv.appendChild(candidateItems['positionError']);

            candidateItems.messageDiv.appendChild(candidateItems.messagePrompt);
            candidateItems.messagePrompt.appendChild(candidateItems.messageContainer);
            candidateItems.messageDiv.appendChild(candidateItems.messageInputBox);
            candidateItems.messageDiv.appendChild(candidateItems['messageError']);

            candidateItems.imageDiv.appendChild(candidateItems.imagePrompt);
            candidateItems.imageDiv.appendChild(candidateItems.imageInputBox);
            candidateItems.imageDiv.appendChild(candidateItems.imagePreviewDiv);
            candidateItems.imagePreviewDiv.appendChild(candidateItems.imagePreview);
            candidateItems.imageDiv.appendChild(candidateItems.imageContainer);
            candidateItems.imageDiv.appendChild(candidateItems.imageSubmitPreviewDiv);
            candidateItems.imageSubmitPreviewDiv.appendChild(candidateItems.imageSubmitPreview);

            candidateItems.imageDiv.appendChild(candidateItems['imageError']);
            
            candidateItems.imageInputBox.onchange = evt => {
                const [file] = candidateItems.imageInputBox.files;
                if (file) {
                    candidateItems.imagePreview.src = URL.createObjectURL(file);
                    candidateItems.imageSubmitPreview.src = URL.createObjectURL(file);
                }
            }

            candidateItems.buttonDiv.appendChild(candidateItems.submitButton);
            candidateItems.buttonDiv.appendChild(candidateItems.editButton);
            candidateItems.buttonDiv.appendChild(candidateItems.saveButton);
            candidateItems.buttonDiv.appendChild(candidateItems.cancelButton);

            

            // make the class object
            let temp = new Candidate(candidateItems);

            // give div collapsible functionalities
            candidateItems.headerDiv.addEventListener('click', function() {temp.animateDiv();});
        }
    }



    // function to give the div collapsible functionalities
    animateDiv() {

        if (this.supress) {return;}

        let content = this.candidateElements;

        // close div
        if (content.inputDiv.style.maxHeight) {

            this.expanded = false;

            content.candidateDiv.style.width = this.initialWidth - 16 + 'px';

            content.inputDiv.style.maxHeight = null;

            content.ddArrow.setAttribute('src', 'assets/ddarrow closed.png');

            // disable inputs
            for (let input of Object.values(this.inputReferences)) {

                input.disabled = true;
            }

        // open div
        } else {
            
            this.expanded = true;

            this.initialWidth = content.candidateDiv.offsetWidth;

            content.inputDiv.style.maxHeight = content.inputDiv.scrollHeight + 'px';

            content.candidateDiv.style.width = content.inputDiv.scrollWidth + 'px';

            content.ddArrow.setAttribute('src', 'assets/ddarrow open.png');

            // enable inputs
            let inputs = Object.values(this.inputReferences);

            for (let input of inputs) {

                input.disabled = false;
            }
        }
    }



    // function to adjust the size of the divs
    adjustDivs() {

        let largestDiv = 0;

        for (let candidate of Candidate.candidates) {

            if (candidate == this || candidate.expanded) {
                continue;
            }

            candidate = candidate.candidateElements.candidateDiv;

            if (candidate.offsetWidth > largestDiv) {
                largestDiv = candidate.offsetWidth;
            }
        }

    for (let candidate of Candidate.candidates) {

        if (candidate == this || candidate.expanded) {
            continue;
        }

        candidate = candidate.candidateElements.candidateDiv;

        candidate.style.display = 'block';
        candidate.style.width = largestDiv - 16 + 'px';
    }

    Candidate.baseWidth = largestDiv + 'px';
}

    // function to update the info bar depending on the candidates submitted
    static updateInfoBar() {

        let candidateCounter = document.getElementById('candidate-counter');
        let endInputButton = document.getElementById('end-candidate-input');

        // adjust header div size
        let infoBar = document.getElementById('info-bar');
        document.getElementById('info-bar-placeholder').style.height = infoBar.offsetHeight + 'px';

        candidateCounter.innerText = Candidate.submitted + '/' + Candidate.candidates.length;

        if (Candidate.submitted === Candidate.candidates.length) {

            candidateCounter.style.display = 'none';
            endInputButton.style.display = 'inline-block';

        } else {

            candidateCounter.style.display = 'none';
            endInputButton.style.display = 'inline-block';
        }
    }



    // function to create the candidate voting page
    static loadVotingPage() {

        // hide submission page
        document.getElementById('input-master-div').style.display = 'none';

        // hide 'vote' button, and replace it with something that tells the user which candidate they have selected.
        document.getElementById('end-candidate-input').style.display = 'none';
        document.getElementById('submission-div').style.display = 'inline-block';

        // adjust header div size
        let infoBar = document.getElementById('info-bar');
        document.getElementById('info-bar-placeholder').style.height = infoBar.offsetHeight + 'px';

        // load master div
        let master = document.getElementById('voting-master-div');

        // set max size
        master.style.width = window.innerWidth - 128 + 'px';

        for (let candidate of Candidate.candidates) {

            if (!(candidate.completed)) {
                continue;
            }

            let votingItems = {

                votingDiv: document.createElement('div'), // div to hold all of the candidate's info

                imageDiv: document.createElement('div'), // div to hold the image

                candidateImage: document.createElement('img'), // image tag to display the candidate image

                infoDiv: document.createElement('div'), // div to hold the candidate info

                candidateName: document.createElement('p'), // paragraph to display the candidate's full name

                candidatePosition: document.createElement('p'), // paragraph to display the candidate's position and grade (don't load grade if position contains grade info)

                candidateMessage: document.createElement('p') // paragraph to display the candidate's message

            };


    
            // set classes for voting div
            votingItems.votingDiv.setAttribute('class', 'voting-div grow-small');

            // set classes for image div and candidate image
            votingItems.imageDiv.setAttribute('class', 'image-div');
            votingItems.candidateImage.setAttribute('class', 'candidate-image');

            // set classes for info div and its content
            votingItems.infoDiv.setAttribute('class', 'info-div');
            votingItems.candidateName.setAttribute('class', 'candidate-info');
            votingItems.candidatePosition.setAttribute('class', 'candidate-info');
            votingItems.candidateMessage.setAttribute('class', 'candidate-info message-container');

            // set data for candidate info
            // URL.createObjectURL(candidate.candidateInfo.image);
            let image = URL.createObjectURL(candidate.candidateInfo.image);
            votingItems.candidateImage.style.backgroundImage = image;
            votingItems.candidateImage.setAttribute('src', image);
            votingItems.candidateName.innerHTML = '<b>Full Name: </b>' + candidate.candidateInfo.fullName;


            if (['Grade 10 Representative', 'Grade 11 Representative', 'Grade 12 Representative'].indexOf(candidate.candidateInfo.position) != -1) {
                votingItems.candidatePosition.innerHTML = '<b>Grade & Position: </b>' + candidate.candidateInfo.position;
            } else {
                votingItems.candidatePosition.innerHTML = '<b>Grade & Position: </b> Grade ' + candidate.candidateInfo.grade + ', ' + candidate.candidateInfo.position;
            }

            votingItems.candidateMessage.innerHTML = '<b>Message: </b>' + candidate.candidateInfo.message;



            // add divs to page
            master.appendChild(votingItems.votingDiv);

            votingItems.votingDiv.appendChild(votingItems.imageDiv);
            votingItems.votingDiv.appendChild(votingItems.infoDiv);

            votingItems.imageDiv.appendChild(votingItems.candidateImage);

            votingItems.infoDiv.appendChild(votingItems.candidateName);
            votingItems.infoDiv.appendChild(votingItems.candidatePosition);
            votingItems.infoDiv.appendChild(votingItems.candidateMessage);



            // add new data to candidate object
            candidate.votingElements = votingItems;



            votingItems.votingDiv.addEventListener('click', function() {candidate.selectCandidate();});
        }
    }



    selectCandidate() {

        if (this.supress) {return;}

        for (let option of Candidate.candidates) {
            try {
                option.votingElements.votingDiv.id = '';
            } catch {}
        }

        if (this === Candidate.selectedCandidate) {
            Candidate.selectedCandidate = null;
            this.votingElements.votingDiv.id = '';

        } else {
            this.votingElements.votingDiv.id = 'grow-enlarge';
            Candidate.selectedCandidate = this;
        }

        Candidate.updateSelectedCandidate();

        // branchlessly update selected candidate instead of using if/else because why not
        // candidate.votingElements.votingDiv.id = 'grow-enlarge'.repeat(+(candidate === Candidate.selectedCandidate)) + '';
        // Candidate.selectedCandidate = candidate * (candidate != Candidate.selectedCandidate) + null * (candidate === Candidate.selectedCandidate);

    }



    // update the display for the selected candidate
    static updateSelectedCandidate() {

        if (Candidate.selectedCandidate) {
            document.getElementById('candidate-choice-display').innerText = 'Candidate: ' + Candidate.selectedCandidate.candidateInfo.fullName;
            document.getElementById('submit-candidate').style.display = 'inline-block';

        } else {
            document.getElementById('candidate-choice-display').innerText = 'Candidate: Not Selected';
            document.getElementById('submit-candidate').style.display = 'none';
        }

        // adjust header div size
        let infoBar = document.getElementById('info-bar');
        document.getElementById('info-bar-placeholder').style.height = infoBar.offsetHeight + 'px';
    }



    static submitVote() {

        let userChoice = Candidate.selectedCandidate;

        // hide other candidates
        for (let candidate of Candidate.candidates) {

            if (candidate != userChoice) {
                try {
                    candidate.votingElements.votingDiv.style.display = 'none';
                } catch {}
            }
        }

        // remove emphasis and event listener on selected candidate
        userChoice.votingElements.votingDiv.id = '';
        userChoice.supress = true;

        // update candidate size
        let newWidth = userChoice.votingElements.imageDiv.offsetWidth + userChoice.votingElements.infoDiv.offsetWidth + 64;
        if (newWidth < userChoice.votingElements.votingDiv.offsetWidth) {
            userChoice.votingElements.votingDiv.style.width = newWidth + 'px';
        }

        // change css properties
        userChoice.votingElements.votingDiv.style.cursor = 'initial';
        userChoice.votingElements.votingDiv.setAttribute('class', (userChoice.votingElements.votingDiv.getAttribute('class').replaceAll('grow', '')));

        // hide unnecessary text in header
        document.getElementById('submission-div').style.display = 'none'

        // display text to add more info
        document.getElementById('voting-result').style.display = 'inline-block';



        // add closing sentence
        let closingSentence = document.createElement('p');
        closingSentence.setAttribute('id', 'closing-sentence');
        closingSentence.innerText = 'Thank you for your submission.\nYou may now close this page.';

        document.getElementById('voting-master-div').appendChild(closingSentence);


    }
}



// make sure that all of the divs have the same width, and match them all to the longest div.
function start() {

    // make the candidate boxes
    Candidate.createInputPage();

    // update info in info bar
    Candidate.updateInfoBar();

    // adjust the div size to make them all the same width
    initialAdjustDivs();

    // adjust header div size
    let infoBar = document.getElementById('info-bar');
    document.getElementById('info-bar-placeholder').style.height = infoBar.offsetHeight + 'px';

    // infoBar.style.height = infoBar.offsetHeight + 'px';
}



// slightly different function that only gets called when the page loads
function initialAdjustDivs() {

    let candidates = document.getElementsByClassName('candidate-div');

    let largestDiv = 0;

    for (let candidate of candidates) {

        if (candidate.offsetWidth > largestDiv) {
            largestDiv = candidate.offsetWidth;
        }
    }

    for (let candidate of candidates) {

        candidate.style.display = 'block';
        candidate.style.width = largestDiv + 65 + 'px';
    }

    document.getElementById('input-master-div').style.width = window.innerWidth - 128 + 'px';

    for (let candidate of Candidate.candidates) {

        candidate.initialWidth = candidate.candidateElements.inputDiv.style.width + 'px';

        candidate.candidateElements.inputDiv.style.display = 'block';

        candidate.candidateElements.messageContainer.style.maxWidth = document.getElementById('input-master-div').offsetWidth;
    }

    Candidate.baseWidth = largestDiv + 65 + 'px';



}


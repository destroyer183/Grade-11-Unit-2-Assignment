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

    constructor(candidateDiv) {

        this.completed = false;

        this.supress = false;

        this.candidateDiv = candidateDiv;

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
            firstNameInput: candidateDiv.firstNameInputBox, 
            lastNameInput:  candidateDiv.lastNameInputBox, 
            gradeInput:     candidateDiv.gradeInputBox, 
            positionInput:  candidateDiv.positionInputBox,
            messageInput:   candidateDiv.messageInputBox,
            imageInput:     candidateDiv.imageInputBox
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
        this.candidateDiv.messageContainer.innerText = fullSentence;
        this.inputReferences.messageInput.value = fullSentence;
        return;
    }



    // this function will check for any errors in the inputted data and display error text accordingly
    putErrorMessage() {

        let errorFound = false;

        // check to make sure all fields are inputted
        for (let input of Object.values(this.inputReferences)) {

            if (input.value == '' || (input.type == 'select' && input.value == 'null')) {

                this.candidateDiv[input.name].innerHTML = 'Please fill out this field.';
                this.candidateDiv[input.name].style.display = 'initial';

                errorFound = true;

            } else {
                this.candidateDiv[input.name].style.display = 'none';
            }
        }

        // check to see if there are any special characters in the first & last name inputs
        for (let character of '!@#$%^&*()_=+[]{}\\|;:,<>/?') {

            if (this.inputReferences.firstNameInput.value != '' && this.inputReferences.firstNameInput.value.indexOf(character) != -1) {

                this.candidateDiv['firstNameError'].innerHTML = 'First name cannot contain special characters.';
                this.candidateDiv['firstNameError'].style.display = 'initial';

                this.inputReferences.firstNameInput.value = '';

                errorFound = true;
            }

            if (this.inputReferences.lastNameInput.value != '' && this.inputReferences.lastNameInput.value.indexOf(character) != -1) {

                this.candidateDiv['lastNameError'].innerHTML = 'Last name cannot contain special characters.';
                this.candidateDiv['lastNameError'].style.display = 'initial';

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

            this.candidateDiv['gradeError'].innerHTML = 'Mismatching grade with positon input.';
            this.candidateDiv['gradeError'].style.display = 'initial';

            this.candidateDiv['positionError'].innerHTML = 'Mismatching grade with grade input.';
            this.candidateDiv['positionError'].style.display = 'initial';

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
        this.candidateDiv.divHeaderSpan.innerHTML = this.candidateDiv.divHeaderSpan.innerHTML.replaceAll('Not Submitted', (this.inputReferences.lastNameInput.value + ', ' + this.inputReferences.firstNameInput.value));

        this.candidateDiv.submissionStateImage.setAttribute('src', 'assets/checkmark.png');
        
        // change buttons that are visible
        this.candidateDiv.submitButton.style.display = 'none';
        this.candidateDiv.editButton.style.display = 'inline-block';

        // save information
        let candidateInfoKeys = Object.keys(this.candidateInfo);
        let inputReferenceKeys = Object.keys(this.inputReferences);

        for (let i = 0; i < candidateInfoKeys.length; i++) {
            this.candidateInfo[candidateInfoKeys[i]] = this.inputReferences[inputReferenceKeys[i]].value;
        }

        // update info display
        let candidateTextKeys = Object.keys(this.candidateDiv.displayText);

        for (let i = 0; i < candidateInfoKeys.length; i++) {

            if (candidateInfoKeys[i] == 'message') {
                this.candidateDiv.messageContainer.style.display = 'flex';
                continue;
            }

            this.candidateDiv.displayText[candidateTextKeys[i]].innerHTML += this.candidateInfo[candidateInfoKeys[i]];
        }

        // hide input boxes
        for (let key of Object.keys(this.inputReferences)) {

            this.inputReferences[key].style.display = 'none';
        }

        // update variable so that the candidate is considered completed
        this.completed = true;

        // update input field size
        this.candidateDiv.inputDiv.style.maxHeight = this.candidateDiv.inputDiv.scrollHeight + 'px';

        return false;
    }



    // this function will be called when the user wants to edit the inputted data
    editData() {

        // reset prompt text
        let candidateInfoKeys = Object.keys(this.candidateInfo);
        let candidateTextKeys = Object.keys(this.candidateDiv.displayText);

        // reset header text
        let endIndex = this.candidateDiv.divHeaderSpan.innerHTML.lastIndexOf('>') + 1;
        this.candidateDiv.divHeaderSpan.innerHTML = this.candidateDiv.divHeaderSpan.innerHTML.substring(0, endIndex) + 'Not Submitted';

        for (let i = 0; i < candidateInfoKeys.length; i++) {

            if (candidateInfoKeys[i] == 'message') {
                this.candidateDiv.messageContainer.style.display = 'none';
                continue;
            }

            this.candidateDiv.displayText[candidateTextKeys[i]].innerHTML = '';
        }

        // put input boxes back on screen
        for (let key of Object.keys(this.inputReferences)) {

            this.inputReferences[key].style.display = 'initial';
        }

        // remove 'edit' button and display 'save' and 'cancel' buttons
        this.candidateDiv.editButton.style.display = 'none';
        this.candidateDiv.saveButton.style.display = 'inline-block';
        this.candidateDiv.cancelButton.style.display = 'inline-block';
        
        // update variable to show that the candidate is not complete
        this.completed = false;

        // update submission state image to show that the candidate is not complete
        this.candidateDiv.submissionStateImage.setAttribute('src', 'assets/crossmark.png');

        // update variable to prevent the user from closing this input box until they are done editing
        this.supress = true;

        // update input field size
        this.candidateDiv.inputDiv.style.maxHeight = this.candidateDiv.inputDiv.scrollHeight + 'px';
    }



    // this function will be called when the user saves the edited data
    saveData() {

        // call 'submitData' function
        if (this.submitData()) {return;}

        // hide buttons
        this.candidateDiv.saveButton.style.display = 'none';
        this.candidateDiv.cancelButton.style.display = 'none';

        // update variable to allow the user to open or close this input box
        this.supress = false;
    }



    // this function will be called when the user cancels the info edit they are making
    cancelDataEdit() {

        // put original text in prompt text, and hide input boxes
        let candidateInfoKeys = Object.keys(this.candidateInfo);
        let inputReferenceKeys = Object.keys(this.inputReferences);
        let candidateTextKeys = Object.keys(this.candidateDiv.displayText);

        for (let i = 0; i < candidateInfoKeys.length; i++) {

            if (candidateInfoKeys[i] == 'message') {
                this.candidateDiv.messageContainer.style.display = 'initial';
                this.inputReferences[inputReferenceKeys[i]].style.display = 'none';
                continue;
            }

            this.candidateDiv.displayText[candidateTextKeys[i]].innerHTML = this.candidateInfo[candidateInfoKeys[i]];
            this.inputReferences[inputReferenceKeys[i]].style.display = 'none';
        }

        // remove 'save' and 'cancel' buttons and add 'edit' button
        this.candidateDiv.saveButton.style.display = 'none';
        this.candidateDiv.cancelButton.style.display = 'none';
        this.candidateDiv.editButton.style.display = 'inline-block';

        // update input field size
        this.candidateDiv.inputDiv.style.maxHeight = this.candidateDiv.inputDiv.scrollHeight + 'px';

        // update variable to allow the user to open or close this input box
        this.supress = false;

        // update variable to show that the candidate is complete
        this.completed = true;

        // update input box information and submission state image
        this.candidateDiv.divHeaderSpan.innerHTML = this.candidateDiv.divHeaderSpan.innerHTML.replaceAll('Not Submitted', (this.inputReferences.lastNameInput.value + ', ' + this.inputReferences.firstNameInput.value));

        this.candidateDiv.submissionStateImage.setAttribute('src', 'assets/checkmark.png');
        
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

                imageDiv: document.createElement('div'),        // div to hold this input group
                imagePrompt: document.createElement('span'),    // image input prompt
                imageContainer: document.createElement('span'), // span to hold the image text
                imageInputBox: document.createElement('input'), // image input box
                'imageError': document.createElement('span'),   // span for error message


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
            }


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
            candidateItems.inputDiv.setAttribute('class', 'input-div');

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

            candidateItems.messageContainer.setAttribute('class', 'paragraph-container');

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

            candidateItems.imageContainer.setAttribute('class', 'input-container');

            candidateItems.imageInputBox.setAttribute('class', 'input-box');
            candidateItems.imageInputBox.setAttribute('type', 'file');
            candidateItems.imageInputBox.setAttribute('name', 'imageError');
            candidateItems.imageInputBox.setAttribute('accept', 'image/*');
            candidateItems.imageInputBox.setAttribute('required', 'required');

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
            candidateItems['firstNameError'].style.left = candidateItems.firstNameInputBox.offsetLeft + 'px';
            candidateItems.firstNameDiv.appendChild(candidateItems['firstNameError']);

            candidateItems.lastNameDiv.appendChild(candidateItems.lastNamePrompt);
            candidateItems.lastNamePrompt.appendChild(candidateItems.lastNameContainer);
            candidateItems.lastNameDiv.appendChild(candidateItems.lastNameInputBox);
            candidateItems['lastNameError'].style.left = candidateItems.lastNameInputBox.offsetLeft + 'px';
            candidateItems.lastNameDiv.appendChild(candidateItems['lastNameError']);

            candidateItems.gradeDiv.appendChild(candidateItems.gradePrompt);
            candidateItems.gradePrompt.appendChild(candidateItems.gradeContainer);
            candidateItems.gradeDiv.appendChild(candidateItems.gradeInputBox);
            candidateItems['gradeError'].style.left = candidateItems.gradeInputBox.offsetLeft + 'px';
            candidateItems.gradeDiv.appendChild(candidateItems['gradeError']);

            candidateItems.positionDiv.appendChild(candidateItems.positionPrompt);
            candidateItems.positionPrompt.appendChild(candidateItems.positionContainer);
            candidateItems.positionDiv.appendChild(candidateItems.positionInputBox);
            candidateItems['positionError'].style.left = candidateItems.positionInputBox.offsetLeft + 'px';
            candidateItems.positionDiv.appendChild(candidateItems['positionError']);

            candidateItems.messageDiv.appendChild(candidateItems.messagePrompt);
            candidateItems.messagePrompt.appendChild(candidateItems.messageContainer);
            candidateItems.messageDiv.appendChild(candidateItems.messageInputBox);
            candidateItems['messageError'].style.left = candidateItems.messageInputBox.offsetLeft + 'px';
            candidateItems.messageDiv.appendChild(candidateItems['messageError']);

            candidateItems.imageDiv.appendChild(candidateItems.imagePrompt);
            candidateItems.imagePrompt.appendChild(candidateItems.imageContainer);
            candidateItems.imageDiv.appendChild(candidateItems.imageInputBox);
            candidateItems['imageError'].style.left = candidateItems.imageInputBox.offsetLeft + 'px';
            candidateItems.imageDiv.appendChild(candidateItems['imageError']);


            candidateItems.buttonDiv.appendChild(candidateItems.submitButton);
            candidateItems.buttonDiv.appendChild(candidateItems.editButton);
            candidateItems.buttonDiv.appendChild(candidateItems.saveButton);
            candidateItems.buttonDiv.appendChild(candidateItems.cancelButton);

            

            // make the class object
            let temp = new Candidate(candidateItems);



            // give div collapsible functionalities
            candidateItems.headerDiv.addEventListener('click', function() {
                if (temp.supress) {return;}
                let content = candidateItems.inputDiv;
                if (content.style.maxHeight) {
                    candidateItems.ddArrow.setAttribute('src', 'assets/ddarrow closed.png');
                    content.style.maxHeight = null;
                    // disable inputs
                    for (let input of Object.values(temp.inputReferences)) {
                        input.disabled = true;
                    }

                } else {
                    content.style.maxHeight = content.scrollHeight + 'px';
                    candidateItems.ddArrow.setAttribute('src', 'assets/ddarrow open.png');
                    // enable inputs
                    let inputs = Object.values(temp.inputReferences);
                    for (let input of inputs) {
                        input.disabled = false;
                    }
                }
            });
        }
    }
}




// make sure that all of the divs have the same width, and match them all to the longest div.
function start() {

    // make the candidate boxes
    Candidate.createInputPage();

    adjustDivs();
}

// I don't call this function 'start' because it isn't just called once when the page loads, but whenever the div text needs to be updated.
function adjustDivs() {

    let candidates = document.getElementsByClassName('candidate-div');

    let largestDiv = 0;

    for (let candidate of candidates) {

        if (candidate.offsetWidth > largestDiv) {
            largestDiv = candidate.offsetWidth
        }

        candidate.style.display = 'block';
        candidate.style.width = '100%';

    }

    // update master div size
    document.getElementById('input-master-div').style.width = largestDiv;
}
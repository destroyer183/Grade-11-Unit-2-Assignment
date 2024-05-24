'use strict';


// make new string method
String.prototype.contains = function (characters) {

    // get value of string object
    let str = this.valueOf();

    // loop over every character that needs to be checked for 
    for (let character of characters) {

        // check if the string contains the current character
        if (str.indexOf(character) != -1) {

            // return true if the character contains the current character
            return true;
        }
    }

    // return false if the string doesn't contain one of the characters
    return false;
}



// create class for candidates
class Candidate {

    // create class variables
    static candidates = []; // create array to store each candidate object
    static submitted = 0; // create counter to keep track of the amount of submitted candidates
    static selectedCandidate; // create variable to store the current selected candidate in the voting menu
    static initialMinWidth; // create variable to store the initial minimum width of the candidate submission divs

    // create class constructor that takes in a dictionary of every html element for each candidate div
    constructor(candidateElements) {

        // create variable to track whether or not a candidate has been submitted
        this.completed = false;

        // create class attribute to keep track of whether or not the drop-down animation should be supressed
        this.supress = false;

        // create class attribute to store the html elements
        this.candidateElements = candidateElements;

        // create class attribute to store the amount of votes for this candidate
        this.voteCount = 0;

        // create class attribute to hold placeholders for the submitted values of the candidate's data in a dictionary
        this.candidateInfo = {
            firstName: '',
            lastName:  '',
            grade:     '',
            position:  '',
            message:   '',
            image:     ''
        };

        // create class attribute to store references to each input box for the candidate's data 
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

        // remove whitespace in first & last name input boxes
        this.inputReferences.firstNameInput.value = this.inputReferences.firstNameInput.value.trim();
        this.inputReferences.lastNameInput.value = this.inputReferences.lastNameInput.value.trim();

        // uppercase the first letter and lowercase the rest of each input in the first & last name input boxes
        this.inputReferences.firstNameInput.value = this.inputReferences.firstNameInput.value.substring(0, 1).toUpperCase() + this.inputReferences.firstNameInput.value.substring(1, this.inputReferences.firstNameInput.value.length).toLowerCase();
        this.inputReferences.lastNameInput.value = this.inputReferences.lastNameInput.value.substring(0, 1).toUpperCase() + this.inputReferences.lastNameInput.value.substring(1, this.inputReferences.lastNameInput.value.length).toLowerCase();

        // create variables necessary for verifying the format of the data
        let sentenceTerminators = '!.?'; // variable for the punctuation that end a sentence
        let whitespace = ' \t' // variable for different types of whitespace
        let newSentence = ''; // variable to store the re-formatted sentence
        let previousIsTerminator = false; // variable to keep track of whether or not the last character was a sentence terminator
        let previousIsWhitespace = false; // variable to keep track of whether or not the last character was a whitespace

        // loop over every character in the inputted message
        for (let character of this.inputReferences.messageInput.value.trim()) {

            // check if the previous character was a sentence terminator, and if the current character is not a sentence terminator
            if (previousIsTerminator && !character.contains(sentenceTerminators)) {

                // check if the character is a new line or a space
                if (character.contains(whitespace + '\n')) {

                    // skip the rest of the loop
                    continue;

                // run if the current character is not a space or a new line
                } else {

                    // add a new line character to the re-formatted sentence, then uppercase and add the current character to the re-formatted sentence
                    newSentence += '\n' + character.toUpperCase();
                    previousIsTerminator = false; // change variable to show that the previous character was not a sentence terminator
                }
            
            // check if the previous character was a sentence terminator, and if the current character is a sentence terminator
            } else if (previousIsTerminator && character.contains(sentenceTerminators)) {

                // add the current character to the re-formatted sentence
                newSentence += character;

            // check if the current character is a sentence terminator
            } else if (character.contains(sentenceTerminators)) {

                // check if the previous character was a whitespace
                if (previousIsWhitespace) {
                    // remove the whitespace from the full sentence, and update variable to show that the previous character is no longer a whitespace
                    newSentence = newSentence.substring(0, newSentence.length - 1);
                    previousIsWhitespace = false;
                }

                previousIsTerminator = true; // update variable to show that the previous character is a sentence terminator
                newSentence += character; // add current character to the re-formatted sentence

            } else if (character.contains(whitespace)) {

                // check if the previous character was a whitespace
                if (previousIsWhitespace) {

                    // skip the rest of the loop to get rid of double space
                    continue;
                }

                previousIsWhitespace = true; // update variable to show that the previous character is a whitespace
                newSentence += character; // add current character to the re-formatted sentence

            // run if nothing else triggers
            } else {

                // add current character to re-formatted sentence
                newSentence += character;

                // update variable to show that the previous character is no longer a whitespace
                previousIsWhitespace = false;
            }
        }

        // check if there is a sentence terminator at the end of the message, and add a period if there is no sentence terminator
        if (!(newSentence.substring(newSentence.length - 1, newSentence.length).contains(sentenceTerminators))) {
            newSentence += '.';
        }



        // uppercase the first letter of the re-formatted message
        let fullSentence = newSentence.substring(0, 1).toUpperCase() + newSentence.substring(1, newSentence.length);

        // update the content of the message input box
        this.candidateElements.messageContainer.innerText = fullSentence;

        // store the full sentence in the class attribute for the current candidate
        this.inputReferences.messageInput.value = fullSentence;
    }



    // this function will check for any errors in the inputted data and display error text accordingly
    putErrorMessage() {

        // create variable to keep track of whether or not an error was found
        let errorFound = false;

        // loop over the html element of every input field
        for (let input of Object.values(this.inputReferences)) {

            // check if the input value is empty or equal to the initial value given when the page loads
            if (input.value == '' || (input.type == 'select' && input.value == 'null')) {

                // configure and display error message
                this.candidateElements[input.name].innerHTML = 'Please fill out this field.'; // configure error text
                this.candidateElements[input.name].style.left = input.offsetLeft + 'px'; // configure error message location
                this.candidateElements[input.name].style.display = 'initial'; // display error message

                // udpate variable to show that an error has been found
                errorFound = true;

            // run if the previous check was false
            } else {

                // hide the error message for the current input box
                this.candidateElements[input.name].style.display = 'none';
            }
        }

        // check if the last name input box is not empty and if it contains a character that shouldn't be in a first name
        if (this.inputReferences.firstNameInput.value != '' && this.inputReferences.firstNameInput.value.contains('!@#$%^&*()_=+[]{}\\|;:,<>/?')) {

            // configure and display error message
            this.candidateElements['firstNameError'].innerHTML = 'First name cannot contain special characters.'; // configure error text
            this.candidateElements['firstNameError'].style.left = this.inputReferences.firstNameInput.offsetLeft + 'px'; // configure error message location
            this.candidateElements['firstNameError'].style.display = 'initial'; // display error message

            // erase content in the first name input box
            this.inputReferences.firstNameInput.value = '';

            // update variable to show that an error has been found
            errorFound = true;
        }

        // check if the last name input box is not empty and if it contains a character that shouldn't be in a last name
        if (this.inputReferences.lastNameInput.value != '' && this.inputReferences.lastNameInput.value.contains('!@#$%^&*()_=+[]{}\\|;:,<>/?')) {

            // configure and display error message
            this.candidateElements['lastNameError'].innerHTML = 'Last name cannot contain special characters.'; // configure error text
            this.candidateElements['lastNameError'].style.left = this.inputReferences.lastNameInput.offsetLeft + 'px'; // configure error message location
            this.candidateElements['lastNameError'].style.display = 'initial'; // display error message

            // erase content in the first name input box
            this.inputReferences.lastNameInput.value = '';

            // update variable to show that an error has been found
            errorFound = true;
        }

        // check for mismatching grade number in the grade input and the position input (i.e. a grade 9 student can't be the grade 12 rep)
        if (
            (this.inputReferences.positionInput.value === 'Grade 10 Representative' && this.inputReferences.gradeInput.value != 'null' && this.inputReferences.gradeInput.value != '10') ||
            (this.inputReferences.positionInput.value === 'Grade 11 Representative' && this.inputReferences.gradeInput.value != 'null' && this.inputReferences.gradeInput.value != '11') ||
            (this.inputReferences.positionInput.value === 'Grade 12 Representative' && this.inputReferences.gradeInput.value != 'null' && this.inputReferences.gradeInput.value != '12')
        ) {

            this.candidateElements['gradeError'].innerHTML = 'Mismatching grade with positon input.'; // configure error text
            this.candidateElements['gradeError'].style.left = this.inputReferences.gradeInput.offsetLeft + 'px'; // configure error message location
            this.candidateElements['gradeError'].style.display = 'initial'; // display error message

            this.candidateElements['positionError'].innerHTML = 'Mismatching grade with grade input.';
            this.candidateElements['positionError'].style.left = this.inputReferences.positionInput.offsetLeft + 'px';
            this.candidateElements['positionError'].style.display = 'initial';

            // update variable to show that an error has been found
            errorFound = true;
        }

        // return the variable that keeps track of whether or not an error has been found
        return errorFound;
    }



    // this will be the function that is called when the user submits data
    submitData() {

        // since the error message function will return true if an error is found, this exits the function and returns true if an error is found
        if (this.putErrorMessage()) {return true;}

        // reformat the inputted data
        this.verifyData();

        // update input box information and submission state image
        this.candidateElements.divHeaderSpan.innerHTML = this.candidateElements.divHeaderSpan.innerHTML.replaceAll('Not Submitted', (this.inputReferences.lastNameInput.value + ', ' + this.inputReferences.firstNameInput.value));
        this.candidateElements.submissionStateImage.setAttribute('src', 'assets/checkmark.png');
        
        // change buttons that are visible to show the edit button instead of the submit button
        this.candidateElements.submitButton.style.display = 'none';
        this.candidateElements.editButton.style.display = 'inline-block';

        // create variables for the dictionary keys of the candidate info dictionary and the input reference dictionary
        let candidateInfoKeys = Object.keys(this.candidateInfo);
        let inputReferenceKeys = Object.keys(this.inputReferences);

        // loop through the candidate info dictionary and the input reference dictionary as if they were arrays, and do it by index to access them in parallel
        for (let i = 0; i < inputReferenceKeys.length; i++) {

            // separately check if the current dictionary element is the image element
            if (candidateInfoKeys[i] == 'image') {

                // add the image data to the candidate data in a special way 
                this.candidateInfo[candidateInfoKeys[i]] = this.inputReferences[inputReferenceKeys[i]].files[0];

                // skip the rest of the loop
                continue;
            }

            // add input box data to candidate info dictionary
            this.candidateInfo[candidateInfoKeys[i]] = this.inputReferences[inputReferenceKeys[i]].value;
        }

        // create variable for the dictionary keys of the candidate data display text elements
        let candidateTextKeys = Object.keys(this.candidateElements.displayText);

        // loop through the dictionaries for the candidate info, the input references, and the display text references as if they were arrays, and do it by index to access them in parallel
        for (let i = 0; i < inputReferenceKeys.length; i++) {

            // separately check if the current dictionary element is the message element
            if (candidateInfoKeys[i] == 'message') {

                // display the element
                this.candidateElements.messageContainer.style.display = 'block';
                
                // skip the rest of the loop
                continue;
            }

            // add candidate info data to the display text element
            this.candidateElements.displayText[candidateTextKeys[i]].innerHTML += this.candidateInfo[candidateInfoKeys[i]];
        }

        // hide input boxes
        for (let key of Object.keys(this.inputReferences)) {

            this.inputReferences[key].style.display = 'none';
        }

        // set full name attribute for the candidate
        this.candidateInfo.fullName = this.candidateInfo.lastName + ', ' + this.candidateInfo.firstName;

        // update variables so that the candidate is considered completed
        this.completed = true;
        Candidate.submitted++;

        // update the information on the info bar
        Candidate.updateInfoBar();

        // close the div
        this.animateDiv();

        // adjust the size of the candidate divs
        this.adjustDivs();

        // update input field size
        // this.candidateElements.inputDiv.style.maxWidth = this.candidateElements.inputDiv.scrollWidth + 'px';
        // this.candidateElements.inputDiv.style.maxHeight = this.candidateElements.inputDiv.scrollHeight + 'px';

        // return false if the function finishes without any errors, this specifically returns false, as it is used as both a check, and used to format data in the 'saveData()' function
        return false;
    }



    // this function will be called when the user wants to edit the inputted data
    editData() {

        // reset header text
        let endIndex = this.candidateElements.divHeaderSpan.innerHTML.lastIndexOf('>') + 1;
        this.candidateElements.divHeaderSpan.innerHTML = this.candidateElements.divHeaderSpan.innerHTML.substring(0, endIndex) + 'Not Submitted';

        // create variables for the dictionary keys of the candidate info dictionary and the display text dictionary
        let candidateInfoKeys = Object.keys(this.candidateInfo);
        let candidateTextKeys = Object.keys(this.candidateElements.displayText);

        // loop through the candidate info dictionary and the display text dictionary as if they were arrays, and do it by index to access them in parallel
        for (let i = 0; i < candidateTextKeys.length; i++) {

            // separately check for the message key, since it needs to be handled differently
            if (candidateInfoKeys[i] == 'message') {

                // hide the message info box
                this.candidateElements.messageContainer.style.display = 'none';

                // skip the rest of the loop
                continue;
            }

            // remove the text in the display element
            this.candidateElements.displayText[candidateTextKeys[i]].innerHTML = '';
        }

        // put input boxes back on screen
        for (let key of Object.keys(this.inputReferences)) {

            this.inputReferences[key].style.display = 'initial';
        }

        
        
        // update variables to show that the candidate is not complete
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
        this.candidateElements.candidateDiv.style.maxWidth = this.baseWidth - 16 + 'px';
        
        // remove 'edit' button and display 'save' and 'cancel' buttons
        this.candidateElements.editButton.style.display = 'none';
        this.candidateElements.saveButton.style.display = 'inline-block';
        this.candidateElements.cancelButton.style.display = 'inline-block';
    }



    // this function will be called when the user saves the edited data
    saveData() {

        // update variable to allow the user to open or close this input box
        this.supress = false;

        // call 'submitData' function, and if it returns 'true' it means an error is found, so exit the rest of the function if that happens
        if (this.submitData()) {

            // supress the div from being closed
            this.supress = true
            return;
        }

        // hide buttons
        this.candidateElements.saveButton.style.display = 'none';
        this.candidateElements.cancelButton.style.display = 'none';
    }



    // this function will be called when the user cancels the info edit they are making
    cancelDataEdit() {

        // create variables references for the dictionary keys of the dictionaries for the candidate info, the input references, and the display text references
        let candidateInfoKeys  = Object.keys(this.candidateInfo);
        let inputReferenceKeys = Object.keys(this.inputReferences);
        let candidateTextKeys  = Object.keys(this.candidateElements.displayText);

        // loop over each of the dictionaries above as if they were arrays, and do it by index so they can be accessed in parallel
        for (let i = 0; i < inputReferenceKeys.length; i++) {

            // separately check for message key since it needs to be handled differently
            if (candidateInfoKeys[i] == 'message') {

                // display the submitted info and hide the input box
                this.candidateElements.messageContainer.style.display = 'block';
                this.inputReferences[inputReferenceKeys[i]].style.display = 'none';

                // skip the rest of the loop
                continue;
            }

            // update display text content and hide input box
            this.candidateElements.displayText[candidateTextKeys[i]].innerHTML = this.candidateInfo[candidateInfoKeys[i]];
            this.inputReferences[inputReferenceKeys[i]].style.display = 'none';
        }

        // remove 'save' and 'cancel' buttons and add 'edit' button
        this.candidateElements.saveButton.style.display = 'none';
        this.candidateElements.cancelButton.style.display = 'none';
        this.candidateElements.editButton.style.display = 'inline-block';

        // update variable to allow the user to open or close this input box
        this.supress = false;

        // update input field size
        this.animateDiv();

        // update variables to show that the candidate is complete
        this.completed = true;
        Candidate.submitted++;

        // update the information on the info bar
        Candidate.updateInfoBar();

        // update input box information and submission state image
        this.candidateElements.divHeaderSpan.innerHTML = this.candidateElements.divHeaderSpan.innerHTML.replaceAll('Not Submitted', (this.inputReferences.lastNameInput.value + ', ' + this.inputReferences.firstNameInput.value));
        this.candidateElements.submissionStateImage.setAttribute('src', 'assets/checkmark.png');
    }



    // function that will create the candidate input page
    static createInputPage() {

        // get the master div that will contain each candidate input
        let master = document.getElementById('input-master-div');

        // repeat loop 10 times to make 10 boxes
        for (let i = 0; i < 10; i++) {

            // create candidate group as a dictionary
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

            // create a nested dictionary to hold references to each element that displays the inputted info
            candidateItems.displayText = {
                firstName: candidateItems.firstNameContainer,
                lastName: candidateItems.lastNameContainer,
                grade: candidateItems.gradeContainer,
                position: candidateItems.positionContainer,
                message: candidateItems.messageContainer,
                image: candidateItems.imageContainer
            };



            // set attributes of main candidate div
            candidateItems.candidateDiv.setAttribute('class', 'candidate-div');

            // set attributes of header div
            candidateItems.headerDiv.setAttribute('class', 'header-div');

            // set attributes of arrow that implies the div is expandable
            candidateItems.ddArrow.setAttribute('src', 'assets/ddarrow closed.png');
            candidateItems.ddArrow.setAttribute('class', 'dd-arrow');

            // set attributes of image that shows whether or not a candidate is submitted
            candidateItems.submissionStateImage.setAttribute('src', 'assets/crossmark.png');
            candidateItems.submissionStateImage.setAttribute('class', 'submission-state-image');

            // set attributes of the span that displays the candidate's name
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
            candidateItems.firstNameInputBox.setAttribute('maxlength', '20');
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
            candidateItems.lastNameInputBox.setAttribute('maxlength', '20');
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
            candidateItems.messageInputBox.setAttribute('maxlength', '500');
            candidateItems.messageInputBox.setAttribute('required', 'required');

            candidateItems['messageError'].setAttribute('class', 'error-message');
            candidateItems['messageError'].innerHTML = 'Please fill out this field.';


            // set attributes for image input
            candidateItems.imageDiv.style.marginBottom = 0;

            candidateItems.imagePrompt.setAttribute('class', 'input-prompt');
            candidateItems.imagePrompt.innerHTML = '<b>Image: </b>';

            candidateItems.imageContainer.setAttribute('class', 'input-container image-container');

            candidateItems.imageInputBox.setAttribute('class', 'input-box image-input');
            candidateItems.imageInputBox.style.border = 'none';
            candidateItems.imageInputBox.style.borderRadius = '0';

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
            candidateItems.submitButton.setAttribute('class', 'submission-button grow');
            let submitButtonFunction = 'Candidate.candidates[' + i + '].submitData();';
            candidateItems.submitButton.setAttribute('onclick', submitButtonFunction);
            candidateItems.submitButton.innerHTML = 'Submit';

            candidateItems.editButton.setAttribute('class', 'submission-button hidden-on-load grow');
            let editButtonFunction = 'Candidate.candidates[' + i + '].editData();';
            candidateItems.editButton.setAttribute('onclick', editButtonFunction);
            candidateItems.editButton.innerHTML = 'Edit';
            
            candidateItems.saveButton.setAttribute('class', 'submission-button hidden-on-load grow');
            let saveButtonFunction = 'Candidate.candidates[' + i + '].saveData();';
            candidateItems.saveButton.setAttribute('onclick', saveButtonFunction);
            candidateItems.saveButton.innerHTML = 'Save';

            candidateItems.cancelButton.setAttribute('class', 'submission-button hidden-on-load grow');
            let cancelButtonFunction = 'Candidate.candidates[' + i + '].cancelDataEdit();'; 
            candidateItems.cancelButton.setAttribute('onclick', cancelButtonFunction);
            candidateItems.cancelButton.innerHTML = 'Cancel';



            // piece all of the elements together
            master.appendChild(candidateItems.candidateDiv);

            candidateItems.candidateDiv.appendChild(candidateItems.headerDiv);
            candidateItems.candidateDiv.appendChild(candidateItems.inputDiv);
            candidateItems.candidateDiv.appendChild(candidateItems.buttonDiv);

            candidateItems.headerDiv.appendChild(candidateItems.ddArrow);
            candidateItems.headerDiv.appendChild(candidateItems.submissionStateImage);
            candidateItems.headerDiv.appendChild(candidateItems.divHeaderSpan);
            
            candidateItems.inputDiv.appendChild(candidateItems.firstNameDiv);
            candidateItems.inputDiv.appendChild(candidateItems.lastNameDiv);
            candidateItems.inputDiv.appendChild(candidateItems.gradeDiv);
            candidateItems.inputDiv.appendChild(candidateItems.positionDiv);
            candidateItems.inputDiv.appendChild(candidateItems.messageDiv);
            candidateItems.inputDiv.appendChild(candidateItems.imageDiv);

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
            
            // add event listener to the image input box so that the image preview is updated every time the image is changed
            candidateItems.imageInputBox.onchange = evt => {
                const [file] = candidateItems.imageInputBox.files;
                if (file) {
                    candidateItems.imagePreview.src = URL.createObjectURL(file);
                    candidateItems.imageSubmitPreview.src = URL.createObjectURL(file);
                }
            }

            // add buttons to button div
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

        // prevent div from being closed if the user has chosen to edit the data
        if (this.supress) {return;}

        // store candidate elements in variable for easier access
        let content = this.candidateElements;

        // check if the max height of the input div has a value, which indicates it is expanded, and should be closed
        if (content.inputDiv.style.maxHeight) {

            // update variable to show that the candidate is expanded
            this.expanded = false;

            // shrink the width of the candidate div
            content.candidateDiv.style.width = this.initialWidth - 16 + 'px';

            // remove the value of the maxHeight for the input div and the button div to shrink the candidate div
            content.inputDiv.style.maxHeight = null;
            content.buttonDiv.style.maxHeight = null;

            // change the display of the button div, because using 'inline-block' adds an invisible outline/margin/padding/idk to the div that makes it take up vertical space even when the height is 0.
            content.buttonDiv.style.display = 'block'

            // update image to show that the div is closed
            content.ddArrow.setAttribute('src', 'assets/ddarrow closed.png');

            // disable input boxes so that the user can't edit the content when the div has been closed
            for (let input of Object.values(this.inputReferences)) {

                input.disabled = true;
            }

            // if the div has not been adjusted with the other divs, adjust it now
            if (this.unadjusted) {this.adjustDivs();}

        // if the div height has no value, this will trigger to expand the div
        } else {
            
            // update variable to show that the div has been expanded
            this.expanded = true;

            // update variable to store the initial width of the candidate div, so that it can be used later to reset it's size
            this.initialWidth = content.candidateDiv.offsetWidth;

            // set the height of the input div and button div to the values required for all of their content to be visible
            content.inputDiv.style.maxHeight = content.inputDiv.scrollHeight + 'px';
            content.buttonDiv.style.maxHeight = content.buttonDiv.scrollHeight + 'px';

            // set the display of the button div to 'inline-block' so that it is centered horizontally
            content.buttonDiv.style.display = 'inline-block';

            // set the maxWidth of the candidate div to horizontally fill its container
            content.candidateDiv.style.maxWidth = '100%'

            // remove the value of the candidate div's width to allow it to expand when it's content gets larger
            content.candidateDiv.style.width = null;

            // update image to show that the div is expanded
            content.ddArrow.setAttribute('src', 'assets/ddarrow open.png');

            // enable inputs
            let inputs = Object.values(this.inputReferences);

            for (let input of inputs) {

                input.disabled = false;
            }
        }
    }



    // function to adjust the size of the divs so that they are the same size
    adjustDivs() {

        console.log('divs are being adjusted...');

        // declare variable to store the value of the largest div found
        let largestDiv = 0;

        // loop over every candidate object
        for (let candidate of Candidate.candidates) {

            // make variable for the full header div size with the size of it's content, because the div's width itself doesn't account for overflow.
            let elements = candidate.candidateElements;
            let headerWidth = elements.ddArrow.scrollWidth + elements.submissionStateImage.scrollWidth + elements.divHeaderSpan.scrollWidth + 8;

            console.log('header width: ' + headerWidth);

            // check if the current candidate is expanded
            if (candidate.expanded) {

                // update variable to show that the div was not adjusted, and skip the rest of the function
                candidate.unadjusted = true;
                continue;
            }

            // update variable for largest div if current div is bigger than the previous biggest div
            if (headerWidth > largestDiv) {

                // store width of biggest div
                largestDiv = headerWidth;
            }
        }

        // loop over every candidate object
        for (let candidate of Candidate.candidates) {

            // shorten variable size
            candidate = candidate.candidateElements.candidateDiv;

            // update candidate sizing
            candidate.style.display = 'block';
            candidate.style.minWidth = largestDiv + 'px';
            candidate.style.width = largestDiv - 16 + 'px';
            Candidate.initialMinWidth = largestDiv;
        }
    }

    // function to update the info bar depending on the candidates submitted
    static updateInfoBar() {

        // get html elements for the candidate counter and the button to end the candidate submission
        let candidateCounter = document.getElementById('candidate-counter');
        let endInputButton = document.getElementById('end-candidate-input');

        // update the text in the candidate counter
        candidateCounter.innerText = Candidate.submitted + '/' + Candidate.candidates.length;

        // check if the number of candidates submitted is equal to the length of the array that contains all the candidates
        if (Candidate.submitted != 0) {

            // hide candidate counter, and display the button to end the voting phase
            candidateCounter.style.display = 'none';
            endInputButton.style.display = 'inline-block';

        // run if the previous condition was false
        } else {

            // display candidate counter, and hide button to end the voting phase
            candidateCounter.style.display = 'none';
            endInputButton.style.display = 'none';
        }

        // adjust header div size, and adjust the placeholder that offsets the location of the master divs for the candidates
        let infoBar = document.getElementById('info-bar');
        document.getElementById('info-bar-placeholder').style.height = infoBar.offsetHeight + 'px';
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

        // load the voting master div into a variable
        let master = document.getElementById('voting-master-div');

        // set max size for the master div
        master.style.width = window.innerWidth - 128 + 'px';

        // iterate over every candidate
        for (let candidate of Candidate.candidates) {

            // skip display for unsubmitted candidates
            if (!(candidate.completed)) {continue;}

            // create dictionary to store the elements for each candidate display
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
            let image = URL.createObjectURL(candidate.candidateInfo.image);
            votingItems.candidateImage.style.backgroundImage = image;
            votingItems.candidateImage.setAttribute('src', image);
            votingItems.candidateName.innerHTML = '<b>Full Name: </b>' + candidate.candidateInfo.fullName;
            votingItems.candidateMessage.innerHTML = '<b>Message: </b>' + candidate.candidateInfo.message;


            // this if/else block will only add the info for the candidate's grade if their position doesn't specify the grade
                // i.e. 'Grade 10 Representative' specifies the candidate's grade, and so no extra info will be added
                // i.e. 'Videographer Apprentice' doesn't specify the candidate's grade, and so that information will be added
            if (['Grade 10 Representative', 'Grade 11 Representative', 'Grade 12 Representative'].indexOf(candidate.candidateInfo.position) != -1) {
                votingItems.candidatePosition.innerHTML = '<b>Grade & Position: </b>' + candidate.candidateInfo.position;
            } else {
                votingItems.candidatePosition.innerHTML = '<b>Grade & Position: </b> Grade ' + candidate.candidateInfo.grade + ', ' + candidate.candidateInfo.position;
            }




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

            // add event listeners that update a div's vote counter and make it flash blue when it is clicked
            votingItems.votingDiv.addEventListener('click', function() {candidate.selectCandidate();});
            votingItems.votingDiv.addEventListener('mousedown', function () {candidate.clickHighlight();})
            votingItems.votingDiv.addEventListener('mouseup', function () {candidate.clickUnHighlight();})
        }
    }



    // this function updates variables and the display to show the user which candidate they have selected
    selectCandidate() {

        // skip function if candidate should be supressed
        if (this.supress) {return;}

        // incramenmt the candidate's vote counter
        this.voteCount++;

        // display button to submit votes
        document.getElementById('submit-candidate').style.display = 'inline-block';
        
        // adjust header div size
        let infoBar = document.getElementById('info-bar');
        document.getElementById('info-bar-placeholder').style.height = infoBar.offsetHeight + 'px';
    }



    // function to update the color of each candidate display while they are clicked
    clickHighlight() {

        // skip function if candidate should be supressed
        if (this.supress) {return;}

        this.votingElements.votingDiv.style.backgroundColor = 'deepskyblue';
    }



    // function to unhighlight a div when the mouse button is released
    clickUnHighlight() {

        // skip function if candidate should be supressed
        if (this.supress) {return;}

        this.votingElements.votingDiv.style.backgroundColor = 'dodgerblue';
    }



    // this function updates variables and the display to show the user which candidate they have selected
    // selectCandidate() {

    //     // skip function if candidate should be supressed
    //     if (this.supress) {return;}

    //     // loop over every candidate
    //     for (let option of Candidate.candidates) {

    //         // use a try/catch block to prevent the function from crashing if an error occurs
    //         try {
    //             // clear the id attribute of each voting div, since the id is used to control the enlargement styling of the divs
    //             option.votingElements.votingDiv.id = '';

    //         // catch any errors to prevent the function from crashing
    //         } catch {}
    //     }

    //     // check if the candidate that the function was called on is the candidate that is already selected
    //     if (this === Candidate.selectedCandidate) {

    //         // clear the 'selectedCandidate' variable and clear the id to undo the enlargement styling
    //         Candidate.selectedCandidate = null;
    //         this.votingElements.votingDiv.id = '';

    //     // only run if the previous condition was false
    //     } else {

    //         // update the id of the candidate that was clicked to apply styling to show that it is selected
    //         this.votingElements.votingDiv.id = 'grow-enlarge';

    //         // update 'selectedCandidate' variable to represent the candidate that was selected
    //         Candidate.selectedCandidate = this;
    //     }

    //     // call function to update the information shown on the info bar
    //     Candidate.updateSelectedCandidate();

    //     // branchlessly update selected candidate instead of using if/else because why not
    //     // candidate.votingElements.votingDiv.id = 'grow-enlarge'.repeat(+(candidate === Candidate.selectedCandidate)) + '';
    //     // Candidate.selectedCandidate = candidate * (candidate != Candidate.selectedCandidate) + null * (candidate === Candidate.selectedCandidate);

    // }



    // update the display for the selected candidate
    static updateSelectedCandidate() {

        // check if a candidate is selected
        if (Candidate.selectedCandidate) {

            // show the name of the candidate in the info bar
            document.getElementById('candidate-choice-display').innerText = 'Candidate: ' + Candidate.selectedCandidate.candidateInfo.fullName;

            // display the button to vote for the selected candidate
            document.getElementById('submit-candidate').style.display = 'inline-block';

        // run if the previous condidtion was false
        } else {

            // change the text in the info bar to show that no candidate is selected
            document.getElementById('candidate-choice-display').innerText = 'Candidate: Not Selected';

            // hide button to submit a vote
            document.getElementById('submit-candidate').style.display = 'none';
        }

        // adjust header div size
        let infoBar = document.getElementById('info-bar');
        document.getElementById('info-bar-placeholder').style.height = infoBar.offsetHeight + 'px';
    }



    // function that is called when the user clicks the button to submit their vote
    static submitVote() {

        // define variable to store the most amount of votes for a candidate
        let mostVotes = 0;

        // define variable to store the amount of candidates that had the highest amount of votes
        let totalCandidates = 0;

        // loop over every candidate
        for (let candidate of Candidate.candidates) {

            // check if the current candidate has more votes than any other checked candidate
            if (candidate.voteCount >= mostVotes) {

                // update most votes to match the current candidate
                mostVotes = candidate.voteCount;
            }
        }

        // loop over every candidate
        for (let candidate of Candidate.candidates) {

            // check if the candidate has less votes than the most amount of votes found
            if (candidate.voteCount < mostVotes) {

                // try/catch block to prevent errors from crashing the function
                try {

                    // hide candidate
                    candidate.votingElements.votingDiv.style.display = 'none';

                // catch errors
                } catch {}

            // run if previous condidtion was false
            } else {

                // increase total candidates by 1
                totalCandidates++;

                // supress candidate functionalities and remove event listener and animations
                candidate.supress = true;
                candidate.votingElements.votingDiv.style.cursor = 'initial';
                candidate.votingElements.votingDiv.setAttribute('class', (candidate.votingElements.votingDiv.getAttribute('class').replaceAll('grow', '')));
            }
        }

        // hide unnecessary text in header
        document.getElementById('submission-div').style.display = 'none'

        // update info text
        if (totalCandidates > 1) {document.getElementById('voting-result').innerHTML = 'Tie!';}
        document.getElementById('voting-counter').innerHTML = 'Votes: ' + mostVotes;

        // display text to add more info
        document.getElementById('voting-result').style.display = 'inline-block';
        document.getElementById('voting-counter').style.display = 'inline-block';

        // create closing sentence
        let closingSentence = document.createElement('p');
        closingSentence.setAttribute('id', 'closing-sentence');
        closingSentence.innerText = 'Thank you for your submission.\nYou may now close this page.';

        // add closing sentence to the voting master div
        document.getElementById('voting-master-div').appendChild(closingSentence);
        
        // adjust header div size
        let infoBar = document.getElementById('info-bar');
        document.getElementById('info-bar-placeholder').style.height = infoBar.offsetHeight + 'px';
    }



    // function that is called when the user clicks the button to submit their vote
    // static submitVote() {

    //     // define variable for the current selected candidate
    //     let userChoice = Candidate.selectedCandidate;

    //     // loop over every candidate
    //     for (let candidate of Candidate.candidates) {

    //         // check if the current candidate is not equal to the user's choice
    //         if (candidate != userChoice) {

    //             // use try/catch block to prevent the function from crashing if an error occurs
    //             try {

    //                 // hide candidate
    //                 candidate.votingElements.votingDiv.style.display = 'none';

    //             // catch errors to prevent crashes
    //             } catch {}
    //         }
    //     }

    //     // remove emphasis and event listener on selected candidate
    //     userChoice.votingElements.votingDiv.id = '';
    //     userChoice.supress = true;

    //     // update candidate size to only be as large as necessary instead of being as large as all the other candidates
    //     let newWidth = userChoice.votingElements.imageDiv.offsetWidth + userChoice.votingElements.infoDiv.offsetWidth + 64;
    //     if (newWidth < userChoice.votingElements.votingDiv.offsetWidth) {
    //         userChoice.votingElements.votingDiv.style.width = newWidth + 'px';
    //     }

    //     // change css properties to prevent the candidate from growing on hover
    //     userChoice.votingElements.votingDiv.style.cursor = 'initial';
    //     userChoice.votingElements.votingDiv.setAttribute('class', (userChoice.votingElements.votingDiv.getAttribute('class').replaceAll('grow', '')));

    //     // hide unnecessary text in header
    //     document.getElementById('submission-div').style.display = 'none'

    //     // display text to add more info
    //     document.getElementById('voting-result').style.display = 'inline-block';
    //     document.getElementById('voting-counter').style.display = 'inline-block';



    //     // create closing sentence
    //     let closingSentence = document.createElement('p');
    //     closingSentence.setAttribute('id', 'closing-sentence');
    //     closingSentence.innerText = 'Thank you for your submission.\nYou may now close this page.';

    //     // add closing sentence to the voting master div
    //     document.getElementById('voting-master-div').appendChild(closingSentence);
    // }
}



// function that is called when the page loads
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
}



// function that only gets called when the page loads to align the divs to be the same size
function initialAdjustDivs() {

    // get array of every candidate div
    let candidates = document.getElementsByClassName('candidate-div');

    // create variable to represent the width of the largest candidate div
    let largestDiv = 0;

    // loop over every candidate
    for (let candidate of Candidate.candidates) {

        // define variable to be the dicionary of elements within the div
        let elements = candidate.candidateElements;

        // define variable to represent the full width of the header div by adding the width of every element within the header div
        // this doesn't use the size of the header dif itself because that doesn't account for overflow
        let headerWidth = elements.ddArrow.scrollWidth + elements.submissionStateImage.scrollWidth + elements.divHeaderSpan.scrollWidth + 8;

        // check if the current div's header with is larger than the largest div found so far
        if (headerWidth > largestDiv) {

            // update variable to store the new largest header div
            largestDiv = headerWidth;
        }
    }

    // define variable to represent the extra size needed to accomodate the border radius of the candidate div
    let borderOffset = 65;

    // loop over every candidate div
    for (let candidate of candidates) {

        

        // update sizing and display of the candidate div
        candidate.style.display = 'block';
        candidate.style.width = largestDiv + borderOffset + 'px';
        candidate.style.minWidth = largestDiv + borderOffset + 'px';

    }

    // record the initial minimum width for the largest div
    Candidate.initialMinWidth = largestDiv + borderOffset;

    // define variable to represent extra offset that stops the edge of a candidate div from being right up against the edge of the page
    let extraOffset = 128

    // update size of the input master div
    document.getElementById('input-master-div').style.width = window.innerWidth - extraOffset + 'px';

    // loop over every candidate
    for (let candidate of Candidate.candidates) {

        // create object attribute to show that the candidate div is not expanded
        candidate.expanded = false;

        // create object attribute to store the initial width of the div (this changes as the div's size changes)
        candidate.initialWidth = candidate.candidateElements.inputDiv.style.maxWidth + 'px';

        // create object attribute to store the base width of the div (this will not change, and is used to size the div correctly when the user edits candidate info)
        candidate.baseWidth = candidate.candidateElements.inputDiv.style.maxWidth + 'px';

        // create object attribute to show that the candidate is properly adjusted right now
        candidate.unadjusted = false;

        // update display type for the input div and the button div
        candidate.candidateElements.inputDiv.style.display = 'block';
        candidate.candidateElements.buttonDiv.style.display = 'block';

        // set the max width of the candidate message box
        candidate.candidateElements.messageContainer.style.maxWidth = document.getElementById('input-master-div').clientWidth;
    }
}
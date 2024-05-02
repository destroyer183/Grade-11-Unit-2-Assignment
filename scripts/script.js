'use strict';







class Candidate {

    static candidates = [];
    static inputDivs = {};

    constructor(firstNameInput, lastNameInput, gradeInput, positionInput, messageInput, imageInput) {

        // this will be a dictionary of all of the html inputs that coorespond to each type of candidate data
        this.inputReferences = {
            firstNameInput: firstNameInput, 
            lastNameInput: lastNameInput, 
            gradeInput: gradeInput, 
            positionInput: positionInput,
            messageInput: messageInput,
            imageInput: imageInput
        };


        // add candidate to class candidate dictionary
        Candidate.candidates.push(this);
    }

    verifyData() {

        // this will be the function that will verify and adjust the inputted data
        return;
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
                firstNameInputBox: document.createElement('input'), // first name input box

                lastNameDiv: document.createElement('div'),        // div to hold this input group
                lastNamePrompt: document.createElement('span'),    // last name input prompt
                lastNameInputBox: document.createElement('input'), // last name input box

                gradeDiv: document.createElement('div'),         // div to hold this input group
                gradePrompt: document.createElement('span'),     // grade input prompt
                gradeInputBox: document.createElement('select'), // grade input box

                positionDiv: document.createElement('div'),       // div to hold this input group
                positionPrompt: document.createElement('span'),   // position input prompt
                positionInptBox: document.createElement('input'), // position input box

                messageDiv: document.createElement('div'),        // div to hold this input group
                messagePrompt: document.createElement('span'),    // message input prompt
                messageInputBox: document.createElement('input'), // message input box

                imageDiv: document.createElement('div'),        // div to hold this input group
                imagePrompt: document.createElement('span'),    // image input prompt
                imageInputBox: document.createElement('input'), // image input box


                submitButton: document.createElement('button'), // submit button

                editButton: document.createElement('button'),  // edit button
                saveButton: document.createElement('button'),  // save edits button
                cancelButton: document.createElement('button') // cancel edits button

            };

            // set attributes of every element
            candidateItems.candidateDiv.setAttribute('class', 'candidate-div');

            candidateItems.headerDiv.setAttribute('class', 'header-div');

            candidateItems.ddArrow.setAttribute('src', 'assets/ddarrow.png');
            candidateItems.ddArrow.setAttribute('class', 'dd-arrow');

            candidateItems.submissionStateImage.setAttribute('src', 'assets/crossmark.png');
            candidateItems.submissionStateImage.setAttribute('class', 'submission-state-image');

            candidateItems.divHeaderSpan.setAttribute('class', 'div-header-text');
            candidateItems.divHeaderSpan.innerHTML = '<b>Candidate ' + (i+1) + ':</b> Not Submitted';


            candidateItems.inputDiv.setAttribute('class', 'input-div');


            candidateItems.firstNameDiv.setAttribute('class', 'input-group');
            
            candidateItems.firstNamePrompt.setAttribute('class', 'input-prompt');
            candidateItems.firstNamePrompt.innerHTML = '<b>First Name: </b>';

            candidateItems.firstNameInputBox.setAttribute('class', 'input-box');
            candidateItems.firstNameInputBox.setAttribute('type', 'text');
            candidateItems.firstNameInputBox.setAttribute('required', 'required');


            candidateItems.lastNameDiv.setAttribute('class', 'input-group');

            candidateItems.lastNamePrompt.setAttribute('class', 'input-prompt');
            candidateItems.lastNamePrompt.innerHTML = '<b>Last Name: </b>';

            candidateItems.lastNameInputBox.setAttribute('class', 'input-box');
            candidateItems.lastNameInputBox.setAttribute('type', 'text');
            candidateItems.lastNameInputBox.setAttribute('required', 'required');


            candidateItems.gradeDiv.setAttribute('class', 'input-group');

            candidateItems.gradePrompt.setAttribute('class', 'input-prompt');
            candidateItems.gradePrompt.innerHTML = '<b>Grade: </b>';
            
            candidateItems.gradeInputBox.setAttribute('class', 'input-box');
            candidateItems.gradeInputBox.setAttribute('name', 'grade');
            candidateItems.gradeInputBox.setAttribute('required', 'required');


            candidateItems.positionDiv


            candidateItems.messageDiv


            candidateItems.imageDiv




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

            candidateItems.firstNameDiv.appendChild(candidateItems.firstNamePrompt);
            candidateItems.firstNameDiv.appendChild(candidateItems.firstNameInputBox);

            candidateItems.lastNameDiv.appendChild(candidateItems.lastNamePrompt);
            candidateItems.lastNameDiv.appendChild(candidateItems.lastNameInputBox);

            candidateItems.gradeDiv.appendChild(candidateItems.gradePrompt);
            candidateItems.gradeDiv.appendChild(candidateItems.gradeInputBox);

            // create options for grade choices
            let option1 = document.createElement('option');
            let option2 = document.createElement('option');
            let option3 = document.createElement('option');
            let option4 = document.createElement('option');
            
            option1.setAttribute('value', '9');
            option2.setAttribute('value', '10');
            option3.setAttribute('value', '11');
            option4.setAttribute('value', '12');

            option1.innerHTML = '9';
            option2.innerHTML = '10';
            option3.innerHTML = '11';
            option4.innerHTML = '12';

            candidateItems.gradeInputBox.appendChild(option1);
            candidateItems.gradeInputBox.appendChild(option2);
            candidateItems.gradeInputBox.appendChild(option3);
            candidateItems.gradeInputBox.appendChild(option4);







            Candidate.inputDivs['candidate' + i] = candidateItems;
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
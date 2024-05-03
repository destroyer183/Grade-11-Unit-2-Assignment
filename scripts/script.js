'use strict';







class Candidate {

    static candidates ={};
    // static inputDivs = {};

    constructor(candidateDiv) {

        this.candidateDiv = candidateDiv;

        // this will be a dictionary of all of the html inputs that coorespond to each type of candidate data
        this.inputReferences = {
            firstNameInput: candidateDiv.firstNameInputBox, 
            lastNameInput: candidateDiv.lastNameInputBox, 
            gradeInput: candidateDiv.gradeInputBox, 
            positionInput: candidateDiv.positionInputBox,
            messageInput: candidateDiv.messageInputBox,
            imageInput: candidateDiv.imageInputBox
        };


        // add candidate to class candidate dictionary
        Candidate.candidates['candidate' + Object.keys(Candidate.candidates).length] = this;
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

                positionDiv: document.createElement('div'),         // div to hold this input group
                positionPrompt: document.createElement('span'),     // position input prompt
                positionInputBox: document.createElement('select'), // position input box

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

            // set attributes of header elements
            candidateItems.candidateDiv.setAttribute('class', 'candidate-div');

            candidateItems.headerDiv.setAttribute('class', 'header-div');


            candidateItems.ddArrow.setAttribute('src', 'assets/ddarrow.png');
            candidateItems.ddArrow.setAttribute('class', 'dd-arrow');

            candidateItems.submissionStateImage.setAttribute('src', 'assets/crossmark.png');
            candidateItems.submissionStateImage.setAttribute('class', 'submission-state-image');

            candidateItems.divHeaderSpan.setAttribute('class', 'div-header-text');
            candidateItems.divHeaderSpan.innerHTML = '<b>Candidate ' + (i+1) + ':</b> Not Submitted';


            // set attribute for input div
            candidateItems.inputDiv.setAttribute('class', 'input-div');


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

            candidateItems.firstNameInputBox.setAttribute('class', 'input-box');
            candidateItems.firstNameInputBox.setAttribute('type', 'text');
            candidateItems.firstNameInputBox.setAttribute('maxlength', '50');
            candidateItems.firstNameInputBox.setAttribute('required', 'required');


            // set attributes for last name input
            candidateItems.lastNamePrompt.setAttribute('class', 'input-prompt');
            candidateItems.lastNamePrompt.innerHTML = '<b>Last Name: </b>';

            candidateItems.lastNameInputBox.setAttribute('class', 'input-box');
            candidateItems.lastNameInputBox.setAttribute('type', 'text');
            candidateItems.lastNameInputBox.setAttribute('maxlength', '50');
            candidateItems.lastNameInputBox.setAttribute('required', 'required');


            // set attributes for grade input
            candidateItems.gradePrompt.setAttribute('class', 'input-prompt');
            candidateItems.gradePrompt.innerHTML = '<b>Grade: </b>';
            
            candidateItems.gradeInputBox.setAttribute('class', 'input-box');
            candidateItems.gradeInputBox.setAttribute('name', 'grade');
            candidateItems.gradeInputBox.setAttribute('required', 'required');
            candidateItems.gradeInputBox.innerHTML = (
                '<option value="9">9</option>' + 
                '<option value="10">10</option>' +
                '<option value="11">11</option>' +
                '<option value="12">12</option>'
            );


            // set attributes for position input
            candidateItems.positionPrompt.setAttribute('class', 'input-prompt');
            candidateItems.positionPrompt.innerHTML = '<b>Position: </b>';

            candidateItems.positionInputBox.setAttribute('class', 'input-box');
            candidateItems.positionInputBox.setAttribute('name', 'position');
            candidateItems.positionInputBox.setAttribute('required', 'required');
            candidateItems.positionInputBox.innerHTML = (
                '<option value="Grade 10 Representative">Grade 10 Representative</option>' +
                '<option value="Grade 11 Representative">Grade 11 Representative</option>' +
                '<option value="Grade 12 Representative">Grade 12 Representative</option>' +
                '<option value="Social Media Manager Apprentice">Social Media Manager Apprentice</option>' +
                '<option value="Physical Artist Apprentice">Physical Artist Apprentice</option>' +
                '<option value="Videographer Apprentice">Videographer Apprentice</option>'
            );


            // set attributes for message input
            candidateItems.messagePrompt.setAttribute('class', 'input-prompt');
            candidateItems.messagePrompt.innerHTML = '<b>Message: </b>';

            candidateItems.messageInputBox.setAttribute('class', 'input-box');
            candidateItems.messageInputBox.setAttribute('type', 'text');
            candidateItems.messageInputBox.setAttribute('maxlength', '200');
            candidateItems.messageInputBox.setAttribute('required', 'required');


            // set attributes for image input
            candidateItems.imagePrompt.setAttribute('class', 'input-prompt');
            candidateItems.imagePrompt.innerHTML = '<b>Image: </b>';

            candidateItems.imageInputBox.setAttribute('class', 'input-box');
            candidateItems.imageInputBox.setAttribute('type', 'file');
            candidateItems.imageInputBox.setAttribute('accept', 'image/*');
            candidateItems.imageInputBox.setAttribute('required', 'required');



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

            candidateItems.firstNameDiv.appendChild(candidateItems.firstNamePrompt);
            candidateItems.firstNameDiv.appendChild(candidateItems.firstNameInputBox);

            candidateItems.lastNameDiv.appendChild(candidateItems.lastNamePrompt);
            candidateItems.lastNameDiv.appendChild(candidateItems.lastNameInputBox);

            candidateItems.gradeDiv.appendChild(candidateItems.gradePrompt);
            candidateItems.gradeDiv.appendChild(candidateItems.gradeInputBox);

            candidateItems.positionDiv.appendChild(candidateItems.positionPrompt);
            candidateItems.positionDiv.appendChild(candidateItems.positionInputBox);

            candidateItems.messageDiv.appendChild(candidateItems.messagePrompt);
            candidateItems.messageDiv.appendChild(candidateItems.messageInputBox);

            candidateItems.imageDiv.appendChild(candidateItems.imagePrompt);
            candidateItems.imageDiv.appendChild(candidateItems.imageInputBox);



            // give div collapsible functionalities
            candidateItems.candidateDiv.addEventListener('click', function() {
                this.classList.toggle('active');
                // candidateItems.candidateDiv.toggle('active');
                let content = candidateItems.inputDiv;
                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                } else {
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            });
            


            // make the class object here
            new Candidate(candidateItems);
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
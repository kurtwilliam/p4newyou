var idApp = {};

idApp.init = function(){
  // kicks off app
  idApp.infoSubmit();
  idApp.getInfoAdvice();
};

// GET INFO - used to request info from API or create other info (date of birth, advice, sin)
idApp.infoSubmit = function(){
  // select form with jquery, listen for on submit. All following events will happen upon submission of the form. 
  $(".inputForm").submit(function (event){
    // prevent default submission event
    event.preventDefault();
    // Save all of the inputs in variables!

    // Save gender input.
    if ($('#male').is(':checked')){
      var genderInput = "male";
    } else {
      var genderInput = "female";
    }

    // Save age input. Must be between 18-99, else wont submit
    var ageInput = Number($('#age').val());
    if (ageInput < 18) {
      alert("Please enter an age above 18, or else prepare for Juvey!");
    } else if (ageInput > 99 ){
      alert("You're too old to be committing a crime! Please enter an age under 99.");
    }

    // Calculate and create a random birthday based on the age input
    idApp.dob = function(){
      // Get Birth Year based on age user inputted
      var birthYear = new Date().getFullYear() - ageInput;
      // Get Random Month
      var birthMonth = Math.ceil(Math.random()*12);
      // Get Random Day (used 28 because that is the lowest number of days in any month)
      var birthDay = Math.floor(Math.random()*28);
      // Store birth day in a variable
      idApp.dobF = `${birthDay}/${birthMonth}/${birthYear}`;
    };
    // Log date of birth to call later
    console.log(idApp.dob());

    // Save region input.
    var regionInput = $('#region option:selected').val();

    // Save favourite advices into an array
    var favAdvice = [179,184,58,135,136,74,134,131,137,164,142];
    // grab a random number for the index of favAdvice
    var randomNum = Math.floor(Math.random()*favAdvice.length);
    // Save advice into a variable
    var favAdviceNum = favAdvice[randomNum];

    // Hide h3 #newIden upon submission to make room for advice h3
    $('#newIden').addClass('hidden');

    // SIN Generator - check to make sure this option is selected upon submission
    if ($('#sin').is(':checked')){
      $('.sin').toggleClass('sinHidden');
      // Generate random values in an array
      var sinNumArr = [
        Math.floor(Math.random()*
        (999-100)+100),
        Math.floor(Math.random()*
        (999-100)+100),
        Math.floor(Math.random()*
        (999-100)+100)
      ];
      // Save the random array values into a variable 
      var sinNum = `${sinNumArr[0]} ${sinNumArr[1]} ${sinNumArr[2]}`;
      // Append the variable upon submission
      $('.sin p').append(sinNum);
    } 
 
    // Prevent submission if statement for age between 18-99 and user picked a gender
    if (ageInput < 18 || ageInput > 99 ||typeof genderInput === 'undefined') {
    } else {
      // else call information from API's if we can submit the form (name, gender, region, advice, alias, ccard info)
      idApp.getInfo(genderInput,regionInput);
      idApp.getInfoAdvice(favAdviceNum);
      idApp.getInfoAlias(); 
      // Hide questionnaire and reveal answers
      $('.inputForm').addClass('hidden');
      $('.newYou').toggleClass('secHidden');
    }
  });
};

idApp.getInfo = function(gender,region){
  // Get general data for our criminal (name, region, gender, ccard info, photo, email)
    $.ajax({
      url: 'https://uinames.com/api/?ext',
      method:'GET',
      dataType:'json',
      data:{ 
        format: 'json',
        gender: gender,
        region: region
      }
    }).then(function(data){
      idApp.displayInfo(data);
    });
};

idApp.getInfoAdvice = function(id){
  // Get advice slip - use number from array mentioned above to call a specific advice
  $.ajax({
    url: `http://api.adviceslip.com/advice/${id}`,
    method:'GET',
    dataType:'json',
    data:{
      format:'json',
      advice: id
    }
  }).then(function(data){
    idApp.displayInfoAdvice(data);
  })
}

idApp.getInfoAlias = function(alias){
  // Get online alias for our criminal - just the username. Everything else is from uinames API 
  $.ajax({
    url:'http://proxy.hackeryou.com',
    data:{
      reqUrl: 'https://throwawaymail.org/getalias',
    },
    method:'GET',
    dataType:'json',
  }).then(function(data){
    idApp.displayInfoAlias(data);
  });
};

idApp.displayInfo = function(fakeInfo){
  // code that displays our fake info once requested

  // Show alias and credit card answers if they have been requested by user
  if($('#online').is(':checked')){
    $('.alias').toggleClass('aliasHidden');
  };

  if($('#ccard').is(':checked')){
    $('.ccard').toggleClass('ccardHidden');
  };

  // save fake info generated from uinames in variables
  var name = fakeInfo.name;
  var surname = fakeInfo.surname;
  var gender = fakeInfo.gender;
  var region = fakeInfo.region;
  var age = idApp.dobF;
  var title = fakeInfo.title;
  var cCardNum = fakeInfo.credit_card.number;
  var cCardExp = fakeInfo.credit_card.expiration;
  var cCardPin = fakeInfo.credit_card.pin;
  var cCardSec = fakeInfo.credit_card.security;
  var email = fakeInfo.email;
  var photo = fakeInfo.photo;

  // append all of the info requested
  var titleEl = $('.title').append(title);
  var nameEl = $('.name').append(` ${name} `);
  var surnameEl = $('.surname').append(surname);
  var genderEl = $('.gender').append(gender);
  var regionEl = $('.region').append(region);
  var ageEl = $('.age').append(age);
  var cCardNumEl = $('.cCardNum').append(cCardNum);
  var cCardExpEl = $('.cCardExp').append(cCardExp);
  var cCardPinEl = $('.cCardPin').append(cCardPin);
  var cCardSecEl = $('.cCardSec').append(cCardSec);
  var emailEl = $('.aliasEmail').append(email);
  var photoEl = $('.aliasImgInner').css('background-image', `url('${photo}')`);
};

idApp.displayInfoAdvice = function(info){
  // save advice to display in a variable that we can call!
  var advice = info.slip.advice;
  // append advice
  var adviceEl = $('.adviceEl').append(`${advice}`);
  // make advice visible
  $('.adviceEl').toggleClass('adviceHidden');
};

// 
idApp.displayInfoAlias = function(info){
  // save generated alias into a variable
  var alias = info.alias;
  // append alias
  $('.aliasName').append(alias);
};

// Initialize App! Yaaaaay!!! 🐱
$(function(){
  idApp.init();
});
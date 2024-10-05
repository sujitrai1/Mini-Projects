const displayslider = document.querySelector(".display-slider");
const dataLengthNumber = document.querySelector(".data-lengthNumber");
const copyBtn = document.querySelector(".display-copybtn");
// initially
let passwordLength = 10;
let checkCount = 0;

//set password length
function handleSlider(){
    displayslider.value = passwordLength;
    dataLengthNumber.innerText = passwordLength;
    let min = displayslider.min;
    let max = displayslider.max;
    displayslider.style.backgroundSize = ((passwordLength - min)*100/(max-min)) + "% 100%";
}
handleSlider();

displayslider.addEventListener('input', (e) => {
passwordLength = e.target.value;
handleSlider();
})



// Uppercase Latter , Lowercase Latter, Number ,Symbol 
const Uppercaselatter = document.querySelector("#Uppercase-latter");
const lowercaselatter = document.querySelector("#Lowercase-latter");
const includeNumber = document.querySelector("#Include-number");
const includeSymbol = document.querySelector("#Include-symbol");
const indicator = document.querySelector(".display-indicator");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;    
}
setIndicator("#FFFFFF");

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRndInteger(0,9);
}

function generateLowerCase() {  
       return String.fromCharCode(getRndInteger(97,123))
}

function generateUpperCase() {  
    return String.fromCharCode(getRndInteger(65,91))
}

function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (Uppercaselatter.checked) hasUpper = true;
    if (lowercaselatter.checked) hasLower = true;
    if (includeNumber.checked) hasNum = true;
    if (includeSymbol.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}


// copy masseges / add, remove 
    const datacopymssg = document.querySelector(".show-copy-mssg");
    const passwordDisplay = document.querySelector(".display-password-msg");

    async function copyContent() {
        try {
            await navigator.clipboard.writeText(passwordDisplay.value);
            datacopymssg.innerText = "copied";
        }
        catch(e) {
            datacopymssg.innerText = "Failed";
        }
        //to make copy wala span visible
        datacopymssg.classList.add("active");
    
        setTimeout( () => {
            datacopymssg.classList.remove("active");
        },2000);
    
    }
    copyBtn.addEventListener('click', () => {
        if(passwordDisplay.value)
            copyContent();
    })
   
    
    // Fisher-Yates Shuffle Algorithm
function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

// checkboox counting 
//allCheckbox checkbox
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    //special condition
    if(passwordLength < checkCount ) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})


//generate button 
const generateBtn = document.querySelector(".generateBtn");

generateBtn.addEventListener('click', () => {
    //none of the checkbox are selected

    if(checkCount == 0) 
        return;

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // let's start the jouney to find new password
    //remove old password
    password = "";

    
    let funcArr = [];

    if(Uppercaselatter.checked)
        funcArr.push(generateUpperCase);

    if(lowercaselatter.checked)
        funcArr.push(generateLowerCase);

    if(includeNumber.checked)
        funcArr.push(generateRandomNumber);

    if(includeSymbol.checked)
        funcArr.push(generateSymbol);

    //compulsory addition
    for(let i=0; i<funcArr.length; i++) {
        password += funcArr[i]();
    }

    //remaining adddition
    for(let i=0; i<passwordLength-funcArr.length; i++) {
        let randIndex = getRndInteger(0 , funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }

    //shuffle the password
    password = shufflePassword(Array.from(password));
    
    passwordDisplay.value = password;
    
    //calculate strength
    calcStrength();
});

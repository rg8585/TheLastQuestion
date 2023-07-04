



let checker = 0
let paragraphs = [];
let paragraphsHT = [];
let chapterIndex = 0;
let cycles = 0.0003
let cycleAnimation = 0
let direction = 0
let contentHeight = 0
var wheelDeltaY = 0;
const functions = [nudgeParagraph,decreaseParagraphSize,increaseParagraphSize,takeSide,underlinging,changeFont,changeTracking];
// const functions = [changeTracking]
var scrollPosition
var canvas
let multiplier = 0
let quickswitch = true


//---------
var mainContainer
var divA
//---------


const cssClasses = [
  'narrator',
  'computer',
  'character1',
  'character2',
  'character3',
  'question',
  'multivac',
  'ending'
];

function setup() {
  canvas = createCanvas(windowWidth,windowHeight)
  canvas.position(0,0);
  canvas.style('z-index','-1')
  prepareText();
}



function prepareText() {
  mainContainer = select(".mainContainer") ;
  divA = select(".divA")
  paragraphs = selectAll("p");
  paragraphs = paragraphs.filter(paragraph => !paragraph.class().includes("chaptertext"));
  paragraphs = paragraphs.filter(paragraph => !paragraph.class().includes("chapter"));
  paragraphsHT = Array.from( document.querySelectorAll('p') );
  var filteredArray = paragraphsHT.filter(function(element) {
    return !element.classList.contains('chapter') && !element.classList.contains('chaptertext');
  });
  paragraphsHT = filteredArray
  for (var i = 0; i < paragraphs.length; i++) {
    paragraphs[i].style.fontFamily = "Roboto";
  }

}






///////////////////////////////scroll


// Store the previous scroll position and the bank value
var previousScrollPosition = 0;
var bank = 0;


// Attach the trackScroll function to the scroll event
window.addEventListener('scroll', trackScroll);

document.addEventListener("wheel", function(event) {
  
  // Retrieve the wheel delta values
  deltaX = event.deltaX || 0;
  deltaY = event.deltaY || 0;
  deltaZ = event.deltaZ || 0;

  // Get the current scroll position
  scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
  changeChapterText();

  // Calculate the height of the content
  if(cycleAnimation==0){
    contentHeight =  document.body.scrollHeight
    // if(scrollPosition > 300 && scrollPosition<400){
    //   mainContainer.style('transform','translateY(0px')
    // }
  }

  // Calculate the height of the viewport
  var viewportHeight = window.innerHeight;


  //maximum scroll position  
  // Calculate the difference between the current and previous scroll position
  var scrollDifference = scrollPosition - previousScrollPosition;



  if (scrollDifference > 0) {
    // Update the bank value
    bank += scrollDifference;

  }

  console.log("cycle anim: " + cycleAnimation)
  console.log("scroll pos + 500 need bigger : " + scrollPosition+700)
  console.log("right side: need smaller" + (contentHeight - viewportHeight-600))

  // Check if reached the bottom of the div
  if (scrollPosition+1400 >= (contentHeight - viewportHeight-600) && deltaY>0) {

    //translating scroll
    cycleAnimation -= deltaY
    quickswitch = false
    mainContainer.style('transform',`translateY(${cycleAnimation}px`)
    console.log("hello")
    console.log(cycleAnimation)
    console.log(-windowHeight*2-100)


    //cycle
    if(cycleAnimation < -windowHeight*2-100){
      mainContainer.style('transform',`translateY(${windowHeight*2}px`)
      cycleAnimation = 0
      window.scrollTo(0, 0);
      quickswitch = true
      cycles += 0.5
    }
  }


  if(scrollDifference>0){
    if(bank%2>1){
      chaos();
    }
  }

  previousScrollPosition=scrollPosition

});



function changeChapterText() {
  var targetElements = document.querySelectorAll('.chaptertext');
  var currentPosition = window.pageYOffset || document.documentElement.scrollTop;
  
  var previousIndex = -1;
  for (var i = 0; i < targetElements.length; i++) {
    var element = targetElements[i];
    var elementTop = element.offsetTop;
    var elementBottom = elementTop + element.offsetHeight;
    
    if (currentPosition >= elementTop && currentPosition <= elementBottom) {
      return; // Exit the function if a matching element is found
    } else if (currentPosition < elementTop) {
      break; // Exit the loop if the current position is before the element
    }
    
    previousIndex = i;
  }

  let writtenIndex = previousIndex+1

  if(writtenIndex<=0){
    writtenIndex = 1 
  }
  document.querySelector('.chapter').textContent = "[ "+writtenIndex+" ]";
}
function trackScroll() {
}







/////////////////////////////////chaos manager

let selectedParagraphIndex;

function chaos() {

  if (quickswitch){

    let currentHeight = getValue(divA, 'rectHeight');
    multiplier = floor((currentHeight / 3) * cycles);
  
    for (let c = 0; c < multiplier; c++) {
      let indexClassyParagraph = chooseRandomParagraph();
      let classy = findClass(paragraphs[indexClassyParagraph]);
      chooseRandomFunction(functions,indexClassyParagraph)
    }
  }

}
function chooseRandomElement(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

function chooseRandomParagraph() {
  const index = Math.floor(Math.random() * paragraphs.length);
  return index;
}


function findClass(paragraph) {
  const childNodes = paragraph.child();
  let classNames = [];

  for (let i = 0; i < childNodes.length; i++) {
    const childNode = childNodes[i];

    if (childNode.nodeType === Node.ELEMENT_NODE) {
      const classList = Array.from(childNode.classList);
      const classIndex = cssClasses.findIndex((className) => classList.includes(className));
      const className = cssClasses[classIndex];
      classNames.push(className);
    }
  }
  if(classNames.length == 1){
    return classNames[0]
  } else{
    var filteredList = classNames.filter(function(className) {
      return className !== 'narrator' && className !== 'multivac';
    });

    return filteredList[0]
  }
  // return classNames.length > 0 ? classNames[0] : '';
}


function findParagraphIndex(paragraph) {
  return paragraphs.findIndex((p) => p.elt === paragraph.elt);
}


function hasCharacterAtBeginning(className) {
  let match = false
  if (className == "character1"){
    return true
  }
  if (className == "character2"){
    return true
  }
  if (className == "character3"){
    return true
  }
  return false
}

function chooseRandomFunction(functions,n) {
  const randomIndex = Math.floor(Math.random() * functions.length);
  const randomFunction = functions[randomIndex];
  randomFunction(n); // Invoke the randomly chosen function
}



function mouseClicked() {
  increaseParagraphSize(8)
}



///////////////////////////////changers


function changeFont(n){
  let paragraph = paragraphs[n];
  let children = paragraph.child();
  for(let i=0; i<children.length ; i++ ){

    let diceRoll = random(100)
    let diceRollB = random(100)
    let diceRollC = random(100)
    let child = children[i]
    let styleChild = children[i].classList[0]
    let textSize = (parseInt(window.getComputedStyle(child).fontSize))
    let lineHeighter = (parseInt(window.getComputedStyle(child).lineHeight))
    lineHeighter += 3

    if(diceRoll>80){
      child.style.lineHeight = `${lineHeighter}px`
    }

    if(diceRollB>90){
      child.style.fontWeight = random(["100","300","500"])
    }

    if(styleChild=="computer"){
      child.style.fontWeight = "900";
    }
  

    if(textSize>30 && diceRoll>80){
      child.style.fontStyle = "italic"
    }

    if(diceRoll>97 && styleChild=="narrator"){
      child.style.fontFamily = "Roboto Condensed"
    }


  }
}


function changeTracking(n){
  let paragraph = paragraphs[n];
  let children = paragraph.child();

  for(let i=0; i<children.length ; i++ ){

    let diceRoll = random(100)
    let child = children[i]
    let styleChild = children[i].classList[0]
    let spacing = (parseInt(window.getComputedStyle(child).letterSpacing))
    print("glofdslgdlosgsd" + spacing)
    let inc = random(-0.01,0.01)
    spacing += inc

    if(styleChild=="computer" || styleChild=="multivac" ){
      child.style.letterSpacing = `${spacing}px`;
    }
    if(diceRoll>80 && styleChild=="narrator"){
      child.style.letterSpacing = `${spacing}px`;
    }

  }
}


function underlinging(n){
  let diceRoll = random(100)
  let diceRollB = random(100)
  if(diceRoll>70){
    let paragraph = paragraphs[n];
    let children = paragraph.child();
    for(let i=0; i<children.length ; i++ ){
      let child = children[i]
      let styleChild = children[i].classList[0]
      if ( (styleChild == "character1" || styleChild == "character2") && diceRollB>60 ){
        child.style.textDecoration = "underline";
      }else{
        child.style.textDecoration = "none";
      }
    }

  }
}


function takeSide(n){
  print("take side")
  let paragraph = paragraphs[n];
  let children = paragraph.child();
  for(let i=0; i<children.length ; i++ ){

    let child = children[i]
    let styleChild = children[i].classList[0]
    let textSize = (parseInt(window.getComputedStyle(child).fontSize))
    let marginLeft = (parseInt(window.getComputedStyle(child).marginLeft))
    let marginRight = (parseInt(window.getComputedStyle(child).marginRight))


    
    if (styleChild == "character1"){
      child.style.justifyContent = "left";
      child.style.display = "flex"
      textSize += 1
      if(textSize<50){
        child.style.fontSize = `${textSize}px`
        
      }
    }
    
    
    if (styleChild == "character2"){
      child.style.justifyContent = "right";
      child.style.display = "flex"
      textSize += 1
      if(textSize<50){
        child.style.fontSize = `${textSize}px`;
      }
    }
    
    
    if (styleChild == "narrator"){
      child.style.justifyContent = "center";
      textSize += random(-1,1)
      if(textSize>11){
        child.style.fontSize = `${textSize}px`
      }

    }


  }
}

function increaseParagraphSize(n) {

  
  let paragraph = paragraphs[n];
  let children = paragraph.child();
  
  for(let i=0; i<children.length ; i++ ){
    let diceRoll = random(100)
    let child = children[i]
    let textSize = (parseInt(window.getComputedStyle(child).fontSize))
    textSize += 1
    if (textSize<50){
      child.style.fontSize = `${textSize}px`
      print("blublu")
    }

    if(diceRoll>98){
      child.style.fontSize = 50 +"px" 
    }
  }
  
}


function decreaseParagraphSize(n) {

  let paragraph = paragraphs[n];
  let children = paragraph.child();
  
  for(let i=0; i<children.length ; i++ ){
    let child = children[i]
    print(child)
    let textSize = (parseInt(window.getComputedStyle(child).fontSize))
    textSize -= 1
    if (textSize>11){
      child.style.fontSize = `${textSize}px`
    }
  }

}



function nudgeParagraph(n) {
  let paragraph = paragraphs[n];
  let currentMarginLeft = parseFloat(paragraph.style('margin-left'));
  let newMarginLeft = currentMarginLeft + random(-30, 30);
  let currentMarginRight = parseFloat(paragraph.style('margin-right'));
  let newMarginRight = currentMarginRight + random(-30, 30);
  
  paragraph.style('margin-left', newMarginLeft + 'px');
  paragraph.style('margin-right', newMarginRight + 'px');
  
}



function createColumn(n) {
  // Check if the index is within the bounds of the array
  if (n >= 0 && n < paragraphs.length - 1) {
    // Create a new div element to hold the columns
    let columnContainer = createDiv('');
    columnContainer.style('display', 'flex');

    // Create the first column and set its content
    let column1 = createP(paragraphs[n].elt.textContent);
    column1.class('column');

    // Create the second column and set its content from the next paragraph
    let nextParagraph = paragraphs[n + 1].elt;
    let column2 = createP(nextParagraph.textContent); // Copy the text content
    column2.class('column');

    // Insert the columns into the column container
    columnContainer.child(column1);
    columnContainer.child(column2);

    // Get the reference to the current paragraph's DOM element
    let currentParagraphDOM = paragraphs[n].elt;

    // Insert the column container after the current paragraph
    divA.elt.insertBefore(columnContainer.elt, currentParagraphDOM.nextSibling);

    // Remove the original paragraph and the next paragraph
    paragraphs[n].remove();
    paragraphs[n + 1].remove();

    // Update the paragraphs array with the new column container
    paragraphs[n] = column1;
    paragraphs[n + 1] = column2; // Assign the updated column container to paragraphs[n+1]
  }
}


function splitParagraph(n) { //split one paragraph
  let paragraphA = paragraphs[n];
  let textContent = paragraphA.html();
  let words = textContent.split(' ');
  let wordsA = words.slice(0, 2);
  let wordsB = words.slice(2);

  // Update the content of paragraphA
  paragraphA.html(wordsA.join(' '));

  // Create a new paragraph element for wordsB
  let paragraphB = createElement('p');
  paragraphB.html(wordsB.join(' '));

  // Insert paragraphB after paragraphA
  paragraphA.elt.insertAdjacentElement('afterend', paragraphB.elt);
}


//////////// usability and engine


function getValue(object,kind){ //scale-y is in transform //rect height is the whole boundingbox

  if (kind == "scaleY") {
    let string = object.elt.style.transform;
    // Remove any non-numeric characters from the string
    let numberString = string.replace(/[^\d.]/g, "");
    // Convert the extracted string to a number
    let number = parseFloat(numberString);
    return number;
  }

  if(kind == "rectHeight"){
    let number = object.elt.getBoundingClientRect().height
    return number;
  }

}

;(function() {
  var throttle = function(type, name, obj) {
    var obj = obj || window;
    var running = false;
    var func = function() {
      if (running) {
        return;
      }
      running = true;
      requestAnimationFrame(function() {
        obj.dispatchEvent(new CustomEvent(name));
        running = false;
      });
    };
    obj.addEventListener(type, func);
  };

  throttle("scroll", "optimizedScroll");
})();



function keyTyped() {
  if (key == 'r'){
    location.reload()
  }
}


//////NOTES TO KEEP:---------------------------------------------------


//Get the current font size of the first paragraph 
//let currentSize = parseFloat(paragraphs[0].style('font-size'));

//check paragraph height
// let scaledHeight = paragraph.elt.getBoundingClientRect().height;


//design h1 the last question
//roboto condesned
//change scrollbar in firefox
//add avater icon

import { getNode } from "../utils/getNode";
import { quizData, elementsArray, glossesArray } from "./jsondata";
import "../../style.scss";

const shuffleArray = (arr) => [...arr.sort(() => Math.random() - 0.5)];

const shuffledData = shuffleArray(quizData);
let idx = 0;
const incorrectQuizIdxSet = new Set();

const getFullGlossQuiz = ({ element, gloss, example }) => {
  const titleHtml = /* html */ `<h2>Element: ${element}</h2>
  <h3>Example</h3> <span class = "example-words"><div class = 'hiding-hint'>마우스를 올리면 힌트가 보입니다.</div>${example}</span>
    `;

  const glosses = shuffleArray(glossesArray)
    .filter((ele) => ele !== gloss)
    .slice(0, 4);

  const correctOption = `<li id-correct="true">${gloss}</li>`;

  const incorrectOption = glosses.reduce((acc, crnt) => {
    return [`<li id-correct="false">${crnt}</li>\n`, ...acc];
  }, []);

  return `${titleHtml} <ol>${shuffleArray([
    ...incorrectOption,
    correctOption,
  ]).join("")}</ol>`;
};

const getFullElementQuiz = ({ element, gloss, example }) => {
  const titleHtml = /* html */ `<h2>Gloss: ${gloss}</h2>
  <h3>Example</h3> <span class = "example-words"><div class = 'hiding-hint'>마우스를 올리면 힌트가 보입니다.</div>${example}</span>
    `;

  const elements = shuffleArray(elementsArray)
    .filter((ele) => ele !== element)
    .slice(0, 4);

  const correctOption = `<li id-correct="true">${element}</li>`;

  const incorrectOption = elements.reduce((acc, crnt) => {
    return [`<li id-correct="false">${crnt}</li>\n`, ...acc];
  }, []);

  return `${titleHtml} <ol>${shuffleArray([
    ...incorrectOption,
    correctOption,
  ]).join("")}</ol>`;
};

const getRootContainer = (dataList, quizNum, quizType = "gloss") => {
  if (quizType === "gloss") {
    const containerHTML = /* html */ `
    <div class = "root-container">
      <h1>Gloss-Quiz${quizNum + 1}</h1>
      <section class="text-contents" >

      ${getFullGlossQuiz(dataList[idx])}
      </section>
    </div>
  `;
    getNode("#root").insertAdjacentHTML("afterbegin", containerHTML);
  } else {
    const containerHTML = /* html */ `
    <div class = "root-container">
      <h1>Element-Quiz${quizNum + 1}</h1>
      <section class="text-contents" >

      ${getFullElementQuiz(dataList[idx])}
      </section>
    </div>
  `;
    getNode("#root").insertAdjacentHTML("afterbegin", containerHTML);
  }
};

const showAndHide = (element, time) => {
  element.classList.remove("hide");
  setTimeout(() => {
    element.classList.add("hide");
  }, time);
};

const showIncorrectList = (incorrectSet) => {
  let result = "<h1>Incorrect Words List!</h1>";

  incorrectSet.forEach((ele) => {
    result += `<li><p>element: ${shuffledData[ele].element}</p> <p>gloss: ${shuffledData[ele].gloss}</p> <p>examples: ${shuffledData[ele].example}</p></li>`;
  });

  const pageHTML = /* html */ `<ol>
    ${result}
  </ol>`;

  return pageHTML;
};

const createGlossQuiz = (quizNum) => {
  getRootContainer(shuffledData, idx, "gloss");

  getNode("#root").addEventListener("click", (e) => {
    if (e.target.tagName !== "LI") return;

    if (e.target.getAttribute("id-correct") === "true") {
      idx += 1;

      if (idx === quizNum /* shuffledData.length */) {
        getNode(".root-container").remove();

        if (incorrectQuizIdxSet.size === 0) {
          getNode("#root").insertAdjacentHTML(
            "afterbegin",
            '<h1 class="cong">Congratulations!!!!!</h1>'
          );
          return;
        } else {
          getNode("#root").insertAdjacentHTML(
            "afterbegin",
            showIncorrectList(incorrectQuizIdxSet)
          );
          return;
        }
      }

      getNode(".root-container").remove();
      getRootContainer(shuffledData, idx, "gloss");
      showAndHide(getNode(".O"), 1500);
    } else {
      showAndHide(getNode(".X"), 500);
      incorrectQuizIdxSet.add(idx);
    }
  });
};

const createElementQuiz = (quizNum) => {
  getRootContainer(shuffledData, idx, "element");

  getNode("#root").addEventListener("click", (e) => {
    if (e.target.tagName !== "LI") return;

    if (e.target.getAttribute("id-correct") === "true") {
      idx += 1;

      if (idx === quizNum /* shuffledData.length */) {
        getNode(".root-container").remove();

        if (incorrectQuizIdxSet.size === 0) {
          getNode("#root").insertAdjacentHTML(
            "afterbegin",
            '<h1 class="cong">Congratulations!!!!!</h1>'
          );
          return;
        } else {
          getNode("#root").insertAdjacentHTML(
            "afterbegin",
            showIncorrectList(incorrectQuizIdxSet)
          );
          return;
        }
      }

      getNode(".root-container").remove();
      getRootContainer(shuffledData, idx, "element");
      showAndHide(getNode(".O"), 1500);
    } else {
      showAndHide(getNode(".X"), 500);
      incorrectQuizIdxSet.add(idx);
    }
  });
};

const createHome = () => {
  const homeHTML = /* html */ `
    <section class = "home-container">
    <h1>영어 어휘 분석 어원 퀴즈!</h1>
    <div>
    <label for="words-number">문제 수 선택: 
    <input id='words-number' type="number" value="10" min="5" max="${quizData.length}" ></label>
    <p>최소 문제 수: 5</p>
    <p>최대 문제 수: ${quizData.length}</p>
    </div>
    <div class="quiz-button-container"><button type="button" class="gloss-quiz-start">Gloss Quiz 시작!</button>
    <button type="button" class="element-quiz-start">Element Quiz 시작!</button></div>
    <button type="button" class="dictionary">사전 보러가기!</button>
    </section>
  `;

  getNode("#root").insertAdjacentHTML("afterbegin", homeHTML);
  addGlossQuizEvent();
  addElementQuizEvent();
  addDictionaryEvent();
};

const addGlossQuizEvent = () => {
  getNode(".gloss-quiz-start").addEventListener("click", () => {
    const numberOfQuiz = +getNode("#words-number").value;

    if (numberOfQuiz < 5) {
      window.alert("5개 이상 48개 이하의 문제 수를 설정해야합니다.");
      getNode("#words-number").focus();
      return;
    }

    getNode(".home-container").remove();
    createGlossQuiz(numberOfQuiz);
  });
};

const addElementQuizEvent = () => {
  getNode(".element-quiz-start").addEventListener("click", () => {
    const numberOfQuiz = +getNode("#words-number").value;
    if (numberOfQuiz < 5) {
      window.alert("5개 이상 48개 이하의 문제 수를 설정해야합니다.");
      getNode("#words-number").focus();
      return;
    }
    getNode(".home-container").remove();

    createElementQuiz(numberOfQuiz);
  });
};

const addDictionaryEvent = () => {};

createHome();

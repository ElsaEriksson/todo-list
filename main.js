import "./sass/main.scss";

class List {
  title;
  category;
  color;
  isCompleted;
  isDeleted;
  isClicked;
  isSorted;
  created;

  constructor(title, category, color) {
    this.title = title;
    this.category = category;
    this.color = color;
    this.isCompleted = false;
    this.isDeleted = false;
    this.isClicked = false;
    this.isSorted = false;
    this.created = Date;
  }
}

const toReadList = new List("To Read", "Personal", "#e9d7d7");
const groceryList = new List("Grocery List", "Errand", "#d2a96c");
const homeworkList = new List("Homework", "School", "#b67878");
const birthdayPartyList = new List("Birthday Party", "Event", "#8fa198");

let lists = [toReadList, groceryList, homeworkList, birthdayPartyList];
if (localStorage.getItem("lists")) {
  lists = JSON.parse(localStorage.getItem("lists"));
}

let sort = "";

function createHtmlForNewLists() {
  const emptyInputPage = document.getElementById("inputPage");
  emptyInputPage.innerHTML = "";
  const toDolist = document.getElementById("toDolist");
  toDolist.innerHTML = "";

  console.log(lists);

  for (let i = 0; i < lists.length; i++) {
    const newList = lists[i];

    const containerListDescription = document.createElement("section");
    containerListDescription.className = "container--listDescription";

    const containerListTexts = document.createElement("section");
    containerListTexts.className = "container--listTexts";

    const titleBold = document.createElement("p");
    titleBold.className = "title__bold";
    titleBold.innerHTML = newList.title;

    const categoryRegular = document.createElement("p");
    categoryRegular.className = "category--title__regular";
    categoryRegular.innerHTML = newList.category;

    const listTitle = document.createElement("section");
    listTitle.className = "listTitle";

    const listCategory = document.createElement("section");
    listCategory.className = "listCategory";

    const containerNewList = document.createElement("li");
    containerNewList.className = "container--createNewList";
    containerNewList.style.backgroundColor = newList.color;

    const trashcan = document.createElement("section");
    trashcan.className = "container--trashcan";
    trashcan.innerHTML = `<i class="fa-solid fa-trash" style="color: #000000;"></i>`;
    trashcan.addEventListener("click", () => {
      newList.isDeleted = true;
      trashcanRemoveList(i);
    });

    const checkButton = checkedToDoList(newList);

    const arrowRight = document.createElement("section");
    arrowRight.className = "arrow__right";
    const arrowRightIcon = document.createElement("i");
    arrowRightIcon.innerHTML = `<i class="fa-solid fa-arrow-right-long" style="color: #000000;"></i>`;

    clickList(newList, lists, containerListDescription, containerNewList);

    arrowRight.appendChild(arrowRightIcon);
    listCategory.appendChild(categoryRegular);
    listTitle.appendChild(titleBold);
    containerListTexts.appendChild(listTitle);
    containerListTexts.appendChild(listCategory);
    containerListDescription.append(checkButton);
    containerListDescription.append(trashcan);
    containerListDescription.appendChild(containerListTexts);
    containerListDescription.appendChild(arrowRight);
    containerNewList.appendChild(containerListDescription);
    toDolist.appendChild(containerNewList);
  }
  save();
}

createHtmlForNewLists();

function createInputPage() {
  const createInputPage = document.getElementById("inputPage");
  createInputPage.className = "container--inputPage";
  const homePage = document.getElementById("homePage");
  homePage.style.display = "none";
  homePage.style.opacity = 0;

  const inputPageTitle = document.getElementById("pageTitleChange");
  inputPageTitle.innerHTML = "Create List";

  const containerCategoryInput = labelsForCategoryInput();
  const titleInput = labelsForTitleInput();
  const colorInput = labelsForColorInput();
  const saveButton = createSaveButton();

  createInputPage.appendChild(titleInput);
  createInputPage.appendChild(containerCategoryInput);
  createInputPage.appendChild(colorInput);
  createInputPage.appendChild(saveButton);
}

document.getElementById("createNewList").addEventListener("click", () => {
  createInputPage();
});

function labelsForTitleInput() {
  const containerTitleInput = document.createElement("section");
  containerTitleInput.className = "containerTitleInput";

  const labelTitleInput = document.createElement("label");
  labelTitleInput.innerHTML = "Title";
  labelTitleInput.className = "labelTitleElement";

  const titleInput = createTitleInput();

  containerTitleInput.appendChild(labelTitleInput);
  containerTitleInput.appendChild(titleInput);

  return containerTitleInput;
}

function labelsForCategoryInput() {
  const containerCategoryInput = document.createElement("section");
  containerCategoryInput.className = "containerCategoryInput";

  const labelCategoryElement = document.createElement("label");
  labelCategoryElement.innerHTML = "Category";
  labelCategoryElement.className = "labelCategoryElement";

  const categoryInput = createCatergoryInput();

  containerCategoryInput.appendChild(labelCategoryElement);
  containerCategoryInput.appendChild(categoryInput);

  return containerCategoryInput;
}

function labelsForColorInput() {
  const containerColors = document.createElement("section");
  containerColors.className = "containerColors";

  const labelColorInput = document.createElement("label");
  labelColorInput.innerHTML = "Color";
  labelColorInput.className = "labelColorElement";

  const containerColorInput = createColorInput();

  containerColors.appendChild(labelColorInput);
  containerColors.appendChild(containerColorInput);

  return containerColors;
}

function createSaveButton() {
  const saveButton = document.createElement("button");
  saveButton.type = "submit";
  saveButton.className = "saveButton";
  saveButton.innerHTML = "Save";

  saveButton.addEventListener("click", () => {
    const titleInput = document.getElementById("title");
    const titleFromUser = titleInput.value;

    const categoryInput = document.getElementById("category");
    const categoryFromUser = categoryInput.value;

    const selectedColorOption = document.querySelector(
      ".optionForColor--radiobutton:checked"
    );
    const colorFromUser = selectedColorOption
      ? selectedColorOption.value
      : null;

    const newList = new List(titleFromUser, categoryFromUser, colorFromUser);
    lists.unshift(newList);

    if (sort === "color") {
      sortByColor();
    }

    if (sort === "title") {
      sortByTitle();
    }

    if (sort === "original") {
      sortByLatestAdded();
    }

    const homePage = document.getElementById("homePage");
    homePage.style.display = "block";
    homePage.style.opacity = 1;
    const pageTitleCreateList = document.getElementById("pageTitleChange");
    pageTitleCreateList.innerHTML = "To Do List";

    createHtmlForNewLists();
  });
  return saveButton;
}

function createTitleInput() {
  const titleInput = document.createElement("input");
  titleInput.value = "";
  titleInput.type = "text";
  titleInput.className = "titleInput";
  titleInput.required = true;
  titleInput.id = "title";

  titleInput.addEventListener("input", () => {
    let inputValue = titleInput.value;
    inputValue = inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
    titleInput.value = inputValue;
  });

  return titleInput;
}

function createCatergoryInput() {
  const categoryInput = document.createElement("input");
  categoryInput.value = "";
  categoryInput.type = "text";
  categoryInput.className = "categoryInput";
  categoryInput.required = true;
  categoryInput.id = "category";

  return categoryInput;
}

function createColorInput() {
  const containerColorInput = document.createElement("section");
  containerColorInput.className = "colorInput";

  const colorOptions = [
    { value: "#e9d7d7" },
    { value: "#d2a96c" },
    { value: "#b67878" },
    { value: "#8fa198" },
    { value: "#94C1E0" },
    { value: "#9978AC" },
  ];

  colorOptions.forEach((option) => {
    const optionForColor = document.createElement("input");
    optionForColor.type = "radio";
    optionForColor.value = option.value;
    optionForColor.name = "color";
    optionForColor.style.backgroundColor = option.value;
    optionForColor.className = "optionForColor--radiobutton";

    const colorBox = document.createElement("span");
    colorBox.className = "colorBox";
    colorBox.style.backgroundColor = option.value;

    colorBox.appendChild(optionForColor);
    containerColorInput.appendChild(colorBox);
  });

  return containerColorInput;
}

function trashcanRemoveList(i) {
  lists.splice(i, 1);
  createHtmlForNewLists();
  // console.log(lists);
}

function checkedToDoList(newList) {
  const checkButton = document.createElement("section");
  checkButton.className = "heartCheckButton";

  const uncheckedButton = document.createElement("span");
  uncheckedButton.className = "heartButtonUnchecked";
  uncheckedButton.innerHTML =
    '<i class="fa-regular fa-heart" style="color: #ff0000"></i>';

  const buttonChecked = document.createElement("span");
  buttonChecked.className = "heartButtonChecked";
  buttonChecked.innerHTML = "";

  if (newList.isCompleted) {
    uncheckedButton.innerHTML = "";
    buttonChecked.innerHTML =
      '<i class="fa-solid fa-heart" style="color: #ff0000"></i>';
    uncheckedButton.appendChild(buttonChecked);
  }
  checkButton.addEventListener("click", () => {
    // console.log(newList);
    newList.isCompleted = !newList.isCompleted;
    createHtmlForNewLists();
  });

  checkButton.appendChild(uncheckedButton);
  return checkButton;
}

function save() {
  localStorage.setItem("lists", JSON.stringify(lists));
  // console.log("Saving to localStorage:", lists);
}

function clickList(newList, lists, containerListDescription, containerNewList) {
  if (newList.isClicked) {
    containerNewList.classList.add("selected");
  }

  containerListDescription.addEventListener("click", () => {
    for (let j = 0; j < lists.length; j++) {
      lists[j].isClicked = false;
    }
    newList.isClicked = true;
    createHtmlForNewLists();
  });
}

function showSortingOptions() {
  const sortByButton = document.getElementById("sortByButton");
  sortByButton.addEventListener("click", () => {
    const sortContainer = document.getElementById("showSort");
    sortContainer.classList.toggle("show");
    testColor();
    testTitle();
    testAdded();
  });
}
showSortingOptions();

function clickSort() {
  const sortByButton = document.getElementById("yes");
  const sortContainer = document.createElement("section");
  sortContainer.className = "sortButton";
  sortContainer.id = "showSort";

  const sortOptions = [
    { value: "Title" },
    { value: "Category" },
    { value: "Color" },
  ];

  sortOptions.forEach((option, i) => {
    const optionForSorting = document.createElement("input");
    optionForSorting.type = "option";
    optionForSorting.value = option.value;
    optionForSorting.name = "sort";
    optionForSorting.className = "optionForSorting";
    optionForSorting.id = "sort" + i;

    const sortBox = document.createElement("span");
    sortBox.className = "sortBox";
    sortBox.innerHTML = option.value;

    optionForSorting.appendChild(sortBox);
    sortContainer.appendChild(optionForSorting);
  });
  sortByButton.appendChild(sortContainer);
  // sortByColor();
  // sortByTitle();
  return sortOptions;
}
clickSort();

function testColor() {
  const sortOptionColor = document.getElementById("sort2");
  sortOptionColor.addEventListener("click", () => {
    sortByColor();
    createHtmlForNewLists();
  });
}

function testTitle() {
  const sortOptionTitle = document.getElementById("sort0");
  sortOptionTitle.addEventListener("click", () => {
    sortByTitle();
    createHtmlForNewLists();
  });
}

function testAdded() {
  const sortOptionByAdded = document.getElementById("sort1");
  sortOptionByAdded.addEventListener("click", () => {
    sortByLatestAdded();
    createHtmlForNewLists();
  });
}

function sortByColor() {
  sort = "color";
  if (sort === "color") {
    const sortOrder = {
      "#e9d7d7": 0,
      "#d2a96c": 1,
      "#b67878": 2,
      "#8fa198": 3,
      "#94C1E0": 4,
      "#9978AC": 5,
    };

    lists.sort(function (p1, p2) {
      return sortOrder[p1.color] - sortOrder[p2.color];
    });
  }
}

function sortByTitle() {
  sort = "title";
  if (sort === "title") {
    return lists.sort((p1, p2) => {
      if (sort) {
        if (p1.title > p2.title) return 1;
        if (p1.title < p2.title) return -1;

        return 0;
      }
    });
  }
}

function sortByLatestAdded() {
  sort = "original";
  if (sort === "original") {
    return lists.sort((p1, p2) => {
      if (sort) {
        if (p1.title > p2.category) return 1;
        if (p1.title < p2.title) return -1;

        return 0;
      }
    });
  }
}

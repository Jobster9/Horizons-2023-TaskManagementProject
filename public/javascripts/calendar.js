const currentDate = document.querySelector(".current-date");
var daysTag = document.querySelector(".days");
var prevNextIcon = document.querySelectorAll(".icons span");
const userTaskCollectionElement = document.getElementById("userTaskCollectionData");
const userTaskCollectionData = userTaskCollectionElement.getAttribute("data-collection");
const userTaskCollection = JSON.parse(decodeURIComponent(userTaskCollectionData));

let date = new Date(),
  currYear = date.getFullYear(),
  currMonth = date.getMonth();
let tasks = [];

if (userTaskCollection) {
  userTaskCollection.forEach((tasklist) => {
    tasklist.tasks.forEach((task) => {
      tasks.push(task);
    });
  });
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function displayTasks(date, tasks, currMonth, currYear) {
  const tasksOnDate = tasks.filter((task) => {
    let taskDeadline = new Date(task.TaskDeadline);
    return (
      taskDeadline.getDate() === date &&
      taskDeadline.getMonth() === currMonth &&
      taskDeadline.getFullYear() === currYear
    );
  });

  let tasksList = "";
  tasksOnDate.forEach((task) => {
    let taskDeadline = new Date(task.TaskDeadline);
    tasksList += `
      <div>
        <strong>Task Name:</strong> ${task.TaskName}
        <br>
        <strong>Task Deadline:</strong> ${taskDeadline.toLocaleDateString()} 
        <hr>
      </div>`;
  });

  const tasksDisplay = document.getElementById("tasksDisplay");
  tasksDisplay.innerHTML = tasksList;

  const tasksModal = new bootstrap.Modal(document.getElementById("tasksModal"));
  tasksModal.show();
}

const renderCalendar = () => {
  let firstDayofMonth = new Date(currYear, currMonth, 1).getDay();
  let lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate();
  let lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay();
  let lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();
  let liTag = "";
  for (let i = firstDayofMonth; i > 0; i--) {
    liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
  }

  for (let i = 1; i <= lastDateofMonth; i++) {
    let isToday =
      i === date.getDate() && currMonth === new Date().getMonth() && currYear === new Date().getFullYear()
        ? "active"
        : "";
    let isTask = "";
    for (let j = 0; j < tasks.length; j++) {
      if (
        new Date(tasks[j].TaskDeadline).getDate() === i &&
        new Date(tasks[j].TaskDeadline).getMonth() === currMonth &&
        new Date(tasks[j].TaskDeadline).getFullYear() === currYear
      ) {
        isTask = "task";
        break;
      }
    }
    liTag += `<li class="${isToday} ${isTask}" data-day="${i}">${i}</li>`;
  }

  for (let i = lastDayofMonth; i < 6; i++) {
    liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
  }

  currentDate.innerText = `${months[currMonth]} ${currYear}`;
  daysTag.innerHTML = liTag;

  const taskDays = document.querySelectorAll(".days li.task");
  taskDays.forEach((taskDay) => {
    taskDay.addEventListener("click", (event) => {
      const clickedDate = parseInt(event.target.getAttribute("data-day"));
      displayTasks(clickedDate, tasks, currMonth, currYear);
    });
  });
};
renderCalendar();

prevNextIcon.forEach((icon) => {
  icon.addEventListener("click", () => {
    currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

    if (currMonth < 0 || currMonth > 11) {
      date = new Date(currYear, currMonth);
      currYear = date.getFullYear();
      currMonth = date.getMonth();
    } else {
      date = new Date();
    }
    renderCalendar();
  });
});

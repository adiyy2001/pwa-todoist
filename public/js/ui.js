const tasks = document.querySelector('.tasks')

document.addEventListener('DOMContentLoaded', function () {
  // nav menu
  const menus = document.querySelectorAll('.side-menu')
  M.Sidenav.init(menus, { edge: 'right' })
  // add task form
  const forms = document.querySelectorAll('.side-form')
  M.Sidenav.init(forms, { edge: 'left' })
})

const renderTasks = (data, id) => {
  const html = `
    <div class="card-panel task white row" data-id="${id}">
      <div class="task-details">
        <div class="task-title">${data.Title}</div>
        <div class="task-ingredients">${data.Description}</div>
      </div>
      <div class="task-delete">
        <i class="material-icons" data-id="${id}">delete_outline</i>
      </div>
    </div>
  `;

  tasks.innerHTML += html;
}


const removeTask = (id) => {
  const task = document.querySelector(`.task[data-id=${id}]`);
  task.remove();
}
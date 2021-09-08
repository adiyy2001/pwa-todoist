db.enablePersistence().catch((err) => {
  if (err.code === 'failed-percondition') {
    // multiple tabs opened
    console.log('persistence failed')
  } else if (err.code === 'unimplmented') {
    console.log('persistence is not avaible')
  }
})

db.collection('tasks').onSnapshot((snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === 'added') {
      renderTasks(change.doc.data(), change.doc.id)
    }
    if (change.type === 'removed') {
      removeTask(change.doc.id)
    }
  })
})

const form = document.querySelector('form');
form.addEventListener('submit', evt => {
  evt.preventDefault();
  const task = {
    Title: form.title.value,
    Description: form.description.value
  };

  db.collection('tasks').add(task)
    .catch(err => console.log(err));

  form.title.value = '';
  form.description.value = '';
});

const taskContainer = document.querySelector('.tasks');
taskContainer.addEventListener('click', (evt) => {
  if(evt.target.tagName === 'I') {
    const id = evt.target.getAttribute('data-id');
    db.collection('tasks').doc(id).delete();
  }
})
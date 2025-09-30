// Entry script
console.log("App loaded");

document.querySelectorAll('.title').forEach(el => {
  el.addEventListener('click', () => {
    el.classList.toggle('active');
  });
});

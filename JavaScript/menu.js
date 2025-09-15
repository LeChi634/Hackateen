// menu.js - dropdown acessível e robusto
const toggleButton = document.getElementById('menu-toggle');
const dropdownMenu = document.getElementById('dropdown-menu');

if (toggleButton && dropdownMenu) {
  toggleButton.setAttribute('aria-expanded', 'false');
  dropdownMenu.setAttribute('aria-hidden', 'true');

  function closeMenu(){
    dropdownMenu.classList.add('hidden');
    toggleButton.setAttribute('aria-expanded', 'false');
    dropdownMenu.setAttribute('aria-hidden', 'true');
  }

toggleButton.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  const isOpen = dropdownMenu.classList.toggle('hidden') === false;
  toggleButton.setAttribute('aria-expanded', String(isOpen));
  dropdownMenu.setAttribute('aria-hidden', String(!isOpen));
});

document.addEventListener('click', (e) => {
  if (!dropdownMenu.contains(e.target) && !toggleButton.contains(e.target)) closeMenu();
});

document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

// Fecha ao clicar em qualquer link do dropdown
dropdownMenu.addEventListener('click', (e) => {
  const target = e.target;
  if (target && target.tagName === 'A') closeMenu();
});
}

//--------- Theme Toggle

const themeToggleCheckbox = document.querySelector('#themeToggleCheckbox');

// Store theme
const storeTheme = function (theme) {
  localStorage.setItem("theme", theme);
};

// Set theme when visitor returns
const setTheme = function () {
  const activeTheme = localStorage.getItem("theme");
  if (activeTheme === 'dark') {
    themeToggleCheckbox.checked = true;
  }
  // fallback for no :has() support
  document.documentElement.className = activeTheme;
};

// On click
themeToggleCheckbox.addEventListener("change", () => {
    if (themeToggleCheckbox.checked) {
        storeTheme('dark');
        // fallback for no :has() support
        document.documentElement.className = 'dark';
    } else{
        storeTheme('light');
        // fallback for no :has() support
        document.documentElement.className = 'light';
    }
});

document.onload = setTheme();
// Data structure for the menu
const menuData = [
    { id: 'fairy', title: 'Fairy Party', subtitle: "Phoebe's 1st birthday • 2015", folder: 'Fairy Party' },
    { id: 'boogie', title: 'Boogie Party', subtitle: "Phoebe's 3rd birthday • 2017", folder: 'Boogie Party' },
    { id: 'farm', title: 'Fun on the Farm', subtitle: "Annie's 1st birthday • 2017", folder: 'Fun on the Farm' },
    { id: 'glow', title: 'Glow in the Dark', subtitle: "Phoebe's 4th birthday • 2018", folder: 'Glow in the Dark' },
    { id: 'rainbows', title: 'Rainbows & Unicorns Party', subtitle: "Phoebe's 5th birthday • 2019", folder: 'Rainbows & Unicorns Party' },
    { id: 'rabbit', title: 'Peter Rabbit Party', subtitle: "Annie's 3rd birthday • 2019", folder: 'Peter Rabbit Party' },
    { id: 'gruffalo', title: 'Gruffalo Party', subtitle: "Penny's 1st birthday • 2020", folder: 'Gruffalo Party' },
    { id: 'superhero', title: 'Superhero Silent Disco', subtitle: "Phoebe's 6th birthday • 2020", folder: 'Superhero Silent Disco' },
    { id: 'lockdown', title: 'Lockdown Birthday', subtitle: "Annie's 4th birthday • 2020", folder: 'Lockdown Birthday' },
    { id: 'potter', title: 'Harry Potter Lockdown', subtitle: "Phoebe's 7th birthday • 2021", folder: 'Harry Potter Lockdown' },
    { id: 'partybus', title: 'Party Bus', subtitle: "Annie's 5th birthday • 2021", folder: 'Party Bus' },
    { id: 'puppy', title: 'Puppy Party', subtitle: "Penny's 3rd birthday • 2022", folder: 'Puppy Party' },
    { id: 'roller', title: 'Roller Disco', subtitle: "Phoebe's 8th birthday • 2022", folder: 'Roller Disco' },
    { id: 'anniefest', title: 'AnnieFest!', subtitle: "Annie's 6th birthday • 2022", folder: 'AnnieFest' },
    { id: 'frozen', title: 'Frozen Party', subtitle: "Penny's 4th birthday • 2023", folder: 'Frozen Party' },
    { id: 'limo', title: 'Limo Party', subtitle: "Phoebe's 9th birthday • 2023", folder: 'Limo Party' },
    { id: 'pamper', title: 'Pamper Bus', subtitle: "Annie's 7th birthday • 2023", folder: 'Pamper Bus' },
    { id: 'barbie', title: 'Barbie Party', subtitle: "Penny's 5th birthday • 2024", folder: 'Barbie Party' },
    { id: 'arcade', title: 'Arcade & Bowling', subtitle: "Phoebe's 10th birthday • 2024", folder: 'Arcade & Bowling' },
    { id: 'roller2', title: 'Roller Disco II', subtitle: "Annie's 8th birthday • 2024", folder: 'Roller Disco II' },
    { id: 'candyland', title: 'Candyland Party', subtitle: "Penny's 6th birthday • 2025", folder: 'Candyland Party' },
    { id: 'sleepover', title: 'Rollerskating Sleepover', subtitle: "Phoebe's 11th birthday • 2025", folder: 'Rollerskating Sleepover' },
    { id: 'slumber', title: 'Tropical Slumber Party', subtitle: "Annie's 9th birthday • 2025", folder: 'Tropical Slumber Party' },
    { id: 'kpop', title: 'K-POP Party', subtitle: "Penny's 7th birthday • 2026", folder: 'K-POP Party' }
];

// Import static assets
import Logo from '/Assets/Logo.svg';
import Arrow from '/Assets/Arrow.svg';

// Import all images eagerly or lazily from the Photos directory
const allImages = import.meta.glob('/Photos/**/*.{jpeg,jpg,png,svg}', { eager: false });

// State
let state = {
    selectedId: null, // null means Home
};

function init() {
    renderAppStructure();
    renderMenu();
    renderContent();
    setupMobileNavigation();
}

function renderAppStructure() {
    const app = document.getElementById('app');
    app.innerHTML = `
    <img id="logo" src="${Logo}" alt="Sophie Plans Parties" style="cursor: pointer;">
    <div class="layout-grid">
      <div id="menu-container">
        <div id="menu-list"></div>
      </div>
      <div id="content-container">
        <div id="mobile-header">
          <div id="back-button">
            <img src="${Arrow}" style="transform: rotate(180deg); width: 20px; height: 20px;" alt="Back">
            Home
          </div>
        </div>
        <div id="content-area"></div>
      </div>
    </div>
  `;

    // Add click handler to logo
    document.getElementById('logo').onclick = () => {
        state.selectedId = null;
        renderMenu();
        renderContent();
        updateMobileView();
    };
}

function renderMenu() {
    const menuList = document.getElementById('menu-list');
    menuList.innerHTML = '';

    menuData.forEach(item => {
        const div = document.createElement('div');
        div.className = `menu-item ${state.selectedId === item.id ? 'active' : ''}`;
        div.onclick = () => selectItem(item.id);

        div.innerHTML = `
      <div class="menu-item-header">
        <p class="menu-item-title">${item.title}</p>
        <img src="${Arrow}" alt="Arrow" class="menu-item-arrow">
      </div>
      <p class="menu-item-subtitle">${item.subtitle}</p>
    `;
        menuList.appendChild(div);
    });
}

function selectItem(id) {
    if (state.selectedId === id) return;
    state.selectedId = id;

    // Update UI
    renderMenu(); // Re-render to update active class
    renderContent();
    updateMobileView();
}

function updateMobileView() {
    // Toggle class for mobile view switching
    if (state.selectedId) {
        document.body.classList.add('view-gallery');
    } else {
        document.body.classList.remove('view-gallery');
    }
}

function setupMobileNavigation() {
    const backBtn = document.getElementById('back-button');
    backBtn.onclick = () => {
        state.selectedId = null;
        renderMenu();
        renderContent();
        updateMobileView();
    };
}

async function renderContent() {
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = ''; // Clear current content

    if (!state.selectedId) {
        // Render Home View
        const homeImg = document.createElement('img');
        homeImg.id = 'main-image';

        // Use the specific K-POP image as requested, resolving via Vite glob
        const homeImageKey = '/Photos/K-POP Party/IMG_6903.jpeg';
        let homeImageSrc = '';

        if (allImages[homeImageKey]) {
            homeImageSrc = (await allImages[homeImageKey]()).default;
        } else {
            // Fallback: pick the first available image if specific one fails
            const firstKey = Object.keys(allImages)[0];
            if (firstKey) {
                homeImageSrc = (await allImages[firstKey]()).default;
            }
        }

        homeImg.src = homeImageSrc;
        homeImg.alt = "Home Feature";

        // Fade in
        homeImg.style.opacity = 0;
        homeImg.onload = () => { homeImg.style.opacity = 1; };

        contentArea.appendChild(homeImg);
    } else {
        // Render Gallery View
        const selectedItem = menuData.find(item => item.id === state.selectedId);
        if (!selectedItem) return;

        const galleryGrid = document.createElement('div');
        galleryGrid.className = 'gallery-grid';
        contentArea.appendChild(galleryGrid);

        // Find images for this folder
        // Note: glob import keys are relative to root, e.g., "/Photos/Fairy Party/img.jpg"
        const folderPath = `/Photos/${selectedItem.folder}/`;

        // Create image promises
        // Sort keys to ensure consistent order (by filename)
        const sortedKeys = Object.keys(allImages).sort();

        const imagePromises = sortedKeys
            .filter(path => path.startsWith(folderPath))
            .map(async path => {
                // Resolve the import to get the actual URL (handled by Vite)
                const imgSrc = (await allImages[path]()).default;
                return imgSrc;
            });

        const images = await Promise.all(imagePromises);

        images.forEach(src => {
            const img = document.createElement('img');
            img.src = src;
            img.className = 'gallery-image';

            // Smart Layout: Check orientation
            img.onload = function () {
                if (this.naturalWidth > this.naturalHeight) {
                    this.classList.add('landscape');
                } else {
                    this.classList.add('portrait');
                }
                this.style.opacity = 1;
            };

            galleryGrid.appendChild(img);
        });
    }
}

document.addEventListener('DOMContentLoaded', init);

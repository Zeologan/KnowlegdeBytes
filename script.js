// your code goes here
let currentSlide = 0;
let selectedUrls = [];
let allUrls = [];

// Google Sheets API Configuration
const API_KEY = "AIzaSyCYeTDZt-3m4qEv2Bf8gvVRi4VehI1CAUQ"; // Replace with your API key
const SHEET_ID = "1a8SWTN1LKa572eI7f-jPs5SIA17GG1D8rLQ9zGcpBzk";
const RANGE = "Sheet1!A:A"; // Assuming URLs are in column A

// Fetch video URLs from Google Sheets
async function fetchVideoUrls() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    allUrls = data.values ? data.values.flat() : []; // Flatten the array to get URLs
    console.log(allUrls)
    getRandomUrls(); // Call getRandomUrls after the data is fetched
  } catch (error) {
    console.error("Error fetching video URLs:", error);
  }
}

// Select 3 random URLs from the allUrls array
function getRandomUrls() {
  selectedUrls = [];
  const randomIndexes = []; 

  while (selectedUrls.length < 3 && allUrls.length > 0) {
    const randomIndex = Math.floor(Math.random() * allUrls.length);
    if (!randomIndexes.includes(randomIndex)) { //check duplicate short
      randomIndexes.push(randomIndex);
      selectedUrls.push(allUrls[randomIndex]);
    }
  }
  console.log("Selected URLs: ", selectedUrls);
  createSlides(); // Call createSlides after selecting URLs
}

// Dynamically create the iframe elements with the selected URLs
function createSlides() {
  const slider = document.querySelector('.slider');
  slider.innerHTML = ''; // Clear any existing slides
  selectedUrls.forEach(url => {
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.classList.add('slide');
    iframe.setAttribute('allow', 'autoplay; encrypted-media');
    iframe.setAttribute('allowfullscreen', true);
    slider.appendChild(iframe);
  });
  showSlide(currentSlide); // Show the first selected slide
}

// Show the active slide and reset the current video
function showSlide(index) {
  const slides = document.querySelectorAll(".slide");
  slides.forEach((slide, i) => {
    if (i === index) {
      slide.classList.add("active");
      const iframeSrc = slide.src;
      slide.src = ""; // Reset iframe
      slide.src = iframeSrc; // Restart iframe by resetting its src
    } else {
      slide.classList.remove("active");
      slide.src = slide.src; // Stop video by keeping the same src

    }
  });
}



// Show the active slide and reset the current video


// Change slide by moving forward or backward
function changeSlide(direction) {
  currentSlide += direction;
  if (currentSlide < 0) {
    currentSlide = selectedUrls.length - 1;
  } else if (currentSlide >= selectedUrls.length) {
    currentSlide = 0;
  }
  showSlide(currentSlide);
}

// Initialize the slider after fetching the URLs
fetchVideoUrls();

// Button click handlers to navigate between slides
// document.getElementById('prevSlide').addEventListener('click', function () {
//   changeSlide(-1);  // Go to the previous slide
// });

// document.getElementById('nextSlide').addEventListener('click', function () {
//   changeSlide(1);  // Go to the next slide
// });

document.body.addEventListener('click', (event) => {
  if (event.target.id === 'prevSlide') {
    changeSlide(-1);
  } else if (event.target.id === 'nextSlide') {
    changeSlide(1);
  }
});

// ------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function () {
  const footerBtn = document.querySelector('.footer-btn');
  const targetSection = document.querySelector('.guideline-section');

  if (window.matchMedia("(max-width: 480px)").matches) {
      let lastScrollY = window.scrollY;

      const observer = new IntersectionObserver((entries) => {
          const entry = entries[0]; // Only one target section to observe
          const scrollingDown = window.scrollY > lastScrollY;

          // Show or hide footer based on scroll direction and section visibility
          if (entry.isIntersecting || scrollingDown) {
              footerBtn.style.display = 'block';
          } else {
              footerBtn.style.display = 'none';
          }

          lastScrollY = window.scrollY; // Update last scroll position
      });

      observer.observe(targetSection);
  }
});



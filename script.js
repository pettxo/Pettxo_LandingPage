let currentStep = 0;
const questionOrder = [];

document.addEventListener("DOMContentLoaded", function () {
  // Mobile Navigation Toggle
  const navToggle = document.querySelector(".nav__toggle");
  const navMenu = document.querySelector(".nav__menu");
  const navOverlay = document.querySelector(".nav__overlay");

  if (navToggle && navMenu && navOverlay) {
    navToggle.addEventListener("click", function () {
      document.body.classList.toggle("menu-open");
      navMenu.classList.toggle("active");
      navOverlay.classList.toggle("active"); // Toggle overlay
      navToggle.querySelector("i").classList.toggle("fa-bars");
      navToggle.querySelector("i").classList.toggle("fa-times");
    });

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll(".nav__link");
    navLinks.forEach((link) => {
      link.addEventListener("click", function () {
        navMenu.classList.remove("active");
        navOverlay.classList.remove("active"); // Close overlay
        document.body.classList.remove("menu-open");
        navToggle.querySelector("i").classList.add("fa-bars");
        navToggle.querySelector("i").classList.remove("fa-times");
      });
    });

    // Close mobile menu when clicking overlay
    navOverlay.addEventListener("click", function () {
      navMenu.classList.remove("active");
      navOverlay.classList.remove("active");
      document.body.classList.remove("menu-open");
      navToggle.querySelector("i").classList.add("fa-bars");
      navToggle.querySelector("i").classList.remove("fa-times");
    });
  }
  // Survey functionality
  // Only run this code if we're on the survey page
  if (document.querySelector(".survey-form")) {
    // Initialize survey functionality here
  }

  // Waitlist Form Handling with Google Sheets Integration
  const WAITLIST_URL =
    "https://script.google.com/macros/s/AKfycbyb7_stGI5HvU58goCUc0ze6f2SU3pFvoGTlQNLu6zAz9-IJD8ifDSO5FGHcG5Sz8XY/exec";

  const waitlistForm = document.getElementById("waitlistForm");
  if (waitlistForm) {
    waitlistForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const formData = new FormData(this);
      const data = {
        timestamp: new Date().toISOString(),
        email: formData.get("email"),
        name: formData.get("name") || "",
        petType: formData.get("petType") || "",
        source: "waitlist",
      };

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        showNotification("Please enter a valid email address.", "error");
        return;
      }

      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Joining...';
      submitBtn.disabled = true;

      // Convert data to URL-encoded format
      const urlEncodedData = new URLSearchParams();
      for (const [key, value] of Object.entries(data)) {
        urlEncodedData.append(key, value);
      }

      try {
        const response = await fetch(WAITLIST_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: urlEncodedData,
        });

        if (response.ok) {
          showNotification(
            "Welcome to Pettxo! You've been added to our waitlist.",
            "success"
          );
          this.reset();
          playPetSound();
        } else {
          showNotification("Something went wrong. Please try again.", "error");
        }
      } catch (error) {
        console.error("Error:", error);
        showNotification("Network error. Please try again.", "error");
      }

      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    });
  }

  // Survey Modal
  const surveyBtn = document.getElementById("surveyBtn");
  const surveyModal = document.getElementById("surveyModal");
  const closeModal = document.getElementById("closeModal");

  if (surveyBtn && surveyModal) {
    surveyBtn.addEventListener("click", function (e) {
      e.preventDefault();
      surveyModal.classList.add("active");
      document.body.style.overflow = "hidden";

      // Play pet sound effect
      playPetSound();
    });
  }

  if (closeModal && surveyModal) {
    closeModal.addEventListener("click", function () {
      surveyModal.classList.remove("active");
      document.body.style.overflow = "";
    });
  }

  // Close modal when clicking outside
  if (surveyModal) {
    surveyModal.addEventListener("click", function (e) {
      if (e.target === this) {
        this.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  }

  // Close modal with Escape key
  document.addEventListener("keydown", function (e) {
    if (
      e.key === "Escape" &&
      surveyModal &&
      surveyModal.classList.contains("active")
    ) {
      surveyModal.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  // Header scroll effect
  const header = document.querySelector(".header");
  let lastScrollTop = 0;

  window.addEventListener("scroll", function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 100) {
      header.style.background = "rgba(255, 255, 255, 0.98)";
      header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
    } else {
      header.style.background = "rgba(255, 255, 255, 0.95)";
      header.style.boxShadow = "none";
    }

    lastScrollTop = scrollTop;
  });

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe sections for animation
  const sections = document.querySelectorAll("section");
  sections.forEach((section) => {
    section.style.opacity = "0";
    section.style.transform = "translateY(30px)";
    section.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(section);
  });

  // Pet-themed Easter Eggs
  let pawPrintCount = 0;
  const pawPrintEmojis = ["🐾", "🐕", "🐱", "🦜", "🐰", "🐠"];

  // Konami code easter egg
  let konamiCode = [];
  const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA

  document.addEventListener("keydown", function (e) {
    konamiCode.push(e.keyCode);

    if (konamiCode.length > konamiSequence.length) {
      konamiCode.shift();
    }

    if (konamiCode.join(",") === konamiSequence.join(",")) {
      triggerPetParty();
      konamiCode = [];
    }
  });

  // Click easter egg - paw prints
  document.addEventListener("click", function (e) {
    if (pawPrintCount < 5) {
      createPawPrint(e.clientX, e.clientY);
      pawPrintCount++;
    }
  });

  // Hover effects for buttons
  const buttons = document.querySelectorAll(".btn");
  buttons.forEach((button) => {
    button.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px) scale(1.02)";
    });

    button.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });

  // Form field animations
  const formInputs = document.querySelectorAll(
    ".form__group input, .form__group select"
  );
  formInputs.forEach((input) => {
    input.addEventListener("focus", function () {
      this.parentElement.style.transform = "scale(1.02)";
    });

    input.addEventListener("blur", function () {
      this.parentElement.style.transform = "scale(1)";
    });
  });

  // Utility Functions
  function showNotification(message, type = "info") {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
            <div class="notification__content">
                <i class="fas fa-${
                  type === "success"
                    ? "check-circle"
                    : type === "error"
                    ? "exclamation-circle"
                    : "info-circle"
                }"></i>
                <span>${message}</span>
            </div>
        `;

    // Add styles
    notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${
              type === "success"
                ? "#27AE60"
                : type === "error"
                ? "#E74C3C"
                : "#3498DB"
            };
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 3000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    // Remove after 5 seconds
    setTimeout(() => {
      notification.style.transform = "translateX(400px)";
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 5000);
  }

  function createPawPrint(x, y) {
    const pawPrint = document.createElement("div");
    pawPrint.innerHTML =
      pawPrintEmojis[Math.floor(Math.random() * pawPrintEmojis.length)];
    pawPrint.style.cssText = `
            position: fixed;
            left: ${x - 20}px;
            top: ${y - 20}px;
            font-size: 2rem;
            pointer-events: none;
            z-index: 1000;
            animation: pawPrintFade 2s ease-out forwards;
        `;

    document.body.appendChild(pawPrint);

    setTimeout(() => {
      document.body.removeChild(pawPrint);
    }, 2000);
  }

  function playPetSound() {
    // Create a simple beep sound (in a real app, you'd use actual pet sounds)
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.2
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  }

  function triggerPetParty() {
    // Create a fun pet party animation
    const partyContainer = document.createElement("div");
    partyContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 2000;
        `;

    document.body.appendChild(partyContainer);

    // Create falling pet emojis
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const pet = document.createElement("div");
        pet.innerHTML =
          pawPrintEmojis[Math.floor(Math.random() * pawPrintEmojis.length)];
        pet.style.cssText = `
                    position: absolute;
                    left: ${Math.random() * 100}%;
                    top: -50px;
                    font-size: 3rem;
                    animation: petFall 3s linear forwards;
                `;
        partyContainer.appendChild(pet);

        setTimeout(() => {
          if (pet.parentNode) {
            pet.parentNode.removeChild(pet);
          }
        }, 3000);
      }, i * 100);
    }

    // Remove container after animation
    setTimeout(() => {
      document.body.removeChild(partyContainer);
    }, 4000);

    // Show notification
    showNotification(
      "🎉 Pet party activated! You found the secret!",
      "success"
    );
  }

  // Add CSS animations
  const style = document.createElement("style");
  style.textContent = `
        @keyframes pawPrintFade {
            0% {
                opacity: 1;
                transform: scale(1) rotate(0deg);
            }
            100% {
                opacity: 0;
                transform: scale(0.5) rotate(180deg);
            }
        }
        
        @keyframes petFall {
            0% {
                transform: translateY(-50px) rotate(0deg);
            }
            100% {
                transform: translateY(100vh) rotate(360deg);
            }
        }
        
        .notification__content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .notification__content i {
            font-size: 1.2rem;
        }
    `;
  document.head.appendChild(style);

  // Performance optimization: Debounce scroll events
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Apply debouncing to scroll events
  const debouncedScrollHandler = debounce(function () {
    // Any additional scroll handling can go here
  }, 10);

  window.addEventListener("scroll", debouncedScrollHandler);

  // Initialize tooltips for better UX
  const tooltipElements = document.querySelectorAll("[data-tooltip]");
  tooltipElements.forEach((element) => {
    element.addEventListener("mouseenter", function () {
      const tooltip = document.createElement("div");
      tooltip.className = "tooltip";
      tooltip.textContent = this.getAttribute("data-tooltip");
      tooltip.style.cssText = `
                position: absolute;
                background: var(--text-primary);
                color: white;
                padding: 0.5rem;
                border-radius: 5px;
                font-size: 0.8rem;
                z-index: 1000;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;

      document.body.appendChild(tooltip);

      const rect = this.getBoundingClientRect();
      tooltip.style.left =
        rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + "px";
      tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + "px";

      setTimeout(() => {
        tooltip.style.opacity = "1";
      }, 10);

      this.tooltip = tooltip;
    });

    element.addEventListener("mouseleave", function () {
      if (this.tooltip) {
        this.tooltip.style.opacity = "0";
        setTimeout(() => {
          if (this.tooltip && this.tooltip.parentNode) {
            this.tooltip.parentNode.removeChild(this.tooltip);
          }
        }, 300);
      }
    });
  });

  // Console welcome message
  console.log(`
    🐾 Welcome to Pettxo! 🐾
    
    Did you know? You can:
    - Press the Konami code (↑↑↓↓←→←→BA) for a surprise!
    - Click around to leave paw prints
    - Join our waitlist to be part of the future of pet care
    
    Thanks for visiting! 🐕🐱🦜
    `);
});

// https://docs.google.com/spreadsheets/d//edit?gid=0#gid=0

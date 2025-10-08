function fetchLocationSuggestions(query, suggestionsList, inputField) {
  // Use OpenStreetMap Nominatim API (free, no API key required)
  const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(
    query
  )}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      suggestionsList.innerHTML = "";

      if (data.length === 0) {
        suggestionsList.style.display = "none";
        return;
      }

      data.forEach((location) => {
        const suggestion = document.createElement("div");
        suggestion.className = "location-suggestion";
        suggestion.style.cssText = `
          padding: 10px;
          cursor: pointer;
          border-bottom: 1px solid #eee;
          transition: background-color 0.2s;
        `;

        // Format: City, State, Country
        let displayName = location.display_name;
        if (location.address) {
          const parts = [];
          if (
            location.address.city ||
            location.address.town ||
            location.address.village
          ) {
            parts.push(
              location.address.city ||
                location.address.town ||
                location.address.village
            );
          }
          if (location.address.state) {
            parts.push(location.address.state);
          }
          if (location.address.country) {
            parts.push(location.address.country);
          }
          if (parts.length > 0) {
            displayName = parts.join(", ");
          }
        }

        suggestion.textContent = displayName;

        // Hover effect
        suggestion.addEventListener("mouseenter", function () {
          this.style.backgroundColor = "#f5f5f5";
        });

        suggestion.addEventListener("mouseleave", function () {
          this.style.backgroundColor = "white";
        });

        // Click to select
        suggestion.addEventListener("click", function () {
          inputField.value = displayName;
          suggestionsList.style.display = "none";

          // Trigger change event to save the answer
          const event = new Event("change");
          inputField.dispatchEvent(event);
        });

        suggestionsList.appendChild(suggestion);
      });

      suggestionsList.style.display = "block";
    })
    .catch((error) => {
      console.error("Error fetching location suggestions:", error);
      suggestionsList.style.display = "none";
    });
}

document.addEventListener("DOMContentLoaded", function () {
  // Survey questions definition - organized by steps and branches

  // Step 0 - Basic Info (all on one page)
  const basicInfoQuestions = [
    {
      id: "personalInfo",
      text: "Personal Information",
      type: "combined",
      required: true,
      fields: [
        {
          id: "firstName",
          text: "First Name",
          type: "text",
          name: "firstName",
          placeholder: "Your first name",
          required: true,
        },
        {
          id: "lastName",
          text: "Last Name",
          type: "text",
          name: "lastName",
          placeholder: "Your last name",
          required: true,
        },
        {
          id: "emailPrimary",
          text: "Email Address",
          type: "email",
          name: "emailPrimary",
          placeholder: "officialpettxo@gmail.com",
          required: true,
          validation: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        },
        {
          id: "location",
          text: "Location",
          type: "location",
          name: "location",
          placeholder: "Enter your city (e.g., Pune)",
          required: true,
        },
      ],
    },
  ];

  // Step 1 - Root branching question
  const rootQuestion = {
    id: "q_ownPet",
    text: "Do you currently own a pet?",
    type: "radio",
    name: "q_ownPet",
    required: true,
    options: [
      { value: "Yes", label: "Yes" },
      {
        value: "No, but planning to get one soon",
        label: "No, but planning to get one soon",
      },
      {
        value: "No, and not planning to get one",
        label: "No, and not planning to get one",
      },
    ],
  };

  // Pet Owner Branch
  const petOwnerQuestions = [
    {
      id: "q_petTypes",
      text: "What type(s) of pet do you have?",
      type: "checkbox",
      name: "q_petTypes",
      required: true,
      options: [
        { value: "Dog", label: "Dog" },
        { value: "Cat", label: "Cat" },
        { value: "Bird", label: "Bird" },
        { value: "Fish", label: "Fish" },
        { value: "Rabbit", label: "Rabbit" },
        { value: "Other", label: "Other", hasOther: true },
      ],
    },
    {
      id: "q_petTypes_other",
      text: "Please specify other pet type(s)",
      type: "text",
      name: "q_petTypes_other",
      placeholder: "Enter other pet type(s)",
      required: true,
      conditional: true,
      showIf: (answers) =>
        answers.q_petTypes && answers.q_petTypes.includes("Other"),
    },
    {
      id: "q_breeds",
      text: "What breed(s) is your pet?",
      type: "text",
      name: "q_breeds",
      placeholder: "e.g., Golden Retriever, Persian Cat",
      required: false,
    },
    {
      id: "q_petGender",
      text: "What is your pet's gender?",
      type: "radio",
      name: "q_petGender",
      required: false,
      options: [
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" },
        { value: "Prefer not to say", label: "Prefer not to say" },
      ],
    },
    {
      id: "q_biggestChallenge",
      text: "What is your biggest challenge as a pet parent?",
      type: "checkbox",
      name: "q_biggestChallenge",
      required: true,
      options: [
        {
          value: "Finding reliable services",
          label: "Finding reliable services",
        },
        {
          value: "Managing health and vaccinations",
          label: "Managing health and vaccinations",
        },
        {
          value: "Connecting with other pet parents",
          label: "Connecting with other pet parents",
        },
        {
          value: "Buying trusted products affordably",
          label: "Buying trusted products affordably",
        },
        { value: "Other", label: "Other", hasOther: true },
      ],
    },
    {
      id: "q_biggestChallenge_other",
      text: "Please specify your biggest challenge",
      type: "text",
      name: "q_biggestChallenge_other",
      placeholder: "Enter your biggest challenge",
      required: true,
      conditional: true,
      // showIf: (answers) => answers.q_biggestChallenge === "Other",
      showIf: (answers) =>
        answers.q_biggestChallenge &&
        answers.q_biggestChallenge.includes("Other"),
    },
  ];

  // Future Owner Branch
  const futureOwnerQuestions = [
    {
      id: "q_when",
      text: "When are you planning to get a pet?",
      type: "radio",
      name: "q_when",
      required: true,
      options: [
        { value: "Within 6 months", label: "Within 6 months" },
        { value: "Within 1 year", label: "Within 1 year" },
        { value: "Not sure", label: "Not sure" },
      ],
    },
    {
      id: "q_preferredType",
      text: "What type(s) of pet are you planning to get?",
      type: "checkbox",
      name: "q_preferredType",
      required: true,
      options: [
        { value: "Dog", label: "Dog" },
        { value: "Cat", label: "Cat" },
        { value: "Bird", label: "Bird" },
        { value: "Rabbit", label: "Rabbit" },
        { value: "Other", label: "Other", hasOther: true },
      ],
    },
    {
      id: "q_preferredType_other",
      text: "Please specify other pet type(s)",
      type: "text",
      name: "q_preferredType_other",
      placeholder: "Enter other pet type(s)",
      required: true,
      conditional: true,
      showIf: (answers) =>
        answers.q_preferredType && answers.q_preferredType.includes("Other"),
    },
    {
      id: "q_mainConcern",
      text: "What is your main concern about getting a pet?",
      type: "checkbox",
      name: "q_mainConcern",
      required: true,
      options: [
        {
          value: "Responsibility/time commitment",
          label: "Responsibility/time commitment",
        },
        { value: "Cost of care", label: "Cost of care" },
        {
          value: "Finding trusted services",
          label: "Finding trusted services",
        },
        { value: "Lack of information", label: "Lack of information" },
        { value: "Other", label: "Other", hasOther: true },
      ],
    },
    {
      id: "q_mainConcern_other",
      text: "Please specify your main concern",
      type: "text",
      name: "q_mainConcern_other",
      placeholder: "Enter your main concern",
      required: true,
      conditional: true,
      // showIf: (answers) => answers.q_mainConcern === "Other",
      showIf: (answers) =>
        answers.q_mainConcern && answers.q_mainConcern.includes("Other"),
    },
  ];

  // Service Provider Branch
  const serviceProviderQuestions = [
    {
      id: "q_offerService",
      text: "Do you offer pet-related services?",
      type: "radio",
      name: "q_offerService",
      required: true,
      options: [
        {
          value: "Yes, professionally (paid)",
          label: "Yes, professionally (paid)",
        },
        {
          value: "Yes, casually (sit/walk/play dates)",
          label: "Yes, casually (sit/walk/play dates)",
        },
        { value: "No", label: "No" },
      ],
    },
    {
      id: "q_serviceTypes",
      text: "What type(s) of services do you offer?",
      type: "checkbox",
      name: "q_serviceTypes",
      required: true,
      conditional: true,
      showIf: (answers) =>
        answers.q_offerService && answers.q_offerService !== "No",
      options: [
        { value: "Pet sitting", label: "Pet sitting" },
        { value: "Dog walking", label: "Dog walking" },
        { value: "Grooming", label: "Grooming" },
        { value: "Training", label: "Training" },
        { value: "Play dates", label: "Play dates" },
        { value: "Other", label: "Other", hasOther: true },
      ],
    },
    {
      id: "q_serviceTypes_other",
      text: "Please specify other service type(s)",
      type: "text",
      name: "q_serviceTypes_other",
      placeholder: "Enter other service type(s)",
      required: true,
      conditional: true,
      showIf: (answers) =>
        answers.q_serviceTypes && answers.q_serviceTypes.includes("Other"),
    },
  ];

  // General Questions (for all branches)
  const generalQuestions = [
    {
      id: "q_currentApps",
      text: "Which pet-related apps or services do you currently use?",
      type: "text",
      name: "q_currentApps",
      placeholder: "e.g., Rover, Chewy, PetSmart",
      required: false,
    },
    {
      id: "q_contentFrequency",
      text: "How often do you like to consume the pet-related content?",
      type: "radio",
      name: "q_contentFrequency",
      required: true,
      options: [
        { value: "Daily", label: "Daily" },
        { value: "Weekly", label: "Weekly" },
        { value: "Occasionally", label: "Occasionally" },
        { value: "Rarely", label: "Rarely" },
      ],
    },
    {
      id: "q_platformInterest",
      text: "Would you use a single platform that combines social community + pet care services + discovery?",
      type: "radio",
      name: "q_platformInterest",
      required: true,
      options: [
        { value: "Definitely yes", label: "Definitely yes" },
        { value: "Maybe", label: "Maybe" },
        { value: "No", label: "No" },
      ],
    },
    {
      id: "q_earlyAccess",
      text: "Would you like early access to Pettxo when it launches?",
      type: "radio",
      name: "q_earlyAccess",
      required: true,
      options: [
        { value: "Yes, sign me up!", label: "Yes, sign me up!" },
        { value: "Maybe later", label: "Maybe later" },
        { value: "No", label: "No" },
      ],
    },
    {
      id: "emailConfirm",
      text: "Confirm your email for early access",
      type: "email",
      name: "emailConfirm",
      placeholder: "Confirm your email address",
      required: true,
      conditional: true,
      showIf: (answers) => answers.q_earlyAccess === "Yes, sign me up!",
      validation: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    {
      id: "emailConfirm",
      text: "Confirm your email",
      type: "email",
      name: "emailConfirmOptional",
      placeholder: "Confirm your email address",
      required: false,
      conditional: true,
      showIf: (answers) => answers.q_earlyAccess === "Maybe later",
      validation: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    {
      id: "q_features",
      text: "What features would you like to see in Pettxo?",
      type: "textarea",
      name: "q_features",
      placeholder: "We appreciate your feedback!",
      required: false,
    },
  ];

  // Survey flow control variables
  let currentStep = 0;
  let questionOrder = [];
  let allAnswers = {};
  let branchType = "";

  // Get elements
  const welcomeScreen = document.getElementById("welcome-screen");
  const surveyForm = document.getElementById("survey-form");
  const questionContainer = document.getElementById("question-container");
  const nextBtn = document.getElementById("next-btn");
  const prevBtn = document.getElementById("prev-btn");
  const thankYouScreen = document.getElementById("thank-you-screen");
  const startBtn = document.getElementById("start-btn");
  const progressFill = document.querySelector(".progress-fill");

  // Initialize survey flow
  function initializeSurvey() {
    // Start with basic info questions
    questionOrder = [...basicInfoQuestions];
    // Add root branching question
    questionOrder.push(rootQuestion);
    // General questions will be added after branch selection
    showQuestion(currentStep);
  }

  // Handle branch selection based on root question answer
  function handleBranchSelection() {
    const rootAnswer = allAnswers[rootQuestion.name];

    // Clear any previously added branch questions
    questionOrder = questionOrder.slice(0, basicInfoQuestions.length + 1); // Keep basic info + root question

    // Add branch-specific questions based on answer
    if (rootAnswer === "Yes") {
      branchType = "owner";
      questionOrder.push(...petOwnerQuestions);
    } else if (rootAnswer === "No, but planning to get one soon") {
      branchType = "future";
      questionOrder.push(...futureOwnerQuestions);
    } else if (rootAnswer === "No, and not planning to get one") {
      branchType = "provider";
      questionOrder.push(...serviceProviderQuestions);
    }

    // Add general questions for all branches
    questionOrder.push(...generalQuestions);
  }

  // Show current question
  function showQuestion(step) {
    if (step >= questionOrder.length) return;

    const q = questionOrder[step];

    // Check if question should be shown based on conditional logic
    if (
      q.conditional &&
      typeof q.showIf === "function" &&
      !q.showIf(allAnswers)
    ) {
      // Skip this question and move to next
      if (step < questionOrder.length - 1) {
        currentStep++;
        showQuestion(currentStep);
      }
      return;
    }

    questionContainer.innerHTML = "";
    console.log("Rendering question:", q.text, "Step:", currentStep);

    // Question text
    const qText = document.createElement("h2");
    qText.textContent = q.text;
    questionContainer.appendChild(qText);

    // Required indicator
    if (q.required && q.type !== "combined") {
      const requiredSpan = document.createElement("span");
      requiredSpan.className = "required";
      requiredSpan.textContent = " *";
      requiredSpan.style.color = "red";
      qText.appendChild(requiredSpan);
    }

    // Handle combined fields (for personal info)
    if (q.type === "combined") {
      const fieldsContainer = document.createElement("div");
      fieldsContainer.className = "combined-fields";

      q.fields.forEach((field) => {
        const fieldContainer = document.createElement("div");
        fieldContainer.className = "field-container";

        const fieldLabel = document.createElement("label");
        fieldLabel.textContent = field.text;
        if (field.required) {
          const requiredSpan = document.createElement("span");
          requiredSpan.className = "required";
          requiredSpan.textContent = " *";
          requiredSpan.style.color = "red";
          fieldLabel.appendChild(requiredSpan);
        }

        let input;

        // Handle location field with autocomplete
        if (field.type === "location") {
          input = document.createElement("input");
          input.type = "text";
          input.name = field.name;
          input.placeholder = field.placeholder || "";
          input.value = allAnswers[field.name] || "";
          input.autocomplete = "off";

          // Create autocomplete container
          const autocompleteContainer = document.createElement("div");
          autocompleteContainer.className = "autocomplete-container";
          autocompleteContainer.style.position = "relative";

          const suggestionsList = document.createElement("div");
          suggestionsList.className = "location-suggestions";
          suggestionsList.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #ddd;
            border-top: none;
            max-height: 200px;
            overflow-y: auto;
            z-index: 1000;
            display: none;
          `;

          // Add location autocomplete functionality
          let debounceTimer;
          input.addEventListener("input", function () {
            const query = this.value.trim();
            clearTimeout(debounceTimer);

            if (query.length < 2) {
              suggestionsList.style.display = "none";
              return;
            }

            debounceTimer = setTimeout(() => {
              fetchLocationSuggestions(query, suggestionsList, input);
            }, 300);
          });

          // Hide suggestions when clicking outside
          document.addEventListener("click", function (e) {
            if (!autocompleteContainer.contains(e.target)) {
              suggestionsList.style.display = "none";
            }
          });

          autocompleteContainer.appendChild(input);
          autocompleteContainer.appendChild(suggestionsList);

          fieldContainer.appendChild(fieldLabel);
          fieldContainer.appendChild(autocompleteContainer);
        } else {
          // Handle regular input fields
          input = document.createElement("input");
          input.type = field.type;
          input.name = field.name;
          input.placeholder = field.placeholder || "";
          input.value = allAnswers[field.name] || "";

          // Add validation for email fields
          if (field.type === "email" && field.validation) {
            input.pattern = field.validation.toString().slice(1, -1); // Convert regex to string pattern
            input.title = "Please enter a valid email address";
            input.required = field.required; // Make field required in HTML
          }

          fieldContainer.appendChild(fieldLabel);
          fieldContainer.appendChild(input);
        }

        // Add required attribute to input if field is required
        if (field.required) {
          input.required = true;
        }
        fieldsContainer.appendChild(fieldContainer);
      });

      questionContainer.appendChild(fieldsContainer);
    }
    // Input for radio or checkbox
    else if (q.type === "radio" || q.type === "checkbox") {
      q.options.forEach((opt, i) => {
        const val = opt.value;
        const labelText = opt.label;
        const hasOther = opt.hasOther;

        const input = document.createElement("input");
        input.type = q.type;
        input.name = q.name;
        input.value = val;
        input.id = `${q.id}_${i}`; // Ensure unique ID for label association

        // Check if this option was previously selected
        if (
          q.type === "checkbox" &&
          allAnswers[q.name] &&
          Array.isArray(allAnswers[q.name]) &&
          allAnswers[q.name].includes(val)
        ) {
          input.checked = true;
        } else if (q.type === "radio" && allAnswers[q.name] === val) {
          input.checked = true;
        }

        const labelEl = document.createElement("label");
        labelEl.htmlFor = input.id;
        labelEl.textContent = labelText;

        // FIX 1: Prepend the input to the label. Clicking anywhere on the label
        // will now natively toggle the input.
        labelEl.prepend(input);

        const div = document.createElement("div");
        div.className = "option-container";
        div.appendChild(labelEl);

        // FIX 2: Use the 'change' event on the input for state management and re-rendering
        input.addEventListener("change", function () {
          // Save state immediately after native click/change
          saveCurrentAnswer();

          // Handle branching logic for the root question (q_ownPet)
          if (q.name === rootQuestion.name) {
            handleBranchSelection();
            // Re-render to show/hide the correct branch questions
            showQuestion(currentStep);
            return; // Stop here for root question
          }

          // Handle conditional 'Other' field visibility
          if (hasOther && val === "Other") {
            // Re-render to show/hide the "other" text input
            showQuestion(currentStep);
          }
        });

        questionContainer.appendChild(div);

        // Show 'Other' text field if 'Other' is selected
        if (
          val === "Other" &&
          allAnswers[q.name] &&
          ((q.type === "radio" && allAnswers[q.name] === "Other") ||
            (q.type === "checkbox" && allAnswers[q.name].includes("Other")))
        ) {
          const otherFieldId = q.name + "_other";
          const otherField = document.createElement("input");
          otherField.type = "text";
          otherField.name = otherFieldId;
          otherField.placeholder = "Please specify";
          otherField.value = allAnswers[otherFieldId] || "";
          otherField.className = "other-field";
          otherField.style.marginLeft = "20px"; // Indent to make it look like it's below "Other"

          // Append the other field BELOW the main label, inside the option container
          div.appendChild(otherField);

          // FIX 3: Stop propagation and save value on input/change events for the text box
          // This prevents any accidental collapse if the structure changes
          otherField.addEventListener("click", function (e) {
            e.stopPropagation(); // Prevent click from reaching parent div/label logic
          });
          otherField.addEventListener("input", function () {
            allAnswers[otherFieldId] = this.value; // Save as user types
          });
        }
      });
    } else if (q.type === "text" || q.type === "email") {
      const input = document.createElement("input");
      input.type = q.type;
      input.name = q.name;
      input.placeholder = q.placeholder || "";
      input.value = allAnswers[q.name] || "";

      // If this is emailConfirm, prefill with emailPrimary
      if (q.name === "emailConfirm" || q.name === "emailConfirmOptional") {
        input.value = allAnswers["emailPrimary"] || "";
      }

      // Add validation for email fields
      if (q.type === "email" && q.validation) {
        input.pattern = q.validation.toString().slice(1, -1); // Convert regex to string pattern
        input.title = "Please enter a valid email address";
      }

      questionContainer.appendChild(input);
    } else if (q.type === "textarea") {
      const textarea = document.createElement("textarea");
      textarea.name = q.name;
      textarea.placeholder = q.placeholder || "";
      textarea.value = allAnswers[q.name] || "";
      questionContainer.appendChild(textarea);
    }

    // Progress bar
    updateProgressBar();

    // Button visibility
    prevBtn.classList.toggle("hidden", step === 0);
    nextBtn.innerHTML =
      step === questionOrder.length - 1
        ? "Submit <i class='fas fa-check'></i>"
        : "Next <i class='fas fa-arrow-right'></i>";
  }

  // Update progress bar
  function updateProgressBar() {
    // Calculate progress based on completed steps vs total visible steps
    const totalSteps = questionOrder.length;
    const progress = ((currentStep + 1) / totalSteps) * 100;
    progressFill.style.width = `${progress}%`;

    // Update step indicator text
    document.getElementById("current-step").textContent = `Step ${
      currentStep + 1
    }`;
    document.getElementById("total-steps").textContent = totalSteps;
  }

  // Save current answer (simplified and corrected for options)
  function saveCurrentAnswer() {
    const q = questionOrder[currentStep];

    if (q.type === "combined") {
      // Save all fields in the combined question
      q.fields.forEach((field) => {
        const input = document.querySelector(`[name='${field.name}']`);
        allAnswers[field.name] = input ? input.value : "";
      });
    } else if (q.type === "checkbox") {
      // Store array of selected values
      allAnswers[q.name] = Array.from(
        document.querySelectorAll(`input[name='${q.name}']:checked`)
      ).map((el) => el.value);

      // Save 'Other' field value if present
      const otherFieldId = q.name + "_other";
      const otherInput = document.querySelector(`[name='${otherFieldId}']`);

      if (allAnswers[q.name].includes("Other")) {
        allAnswers[otherFieldId] = otherInput ? otherInput.value : "";
      } else {
        // Only clear 'other' if the checkbox/radio is explicitly deselected
        if (otherInput) {
          // Retain value if checkbox is unchecked, but we ensure it's not submitted unless 'Other' is checked
        }
      }
    } else if (q.type === "radio") {
      const checked = document.querySelector(`input[name='${q.name}']:checked`);
      allAnswers[q.name] = checked ? checked.value : "";

      // Save/Clear 'Other' field value
      const otherFieldId = q.name + "_other";
      const otherInput = document.querySelector(`[name='${otherFieldId}']`);

      if (allAnswers[q.name] === "Other") {
        allAnswers[otherFieldId] = otherInput ? otherInput.value : "";
      } else {
        allAnswers[otherFieldId] = ""; // Clear if 'Other' is not selected
      }
    } else {
      const input = document.querySelector(`[name='${q.name}']`);
      allAnswers[q.name] = input ? input.value : "";
    }
  }

  // Validate current question
  function validateCurrentQuestion() {
    const q = questionOrder[currentStep];

    // Skip validation for non-required fields
    if (!q.required) return true;

    // Skip validation for conditional fields that aren't shown
    if (
      q.conditional &&
      typeof q.showIf === "function" &&
      !q.showIf(allAnswers)
    ) {
      return true;
    }

    if (q.type === "combined") {
      // All required fields in the combined question must be filled
      for (const field of q.fields) {
        if (field.required) {
          const input = document.querySelector(`[name='${field.name}']`);

          if (!input || input.value.trim() === "") {
            const fieldName = field.text.replace(" *", "").toLowerCase();
            showValidationError(q, `Please enter your ${fieldName}`);
            input?.focus();
            return false;
          }

          // Email validation
          if (field.type === "email" && field.validation) {
            if (!field.validation.test(input.value.trim())) {
              showValidationError(
                q,
                "Please enter a valid email address (e.g., name@example.com)"
              );
              input.focus();
              return false;
            }
          }

          // Location validation
          if (field.type === "location") {
            if (input.value.trim().length < 2) {
              showValidationError(q, "Please enter a valid location");
              input.focus();
              return false;
            }
          }
        }
      }
    } else if (q.type === "checkbox") {
      // For checkbox, ensure at least one option is selected if required
      const checked = document.querySelectorAll(
        `input[name='${q.name}']:checked`
      );
      if (checked.length === 0) {
        showValidationError(q, "Please select at least one option");
        return false;
      }

      // If 'Other' is selected, validate the other field
      const values = Array.from(checked).map((el) => el.value);
      if (values.includes("Other")) {
        const otherFieldId = q.name + "_other";
        const otherInput = document.querySelector(`[name='${otherFieldId}']`);
        if (otherInput && otherInput.value.trim() === "") {
          showValidationError(q, 'Please specify your "Other" option');
          return false;
        }
      }
    } else if (q.type === "radio") {
      const checked = document.querySelector(`input[name='${q.name}']:checked`);
      if (!checked) {
        showValidationError(q, "Please select an option");
        return false;
      }

      // If 'Other' is selected, validate the other field
      if (checked.value === "Other") {
        const otherFieldId = q.name + "_other";
        const otherInput = document.querySelector(`[name='${otherFieldId}']`);
        if (otherInput && otherInput.value.trim() === "") {
          showValidationError(q, "Please specify the other option");
          return false;
        }
      }
    } else if (q.type === "email") {
      const input = document.querySelector(`[name='${q.name}']`);
      if (!input || input.value.trim() === "") {
        showValidationError(q, "Please enter your email address");
        return false;
      }

      // Email validation
      if (q.validation && !q.validation.test(input.value)) {
        showValidationError(q, "Please enter a valid email address");
        return false;
      }
    } else {
      const input = document.querySelector(`[name='${q.name}']`);
      if (!input || input.value.trim() === "") {
        showValidationError(q, "This field is required");
        return false;
      }
    }

    // Clear any validation errors
    clearValidationError();
    return true;
  }

  // Show validation error
  function showValidationError(question, message) {
    clearValidationError();

    const errorDiv = document.createElement("div");
    errorDiv.className = "validation-error";
    errorDiv.textContent = message;
    errorDiv.style.color = "red";
    errorDiv.style.marginTop = "0.5rem";
    errorDiv.style.fontSize = "0.9rem";

    questionContainer.appendChild(errorDiv);
  }

  // Clear validation error
  function clearValidationError() {
    const errorDiv = questionContainer.querySelector(".validation-error");
    if (errorDiv) {
      errorDiv.remove();
    }
  }

  // Start button event listener
  if (startBtn) {
    startBtn.addEventListener("click", function () {
      welcomeScreen.classList.add("hidden");
      surveyForm.classList.remove("hidden");
      currentStep = 0;
      initializeSurvey(); // Initialize the survey flow
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", async function () {
      // Validate current question
      if (!validateCurrentQuestion()) {
        return; // Don't proceed if validation fails
      }

      // Save current answer
      saveCurrentAnswer();

      // Check if we're at the last question
      if (currentStep < questionOrder.length - 1) {
        // Move to next question
        currentStep++;
        showQuestion(currentStep);
      } else {
        // Prepare survey data (same as before)
        const submissionData = {
          timestamp: new Date().toISOString(),
          firstName: allAnswers.firstName || "",
          lastName: allAnswers.lastName || "",
          emailPrimary: allAnswers.emailPrimary || "",
          location: allAnswers.location || "",
          branchType: branchType,
          q_ownPet: allAnswers.q_ownPet || "",
          q_petTypes: Array.isArray(allAnswers.q_petTypes)
            ? allAnswers.q_petTypes.join(", ")
            : allAnswers.q_petTypes || "",
          q_petTypes_other: allAnswers.q_petTypes_other || "",
          q_breeds: allAnswers.q_breeds || "",
          q_petGender: allAnswers.q_petGender || "",
          q_biggestChallenge: Array.isArray(allAnswers.q_biggestChallenge)
            ? allAnswers.q_biggestChallenge.join(", ")
            : allAnswers.q_biggestChallenge || "",
          q_biggestChallenge_other: allAnswers.q_biggestChallenge_other || "",
          q_when: allAnswers.q_when || "",
          q_preferredType: Array.isArray(allAnswers.q_preferredType)
            ? allAnswers.q_preferredType.join(", ")
            : allAnswers.q_preferredType || "",
          q_preferredType_other: allAnswers.q_preferredType_other || "",
          q_mainConcern: Array.isArray(allAnswers.q_mainConcern)
            ? allAnswers.q_mainConcern.join(", ")
            : allAnswers.q_mainConcern || "",
          q_mainConcern_other: allAnswers.q_mainConcern_other || "",
          q_offerService: allAnswers.q_offerService || "",
          q_serviceTypes: Array.isArray(allAnswers.q_serviceTypes)
            ? allAnswers.q_serviceTypes.join(", ")
            : allAnswers.q_serviceTypes || "",
          q_serviceTypes_other: allAnswers.q_serviceTypes_other || "",
          q_currentApps: allAnswers.q_currentApps || "",
          q_contentFrequency: allAnswers.q_contentFrequency || "",
          q_platformInterest: allAnswers.q_platformInterest || "",
          q_earlyAccess: allAnswers.q_earlyAccess || "",
          emailConfirm:
            allAnswers.emailConfirm || allAnswers.emailConfirmOptional || "",
          q_features: allAnswers.q_features || "",
        };

        // Create hidden form
        const form = document.createElement("form");
        form.method = "POST";
        form.action =
          "https://script.google.com/macros/s/AKfycbx_ZJNZfcC1IfWEkzzjwQox5sgHJI6K-Vbr2nUKcz3_FY4uAUbOqNzhSy_uK77nXLON2Q/exec";
        form.style.display = "none";

        // Add each data field as a hidden input
        for (const [key, value] of Object.entries(submissionData)) {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = value;
          form.appendChild(input);
        }

        // // Create hidden iframe to handle response without leaving page
        // const iframeName = "hiddenIframe";
        // const iframe = document.createElement("iframe");
        // iframe.name = iframeName;
        // iframe.style.display = "none";
        // document.body.appendChild(iframe);

        // // Target form to iframe
        // form.target = iframeName;

        // Append form to body and submit
        document.body.appendChild(form);
        form.submit();

        // Clean up (optional: remove after submit)
        setTimeout(() => {
          document.body.removeChild(form);
          document.body.removeChild(iframe);
        }, 1000);

        // Assume success and show thank you (or add iframe onload listener for confirmation)
        console.log("Survey submitted successfully!");
        surveyForm.classList.add("hidden");
        thankYouScreen.classList.remove("hidden");
      }
    });
  }

  // Previous button event listener
  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      if (currentStep > 0) {
        // Save current answer before going back
        saveCurrentAnswer();

        // Move to previous question
        currentStep--;

        // Skip conditional questions that shouldn't be shown
        const q = questionOrder[currentStep];
        if (
          q.conditional &&
          typeof q.showIf === "function" &&
          !q.showIf(allAnswers)
        ) {
          // Keep going back until we find a question that should be shown
          prevBtn.click();
          return;
        }

        showQuestion(currentStep);
      }
    });
  }

  // Initialize survey if welcome screen exists
  if (welcomeScreen) {
    // Initialize with empty survey until user clicks start
    questionOrder = [];
  }

  // Return to homepage button event listener
  const returnHomeBtn = document.getElementById("return-home-btn");
  if (returnHomeBtn) {
    returnHomeBtn.addEventListener("click", function () {
      // Close the survey popup completely and return to homepage
      window.parent.postMessage("closeSurvey", "*");
      window.parent.location.href = "index.html";
    });
  }
});
// End Pettxo Survey Logic

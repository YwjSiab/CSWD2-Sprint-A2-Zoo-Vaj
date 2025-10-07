// formsubmission.js
// This module handles form submissions for the NTC Zoo application.
// It includes functions to sanitize user input, process the booking form,
// process the membership form, and attach the relevant event listeners.

/**
 * Function to initialize the membership form (without handling submission)
 */
export const initializeMembershipForm = () => {
    console.log("Initializing membership form...");
    const form = document.getElementById("membershipForm");
    if (!form) {
      console.error("Membership form not found.");
      return;
    }
    // Reset the form fields on page load or apply any default values.
    form.reset();
  };

//////////////////////////////
// Input Sanitization
//////////////////////////////
export const sanitizeInput = (input) => {
    console.log("Before Sanitization:", input);
    
    // Buffer Overflow Protection: Limit input length to 255 characters.
    const maxLength = 255;
    if (input.length > maxLength) {
      console.warn("Input truncated due to length limit");
      input = input.slice(0, maxLength);
    }
    
    // SQL Injection Detection using a regex pattern.
    const sqlPattern = /\b(SELECT|INSERT|DELETE|DROP|UPDATE|UNION|--|;|\|)/gi;
    if (sqlPattern.test(input)) {
      console.warn("SQL Injection pattern detected in input:", input);
      // Reject the input by throwing an error to prevent submission.
      throw new Error("Suspicious input detected. Please remove any SQL keywords.");
    }
    
    // Remove any HTML tags.
    const tagStripped = input.replace(/<[^>]*>?/gm, "");
    
    // Encode common dangerous characters.
    const encoded = tagStripped
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
    
    console.log("After Sanitization:", encoded);
    return encoded;
  };
  
  //////////////////////////////
  // Booking Form Submission
  //////////////////////////////
  export const setupBookingForm = () => {
    const bookingForm = document.getElementById("bookingForm");
    if (!bookingForm) {
      console.error("Booking form not found. Check your HTML.");
      return;
    }
    
    bookingForm.addEventListener("submit", (event) => {
      event.preventDefault(); // Prevent default form submission
      
      try {
        // Retrieve and sanitize input values.
        const visitorName = sanitizeInput(document.getElementById("visitorName").value.trim());
        const contact = sanitizeInput(document.getElementById("contact").value.trim());
        const selectedAnimal = sanitizeInput(document.getElementById("animal").value);
        const dateTime = sanitizeInput(document.getElementById("dateTime").value);
        const groupSize = parseInt(document.getElementById("groupSize").value, 10);
        
        // Validate inputs.
        if (!visitorName || !contact || !selectedAnimal || !dateTime || isNaN(groupSize) || groupSize < 1) {
          throw new Error("Please fill in all required fields with valid data.");
        }
        
        // Store booking data to localStorage.
        const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
        bookings.push({ visitorName, contact, selectedAnimal, dateTime, groupSize });
        localStorage.setItem("bookings", JSON.stringify(bookings));
        
        alert("Booking confirmed!");
        
        // Update the visitor count, if a global updateVisitorCount() function exists.
        if (window.updateVisitorCount) {
          window.updateVisitorCount(groupSize);
        }
        
        // Reset the booking form.
        bookingForm.reset();
        
      } catch (error) {
        console.error("Error processing booking:", error.message);
        alert(error.message);
      }
    });
  };
  
  //////////////////////////////
  // Membership Form Submission
  //////////////////////////////
  export const handleMembershipSubmission = (event) => {
    event.preventDefault();
    try {
      // Get membership form fields.
      const nameEl = document.getElementById("name");
      const emailEl = document.getElementById("email");
      const membershipTypeEl = document.getElementById("membershipType");
      const startDateEl = document.getElementById("startDate");
      const emergencyContactEl = document.getElementById("emergencyContact");
      
      // Ensure all required fields exist.
      if (!nameEl || !emailEl || !membershipTypeEl || !startDateEl || !emergencyContactEl) {
        throw new Error("Some membership form fields were not found in the DOM.");
      }
      
      // Read and sanitize the input values.
      const name = sanitizeInput(nameEl.value.trim());
      const email = sanitizeInput(emailEl.value.trim());
      const membershipType = sanitizeInput(membershipTypeEl.value);
      const startDate = sanitizeInput(startDateEl.value);
      const emergencyContact = sanitizeInput(emergencyContactEl.value.trim());
      const photoDataUrl = (document.getElementById("memberPhotoDataUrl")?.value || "").trim();
      
      // Validate input values.
      if (!name || !email || !membershipType || !startDate || !emergencyContact) {
        throw new Error("Please fill in all required fields.");
      }
      
      // Save membership data to localStorage.
      const members = JSON.parse(localStorage.getItem("members")) || [];
      members.push({ name, email, membershipType, startDate, emergencyContact, photoDataUrl});
      localStorage.setItem("members", JSON.stringify(members));
      
      // Optionally use a global displaySuccess() function to show a success message.
      if (window.displaySuccess) {
        window.displaySuccess("Membership registration successful!");
      }
      
      console.log("Membership registered successfully.");
      
      // Update visitor count using a global function if available.
      if (window.updateVisitorCount) {
        window.updateVisitorCount(1);
      }
      
      // Reset the membership form.
      event.target.reset();
      const preview = document.getElementById("memberPhotoPreview");
      if (preview) { preview.src = ""; preview.style.display = "none"; }
      const hidden = document.getElementById("memberPhotoDataUrl");
      if (hidden) hidden.value = "";
      
    } catch (error) {
      console.error("Error processing membership registration:", error.message);
      // Optionally use a global displayError() function if defined.
      if (window.displayError) {
        window.displayError(error.message);
      }
    }
  };
  
  export const setupMembershipForm = () => {
    const membershipForm = document.getElementById("membershipForm");
    if (!membershipForm) {
      console.error("Membership form not found.");
      return;
    }
    membershipForm.addEventListener("submit", handleMembershipSubmission);
  };  

  // formsubmission.js
// Regex-based validation and user feedback for Add Animal form

const patterns = {
  // 2–30 letters, spaces, apostrophes, and hyphens
  name: /^[A-Za-z][A-Za-z' -]{1,29}$/,
  // Allowed species (adjust if you add more)
  species: /^(Elephant|Tiger|Panda|Lion)$/i,
  // Open or Closed
  status: /^(Open|Closed)$/i,
  // Health states
  health: /^(Healthy|Sick|Injured)$/i,
  // image path like images/ellie.png/.jpg/.jpeg/.webp
  image: /^images\/[a-z0-9_\-]+\.(png|jpg|jpeg|webp)$/i,
  // Latitude: -90..90 with optional decimals
  lat: /^(\+|-)?(?:90(?:\.0+)?|[0-8]?\d(?:\.\d+)?)$/,
  // Longitude: -180..180 with optional decimals
  lng: /^(\+|-)?(?:180(?:\.0+)?|1[0-7]\d(?:\.\d+)?|[0-9]?\d(?:\.\d+)?)$/
};

function setFeedback(input, ok, message = "") {
  const msg = input.parentElement.querySelector(".msg");
  input.classList.toggle("is-valid", ok);
  input.classList.toggle("is-invalid", !ok);
  if (msg) {
    msg.textContent = message;
    msg.classList.toggle("ok", ok);
    msg.classList.toggle("err", !ok);
  }
}

function validateField(id, pattern, friendlyName) {
  const el = document.getElementById(id);
  if (!el) return { ok: false, el: null, value: "" };
  const value = el.value.trim();
  const ok = pattern.test(value);
  setFeedback(el, ok, ok ? `${friendlyName} looks good.` : `Please enter a valid ${friendlyName}.`);
  return { ok, el, value };
}

export function wireAddAnimalForm(onValidSubmit) {
  const form = document.getElementById("addAnimalForm");
  if (!form) return;

  const fields = [
    { id: "animalName",   pattern: patterns.name,    label: "name" },
    { id: "animalSpecies",pattern: patterns.species, label: "species (Elephant/Tiger/Panda/Lion)" },
    { id: "animalStatus", pattern: patterns.status,  label: "status (Open/Closed)" },
    { id: "animalHealth", pattern: patterns.health,  label: "health (Healthy/Sick/Injured)" },
    { id: "animalImage",  pattern: patterns.image,   label: "image path (e.g., images/ellie.png)" },
    { id: "animalLat",    pattern: patterns.lat,     label: "latitude (-90..90)" },
    { id: "animalLng",    pattern: patterns.lng,     label: "longitude (-180..180)" }
  ];

  // Live validation on input
  fields.forEach(f => {
    const el = document.getElementById(f.id);
    if (el) el.addEventListener("input", () => validateField(f.id, f.pattern, f.label));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const results = fields.map(f => validateField(f.id, f.pattern, f.label));
    const allGood = results.every(r => r.ok);

    const errorBox   = document.getElementById("errorMessages");
    const successBox = document.getElementById("successMessages");
    if (errorBox) errorBox.textContent = "";
    if (successBox) successBox.textContent = "";

    if (!allGood) {
      if (errorBox) errorBox.textContent = "Please correct the highlighted fields.";
      return;
    }

    // Build the new animal object in the shape your app expects
    // (match your existing properties)
    const data = Object.fromEntries(results.map(r => {
      return [r.el.id, r.value];
    }));

    const newAnimal = {
      id: Date.now(), // or your own id logic
      name: data.animalName,
      species: capitalize(data.animalSpecies),
      status: capitalize(data.animalStatus),
      health: capitalize(data.animalHealth),
      image: data.animalImage,
      location: {
        lat: parseFloat(data.animalLat),
        lng: parseFloat(data.animalLng)
      }
    };

    if (typeof onValidSubmit === "function") {
      onValidSubmit(newAnimal); // let caller actually add/POST the animal
    }

    if (successBox) successBox.textContent = `✅ Added ${newAnimal.name} successfully.`;
    form.reset();
    // clear visuals after reset
    results.forEach(r => setFeedback(r.el, true, ""));
  });
}

function capitalize(s){
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;
}

export const CalendlyExtension = {
  name: "Calendly",
  type: "effect",
  match: ({ trace }) => {
    return (
      trace.type === "ext_calendly" || trace.payload.name === "ext_calendly"
    );
  },
  effect: ({ trace }) => {
    const { url } = trace.payload;
    if (url) {
      // Inject custom style to ensure Calendly popup is always on top
      const style = document.createElement('style');
      style.innerHTML = `
        .calendly-popup, .calendly-overlay {
          z-index: 10000 !important;
        }
      `;
      document.head.appendChild(style);

      // Initialize Calendly popup
      Calendly.initPopupWidget({ url: 'https://calendly.com/stefanos-clearstack/demo' });
    }
  },
};


export const popform = {
  name: 'Forms',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_capture_pop_up' || trace.payload.name === 'ext_capture_pop_up',
  render: ({ trace, element }) => {
    createPopup();
    showPopup();

    const formContainer = document.createElement('form')

    formContainer.innerHTML = `
          <style>
            label {
              font-size: 0.8em;
              color: #888;
            }
            input[type="text"], input[type="email"], input[type="tel"] {
              width: 100%;
              border: none;
              border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
              background: transparent;
              margin: 5px 0;
              outline: none;
            }
            .phone {
              width: 150px;
            }
            .invalid {
              border-color: red;
            }
            .submit {
              background: linear-gradient(to right, #2e6ee1, #2e7ff1 );
              border: none;
              color: white;
              padding: 10px;
              border-radius: 5px;
              width: 100%;
              cursor: pointer;
            }
          </style>

          <label for="name">Name</label>
          <input type="text" class="name" name="name" required><br><br>

          <label for="email">Email</label>
          <input type="email" class="email" name="email" required pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" title="Invalid email address"><br><br>

          <label for="phone">Phone Number</label>
          <input type="tel" class="phone" name="phone" required pattern="\\d+" title="Invalid phone number, please enter only numbers"><br><br>

          <input type="submit" class="submit" value="Submit">
        `

    formContainer.addEventListener('submit', function (event) {
      event.preventDefault()

      const name = formContainer.querySelector('.name')
      const email = formContainer.querySelector('.email')
      const phone = formContainer.querySelector('.phone')

      if (
        !name.checkValidity() ||
        !email.checkValidity() ||
        !phone.checkValidity()
      ) {
        name.classList.add('invalid')
        email.classList.add('invalid')
        phone.classList.add('invalid')
        return
      }

      formContainer.querySelector('.submit').remove()

      window.voiceflow.chat.interact({
        type: 'complete',
        payload: { name: name.value, email: email.value, phone: phone.value },
      })
    })

    element.appendChild(formContainer)
  },
}





function createPopup() {
  // Check if popup already exists
  if (document.getElementById('overlay')) {
    return;
  }

  // Create overlay
  const overlay = document.createElement('div');
  overlay.id = 'overlay';
  overlay.style.display = 'none';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  overlay.style.zIndex = '1000';
  document.body.appendChild(overlay);

  // Create popup
  const popup = document.createElement('div');
  popup.id = 'popup';
  popup.style.display = 'none';
  popup.style.position = 'fixed';
  popup.style.top = '50%';
  popup.style.left = '50%';
  popup.style.transform = 'translate(-50%, -50%)';
  popup.style.width = '300px';
  popup.style.padding = '20px';
  popup.style.backgroundColor = 'white';
  popup.style.borderRadius = '10px';
  popup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
  popup.style.zIndex = '1001';
  document.body.appendChild(popup);

  // Create close button
  const closeBtn = document.createElement('button');
  closeBtn.id = 'close-btn';
  closeBtn.innerHTML = '&times;';
  closeBtn.style.position = 'absolute';
  closeBtn.style.top = '10px';
  closeBtn.style.right = '10px';
  closeBtn.style.background = 'none';
  closeBtn.style.border = 'none';
  closeBtn.style.fontSize = '16px';
  closeBtn.style.cursor = 'pointer';
  popup.appendChild(closeBtn);

  // Create popup content
  const popupContent = `
    <h2>Sign Up for Our Newsletter</h2>
    <form id="popup-form">
      <label for="name">Name:</label>
      <input type="text" id="name" name="name" required>
      <br><br>
      <label for="email">Email:</label>
      <input type="email" id="email" name="email" required>
      <br><br>
      <input type="submit" value="Subscribe">
    </form>
  `;
  popup.innerHTML += popupContent;

  // Add event listeners
  closeBtn.addEventListener('click', hidePopup);

  // Add form submission listener
  document.getElementById('popup-form').addEventListener('submit', function(event) {
    event.preventDefault();
    // Handle form submission logic
    hidePopup();
    alert('Thank you for subscribing!');
  });
}

function showPopup() {
  document.getElementById('overlay').style.display = 'block';
  document.getElementById('popup').style.display = 'block';
}

function hidePopup() {
  document.getElementById('overlay').style.display = 'none';
  document.getElementById('popup').style.display = 'none';
}
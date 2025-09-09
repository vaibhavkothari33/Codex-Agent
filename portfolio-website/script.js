document.addEventListener('DOMContentLoaded', () => {
  const accordionButtons = document.querySelectorAll('.accordion-btn');
  accordionButtons.forEach(button => {
    button.addEventListener('click', () => {
      button.classList.toggle('active');
      const panel = button.nextElementSibling;
      if(panel.style.display === 'block') {
        panel.style.display = 'none';
      } else {
        panel.style.display = 'block';
      }
    });
  });

  // Simple form submission handler
  const form = document.getElementById('contact-form');
  const response = document.getElementById('form-response');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    response.textContent = 'Thank you for your message, ' + form.name.value + '! I will get back to you soon.';
    form.reset();
  });
});
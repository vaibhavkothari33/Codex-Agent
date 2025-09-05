const videoPlayer = document.getElementById('video');
const buttons = document.querySelectorAll('button[data-src]');

function setActiveButton(activeBtn) {
  buttons.forEach(btn => {
    if (btn === activeBtn) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const src = button.getAttribute('data-src');
    videoPlayer.src = src;
    videoPlayer.play();
    setActiveButton(button);
  });
});

// Play first video by default
if (buttons.length > 0) {
  buttons[0].click();
}

// Add keyboard navigation (left/right arrows to navigate videos)
document.addEventListener('keydown', (e) => {
  let currentIndex = Array.from(buttons).findIndex(btn => btn.classList.contains('active'));
  if (e.key === 'ArrowRight') {
    e.preventDefault();
    let nextIndex = (currentIndex + 1) % buttons.length;
    buttons[nextIndex].click();
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    let prevIndex = (currentIndex - 1 + buttons.length) % buttons.length;
    buttons[prevIndex].click();
  }
});
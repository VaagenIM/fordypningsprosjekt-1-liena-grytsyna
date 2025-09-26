// Simple script to verify JavaScript is working
document.addEventListener('DOMContentLoaded', function() {
  // Simple initialization
  initializeApp();
});

function initializeApp() {
  // Add some dynamic content to show JS is working
  const container = document.querySelector('.container');
  if (container) {
    const jsIndicator = document.createElement('p');
    jsIndicator.textContent = '✅ JavaScript is working!';
    jsIndicator.style.textAlign = 'center';
    jsIndicator.style.color = '#27ae60';
    jsIndicator.style.fontWeight = 'bold';
    jsIndicator.style.marginTop = '20px';
    container.appendChild(jsIndicator);
  }

  // Add smooth scroll for any anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}
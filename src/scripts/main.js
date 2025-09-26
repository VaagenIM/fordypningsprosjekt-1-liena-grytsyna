// Simple script to verify JavaScript is working
document.addEventListener('DOMContentLoaded', function() {
  console.log('JavaScript loaded successfully!');
  
  // Add a paragraph to the page to show JavaScript is working
  const paragraph = document.createElement('p');
  paragraph.textContent = 'This text was added by JavaScript!';
  paragraph.style.textAlign = 'center';
  paragraph.style.color = '#3498db';
  paragraph.style.fontWeight = 'bold';
  document.body.appendChild(paragraph);
});
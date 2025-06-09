function changeMainImage(src) {
    document.getElementById('mainImage').src = src;
}

// Add active state to option buttons
document.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Remove active class from siblings
        this.parentElement.querySelectorAll('.option-btn').forEach(sibling => {
            sibling.classList.remove('active');
        });
        // Add active class to clicked button
        this.classList.add('active');
    });
});

// Quantity input controls
document.querySelector('.qty-input').addEventListener('input', function() {
    if (this.value < 1) this.value = 1;
});
// Color swatch selection
document.querySelectorAll('.color-swatch').forEach(swatch => {
    swatch.addEventListener('click', function() {
        document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
        this.classList.add('selected');
    });
});

// Price range sync
document.querySelectorAll('.range-input').forEach(slider => {
    slider.addEventListener('input', function() {
        const priceInputs = this.closest('.filter-section').querySelectorAll('.price-input');
        priceInputs[1].value = this.value;
    });
});

// Category pills interaction
document.querySelectorAll('.category-pills .btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.category-pills .btn').forEach(b => {
            b.classList.remove('btn-primary');
            b.classList.add('btn-outline-primary');
        });
        this.classList.remove('btn-outline-primary');
        this.classList.add('btn-primary');
    });
});
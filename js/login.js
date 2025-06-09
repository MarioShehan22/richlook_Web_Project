function togglePassword() {
    const passwordInput = document.getElementById('passwordInput');
    const toggleButton = document.querySelector('.password-toggle');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleButton.textContent = '🙈';
    } else {
        passwordInput.type = 'password';
        toggleButton.textContent = '👁';
    }
}

// Form submission handler
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Add loading state to button
    const button = document.querySelector('.login-button');
    const originalText = button.textContent;
    button.textContent = 'Logging in...';
    button.disabled = true;

    // Simulate login process
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        alert('Login functionality would be implemented here!');
    }, 2000);
});

// Add floating animation to form inputs
document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('focus', function() {
        this.style.transform = 'translateY(-2px)';
    });

    input.addEventListener('blur', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Add ripple effect to buttons
document.querySelectorAll('.login-button, .social-button').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;

        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
document.head.appendChild(style);
// ===== Birthday Reminder App - JavaScript =====

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎉 Birthday Reminder App Loaded');
    
    // Auto-dismiss notifications after 4 seconds
    const notifications = document.querySelectorAll('.notification');
    notifications.forEach(notification => {
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in forwards';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    });

    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Form validation with visual feedback
    const forms = document.querySelectorAll('.modern-form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const inputs = this.querySelectorAll('input[required]');
            let isValid = true;

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    input.style.borderColor = '#f56565';
                    isValid = false;
                } else {
                    input.style.borderColor = '#cbd5e0';
                }
            });

            if (!isValid) {
                e.preventDefault();
                console.warn('Please fill in all required fields');
            }
        });
    });

    // Delete confirmation with custom dialog
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const friendName = this.closest('.birthday-card')?.querySelector('h3')?.textContent || 'this friend';
            if (!confirm(`Are you sure you want to delete ${friendName}'s birthday?`)) {
                e.preventDefault();
            }
        });
    });

    // Add ripple effect to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.classList.contains('btn-delete') || this.classList.contains('btn-edit')) {
                return; // Skip ripple for action buttons
            }
            
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            ripple.style.position = 'absolute';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.style.background = 'rgba(255, 255, 255, 0.5)';
            ripple.style.borderRadius = '50%';
            ripple.style.pointerEvents = 'none';
            ripple.style.transform = `translate(${x}px, ${y}px)`;
            ripple.style.animation = 'ripple 0.6s ease-out';

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Animate birthday cards on hover
    document.querySelectorAll('.birthday-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add input focus effects
    document.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
});

// Ripple animation keyframes (inject into style)
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: translate(calc(-50% + var(--x, 0px)), calc(-50% + var(--y, 0px))) scale(4);
            opacity: 0;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    .form-group.focused label {
        color: #667eea;
    }
`;
document.head.appendChild(style);

console.log('✨ All interactive features initialized successfully!');

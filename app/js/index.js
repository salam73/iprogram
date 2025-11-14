const sections = document.querySelectorAll('section');

const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.2
};

const observer = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, options);

sections.forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
});

const translations = {}; // Object to store loaded translations

        async function loadTranslations(lang) {
            try {
                const response = await fetch(`./lang/${lang}.json`);
                const data = await response.json();
                translations[lang] = data; // Store translations

                const welcomeHeader = document.querySelector('[data-i18n="header_welcome"]');
                const taglineHeader = document.querySelector('[data-i18n="header_tagline"]');

                document.querySelectorAll('[data-i18n]').forEach(element => {
                    const key = element.getAttribute('data-i18n');
                    if (translations[lang][key]) {
                        // Handle strong tag within skills paragraph
                        if (element.classList.contains('skills')) {
                            element.innerHTML = `<strong>${translations[lang][key].split(':')[0]}:</strong> ${translations[lang][key].split(':')[1]}`;
                        } else {
                            // Update content immediately
                            element.textContent = translations[lang][key];

                            // Reset typing effect animations for header elements
                            if (element === welcomeHeader || element === taglineHeader) {
                                // 1. Clear previous animation/style to restart the effect
                                element.style.width = '0';
                                element.style.animation = 'none';
                                element.offsetWidth; // Trigger reflow
                            }
                        }
                    }
                });

                // Set HTML direction for RTL languages
                document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';
                document.body.classList.toggle('rtl', lang === 'ar');

                // Update active language button
                document.querySelectorAll('#language-switcher span').forEach(span => {
                    span.classList.remove('active');
                });
                document.getElementById(`lang-${lang}`).classList.add('active');

                // --- Typing Effect Logic ---

                const welcomeText = welcomeHeader.textContent;
                const taglineText = taglineHeader.textContent;

                // Calculate duration based on text length (e.g., 0.1s per character)
                const charDuration = 0.08; // Adjust for desired speed
                const welcomeDuration = welcomeText.length * charDuration;
                const taglineDuration = taglineText.length * charDuration;

                // Apply animation to header_welcome
                welcomeHeader.style.animation = `typing ${welcomeDuration}s steps(${welcomeText.length}, end) forwards, blink-caret .75s step-end infinite`;
                welcomeHeader.style.width = '100%'; // Ensure full width after typing

                // Apply staggered animation to header_tagline (starts after welcome is complete)
                const taglineDelay = welcomeDuration + 0.5; // Delay: duration of first animation + small pause
                taglineHeader.style.animation = `typing ${taglineDuration}s steps(${taglineText.length}, end) ${taglineDelay}s forwards, blink-caret .75s step-end infinite ${taglineDelay}s`;
                taglineHeader.style.width = '100%'; // Ensure full width after typing

                // --- End Typing Effect Logic ---

            } catch (error) {
                console.error('Error loading translations:', error);
            }
        }

document.addEventListener('DOMContentLoaded', function() {
    const heroHeading = document.querySelector('.hero h1');
    const texts = [
        "Unlock Your Potential",
        "Launch Your Career",
        "Connect with Experts",
        "Bridging the Gap"
    ];
    let currentIndex = 0;

    if (heroHeading) {
        const updateText = () => {
            heroHeading.style.opacity = 0; // Fade out
            setTimeout(() => {
                heroHeading.textContent = texts[currentIndex];
                heroHeading.style.opacity = 1; // Fade in
                currentIndex++;

                if (currentIndex < texts.length) {
                    // If not the last text, set timeout for the next change
                    setTimeout(updateText, 2000); // Wait 2 seconds before fading out again
                }
                // When currentIndex reaches texts.length, the animation stops on the last text.

            }, 500); // Wait for fade-out to complete
        };

        // Start the animation
        setTimeout(updateText, 1000); // Initial delay before starting
    }
});

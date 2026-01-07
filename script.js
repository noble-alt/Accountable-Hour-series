document.addEventListener('DOMContentLoaded', function() {
    const heroHeading = document.getElementById('hero-text');

    // The initial text is "Building Future Leaders"
    const finalPhrase = "Building Future Leaders";

    // The three phrases to cycle through before returning to the final one.
    const tempPhrases = [
        "Your Career Catalyst",
        "Unlocking Your Potential",
        "Bridging the Gap between the Classroom and the real Work life"
    ];

    let currentIndex = 0;

    const interval = setInterval(() => {
        // If we still have temporary phrases to show
        if (currentIndex < tempPhrases.length) {
            heroHeading.textContent = tempPhrases[currentIndex];
            currentIndex++;
        } else {
            // All temporary phrases have been shown, so set the final phrase and stop.
            heroHeading.textContent = finalPhrase;
            clearInterval(interval);
        }
    }, 2000); // Change text every 2 seconds
});

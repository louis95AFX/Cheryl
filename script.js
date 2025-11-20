 const hero = document.querySelector('.hero-image');
    const title = document.querySelector('.hero-text h1');
    const heroSection = document.querySelector('.hero-section');
    
    // Use the container's size for better centering
    let containerRect = heroSection.getBoundingClientRect();

    document.addEventListener('mousemove', (e) => {
        // Calculate offset relative to the hero section container
        const centerX = containerRect.left + containerRect.width / 2;
        const centerY = containerRect.top + containerRect.height / 2;

        // Calculate rotation based on cursor deviation from center
        const xRotate = (e.clientY - centerY) / 40; // Tilt X based on vertical movement
        const yRotate = (e.clientX - centerX) / 40; // Tilt Y based on horizontal movement
        
        // Tilt the hero image (subtler effect)
        hero.style.transform = `rotateX(${xRotate}deg) rotateY(${-yRotate}deg) scale(1.02)`;
        
        // Shift the title shadow (stronger effect)
        const shadowX = (e.clientX - centerX) / 20;
        const shadowY = (e.clientY - centerY) / 20;
        
        // Apply Comic Book Shadow Shift
        title.style.textShadow = 
            `${shadowX}px ${shadowY}px 0 var(--color-red), 
            ${shadowX + 4}px ${shadowY + 4}px 0 var(--color-dark-grey)`;
    });

    document.addEventListener('mouseleave', () => {
        hero.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
        // Restore initial title shadow
        title.style.textShadow = `4px 4px 0 var(--color-red), 8px 8px 0 var(--color-dark-grey)`;
    });

    // Recalculate container size on resize to maintain accurate parallax center
    window.addEventListener('resize', () => {
        containerRect = heroSection.getBoundingClientRect();
    });

    // Particle trail (Kept the original logic, updated color in CSS)
    document.addEventListener('mousemove', function(e) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.width = particle.style.height = Math.random() * 8 + 4 + 'px';
        particle.style.left = e.pageX + 'px';
        particle.style.top = e.pageY + 'px';
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 1000);
    });

    // New: Cursor-based tilt for the approach cards
    const approachCards = document.querySelectorAll('.approach-card');

    approachCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const cardRect = this.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;

            const xPos = (e.clientX - cardCenterX) / (cardRect.width / 2); // -1 to 1 range
            const yPos = (e.clientY - cardCenterY) / (cardRect.height / 2); // -1 to 1 range

            const xRotate = yPos * 10; // More tilt for Y-axis
            const yRotate = -xPos * 10; // More tilt for X-axis

            this.style.transform = `perspective(1000px) rotateX(${xRotate}deg) rotateY(${yRotate}deg) scale(1.05)`;
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
        });
    });

    // New: Cursor-based tilt for the comic bubbles in the approach section
    const comicBubbleLeft = document.querySelector('.comic-bubble-left');
    const comicBubbleRight = document.querySelector('.comic-bubble-right');
    const approachSection = document.querySelector('.marvel-approach-section');

    approachSection.addEventListener('mousemove', (e) => {
        const sectionRect = approachSection.getBoundingClientRect();
        const sectionCenterX = sectionRect.left + sectionRect.width / 2;
        const sectionCenterY = sectionRect.top + sectionRect.height / 2;

        const xMove = (e.clientX - sectionCenterX) / 100; // Affect position
        const yMove = (e.clientY - sectionCenterY) / 100;

        const xRotate = (e.clientY - sectionCenterY) / 200; // Affect rotation
        const yRotate = (e.clientX - sectionCenterX) / 200;

        comicBubbleLeft.style.transform = `translate(${xMove * 0.5}px, ${yMove * 0.5}px) rotateX(${-xRotate}deg) rotateY(${yRotate}deg) rotateZ(-15deg) `;
        comicBubbleRight.style.transform = `translate(${-xMove * 0.5}px, ${-yMove * 0.5}px) rotateX(${xRotate}deg) rotateY(${-yRotate}deg) rotateZ(10deg)`;
    });

    approachSection.addEventListener('mouseleave', () => {
        comicBubbleLeft.style.transform = `translate(0,0) rotateX(0deg) rotateY(0deg) rotateZ(-15deg)`;
        comicBubbleRight.style.transform = `translate(0,0) rotateX(0deg) rotateY(0deg) rotateZ(10deg)`;
    });

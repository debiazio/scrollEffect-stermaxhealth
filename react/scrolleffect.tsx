import React, { useEffect } from 'react';

const ScrollAnimationGlobal: React.FC = () => {
  useEffect(() => {
    const elements = document.querySelectorAll(
      '.vtex-store-components-3-x-imageElement--selo-anvisa-teste, .vtex-store-components-3-x-imageElement--selo-iso-teste'
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;

          if (entry.isIntersecting) {
            // elemento visível → mostra
            target.style.opacity = '1';
            target.style.transform = 'translateX(0)';
          } else {
            // elemento fora da tela → esconde
            target.style.opacity = '0';
            target.style.transform = 'translateX(200px)';
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach((el) => {
      const element = el as HTMLElement;
      element.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
      element.style.opacity = '0';
      element.style.transform = 'translateX(200px)';
      observer.observe(element);
    });

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return null; // não renderiza nada
};

export default ScrollAnimationGlobal;

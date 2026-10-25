import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import '../Styles/SplitText.css';

gsap.registerPlugin(ScrollTrigger);

const SplitText = ({
    text,
    className = '',
    type = 'chars',
    from = { y: 50, opacity: 0 },
    to = { y: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.7)', stagger: 0.05 },
    scrollTriggerOptions = null,
}) => {
    const elRef = useRef(null);

    useEffect(() => {
        const el = elRef.current;
        if (!el) return;

        const ctx = gsap.context(() => {
            const splitTypes = {
                chars: '',
                words: ' ',
                lines: '\n',
            };

            const split = text.split(splitTypes[type] || '');
            let innerHtmlContent = split
                .map((part, idx) => {
                    if (type === 'words') {
                        return `<span class="split-part" style="display:inline-block;">${part}</span>${idx < split.length - 1 ? ' ' : ''}`;
                    }
                    return `<span class="split-part" style="display:inline-block;">${part === ' ' ? '&nbsp;' : part}</span>`;
                })
                .join('');

            if (type === 'chars') {
                innerHtmlContent = innerHtmlContent.replace(/<\/span>/g, '</span><wbr>');
            }

            el.innerHTML = innerHtmlContent;

            const targets = el.querySelectorAll('.split-part');

            const tweenOptions = {
                ...from,
                ...to,
            };

            if (scrollTriggerOptions) {
                tweenOptions.scrollTrigger = {
                    trigger: el,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                    ...scrollTriggerOptions,
                };
            }

            gsap.fromTo(targets, from, tweenOptions);
        }, el);

        return () => ctx.revert();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div ref={elRef} className={className}></div>;
};

export default SplitText;

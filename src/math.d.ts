interface Window {
    MathJax: {
        typeset?: (elements?: HTMLElement[]) => void;
        typesetPromise?: (elements?: HTMLElement[]) => Promise<void>;
        [key: string]: any;
    };
}
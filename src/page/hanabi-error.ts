export const hanabi_error_css = `
@charset "utf-8";

* {
    margin: 0;
    padding: 0;

    box-sizing: border-box;
}
a {
    color: inherit;
    text-decoration: none;
}
img,
svg {
    display: block;
    max-width: 100%;
}

:root {
    --space-block-large: 4rem;
    --color-main: #303030;
    --color-background: #f0f0f0;
    --color-header-background: #615c66;
    --color-header-text: #ffffff;
    --color-accent: #d7003a;
    --content-width: 740px;
    --content-padding: 1rem;
}
:root {
    font-size: 18px;
    line-height: 1.8;
    font-family: "Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif;
}
p {
    text-indent: 1rem;
}

:root {
    scroll-behavior: smooth;
}

body {
    color: var(--color-main);
    background-color: var(--color-background);
}

.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-block-large);
}
.content {
    max-width: var(--content-width);
    width: 100%;
    padding-inline: var(--content-padding);
}

h1 {
    font-size: 2rem;
}

.page-header {
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    margin-block-end: 2rem;
}

.page-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: var(--color-main);
    color: var(--color-background);
}

.page-footer-content {
    position: relative;
    max-width: var(--content-width);
    margin-inline: auto;
}

.page-footer-copyright {
    text-align: center;
}
`;

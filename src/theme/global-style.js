// Note: using typography.js includes normalize.css by default, unless
//       the option to disable it is explicitly invoked.

import { createGlobalStyle } from "styled-components";
import background from "./WaterPlain0008_1_270.jpg";

export default createGlobalStyle`

  /* Modern CSS Reset -- see: https://hankchizljaw.com/wrote/a-modern-css-reset/ */

  /* Box sizing rules */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  /* Remove default padding */
  ul[class],
  ol[class] {
    padding: 0;
  }

  /* Remove default margin */
  body,
  h1,
  h2,
  h3,
  h4,
  p,
  ul[class],
  ol[class],
  li,
  figure,
  figcaption,
  blockquote,
  dl,
  dd {
    margin: 0;
  }

  /* Set core body defaults */
  body {
    min-height: 100vh;
    scroll-behavior: smooth;
    text-rendering: optimizeSpeed;
    line-height: 1.5;
  }

  /* Remove list styles on ul, ol elements with a class attribute */
  ul[class],
  ol[class] {
    list-style: none;
  }

  /* A elements that don't have a class get default styles */
  a:not([class]) {
    text-decoration-skip-ink: auto;
  }

  /* Make images easier to work with */
  img {
    max-width: 100%;
    display: block;
  }

  /* Natural flow and rhythm in articles by default */
  article > * + * {
    margin-top: 1em;
  }

  /* Inherit fonts for inputs and buttons */
  input,
  button,
  textarea,
  select {
    font: inherit;
  }

  /* Remove all animations and transitions for people that prefer not to see them */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }

  /* END RESET */

  #___gatsby {
    height: 100%;
  }

  div[role="group"][tabindex] {
    height: 100%;
  }

  body {
    padding: 0;
    background: url(${background});

    &::before {
      box-shadow: 0 0 10px rgba(0,0,0,.8);
      content: "";
      height: 10px;
      left: 0;
      position: fixed;
      top: -10px;
      width: 100%;
      z-index: 100;
    }
  }

  a {
    color: ${props => props.theme.colors.main};
  }
`;

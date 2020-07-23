// Note: using typography.js includes normalize.css by default, unless
//       the option to disable it is explicitly invoked.

import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`

  html, body, #___gatsby {
    height: 100%;
  }

  div[role="group"][tabindex] {
    height: 100%;
  }

  body {
    padding: 0;
    margin: 0;
    background: cadetblue;

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

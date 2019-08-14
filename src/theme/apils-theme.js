import { options } from "./typography";

export default {
  // main: "hsl(230, 55%, 58%)"
  colors: {
    main: "#508084",
    mainAlt: "ghostwhite",
    pageBg: "white",
    highlight: "#f4ff99"
  },

  fonts: {
    body: options.bodyFontFamily.map(typeface => `"${typeface}"`).join(","),
    header: options.headerFontFamily.map(typeface => `"${typeface}"`).join(",")
  },

  contentMaxWidth: "960px",
  contentOverhang: "20px",

  pageShadow: `
    position: relative;

    &::before,
    &::after {
      border-radius: 100px / 10px;
      bottom: 10px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
      content: "";
      left: 0;
      position: absolute;
      right: 0;
      top: 10px;
      z-index: -1;
    }

    &::after {
      left: auto;
      right: 10px;
      transform: skew(8deg) rotate(3deg);
    }
  `
};

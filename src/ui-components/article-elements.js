import styled, { css } from "styled-components";
import { lighten, transparentize } from "polished";

const footnoteTipStyles = css`
  ${({ theme }) => theme.scale(-0.3)};
  background: ${({ theme }) => transparentize(0.05, theme.colors.main)};
  border-color: ${({ theme }) => transparentize(0.05, theme.colors.main)};
  font-family: ${({ theme }) => theme.fonts.body};
  font-style: normal;
  max-width: 20rem;
  padding: 0.5rem 1rem;
  z-index: 2;

  a[href^="#ftn"] {
    display: none;
  }

  p {
    margin-bottom: ${({ theme }) => theme.rhythm(1 / 2)};
    &:last-of-type {
      margin-bottom: 0;
    }
  }
`;

const Abstract = styled.blockquote`
  ${({ theme }) => theme.scale(-0.1)}
  font-family: ${({ theme }) => theme.fonts.header};
  margin: ${({ theme: { rhythm } }) =>
    `${rhythm(1)} ${rhythm(2)} ${rhythm(1)} ${rhythm(1)}`};
  text-align: justify;

  em,
  span.zh {
    font-style: normal;
  }
`;

const ArticleBody = styled.div`
  ${({ theme }) => theme.scale(0)};

  header {
    ${({ theme }) => theme.scale(0.5)};
    font-family: ${({ theme }) => theme.fonts.header};
    margin: ${({ theme }) => theme.rhythm(2 / 3)} 0;
  }

  figure {
    border: 1px solid ${({ theme }) => theme.colors.bodyText};
    border-radius: 5px;
    display: inline-block;
    margin: 0 0.5%;
    max-width: 48%;
    padding: ${({ theme }) => theme.rhythm(1 / 5)};

    img {
      margin-bottom: 0;
    }

    figcaption {
      background: ${({ theme }) => lighten(0.4, theme.colors.main)};
      font-family: ${({ theme }) => theme.fonts.header};
      ${({ theme }) => theme.scale(-0.2)};
      padding: ${({ theme }) => theme.rhythm(1 / 5)};
    }
  }

  table {
    ${({ theme }) => theme.scale(-0.1)};
    font-family: ${({ theme }) => theme.fonts.header};

    tr:nth-child(odd) {
      background: #eaeaea;
    }

    tr:first-child {
      background: ${({ theme }) => lighten(0.4, theme.colors.main)};
      font-weight: bold;
    }

    td {
      padding: ${({ theme: { rhythm } }) =>
        `${rhythm(1 / 6)} ${rhythm(1 / 3)}`};

      &[colspan="100%"] {
        text-align: center;
      }
    }
  }

  blockquote {
    border: none;
    margin: ${({ theme: { rhythm } }) => `0 ${rhythm(1)} ${rhythm(1)}`};
    padding: 0;

    span.zh {
      font-style: normal;
    }
  }
`;

const Footnotes = styled.div`
  ${({ theme }) => theme.scale(-0.2)};
  border-top: 1px solid #000;
  color: rgba(0, 0, 0, 0.6);
  margin-top: ${({ theme }) => theme.rhythm(2)};
  padding-top: ${({ theme }) => theme.rhythm(2 / 3)};

  li:target {
    background-color: ${({ theme }) => theme.colors.highlight};
    border: 8px solid ${({ theme }) => theme.colors.highlight};
    color: ${({ theme }) => theme.colors.bodyText};
  }
`;

export { Abstract, ArticleBody, Footnotes, footnoteTipStyles };

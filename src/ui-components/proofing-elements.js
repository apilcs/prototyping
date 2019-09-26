import styled, { css } from "styled-components";
import { lighten } from "polished";
import { Tip } from "./tooltip";

const ToggleButton = styled.button`
  background: none;
  border: none;
  margin: 1em 0 0;

  &::before {
    color: ${({ theme }) => theme.colors.main};
    content: "⧐";
    display: inline-block;
    margin-right: 4px;
    transition: transform 0.5s ease;
  }

  &.shown {
    &::before {
      transform: rotate(90deg);
    }
  }
`;

const ControlsPanel = styled.div`
  background: #eaeaea;
  margin: 10px;
  padding: 10px;
  ${({ theme }) => theme.scale(-0.3)};
  ${"" /* font-family: ${({ theme }) => theme.fonts.header}; */}
  font-family: "Source Sans Pro", sans-serif;
  overflow: hidden;

  div {
    display: flex;
    align-items: center;
  }

  ${ToggleButton}.shown + form {
    height: 650px;
  }

  form {
    transition: height 0.5s ease;
    overflow: hidden;
    height: 0;
    padding: 0;
    margin-bottom: 0;

    div {
      align-items: start;
    }
  }

  fieldset {
    display: flex;
    flex: 1 0 auto;
    padding: 0 2em 1em;
    margin: 0 1em 1em;

    div:last-child {
      margin-top: 1em;
    }
  }

  input[type="checkbox"],
  input[type="radio"] {
    margin-right: 5px;
  }

  input[type="file"] {
    flex-grow: 1;
    line-height: 1.2;
  }

  label {
    cursor: pointer;
    padding-right: 10px;
  }
`;

const controlsTipStyles = css`
  ${({ theme }) => theme.scale(-0.3)};
  background: black;
  color: white;
  font-style: normal;
  line-height: 1.5;
  max-width: 20rem;
  padding: 0 8px;
  z-index: 2;
`;

const ControlButton = styled.button`
  background: ${({ theme }) => theme.colors.main};
  color: white;

  border: 0;
  border-radius: 3px;
  margin: 0 4px;

  line-height: 1.2;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => lighten(0.1, theme.colors.main)};
  }
`;

const entityTipStyles = css`
  ${({ theme }) => theme.scale(-0.5)};
  background: #eaeaea;
  border: 1px solid darkgrey;
  color: black;
  font-family: sans-serif;
  font-style: normal;
  max-width: 20rem;
  padding: 0.1rem 0.5rem;
  z-index: 2;
`;

const NamedEntity = styled.span`
  ${({ theme }) => theme.scale(-0.4)}
  font-family: sans-serif;
  font-style: normal;
  display: inline-block;
  padding: 0 4px;
  border-radius: 5px;
  position: relative;
  background-color: ${props =>
    (props.type === "GPE" && "lightblue") ||
    (props.type === "LOC" && "thistle") ||
    (props.type === "ORG" && "darkseagreen") ||
    (props.type === "NORP" && "darkkhaki") ||
    (props.type === "PERSON" && "lightsteelblue") ||
    "lightgrey"};
  padding-right: ${props => props.type.length * 7 + 18}px;
  line-height: 1rem;

  ${Tip} & {
    color: black;
  }

  &::after {
    ${({ theme }) => theme.scale(-1)}
    content: '${props => props.type}';
    background: #eaeaea;
    border-radius: 2px;
    display: inline-block;
    margin: 4px;
    line-height: 1.1;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-73%);
    padding: 3px 4px;
  }
`;

export {
  ControlsPanel,
  controlsTipStyles,
  ToggleButton,
  ControlButton,
  NamedEntity,
  entityTipStyles
  // FileInput
};

import styled, { css } from "styled-components";
import { Tip } from "./tooltip";

const entityTipStyles = css`
  ${({ theme }) => theme.scale(-0.5)};
  background: #eaeaea;
  border: 1px solid black;
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

export { NamedEntity, entityTipStyles };

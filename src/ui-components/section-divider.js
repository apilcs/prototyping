import React from "react";
import styled from "styled-components";

const SectionDividerContainer = styled.div`
  display: table;
  font-size: 24px;
  text-align: center;
  width: 75%;
  margin: 40px auto;
  height: 10px;

  span {
    display: table-cell;
    position: relative;

    &:first-child,
    &:last-child {
      width: 50%;
      top: 13px;
      background-size: 100% 2px;
      background-position: 0 0, 0 100%;
      background-repeat: no-repeat;
    }

    &:first-child {
      background-image: linear-gradient(90deg, transparent, #000);
    }

    &:last-child {
      background-image: linear-gradient(90deg, #000, transparent);
    }
  }
`;

function SectionDivider() {
  return (
    <SectionDividerContainer>
      <span />
      <span />
    </SectionDividerContainer>
  );
}

export default SectionDivider;

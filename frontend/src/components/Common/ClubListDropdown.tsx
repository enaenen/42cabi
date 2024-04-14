import { useState } from "react";
import styled, { css } from "styled-components";

interface IClubListDropd {
  options: { userId: number; name: string; imageSrc?: string }[];
  defaultValue: string;
  defaultImageSrc?: string;
  onChangeValue?: (param: any) => any;
}

const ClubListDropd = ({
  options,
  defaultValue,
  onChangeValue,
}: IClubListDropd) => {
  const [currentName, setCurrentName] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const selectedIdx = options.findIndex((op) => op.name === currentName) ?? 0;
  return (
    <ClubListDropdContainerStyled>
      <ClubListDropdSelectionBoxStyled
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        isOpen={isOpen}
      >
        {options[selectedIdx].imageSrc && (
          <div style={{ width: "18px", height: "18px" }}>
            <img src={options[selectedIdx].imageSrc} />
          </div>
        )}
        <p style={{ paddingLeft: "10px" }}>{currentName}</p>
        <img src="/src/assets/images/ClubListDropdChevron.svg" />
      </ClubListDropdSelectionBoxStyled>
      <ClubListDropdItemContainerStyled isVisible={isOpen}>
        {options?.map((option) => {
          return (
            <ClubListDropdItemStyled
              key={option.userId}
              onClick={() => {
                setCurrentName(option.name);
                setIsOpen(false);
                if (onChangeValue) {
                  onChangeValue(option.userId);
                }
              }}
              isSelected={option.name === currentName}
            >
              {option.imageSrc && (
                <div style={{ width: "18px", height: "18px" }}>
                  <img src={option.imageSrc} />
                </div>
              )}
              <p style={{ paddingLeft: "10px" }}>{option.name}</p>
            </ClubListDropdItemStyled>
          );
        })}
      </ClubListDropdItemContainerStyled>
    </ClubListDropdContainerStyled>
  );
};

const ClubListDropdContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
`;

const ClubListDropdSelectionBoxStyled = styled.div<{ isOpen: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid var(--shared-gray-color-400);
  width: 100%;
  height: 60px;
  border-radius: 10px;
  text-align: start;
  padding-left: 20px;
  font-size: 1.125rem;
  color: var(--main-color);
  & > img {
    filter: contrast(0.6);
    width: 14px;
    height: 8px;
    position: absolute;
    top: 45%;
    left: 85%;
    ${({ isOpen }) =>
      isOpen === true &&
      css`
        transform: scaleY(-1);
      `}
  }
`;

const ClubListDropdItemContainerStyled = styled.div<{ isVisible: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 110%;
  z-index: 99;
  ${({ isVisible }) =>
    isVisible !== true &&
    css`
      visibility: hidden;
    `}
`;

const ClubListDropdItemStyled = styled.div<{ isSelected: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  background-color: ${({ isSelected }) =>
    isSelected ? "var(--shared-gray-color-200)" : "var(--bg-color)"};
  border: 1px solid var(--shared-gray-color-400);
  border-width: 0px 1px 1px 1px;
  width: 100%;
  height: 60px;
  text-align: start;
  padding-left: 20px;
  font-size: 1.125rem;
  color: ${({ isSelected }) =>
    isSelected ? "var(--main-color)" : "var(--normal-text-color)"};
  cursor: pointer;
  &:first-child {
    border-radius: 10px 10px 0px 0px;
    border-width: 1px 1px 1px 1px;
  }
  &:last-child {
    border-radius: 0px 0px 10px 10px;
  }
  &:hover {
    background-color: var(--shared-gray-color-200);
  }
`;

export default ClubListDropd;

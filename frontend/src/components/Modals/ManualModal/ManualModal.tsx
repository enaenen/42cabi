import React from "react";
import { useState } from "react";
import styled, { keyframes } from "styled-components";
import { manualContentData } from "@/assets/data/ManualContent";
import { ReactComponent as MoveBtnImg } from "@/assets/images/moveButton.svg";
import ContentStatus from "@/types/enum/content.status.enum";

interface ModalProps {
  contentStatus: ContentStatus;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ManualModal: React.FC<ModalProps> = ({
  contentStatus,
  setIsModalOpen,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(true);
  const contentData = manualContentData[contentStatus];

  const isCabinetType =
    contentStatus === ContentStatus.PRIVATE ||
    contentStatus === ContentStatus.SHARE ||
    contentStatus === ContentStatus.CLUB;

  const isIcon =
    contentStatus !== ContentStatus.PENDING &&
    contentStatus !== ContentStatus.IN_SESSION;

  const closeModal = () => {
    if (modalIsOpen) {
      setModalIsOpen(false);
      setTimeout(() => {
        setIsModalOpen(false);
      }, 400);
    }
  };

  return (
    <ModalOverlay onClick={closeModal}>
      <ModalWrapper
        background={contentData.background}
        contentStatus={contentStatus}
        className={modalIsOpen ? "open" : "close"}
      >
        <ModalContent contentStatus={contentStatus}>
          <CloseButton contentStatus={contentStatus} onClick={closeModal}>
            <MoveBtnImg stroke="white" />
          </CloseButton>
          <BasicInfo>
            {isIcon && (
              <img className="contentImg" src={contentData.imagePath} alt="" />
            )}
            {isCabinetType && (
              <BoxInfoWrap>
                <BoxInfo1>
                  대여기간
                  <br />
                  <strong>{contentData.rentalPeriod} </strong>
                </BoxInfo1>
                <BoxInfo2>
                  사용인원
                  <br />
                  <strong>{contentData.capacity}</strong>
                </BoxInfo2>
              </BoxInfoWrap>
            )}
          </BasicInfo>
          {contentData.contentTitle}
          <ManualContentStyeld color={contentData.pointColor}>
            <div
              dangerouslySetInnerHTML={{ __html: contentData.contentText }}
            ></div>
          </ManualContentStyeld>
        </ModalContent>
      </ModalWrapper>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const OpenModalAni = keyframes`
  from {
    transform: translateY(100%) scale(0.8);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
`;

const CloseModalAni = keyframes`
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
`;

const ModalWrapper = styled.div<{
  background: string;
  contentStatus: ContentStatus;
}>`
  &.open {
    animation: ${OpenModalAni} 0.4s ease-in-out;
  }

  &.close {
    animation: ${CloseModalAni} 0.4s ease-in-out;
  }
  transform-origin: center;
  position: fixed;
  bottom: 0;
  max-width: 1000px;
  min-width: 330px;
  width: 70%;
  height: 75%;
  overflow-y: auto;
  background: ${(props) => props.background};
  padding: 30px 70px;
  border-radius: 40px 40px 0 0;
  border: ${(props) =>
    props.contentStatus === ContentStatus.PENDING
      ? "10px double var(--white)"
      : props.contentStatus === ContentStatus.IN_SESSION
      ? "5px solid var(--main-color)"
      : "none"};
  border-bottom: none;
  @media screen and (max-width: 700px) {
    width: 100%;
    padding: 30px 30px;
  }
`;

const ModalContent = styled.div<{
  contentStatus: ContentStatus;
}>`
  height: 100%;
  display: flex;
  flex-direction: column;
  color: ${(props) =>
    props.contentStatus === ContentStatus.IN_SESSION
      ? "var(--main-color)"
      : props.contentStatus === ContentStatus.EXTENSION
      ? "black"
      : "white"};
  font-size: 40px;
  font-weight: bold;
  align-items: flex-start;
  .svg {
    width: 80px;
    height: 80px;
  }
  .contentImg {
    width: 80px;
    height: 80px;
    filter: ${(props) =>
      props.contentStatus === ContentStatus.EXTENSION
        ? "brightness(0)"
        : props.contentStatus === ContentStatus.PENDING
        ? "brightness(0)"
        : "brightness(100)"};
  }
  @media screen and (max-width: 400px) {
    font-size: 25px;
    .contentImg {
      width: 60px;
      height: 60px;
      margin-top: 10px;
    }
    svg {
      width: 60px;
      height: 60px;
    }
  }
`;

const CloseButton = styled.div<{
  contentStatus: ContentStatus;
}>`
  width: 80px;
  height: 40px;
  cursor: pointer;
  margin-bottom: 45px;
  align-self: flex-end;
  svg {
    transform: scaleX(-1);
    stroke: ${(props) =>
      props.contentStatus === ContentStatus.IN_SESSION
        ? "var(--main-color)"
        : props.contentStatus === ContentStatus.EXTENSION
        ? "black"
        : "white"};
  }
  :hover {
    transition: all 0.3s ease-in-out;
    transform: translateY(-5px);
  }
`;

const BasicInfo = styled.div`
  width: 100%;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
`;

const BoxInfoWrap = styled.div`
  display: flex;
`;

const BoxInfo1 = styled.div`
  width: 100px;
  height: 80px;
  border: 1px solid white;
  border-radius: 15px;
  font-size: 14px;
  font-weight: 400;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-direction: column;
  align-self: flex-end;
  strong {
    margin-top: 10px;
  }
`;

const BoxInfo2 = styled.div`
  width: 80px;
  height: 80px;
  border: 1px solid white;
  border-radius: 15px;
  font-size: 14px;
  font-weight: 400;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-direction: column;
  margin-left: 10px;
  strong {
    margin-top: 10px;
  }
`;

const ManualContentStyeld = styled.div<{
  color: string;
}>`
  margin: 40px 0 0 20px;
  font-size: 20px;
  line-height: 1.9;
  font-weight: 350;
  strong {
    color: ${(props) => props.color};
  }
  a {
    font-weight: bold;
    color: ${(props) => props.color};
  }
  @media screen and (max-width: 800px) {
    line-height: 1.7;
    font-size: 18px;
    margin-left: 10px;
  }
  @media screen and (max-width: 400px) {
    line-height: 1.6;
    font-size: 14px;
    margin-top: 20px;
    margin-left: 3px;
  }
`;

export default ManualModal;

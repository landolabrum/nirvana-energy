import { IVariant } from '@webstack/components/AdapTable/models/IVariant';
import { IButton } from '@webstack/components/UiButton/UiButton';
import { createContext, ReactNode, useContext, useState } from 'react';
type IConfirm ={
  title?: string;
  statements?: {text?: string, onClick?:(e:any)=>void, variant?: IVariant}[];
} | undefined;
export type IModalContent = {
  children?: ReactNode | null | string;
  variant?: "popup" | 'fullscreen';
  confirm?: IConfirm;
} | ReactNode | null;

interface ModalContextType {
  isModalOpen: boolean;
  openModal: (content: IModalContent) => void;
  closeModal: () => void;
  modalContent: IModalContent;
}

export const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface Props {
  children: any;
}

export const ModalProvider: React.FC<Props> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<IModalContent>(null); // Updated type here
  const openModal = (content: IModalContent) => {
    setIsModalOpen(true);
    setModalContent(content);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  return (
    <ModalContext.Provider value={{ isModalOpen, openModal, closeModal, modalContent }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);

  const defaultContext: ModalContextType = {
    isModalOpen: false,
    openModal: (content: IModalContent) => {
      console.warn('openModal called before ModalProvider is ready.');
    },
    closeModal: () => {
      console.warn('closeModal called before ModalProvider is ready.');
    },
    modalContent: null,
  };

  return context ?? defaultContext;
};

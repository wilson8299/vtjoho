import ReactModal from "react-modal";

ReactModal.setAppElement("#__next");

interface IModalProps {
  title: string;
  submit: string;
  isOpen: boolean;
  handleCloseModal?(): void;
  handleSubmit?(e: React.FormEvent<HTMLFormElement>): void;
  children?: React.ReactNode;
}

const Modal: React.FC<IModalProps> = ({
  title,
  submit,
  isOpen,
  handleCloseModal,
  handleSubmit,
  children,
}) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={handleCloseModal}
      className="absolute m-8 flex max-h-[80vh] w-[100%] flex-col rounded border-none bg-light-300 p-5 outline-none dark:bg-dark-300 lg:w-[55%]"
      overlayClassName="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-cover bg-no-repeat bg-zinc-400/50"
    >
      <h3 className="py-3 text-xl text-dark-100 dark:text-light-100">{title}</h3>
      <form
        onSubmit={handleSubmit}
        className="flex h-full w-full flex-col overflow-hidden"
      >
        {children}
        <div className="mt-6 ml-auto flex items-center justify-end">
          <button onClick={handleCloseModal} className="mr-3 border-none text-slate-400">
            Close
          </button>
          <input
            type="submit"
            value={submit}
            className={`${
              submit === "Delete" && "bg-red-500 hover:bg-red-600"
            } duration-400 ml-auto w-fit cursor-pointer rounded-sm border-none bg-sky-500 px-2 py-1 text-base text-white transition ease-in-out hover:bg-sky-600 `}
          />
        </div>
      </form>
    </ReactModal>
  );
};

export default Modal;

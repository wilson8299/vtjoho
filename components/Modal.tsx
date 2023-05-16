import ReactModal from "react-modal";

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
      className="absolute m-8 flex min-w-[400px] flex-col justify-between rounded border-none bg-slate-900 p-10"
      overlayClassName="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-cover bg-no-repeat bg-zinc-400/50"
      contentLabel="Management"
    >
      <h3 className="py-3 text-xl text-white">{title}</h3>
      <form onSubmit={handleSubmit} className="flex flex-col">
        {children}
        <div className="ml-auto mt-6 flex items-center justify-end">
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

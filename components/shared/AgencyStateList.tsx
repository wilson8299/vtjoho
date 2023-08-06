import { useState } from "react";
import { MdDriveFileRenameOutline, MdOutlineDelete } from "react-icons/md";
import { Modal } from "@/components/shared";
import { useUpdateAgencyMutation, useDeleteAgencyMutation } from "@/query/agencyQuery";

enum ModalType {
  Edit,
  Delete,
}

interface IModalState {
  type: ModalType;
  isOpen: boolean;
}

interface IBaseProps {
  id: string;
  name: string;
  radioChecked: string;
  handleRadioClick(e: React.ChangeEvent<HTMLInputElement>): void;
}

const AgencyStateList: React.FC<IBaseProps> = ({
  id,
  name,
  radioChecked,
  handleRadioClick,
}) => {
  const [modalState, setModalState] = useState<IModalState>();
  const [agencyName, setAgencyName] = useState<string>(name);
  const updateAgencyMutation = useUpdateAgencyMutation();
  const deleteAgencyMutation = useDeleteAgencyMutation();

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateAgencyMutation.mutate({
      oldName: name,
      name: agencyName,
    });
    handleCloseModal();
  };

  const handleDeleteSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    deleteAgencyMutation.mutate(id);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setModalState({
      type: ModalType.Edit,
      isOpen: false,
    });
  };

  return (
    <>
      <div key={id} className="flex justify-between">
        <label>
          <input
            checked={radioChecked === id}
            onChange={handleRadioClick}
            value={id}
            type="radio"
            name="agencyRadio"
            className="peer hidden"
            id={name}
          />
          <div className="border-l-[6px] border-transparent px-2 py-1 text-lg text-white transition duration-150 ease-in-out hover:border-sky-500 peer-checked:border-sky-500">
            {name}
          </div>
        </label>
        <div className="flex items-center pr-3 text-xl text-white">
          <MdDriveFileRenameOutline
            className="mr-3 cursor-pointer text-white transition duration-150 ease-in-out hover:text-sky-500"
            onClick={() => {
              setModalState({
                type: ModalType.Edit,
                isOpen: true,
              });
            }}
          />
          <MdOutlineDelete
            className="cursor-pointer text-red-500 transition duration-150 ease-in-out hover:text-red-700"
            onClick={() =>
              setModalState({
                type: ModalType.Delete,
                isOpen: true,
              })
            }
          />
        </div>
      </div>

      {modalState?.isOpen && modalState?.type == ModalType.Edit && (
        <Modal
          title="Edit agency name"
          submit="Edit"
          isOpen={modalState.isOpen}
          handleCloseModal={handleCloseModal}
          handleSubmit={handleEditSubmit}
        >
          <input
            type="text"
            name="editAgency"
            value={agencyName}
            onChange={(e) => setAgencyName(e.target.value)}
            className="rounded-sm border-[1px] border-slate-50 bg-transparent p-1 text-white"
          />
        </Modal>
      )}

      {modalState?.isOpen && modalState?.type == ModalType.Delete && (
        <Modal
          title={`Are you sure you want to delete ${name}`}
          submit="Delete"
          isOpen={modalState.isOpen}
          handleCloseModal={handleCloseModal}
          handleSubmit={handleDeleteSubmit}
        />
      )}
    </>
  );
};

export default AgencyStateList;

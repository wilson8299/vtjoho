/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useState } from "react";
import { MdDriveFileRenameOutline, MdOutlineDelete } from "react-icons/md";
import FormData from "form-data";
import axios from "axios";
import { Modal } from "@/components/shared";
import {
  IMember,
  useDeleteMemberMutation,
  useUpdateMemberMutation,
} from "@/query/memberQuery";

enum ModalType {
  Edit,
  Delete,
}

interface IModalState {
  type: ModalType;
  isOpen: boolean;
}

interface IBaseProps extends IMember {}

const MemberStateList: React.FC<IBaseProps> = ({
  id,
  enName,
  jpName,
  avatarName,
  banner,
  channelTitle,
  agency,
  official,
  createdAt,
}) => {
  const [modalState, setModalState] = useState<IModalState>();
  const [member, setMember] = useState<IBaseProps>({
    id,
    enName,
    jpName,
    avatarName,
    banner,
    channelTitle,
    agency,
    official,
    createdAt,
  });
  const [avatar, setAvatar] = useState<File>();
  const updateMemberMutation = useUpdateMemberMutation();
  const deleteMemberMutation = useDeleteMemberMutation();

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateMemberMutation.mutate({
      prevId: id,
      member,
    });

    if (member.enName !== enName || member.agency !== agency || avatar) {
      if (avatar) {
        const reqUrl = `https://${process.env.NEXT_PUBLIC_VTJOHO_HOSTNAME}/api/member/update-image`;

        const data = new FormData();
        data.append("avatar", avatar);
        data.append("originalAgency", agency);
        data.append("originalAvatarName", avatarName);
        data.append("agency", member.agency);
        data.append("enName", member.enName);
        await axios.post(reqUrl, data);
      }
    }

    handleCloseModal();
  };

  const handleDeleteSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const reqUrl = `https://${process.env.NEXT_PUBLIC_VTJOHO_HOSTNAME}/api/member/delete-image`;
    await axios.post(reqUrl, {
      agency: member.agency,
      avatarName: member.avatarName,
    });
    deleteMemberMutation.mutate(member.id);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setModalState({
      type: ModalType.Edit,
      isOpen: false,
    });
    setAvatar(undefined);
  };

  const editMemberInfoElement = [
    { title: "Id", nameid: "id", value: member.id },
    { title: "Agency", nameid: "agency", value: member.agency },
    { title: "Jp Name", nameid: "jpName", value: member.jpName },
    { title: "En Name", nameid: "enName", value: member.enName },
    { title: "Banner", nameid: "banner", value: member.banner },
    { title: "Official", nameid: "official", value: member.official },
  ];

  return (
    <>
      <div className="flex justify-between bg-slate-900">
        <div className="flex overflow-hidden">
          <span className="block rounded">
            <img
              className="h-[70px] w-[70px] object-cover"
              src={`${process.env.NEXT_PUBLIC_CDN_URL}/${agency}/${avatarName}.jpg`}
              alt={jpName}
            />
          </span>
          <div className="flex items-center gap-6 truncate py-2 px-4">
            <h3 className="truncate text-xl text-white">{jpName}</h3>
            <h4 className="truncate text-lg text-slate-500">{enName}</h4>
          </div>
        </div>

        <div className="flex">
          <span
            className="flex cursor-pointer items-center bg-sky-500 px-4 transition duration-150 ease-in-out hover:bg-sky-600"
            onClick={() => {
              setModalState({
                type: ModalType.Edit,
                isOpen: true,
              });
            }}
          >
            <MdDriveFileRenameOutline className="text-2xl text-white" />
          </span>
          <span
            className="flex cursor-pointer items-center bg-rose-500 px-4 transition duration-150 ease-in-out hover:bg-rose-600"
            onClick={() => {
              setModalState({
                type: ModalType.Delete,
                isOpen: true,
              });
            }}
          >
            <MdOutlineDelete className="text-2xl text-white" />
          </span>
        </div>
      </div>

      {modalState?.isOpen && modalState?.type == ModalType.Edit && (
        <Modal
          title={`Edit ${jpName} Info`}
          submit="Save"
          isOpen={modalState.isOpen}
          handleCloseModal={handleCloseModal}
          handleSubmit={handleEditSubmit}
        >
          <p className="mb-2 text-sky-500">Modify info or avatar.</p>
          {editMemberInfoElement?.map((info) => (
            <React.Fragment key={info.nameid}>
              <label
                key={info.title}
                htmlFor={info.nameid}
                className="text-lg text-white"
              >
                {info.title}:
              </label>
              <input
                key={info.nameid}
                type="text"
                name={info.nameid}
                id={info.nameid}
                value={info.value?.toString()}
                className="mb-2 rounded-sm border-[1px] border-slate-50 bg-transparent p-1 text-white"
                onChange={(e) =>
                  setMember({ ...member, [e.target.name]: e.target.value })
                }
              />
            </React.Fragment>
          ))}
          <label htmlFor="avatar" className="text-lg text-white">
            Avatar:
          </label>
          <input
            type="file"
            accept="image/*"
            name="avatar"
            id="avatar"
            className="mb-2 rounded-sm border-[1px] border-slate-50 bg-transparent p-1 text-white"
            onChange={(e) => setAvatar(e.target.files![0])}
          />
        </Modal>
      )}

      {modalState?.isOpen && modalState?.type == ModalType.Delete && (
        <Modal
          title={`Are you sure you want to delete ${jpName}`}
          submit="Delete"
          isOpen={modalState.isOpen}
          handleCloseModal={handleCloseModal}
          handleSubmit={handleDeleteSubmit}
        />
      )}
    </>
  );
};

export default MemberStateList;

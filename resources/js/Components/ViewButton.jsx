import React, { useState } from 'react';
import UpdateTaskModal from './UpdateTaskModal';

const ViewButton = ({ task, documents }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded text-sm"
        onClick={openModal}
      >
        View
      </button>
      {isModalOpen && <UpdateTaskModal docID={documents} task={task} onClose={closeModal} />
      }
      
    </>
  );
};

export default ViewButton;

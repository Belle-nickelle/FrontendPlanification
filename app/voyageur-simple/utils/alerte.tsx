import React from 'react';

interface ConfirmModalProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <p className="mb-4">{message}</p>
                <div className="flex justify-end">
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded mr-2 hover:bg-red-700"
                        onClick={onConfirm}
                    >
                        Oui
                    </button>
                    <button
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                        onClick={onCancel}
                    >
                        Non
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;

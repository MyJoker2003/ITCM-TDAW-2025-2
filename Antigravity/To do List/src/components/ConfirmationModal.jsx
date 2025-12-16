import React, { useRef, useEffect } from 'react';
import './ConfirmationModal.css';

export function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
    const dialogRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            dialogRef.current?.showModal();
        } else {
            dialogRef.current?.close();
        }
    }, [isOpen]);

    return (
        <dialog ref={dialogRef} className="confirm-modal" onClose={onClose}>
            <div className="modal-content">
                <header className="confirm-header">
                    {title}
                </header>

                <div className="confirm-body">
                    <p>{message}</p>
                </div>

                <footer className="confirm-footer">
                    <button className="button btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="button btn-danger" onClick={onConfirm} autoFocus>
                        Delete
                    </button>
                </footer>
            </div>
        </dialog>
    );
}

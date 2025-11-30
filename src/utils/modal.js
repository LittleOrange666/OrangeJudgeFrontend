import { Modal } from 'bootstrap';

/**
 * Shows a Bootstrap modal and returns a promise that resolves when the modal is hidden.
 * @param {string} title - The title of the modal.
 * @param {string} text - The body text of the modal.
 * @param {number|null} timeout - Auto-hide timeout in milliseconds.
 * @returns {Promise<void>}
 */
export function show_modal(title, text, timeout) {
    if (!timeout && title === "成功"){
        timeout = 3000;
    }
  return new Promise((resolve) => {
    const modalElement = document.getElementById('myModal');
    if (!modalElement) {
      console.error('Modal element #myModal not found in the DOM.');
      return resolve(); // Resolve immediately if modal doesn't exist
    }

    const myModal = Modal.getOrCreateInstance(modalElement);

    const modalTitleEl = modalElement.querySelector('.modal-title');
    const modalBodyEl = modalElement.querySelector('.modal-body');

    if (modalTitleEl) modalTitleEl.textContent = title;
    if (modalBodyEl) modalBodyEl.textContent = text;

    let hideHandler = () => resolve();

    if (timeout) {
      const close_evt = () => myModal.hide();
      const timeout_id = window.setTimeout(close_evt, timeout);
      
      const keypressHandler = (event) => {
        if (event.key) {
          close_evt();
        }
      };
      document.addEventListener("keypress", keypressHandler, { once: true });

      // Overwrite hideHandler to also clean up listeners
      const originalHideHandler = hideHandler;
      hideHandler = () => {
        window.clearTimeout(timeout_id);
        document.removeEventListener("keypress", keypressHandler);
        originalHideHandler();
      };
    }

    modalElement.addEventListener("hide.bs.modal", hideHandler, { once: true });
    myModal.show();
  });
}
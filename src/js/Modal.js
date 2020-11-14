export default class Modal {
  constructor() {
    Modal.window = document.querySelector('.modal');
  }

  static drowModal(info) {
    Modal.window = document.querySelector('.modal');
    Modal.window.classList.add('modal_active');
    Modal.addInfo(info);
    Modal.addListener();
  }

  static closeModal(e) {
    if (e.target.closest('.modal_window__btn')) {
      Modal.window.removeEventListener('click', Modal.closeModal);
      Modal.window.classList.remove('modal_active');
    }
  }

  static addListener() {
    Modal.window.addEventListener('click', (e) => Modal.closeModal(e));
  }

  static addInfo(info) {
    Modal.infoBlock = document.querySelector('.modal_window__info p');
    Modal.infoBlock.innerHTML = info;
  }
}

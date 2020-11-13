// import { length } from 'file-loader';
export default class Preloader {
  static start() {
    const preloader = document.querySelector('.preloader');
    preloader.style.display = 'flex';
  }

  static stop() {
    const preloader = document.querySelector('.preloader');
    preloader.style.display = 'none';
  }
}

export default class Preloader {
  static createElem(element, atributes = [], ...classes) {
    const elem = document.createElement(element);
    classes.forEach((className) => elem.classList.add(className));
    if (atributes.length > 0) {
      atributes.forEach((atribute) => elem.setAttribute(atribute[0], atribute[1]));
    }
    return elem;
  }

  static async start() {
    const preloader = document.querySelector('.preloader');
    preloader.style.display = 'flex';
    return true;
  }

  static stop() {
    const preloader = document.querySelector('.preloader');
    preloader.style.display = 'none';
  }

  static render() {
    const preloader = Preloader.createElem('div', [], 'preloader');
    const preloaderText = Preloader.createElem('p', [], 'preloader__text');
    preloader.append(preloaderText);
    preloaderText.innerText = 'Поиск решения с помощью алгоритма - A*';
    return preloader;
  }
}

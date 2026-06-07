export default class Goal {
  #pos;
  #type = "Goal";

  constructor(pos) {
    this.#pos = pos;
  }

  get pos() {
    return this.#pos;
  }

  get type() {
    return this.#type;
  }
}

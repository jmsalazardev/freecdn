export class User {
  uid: string;
  constructor(uid: string) {
    this.uid = uid;
  }
  toString() {
    return this.uid;
  }
}

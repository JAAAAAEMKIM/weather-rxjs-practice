new Date(1234);

class CustomDate extends Date {
  getFullMonth() {
    return (super.getMonth() + 1).toString().padStart(2, '0');
  }

  getFullDate() {
    return super.getDate().toString().padStart(2, '0');
  }

  toInputFormat() {
    return `${super.getFullYear()}-${this.getFullMonth()}-${this.getFullDate()}`;
  }

  toApiFormat() {
    return `${super.getFullYear()}${this.getFullMonth()}${this.getFullDate()}`;
  }
}

export default CustomDate;

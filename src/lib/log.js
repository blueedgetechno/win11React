import Swal from "sweetalert2";

export const log = ({ type, title, content, icon, time }) => {
  switch (type) {
    case "loading":
      Swal.fire({
        title: title ?? "Loading!!",
        text: content ?? "Take a breath ^^",
        icon: icon ?? null,
        showCancelButton: false,
        showConfirmButton: false,
      });
      break;
    case "error":
      Swal.fire({
        title: title ?? "Error !!",
        text: content ?? "Some thing went wrong!!",
        icon: icon ?? "error",
      });
      break;
    case "success":
      Swal.fire({
        title: title ?? "Success!",
        text: content ?? "You've succeed",
        icon: icon ?? "success",
      });
      break;
    case "close":
      Swal.close();
      break;
    default:
      break;
  }
};

export class Log {
  constructor() {}
  loading(title, content, time, icon) {
    Swal.fire({
      title: title ?? "Loading!",
      text: content ?? "Take a breath ^^",
      icon: icon ?? "info",
      timer: time,
      showCancelButton: false,
      showConfirmButton: false,
    });
  }
  error(title, content, icon, time) {
    Swal.fire({
      title: title ?? "Error!!",
      text: content ?? "Something went wrong:(",
      icon: icon ?? "error",
      timer: time,
    });
  }
  success(title, content, icon, time) {
    Swal.fire({
      title: title ?? "Success!",
      text: content ?? "Nice try!",
      icon: icon ?? "success",
      timer: time,
    });
  }
  close() {
    Swal.close();
  }
}

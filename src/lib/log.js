import Swal from "sweetalert2";

export const log = async ({
  type,
  title,
  content,
  icon,
  time,
  confirmButtonText,
  confirmCallback,
}) => {
  switch (type) {
    case "loading":
      Swal.fire({
        title: title ?? "Loading",
        text: content ?? "Take a breath ^^",
        icon: icon ?? "info",
        showCancelButton: false,
        showConfirmButton: false,
        allowOutsideClick: false,
      });
      break;
    case "error":
      Swal.fire({
        title: title ?? "Error !!",
        html: content ?? "Some thing went wrong!!",
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

    case "confirm":
      const result = await Swal.fire({
        title: title ?? "Are you sure?",
        text: content ?? "You won't be able to revert this!",
        icon: icon ?? "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: confirmButtonText ?? "Yes, do it!",
      });

      if (!result.isConfirmed) break;

      const { error } = await confirmCallback();
      if (error) {
        await Swal.fire({
          title: "Error!",
          text: error,
          icon: "error",
        });
      } else {
        await Swal.fire({
          title: "Success!",
          text: "You've succeed",
          icon: "success",
        });
      }

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

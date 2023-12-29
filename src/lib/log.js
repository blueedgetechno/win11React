import Swal from "sweetalert2";
import { dispatchOutSide } from "../actions";
import { sleep } from "../utils/sleep";

export const log = async ({
  type,
  title,
  content,
  icon,
  time,
  confirmButtonText,
  confirmCallback,
  showLoadingProcess = false
}) => {

  //Swal.close()
  dispatchOutSide('CLOSE_MODAL', '')

  switch (type) {
    case "loading":
      //Swal.fire({
      //  title: title ?? "Loading",
      //  text: content ?? "Take a breath ^^",
      //  icon: icon ?? "info",
      //  showCancelButton: false,
      //  showConfirmButton: false,
      //  allowOutsideClick: true,
      //});

      dispatchOutSide('NOTIFY', { title, content, showLoadingProcess })
      break;
    case "error":
      Swal.fire({
        title: title ?? "Error !!",
        html: content ?? "Some thing went wrong!!",
        icon: icon ?? "error",
      });
      break;
    case "success":
      dispatchOutSide('NOTIFY', { loadingPercent: 100, showLoadingProcess })
      await sleep(400)
      Swal.fire({
        title: title ?? "Success!",
        text: content ?? "You've succeed",
        icon: icon ?? "success",
      });
      dispatchOutSide('CLOSE_MODAL', '')
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

    case "description":
      const { value: description } = await Swal.fire({
        input: "textarea",
        inputLabel: "Message",
        inputPlaceholder: "Type your description here...",
        inputAttributes: {
          "aria-label": "Type your description here",
        },
        showCancelButton: true,
        focusConfirm: false,
      });
      return description;

    case "createSub":
      const { value: formValues } = await Swal.fire({
        title: 'Multiple inputs',
        html:
          '<div className="flex items-center gap-2"><span>Email</span><input id="email" class="swal2-input"/></div>' +
          `
          <div className="flex items-center mt-5 gap-2">
            <span>SUB</span>
            <select name="sub" class="swal2-input" id="plan">
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="fullstack">Fullstack</option>
              <option value="remote">Remote</option>
              <option value="admin">Admin</option>
            </select>
            <div className="flex items-center gap-2"><span>Price (month/week)</span><input id="price_add" class="swal2-input"/></div>
          </div>
        <div className="flex items-center justify-around">
          <label className="flex items-center gap-2" htmlFor="free_sub"> <input type="checkbox" className="h-[20px] w-[20px]" id="free_sub" name="free_sub" /> <span>Free Subscription ?</span></label>
        </div>
          `,
        focusConfirm: false,
        preConfirm: () => {
          return {
            email: document.getElementById('email').value,
            plan : document.getElementById('plan').value,
            price : document.getElementById('price_add').value,
            free: document.querySelector('#free_sub').checked
          }
        }
      })
      return formValues
      break;
    case "modifySub": 
      const { value } = await Swal.fire({
        title: 'Modify Subscription',
        html:
          '<div className="flex items-center gap-2"><span>Email</span><input id="email" class="swal2-input"/></div>' +
          `
          <div className="flex items-center mt-5 gap-2">
            <span>Action</span>
            <select name="action" class="swal2-input" id="action">
              <option value="CANCEL">Cancel</option>
              <option value="RENEW">Renew</option>
              <option value="UPGRADE">Upgrade</option>
            </select>
            <div className="flex items-center gap-2"><span>Price (upgrade)</span><input id="price_upgrade" class="swal2-input"/></div>
          </div>
          `,
        focusConfirm: false,
        preConfirm: () => {
          return {
            email:  document.getElementById('email').value,
            action :  document.getElementById('action').value,
            price :  document.getElementById('price_upgrade').value
          }
        }
      })
      return value
    break;
    case "adjustSub":
    let created_at = new Date(content.created_at).toISOString().split('T')[0];
    let ends_at = new Date(content.ends_at).toISOString().split('T')[0];
      return await Swal.fire({
        title: 'Adjust Subscription',
        html:
        `<form">
          <label for="created_sub">Start Time</label>
          <input type="date" id="created_sub" name="created_sub" value=${created_at}>
          <label for="end_sub">End Time</label>
          <input type="date" id="end_sub" name="end_sub" value=${ends_at}>
        </form>`,
        focusConfirm: false,
        preConfirm: () => {
          return {
            email: content.email,
            created_at: document.getElementById('created_sub').value,
            ends_at: document.getElementById('end_sub').value,
          }
        }
      })
    break;
    case "migrateVolume":
      const { value: migrateForm  } = await Swal.fire({
        title: 'Multiple inputs',
        html:
          '<div className="flex items-center gap-2"><span>CLuster Id</span><input id="cluster_id" class="swal2-input"/></div>' ,
        focusConfirm: false,
        preConfirm: () => {
          return {
            cluster_id: document.getElementById('cluster_id').value
          }
        }
      })
      return migrateForm
      break;
    case "forkVolume":
      const { value: forkVolume } = await Swal.fire({
        title: 'Multiple inputs',
        html:
          `   
            <div>
              <div className="flex items-center gap-2"><span>Description</span><input id="description_fork" class="swal2-input"/></div>
              <select id="gpu_model_fork" defaultValue={"RTX 3060 Ti"} class="h-[32px] text-[16px]" name="gpu_model">
                <option value="RTX 3060 Ti" >RTX 3060 Ti</option>
                <option value="RTX 2060 SUPER">RTX 2060 Super</option>
              </select>
              <label htmlFor="ram">
                Ram:
                <select id="ram_fork" defaultValue={"12"} class="ml-2 h-[32px] text-[16px]" name="ram">
                  <optgroup label="RAM">
                    <option value="8">8</option>
                    <option value="12" >12</option>
                    <option value="16">16</option>
                  </optgroup>
                </select>
              </label>
              <label htmlFor="">
                VCPUS:
                <select id="vcpus_fork" defaultValue={"12"} class="ml-2 h-[32px] text-[16px]" name="vcpus">
                  <optgroup label="VCPUS">
                    <option value="8">8</option>
                    <option value="12" >12</option>
                    <option value="16">16</option>
                  </optgroup>
                </select>
              </label>
            </div>` ,
        focusConfirm: false,
        preConfirm: () => {
          return {
            gpu_model: document.getElementById('gpu_model_fork').value,
            vcpus: document.getElementById('vcpus_fork').value,
            ram: document.getElementById('ram_fork').value,
            description: document.getElementById('description_fork').value
          }
        }
      })
      return forkVolume
      break;
    
    default:
      break;
  }
};

export class Log {
  constructor() { }
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

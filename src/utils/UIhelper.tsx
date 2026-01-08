import { CURRENCY } from "@/constants/others";
import moment from "moment";
import Swal from "sweetalert2";

const UIHelpers = {
  amountFormat(
    value: string | number,
    currencyCode: string = "USD",
    flotFixed: number = 2
  ) {
    let initValue = parseFloat(String(value));

    return (
      <>
        <span
          dangerouslySetInnerHTML={{
            __html: `${CURRENCY[currencyCode].entity}`,
          }}
        />
        &nbsp;
        {initValue.toLocaleString(undefined, {
          minimumFractionDigits: flotFixed,
          maximumFractionDigits: flotFixed,
        })}
      </>
    );
  },

  async deleteConfirm(promiseCallBack: () => Promise<any>): Promise<any> {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-secondary",
        cancelButton: "btn btn-dark ltr:mr-3 rtl:ml-3",
        popup: "sweet-alerts",
      },
      buttonsStyling: false,
    });

    const result = await swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
      padding: "2em",
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: "Progress...",
        html: "Progressing your request",
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        await promiseCallBack();
      } catch (error) {
        console.error("Error during deletion confirmation:", error);
      }
    }
  },
  capitalize(str: string) {
    return str[0].toUpperCase() + str.slice(1);
  },

  truncateText(text: string, maxLength = 345) {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  },
  DateFormat(date: string, FORMAT_TYPE = "DD-MM-YYYY") {
    return date ? moment(new Date(date)).format(FORMAT_TYPE) : null;
  },
};

export default UIHelpers;

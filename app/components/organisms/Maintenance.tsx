import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { TextButton } from "../atoms/Button";

// Pass props: Target Time, Message, Description Children
const Maintenance = () => {
  const [percentage, setPercentage] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const beginDate = new Date("2024-09-20T08:32:51");
    const targetDate = new Date("2024-10-15T08:32:51");
    const interval = setInterval(() => {
      const now = new Date();
      const timeDiff = targetDate.getTime() - now.getTime();
      const totalDuration = targetDate.getTime() - beginDate.getTime();
      const newPercentage = Math.min(
        100,
        ((totalDuration - timeDiff) / totalDuration) * 100
      );
      setPercentage(newPercentage);
      // console.log("Percentage: ", newPercentage);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="" dir="rtl">
      {/* flex flex-col items-center justify-center h-screen bg-gray-100 */}
      {/* <div className="h-4 bg-zebra-yellow animate-move-zebra"></div> */}
      <div className="p-2 bg-zebra-blue //bg-zebra-yellow animate-move-zebra flex items-center justify-center rounded-xl shadow-md">
        <h3 className="flex flex-row justify-center items-center text-center gap-2 /animate-pulse bg-white dark:bg-slate-800 rounded-lg p-1">
          {/* 🚀{percentage.toFixed(2)}% | درحال ارتقاء زیرساخت هستیم! از شکیبایی
          شما سپاسگزاریم!🙏🏻 */}
          🚀{percentage.toFixed(2)}% | درحال سر و سامون دادن به ظاهر جدید سایت
          هستیم! 🥳
          <TextButton className="bg-blue-500" onClick={() => setIsOpen(true)}>
            بیشتر
          </TextButton>
        </h3>
      </div>

      <Dialog
        dir="rtl"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50"
      >
        <Dialog.Panel className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg max-w-sm">
          <Dialog.Title className="text-xl font-bold mb-4">
            جزئیات فرایند
          </Dialog.Title>
          <Dialog.Description className="mb-4">
            {/* شبکه ابری اینترنت اشیاء THOR، اخیرا با هجوم انبوه کاربران جدید مواجه
            شده و ما درحال توسعه و ارتقاء زیرساخت های شبکه سراسری هستیم تا
            بتوانیم پاسخگوی این حجم از دستگاه های جدید باشیم. پیشاپیش قدردان
            بردباری شما هستیم. */}
            یک اپلیکیشن جدید با ظاهر کاملا متفاوت و جذاب تو راهه! 🥳
          </Dialog.Description>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded"
            onClick={() => setIsOpen(false)}
          >
            بستن
          </button>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
};

export default Maintenance;

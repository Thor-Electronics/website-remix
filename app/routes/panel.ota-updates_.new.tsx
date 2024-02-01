import {
  ExclamationTriangleIcon,
  FolderPlusIcon,
} from "@heroicons/react/24/solid";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import type { FormEvent } from "react";
import { useState } from "react";
import Button from "~/components/atoms/Button";
import { requireSessionToken } from "~/models/session.server";
import { PANEL_PREFIX } from "./panel";

// type ActionData = {
//   errors: string[]
// }

type LoaderData = {
  sessionToken: string;
};

export const loader: LoaderFunction = async ({ request }) =>
  json<LoaderData>({ sessionToken: await requireSessionToken(request) });

const chips = [
  {
    value: "ESP8266",
    displayName: "ESP8266",
  },
  {
    value: "ESP32",
    displayName: "ESP32",
  },
  {
    value: "STM32",
    displayName: "STM32",
  },
];

export const AdminOTAUpdatesNew = () => {
  const { sessionToken } = useLoaderData<LoaderData>();
  const navigation = useNavigation();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitting ...");
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    Array.from(formData).forEach(([k, v]) => {
      console.log("Checking: ", k, v);
      if (!v) formData.delete(k);
    });
    console.log("ENTRIES: ", formData.entries());
    // we can't use the API since it's a server file :)
    fetch(`${ENV.CORE_URL}/api/v1/admin/firmware-updates`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        // ContentType: "multipart/form-data", // https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects#:~:text=Warning%3A%20When,the%20request%20body.
      },
      body: formData,
    })
      .then(async res => {
        console.log("RES: ", res);
        const body = await res.json();
        if (res.status !== 201 || !res.ok)
          return setError(
            `Error uploading firmware to core(${res.status} ${res.statusText}): ${body.message}`
          );
        window.location.href = `${PANEL_PREFIX}/ota-updates`;
        setIsSubmitting(false);
      })
      .catch(err => {
        console.error("ERROR: ", err);
        setError(`Error uploading firmware to core: ${err.toString()}`);
        setIsSubmitting(false);
      });
  };

  return (
    <div className="admin-page">
      <h2 className="page-title">Upoad New Firmware Update(OTA)</h2>
      <form
        onSubmit={handleSubmit}
        method="post"
        encType="multipart/form-data"
        className="form max-w-sm mx-auto bg-white
          dark:bg-slate-800 rounded-lg shadow-lg px-2 py-3 sm:p-4
          flex flex-col items-stretch justify-center gap-4"
      >
        {error && (
          <p
            className="error bg-rose-100 dark:bg-rose-950 border
            border-rose-400 dark:border-rose-600 shadow-md
            shadow-rose-200 dark:shadow-rose-800 rounded-md py-1
            px-2 text-rose-600 dark:text-rose-400"
          >
            {error}
          </p>
        )}
        <label className="label">
          Chip:
          <select className="input mt-2" name="chip">
            {chips.map(ch => (
              <option value={ch.value} key={ch.value}>
                {ch.displayName}
              </option>
            ))}
          </select>
        </label>
        <label className="label">
          Device Type: (Optional)
          <input
            type="text"
            name="deviceType"
            placeholder="KEY, Leave empty for all device types"
          />
          <span className="text-xs">
            supported device types will be added and you can choose
          </span>
        </label>
        <label className="label">
          Firmware Version:
          <input
            type="text"
            name="version"
            placeholder="1.0.19-beta"
            required
          />
        </label>
        <label className="label">
          Manufacturer ID: (Optional)
          <input
            type="text"
            name="manufacturerId"
            placeholder="Leave empty for global manufacturer scope"
          />
        </label>
        <label className="label">
          Group ID: (Optional)
          <input
            type="text"
            name="groupId"
            placeholder="Leave empty for global group scope"
          />
        </label>
        <label className="label">
          File:
          <input type="file" name="file" required />
        </label>
        <label className="label">
          Description: (Optional)
          <textarea
            cols={5}
            name="description"
            placeholder="Enjoy Thor on Norouz with AI!"
          />
        </label>
        <Button
          className={`${
            error
              ? "!bg-rose-500 dark:!bg-rose-400 shadow-rose-300 dark:shadow-rose-700"
              : "!bg-primary dark:!bg-blue-400 shadow-blue-300 dark:shadow-blue-600"
          } py-1 px-3  flex items-center justify-center gap-2.5`}
          disabled={isSubmitting || navigation.state !== "idle"}
        >
          {error ? (
            <ExclamationTriangleIcon className="w-5 h-5" />
          ) : (
            <FolderPlusIcon className="w-5 h-5" />
          )}
          {error ? "Error Uploading Firmware" : "Upload Firmware"}
          {error && <ExclamationTriangleIcon className="w-5 h-5" />}
        </Button>
      </form>
    </div>
  );
};

export default AdminOTAUpdatesNew;
